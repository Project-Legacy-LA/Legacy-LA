-- === policies.sql ===
SET search_path = app, public;

-- Session helpers (set by backend on each DB connection/session)
CREATE OR REPLACE FUNCTION app.set_tenant(p_tenant uuid) RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM set_config('app.tenant_id', p_tenant::text, true); END$$;

CREATE OR REPLACE FUNCTION app.set_actor(p_user uuid) RETURNS void LANGUAGE plpgsql AS $$
BEGIN PERFORM set_config('app.actor_user_id', COALESCE(p_user::text,''), true); END$$;

CREATE OR REPLACE FUNCTION app.current_tenant() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true),'')::uuid
$$;

CREATE OR REPLACE FUNCTION app.current_actor() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.actor_user_id', true),'')::uuid
$$;

-- Policy helpers (use app tables; must be created after tables)
CREATE OR REPLACE FUNCTION app.is_attorney_owner() RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM app.membership m
    WHERE m.tenant_id = app.current_tenant()
      AND m.user_id = app.current_actor()
      AND m.is_active
      AND m.role = 'attorney_owner'
  )
$$;

CREATE OR REPLACE FUNCTION app.is_household_person(p_client uuid, p_person uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM app.person_role pr
    WHERE pr.tenant_id = app.current_tenant()
      AND pr.client_id = p_client
      AND pr.person_id = p_person
  )
$$;

CREATE OR REPLACE FUNCTION app.has_client_permission(p_client uuid, p_perm text) RETURNS boolean LANGUAGE sql STABLE AS $$
WITH me AS ( SELECT app.current_tenant() AS t, app.current_actor() AS u ),
attorney AS ( SELECT TRUE ok FROM me WHERE app.is_attorney_owner() ),
staff AS (
  SELECT EXISTS (
    SELECT 1 FROM app.client_grant g, me
    WHERE g.tenant_id = me.t
      AND g.client_id = p_client
      AND g.grantee_user_id = me.u
      AND g.is_enabled
      AND ( 'admin' = ANY(g.permissions) OR p_perm = ANY(g.permissions) )
  ) ok
),
household AS (
  SELECT EXISTS (
    SELECT 1 FROM app.client_account a, me
    WHERE a.tenant_id = me.t
      AND a.client_id = p_client
      AND a.user_id = me.u
      AND a.is_enabled
      AND (
        p_perm = 'read'
        OR (p_perm = 'write' AND COALESCE(a.can_write, a.role IN ('owner','spouse')))
      )
  ) ok
)
SELECT COALESCE((SELECT ok FROM attorney), FALSE)
    OR COALESCE((SELECT ok FROM staff), FALSE)
    OR COALESCE((SELECT ok FROM household), FALSE)
$$;

CREATE OR REPLACE FUNCTION app.has_client_read(p_client uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT app.has_client_permission(p_client, 'read')
$$;

CREATE OR REPLACE FUNCTION app.has_client_write(p_client uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT (CASE WHEN app.is_attorney_owner() THEN TRUE
               ELSE NOT COALESCE((SELECT c.editing_frozen FROM app.client c WHERE c.client_id = $1 AND c.tenant_id = app.current_tenant()), FALSE)
          END)
         AND app.has_client_permission($1, 'write')
$$;

CREATE OR REPLACE FUNCTION app.has_client_delete(p_client uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT app.has_client_permission(p_client, 'delete') OR app.has_client_permission(p_client, 'admin')
$$;

CREATE OR REPLACE FUNCTION app.has_person_read(p_person uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT TRUE WHERE app.is_attorney_owner()
  UNION ALL
  SELECT EXISTS (
    SELECT 1 FROM app.person_role pr
    WHERE pr.tenant_id = app.current_tenant()
      AND pr.person_id = p_person
      AND app.has_client_read(pr.client_id)
  )
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION app.can_revoke_link(p_created_by uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT app.current_actor() = p_created_by OR app.is_attorney_owner()
$$;

CREATE OR REPLACE FUNCTION app.is_admin() RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT COALESCE((SELECT u.is_admin FROM app."users" u WHERE u.user_id = app.current_actor()), FALSE)
$$;

-- Link-guard triggers (creator-only revoke; attorney bypass) — created here because they call policy helpers
CREATE OR REPLACE FUNCTION app.guard_revoke_membership() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF app.is_attorney_owner() THEN RETURN NEW; END IF;
  IF NOT app.can_revoke_link(OLD.created_by_user_id) THEN RAISE EXCEPTION 'Not authorized to revoke this membership'; END IF;
  IF (NEW.is_active IS DISTINCT FROM OLD.is_active) AND NOT (OLD.is_active = TRUE AND NEW.is_active = FALSE) THEN
    RAISE EXCEPTION 'Only deactivation is allowed';
  END IF;
  IF NEW.role IS DISTINCT FROM OLD.role OR NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.tenant_id IS DISTINCT FROM OLD.tenant_id OR NEW.created_by_user_id IS DISTINCT FROM OLD.created_by_user_id THEN
    RAISE EXCEPTION 'Cannot modify membership identity/role';
  END IF;
  RETURN NEW;
END$$;

CREATE TRIGGER t_membership_guard BEFORE UPDATE ON app.membership FOR EACH ROW EXECUTE FUNCTION app.guard_revoke_membership();

CREATE OR REPLACE FUNCTION app.guard_revoke_client_account() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF app.is_attorney_owner() THEN RETURN NEW; END IF;
  IF NOT app.can_revoke_link(OLD.created_by_user_id) THEN RAISE EXCEPTION 'Not authorized to revoke this client_account'; END IF;
  IF (NEW.is_enabled IS DISTINCT FROM OLD.is_enabled) AND NOT (OLD.is_enabled = TRUE AND NEW.is_enabled = FALSE) THEN
    RAISE EXCEPTION 'Only disabling is allowed';
  END IF;
  IF NEW.role IS DISTINCT FROM OLD.role OR NEW.can_write IS DISTINCT FROM OLD.can_write OR NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.client_id IS DISTINCT FROM OLD.client_id OR NEW.tenant_id IS DISTINCT FROM OLD.tenant_id OR NEW.created_by_user_id IS DISTINCT FROM OLD.created_by_user_id THEN
    RAISE EXCEPTION 'Cannot modify client_account identity/permissions';
  END IF;
  RETURN NEW;
END$$;

CREATE TRIGGER t_client_account_guard BEFORE UPDATE ON app.client_account FOR EACH ROW EXECUTE FUNCTION app.guard_revoke_client_account();

CREATE OR REPLACE FUNCTION app.guard_revoke_client_grant() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF app.is_attorney_owner() THEN RETURN NEW; END IF;
  IF NOT app.can_revoke_link(OLD.created_by_user_id) THEN RAISE EXCEPTION 'Not authorized to revoke this client_grant'; END IF;
  IF (NEW.is_enabled IS DISTINCT FROM OLD.is_enabled) AND NOT (OLD.is_enabled = TRUE AND NEW.is_enabled = FALSE) THEN
    RAISE EXCEPTION 'Only disabling is allowed';
  END IF;
  IF NEW.permissions IS DISTINCT FROM OLD.permissions OR NEW.grantee_user_id IS DISTINCT FROM OLD.grantee_user_id OR NEW.client_id IS DISTINCT FROM OLD.client_id OR NEW.tenant_id IS DISTINCT FROM OLD.tenant_id OR NEW.created_by_user_id IS DISTINCT FROM OLD.created_by_user_id THEN
    RAISE EXCEPTION 'Cannot modify client_grant identity/permissions';
  END IF;
  RETURN NEW;
END$$;

CREATE TRIGGER t_client_grant_guard BEFORE UPDATE ON app.client_grant FOR EACH ROW EXECUTE FUNCTION app.guard_revoke_client_grant();

-- === Enable RLS on app tables except users, and create policies ===
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'tenant','membership','client','client_account','client_grant',
    'person','person_role','child_profile','parentage','marital_record',
    'address','contact_point','person_name_history',
    'trust','asset','asset_valuation','beneficiary_designation',
    'liability','will','will_bequest'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE app.%I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END$$;

-- Ensure users table is unrestricted for auth (login) queries
ALTER TABLE app."users" DISABLE ROW LEVEL SECURITY;

-- -------------------------
-- Tenant policies
-- -------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS tenant_read_self ON app.tenant;
  DROP POLICY IF EXISTS tenant_admin_all ON app.tenant;

  CREATE POLICY tenant_read_self ON app.tenant FOR SELECT USING (tenant_id = app.current_tenant());

  CREATE POLICY tenant_admin_all ON app.tenant FOR ALL USING (app.is_admin()) WITH CHECK (app.is_admin());
END$$;

-- -------------------------
-- Membership policies (attorney manages; creator can revoke)
-- -------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS membership_select ON app.membership;
  DROP POLICY IF EXISTS membership_insert ON app.membership;
  DROP POLICY IF EXISTS membership_update ON app.membership;
  DROP POLICY IF EXISTS membership_delete ON app.membership;
  DROP POLICY IF EXISTS membership_revoke ON app.membership;

  CREATE POLICY membership_select ON app.membership FOR SELECT USING (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY membership_insert ON app.membership FOR INSERT WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY membership_update ON app.membership FOR UPDATE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner()) WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY membership_delete ON app.membership FOR DELETE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner());

  CREATE POLICY membership_revoke ON app.membership FOR UPDATE USING (tenant_id = app.current_tenant() AND app.can_revoke_link(created_by_user_id));
END$$;

-- -------------------------
-- Client-scoped domain tables policies
-- -------------------------
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'client','client_account','client_grant','person_role','child_profile','parentage',
    'marital_record','asset','asset_valuation','beneficiary_designation','liability',
    'will','will_bequest','trust'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS read_client_scoped ON app.%I;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS write_client_scoped_insert ON app.%I;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS write_client_scoped_update ON app.%I;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS delete_client_scoped ON app.%I;', tbl);

    -- SELECT
    EXECUTE format('CREATE POLICY read_client_scoped ON app.%I FOR SELECT USING (tenant_id = app.current_tenant() AND app.has_client_read(client_id));', tbl);

    -- INSERT: only WITH CHECK allowed for insert policies
    EXECUTE format('CREATE POLICY write_client_scoped_insert ON app.%I FOR INSERT WITH CHECK (tenant_id = app.current_tenant() AND app.has_client_write(client_id));', tbl);

    -- UPDATE: USING + WITH CHECK
    EXECUTE format('CREATE POLICY write_client_scoped_update ON app.%I FOR UPDATE USING (tenant_id = app.current_tenant() AND app.has_client_write(client_id)) WITH CHECK (tenant_id = app.current_tenant() AND app.has_client_write(client_id));', tbl);

    -- DELETE: USING
    EXECUTE format('CREATE POLICY delete_client_scoped ON app.%I FOR DELETE USING (tenant_id = app.current_tenant() AND app.has_client_delete(client_id));', tbl);
  END LOOP;
END$$;

-- -------------------------
-- Break circularity: allow link row owners to SELECT their own link rows
-- -------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS client_account_read_self ON app.client_account;
  CREATE POLICY client_account_read_self ON app.client_account FOR SELECT USING (tenant_id = app.current_tenant() AND user_id = app.current_actor());

  DROP POLICY IF EXISTS client_grant_read_self ON app.client_grant;
  CREATE POLICY client_grant_read_self ON app.client_grant FOR SELECT USING (tenant_id = app.current_tenant() AND grantee_user_id = app.current_actor());
END$$;

-- -------------------------
-- Special revoke policy for link rows (FOR UPDATE)
-- -------------------------
DO $$
BEGIN
  DROP POLICY IF EXISTS client_account_revoke ON app.client_account;
  CREATE POLICY client_account_revoke ON app.client_account FOR UPDATE USING (tenant_id = app.current_tenant() AND app.can_revoke_link(created_by_user_id));

  DROP POLICY IF EXISTS client_grant_revoke ON app.client_grant;
  CREATE POLICY client_grant_revoke ON app.client_grant FOR UPDATE USING (tenant_id = app.current_tenant() AND app.can_revoke_link(created_by_user_id));
END$$;

-- -------------------------
-- Tenant-PII tables (person & related): separate policies per operation
-- -------------------------
DO $$
BEGIN
  -- person
  DROP POLICY IF EXISTS person_read ON app.person;
  DROP POLICY IF EXISTS person_insert ON app.person;
  DROP POLICY IF EXISTS person_update ON app.person;
  DROP POLICY IF EXISTS person_delete ON app.person;

  CREATE POLICY person_read ON app.person FOR SELECT USING (tenant_id = app.current_tenant() AND app.has_person_read(person_id));
  CREATE POLICY person_insert ON app.person FOR INSERT WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY person_update ON app.person FOR UPDATE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner()) WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY person_delete ON app.person FOR DELETE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner());

  -- contact_point
  DROP POLICY IF EXISTS contact_point_read ON app.contact_point;
  DROP POLICY IF EXISTS contact_point_insert ON app.contact_point;
  DROP POLICY IF EXISTS contact_point_update ON app.contact_point;
  DROP POLICY IF EXISTS contact_point_delete ON app.contact_point;

  CREATE POLICY contact_point_read ON app.contact_point FOR SELECT USING (tenant_id = app.current_tenant() AND app.has_person_read(person_id));
  CREATE POLICY contact_point_insert ON app.contact_point FOR INSERT WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY contact_point_update ON app.contact_point FOR UPDATE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner()) WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY contact_point_delete ON app.contact_point FOR DELETE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner());

  -- person_name_history
  DROP POLICY IF EXISTS person_name_history_read ON app.person_name_history;
  DROP POLICY IF EXISTS person_name_history_insert ON app.person_name_history;
  DROP POLICY IF EXISTS person_name_history_update ON app.person_name_history;
  DROP POLICY IF EXISTS person_name_history_delete ON app.person_name_history;

  CREATE POLICY person_name_history_read ON app.person_name_history FOR SELECT USING (tenant_id = app.current_tenant() AND app.has_person_read(person_id));
  CREATE POLICY person_name_history_insert ON app.person_name_history FOR INSERT WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY person_name_history_update ON app.person_name_history FOR UPDATE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner()) WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY person_name_history_delete ON app.person_name_history FOR DELETE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner());

  -- address (tied to person OR client)
  DROP POLICY IF EXISTS address_read ON app.address;
  DROP POLICY IF EXISTS address_insert ON app.address;
  DROP POLICY IF EXISTS address_update ON app.address;
  DROP POLICY IF EXISTS address_delete ON app.address;

  CREATE POLICY address_read ON app.address FOR SELECT USING (
    tenant_id = app.current_tenant()
    AND (
      (person_id IS NOT NULL AND app.has_person_read(person_id))
      OR (client_id IS NOT NULL AND app.has_client_read(client_id))
    )
  );

  CREATE POLICY address_insert ON app.address FOR INSERT WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY address_update ON app.address FOR UPDATE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner()) WITH CHECK (tenant_id = app.current_tenant() AND app.is_attorney_owner());
  CREATE POLICY address_delete ON app.address FOR DELETE USING (tenant_id = app.current_tenant() AND app.is_attorney_owner());
END$$;
