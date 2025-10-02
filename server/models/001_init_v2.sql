-- 001_init_v2.sql
-- Bootstrap schema for Legacy Louisiana estate-planning app (Fresh v2)
-- Generated: 2025-09-10

-- === Safety & extensions ===
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

-- === App schema ===
CREATE SCHEMA IF NOT EXISTS app;
SET search_path = app, public;

-- === Helper: context for RLS (per-tenant/session) ===
-- Store current tenant in a transaction-local GUC after auth.
-- Example: BEGIN; SELECT app.set_tenant('00000000-0000-0000-0000-000000000000'); ... COMMIT;
CREATE OR REPLACE FUNCTION app.set_tenant(p_tenant uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant::text, true);
END$$;

-- === Enums ===
DO $$ BEGIN
  CREATE TYPE user_status_enum AS ENUM ('active','disabled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE membership_role_enum AS ENUM ('attorney_owner','paralegal','staff');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE client_status_enum AS ENUM ('active','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE relationship_status_enum AS ENUM ('single','married','divorced','widowed','partnered','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE person_role_enum AS ENUM ('client_primary','spouse','child','beneficiary','advisor','representative','trustee','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE life_status_enum AS ENUM ('alive','deceased');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE adoption_status_enum AS ENUM ('none','adopted','stepchild','foster');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incapacity_status_enum AS ENUM ('none','permanent_incapacity');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE relationship_type_enum AS ENUM (
    'biological_parent','adoptive_parent','step_parent','legal_guardian',
    'custodial_parent','non_custodial_parent','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE parental_rights_enum AS ENUM ('full','joint','sole','terminated','unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- v2 titling split
DO $$ BEGIN
  CREATE TYPE title_form_enum AS ENUM (
    'sole','jtwros','tenancy_in_common','trust_titled',
    'custodial_utma','custodial_ugma','usufruct','naked_ownership','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE marital_character_enum AS ENUM ('community','separate','quasi_community','unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- v2 asset categories
DO $$ BEGIN
  CREATE TYPE asset_category_enum AS ENUM (
    'real_estate','personal_property','vehicle','bank','brokerage','retirement','annuity','life_insurance',
    'employer_equity','education_account','hsa_fsa','crypto_alts','reits_interest','business_interest',
    'trust_interest','future_interest_iou','promissory_note','donor_advised_fund','patent',
    'royalty_interest','mineral_interest','savings_bond','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE probate_class_enum AS ENUM ('probate','non_probate','contingent_to_trust');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE instrument_type_enum AS ENUM ('RSU','ISO','NSO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE beneficiary_tier_enum AS ENUM ('primary','contingent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status_enum AS ENUM ('draft','confirmed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE liability_kind_enum AS ENUM (
    'primary_mortgage','second_mortgage','heloc','vehicle_loan','personal_loan','credit_card',
    'student_loan','business_loan','admin_cost','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE bequest_type_enum AS ENUM ('specific','percentage','residuary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE trust_type_enum AS ENUM ('revocable','irrevocable','family','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- === Core tables ===
CREATE TABLE IF NOT EXISTS tenant (
  tenant_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id uuid NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "users" (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email citext UNIQUE NOT NULL,
  password_digest text NOT NULL,
  status user_status_enum NOT NULL,
  person_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS membership (
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
  role membership_role_enum NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (tenant_id, user_id)
);

CREATE TABLE IF NOT EXISTS client (
  client_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  primary_attorney_user_id uuid NOT NULL REFERENCES "users"(user_id),
  label text NOT NULL,
  status client_status_enum NOT NULL,
  relationship_status relationship_status_enum NOT NULL,
  residence_country text NOT NULL,
  residence_admin_area text NOT NULL,
  residence_locality text NOT NULL,
  residence_postal_code text,
  residence_line1 text,
  residence_line2 text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_client_tenant ON client(tenant_id);

CREATE TABLE IF NOT EXISTS client_account (
  client_account_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','spouse','delegate')),
  is_enabled boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS client_grant (
  client_grant_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  grantee_user_id uuid NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
  permissions text[] NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  CONSTRAINT uq_client_grant UNIQUE (client_id, grantee_user_id)
);

-- Person & roles
CREATE TABLE IF NOT EXISTS person (
  person_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  suffix text,
  preferred_name text,
  ssn_enc text,
  dob date,
  birth_country text,
  birth_admin_area text,
  birth_locality text,
  is_decedent boolean,
  date_of_death date,
  death_country text,
  death_admin_area text,
  death_locality text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "users" ADD CONSTRAINT fk_user_person FOREIGN KEY (person_id) REFERENCES person(person_id);

CREATE TABLE IF NOT EXISTS person_role (
  person_role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  role person_role_enum NOT NULL,
  priority int,
  notes text,
  CONSTRAINT uq_person_role UNIQUE (client_id, person_id, role)
);

CREATE TABLE IF NOT EXISTS child_profile (
  profile_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  life_status life_status_enum NOT NULL,
  date_of_death date,
  adoption_status adoption_status_enum NOT NULL,
  adoption_date date,
  incapacity_status incapacity_status_enum NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_child_profile UNIQUE (client_id, person_id)
);

CREATE TABLE IF NOT EXISTS parentage (
  parentage_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  child_person_id uuid NOT NULL REFERENCES person(person_id),
  parent_person_id uuid NOT NULL REFERENCES person(person_id),
  relationship_type relationship_type_enum NOT NULL,
  parental_rights parental_rights_enum NOT NULL,
  start_date date,
  end_date date,
  legal_basis text,
  notes text,
  CONSTRAINT chk_parent_child_distinct CHECK (child_person_id <> parent_person_id)
);

CREATE TABLE IF NOT EXISTS marital_record (
  marital_record_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL UNIQUE REFERENCES client(client_id) ON DELETE CASCADE,
  spouse_a_person_id uuid NOT NULL REFERENCES person(person_id),
  spouse_b_person_id uuid NOT NULL REFERENCES person(person_id),
  marriage_date date,
  marriage_country text,
  marriage_admin_area text,
  marriage_locality text,
  dissolution_date date,
  dissolution_type text CHECK (dissolution_type IN ('divorce','death','annulment','other')),
  has_pre_marital_agreement boolean NOT NULL DEFAULT false,
  pre_agreement_storage_url text,
  has_post_marital_agreement boolean NOT NULL DEFAULT false,
  post_agreement_storage_url text,
  lived_in_community_property_state boolean NOT NULL DEFAULT false,
  notes text,
  CONSTRAINT chk_spouses_distinct CHECK (spouse_a_person_id <> spouse_b_person_id)
);

-- Addresses & contacts
CREATE TABLE IF NOT EXISTS address (
  address_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  person_id uuid REFERENCES person(person_id) ON DELETE CASCADE,
  client_id uuid REFERENCES client(client_id) ON DELETE CASCADE,
  country text NOT NULL,
  admin_area text NOT NULL,
  locality text NOT NULL,
  postal_code text,
  line1 text NOT NULL,
  line2 text,
  is_current boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS contact_point (
  contact_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('phone','email')),
  value text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS person_name_history (
  person_name_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  full_name text NOT NULL,
  note text
);

-- Trusts
CREATE TABLE IF NOT EXISTS trust (
  trust_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  trust_name text NOT NULL,
  trust_type trust_type_enum NOT NULL,
  date_signed date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Assets (v2)
CREATE TABLE IF NOT EXISTS asset (
  asset_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  display_name text NOT NULL,
  institution_or_provider text,
  account_or_policy_identifier_enc text,
  owner_scope text NOT NULL CHECK (owner_scope IN ('household','person')),
  owner_person_id uuid REFERENCES person(person_id),
  -- Titling vs legal character (decoupled)
  title_form title_form_enum NOT NULL,
  marital_character marital_character_enum NOT NULL,
  -- Classification & routing
  percent_owned numeric,
  category asset_category_enum NOT NULL,
  subtype text,
  probate_class probate_class_enum NOT NULL,
  beneficiary_designation_required boolean NOT NULL,
  is_excluded_from_taxable_estate boolean NOT NULL,
  -- Life insurance
  insured_person_id uuid REFERENCES person(person_id),
  policy_owner_person_id uuid REFERENCES person(person_id),
  face_amount numeric,
  cash_value numeric,
  -- Retirement / Benefits
  plan_type text,
  custodian text,
  is_ira_wrapper boolean,
  -- Employer equity
  employer text,
  instrument_type instrument_type_enum,
  grant_id text,
  vested_value numeric,
  -- Education / Trust
  successor_owner_person_id uuid REFERENCES person(person_id),
  legal_description_or_entity text,
  trust_id uuid REFERENCES trust(trust_id),
  trust_capacity text CHECK (trust_capacity IN ('trustee','income_beneficiary','principal_beneficiary')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- v2 checks
  CONSTRAINT chk_asset_owner_scope CHECK (
    owner_scope = 'household' OR (owner_scope = 'person' AND owner_person_id IS NOT NULL)
  ),
  CONSTRAINT chk_tic_percent_owned CHECK (
    title_form <> 'tenancy_in_common' OR percent_owned IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS asset_valuation (
  asset_valuation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES asset(asset_id) ON DELETE CASCADE,
  valuation_date date NOT NULL,
  amount numeric(18,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_asset_valuation UNIQUE (asset_id, valuation_date)
);

CREATE TABLE IF NOT EXISTS beneficiary_designation (
  beneficiary_designation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES asset(asset_id) ON DELETE CASCADE,
  tier beneficiary_tier_enum NOT NULL,
  party_person_id uuid REFERENCES person(person_id),
  party_trust_id uuid REFERENCES trust(trust_id),
  percent numeric(5,2) NOT NULL CHECK (percent >= 0 AND percent <= 100),
  per_stirpes boolean NOT NULL DEFAULT false,
  effective_date date,
  verification_status verification_status_enum NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_exactly_one_party CHECK (
    (party_person_id IS NOT NULL)::int + (party_trust_id IS NOT NULL)::int = 1
  )
);

-- Liabilities
CREATE TABLE IF NOT EXISTS liability (
  liability_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  kind liability_kind_enum NOT NULL,
  creditor_name text NOT NULL,
  secured_asset_id uuid REFERENCES asset(asset_id),
  balance numeric(18,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  as_of date NOT NULL,
  interest_rate_apr numeric(5,3),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Wills
CREATE TABLE IF NOT EXISTS will (
  will_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  testator_person_id uuid NOT NULL REFERENCES person(person_id),
  date_signed date NOT NULL,
  independent_administration boolean NOT NULL,
  bond_or_compensation text,
  is_last_will boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS will_bequest (
  will_bequest_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  will_id uuid NOT NULL REFERENCES will(will_id) ON DELETE CASCADE,
  bequest_type bequest_type_enum NOT NULL,
  description text NOT NULL,
  party_person_id uuid REFERENCES person(person_id),
  party_trust_id uuid REFERENCES trust(trust_id),
  percent numeric(5,2),
  per_stirpes boolean NOT NULL DEFAULT false,
  CONSTRAINT chk_exactly_one_bequest_party CHECK (
    (party_person_id IS NOT NULL)::int + (party_trust_id IS NOT NULL)::int = 1
  )
);

-- === Integrity constraints ===

-- client.primary_attorney_user_id must be active attorney_owner
CREATE OR REPLACE FUNCTION app.enforce_client_primary_attorney()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_role membership_role_enum;
BEGIN
  SELECT role INTO v_role
  FROM membership
  WHERE tenant_id = NEW.tenant_id AND user_id = NEW.primary_attorney_user_id AND is_active;
  IF v_role IS NULL OR v_role <> 'attorney_owner' THEN
    RAISE EXCEPTION 'primary_attorney_user_id must be an active attorney_owner within tenant';
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_client_primary_attorney ON client;
CREATE TRIGGER trg_client_primary_attorney
BEFORE INSERT OR UPDATE OF primary_attorney_user_id, tenant_id
ON client FOR EACH ROW
EXECUTE FUNCTION app.enforce_client_primary_attorney();

-- Liability compatibility
CREATE OR REPLACE FUNCTION app.enforce_liability_asset_compat()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_cat asset_category_enum;
BEGIN
  IF NEW.secured_asset_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT category INTO v_cat FROM asset WHERE asset_id = NEW.secured_asset_id;
  IF NEW.kind IN ('primary_mortgage','second_mortgage','heloc') AND v_cat <> 'real_estate' THEN
    RAISE EXCEPTION 'Mortgage/HELOC must be secured by real_estate asset';
  END IF;
  IF NEW.kind = 'vehicle_loan' AND v_cat <> 'vehicle' THEN
    RAISE EXCEPTION 'Vehicle loan must be secured by vehicle asset';
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_liability_asset ON liability;
CREATE TRIGGER trg_liability_asset
BEFORE INSERT OR UPDATE OF kind, secured_asset_id
ON liability FOR EACH ROW
EXECUTE FUNCTION app.enforce_liability_asset_compat();

-- Beneficiary totals per (asset_id, tier) = 100
CREATE OR REPLACE FUNCTION app.check_beneficiary_percent()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_asset uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_asset := OLD.asset_id;
  ELSE
    v_asset := NEW.asset_id;
  END IF;
  PERFORM 1 FROM (
    SELECT tier, ROUND(COALESCE(SUM(percent),0),2) as total
    FROM beneficiary_designation
    WHERE asset_id = v_asset
    GROUP BY tier
    HAVING ROUND(COALESCE(SUM(percent),0),2) <> 100.00
  ) bad;
  IF FOUND THEN
    RAISE EXCEPTION 'Sum of beneficiary percents per (asset,tier) must total 100';
  END IF;
  RETURN NULL;
END$$;

DROP TRIGGER IF EXISTS trg_beneficiary_percent_validate ON beneficiary_designation;
CREATE CONSTRAINT TRIGGER trg_beneficiary_percent_validate
AFTER INSERT OR UPDATE OR DELETE ON beneficiary_designation
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION app.check_beneficiary_percent();

-- If beneficiary required, enforce at least one primary
CREATE OR REPLACE FUNCTION app.enforce_required_primary_beneficiary()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  need boolean;
  has_primary boolean;
BEGIN
  SELECT beneficiary_designation_required INTO need FROM asset WHERE asset_id = NEW.asset_id;
  IF need THEN
    SELECT EXISTS(
      SELECT 1 FROM beneficiary_designation WHERE asset_id = NEW.asset_id AND tier = 'primary'
    ) INTO has_primary;
    IF NOT has_primary THEN
      RAISE EXCEPTION 'Primary beneficiary required for this asset';
    END IF;
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_required_primary_beneficiary ON beneficiary_designation;
CREATE TRIGGER trg_required_primary_beneficiary
AFTER INSERT OR UPDATE ON beneficiary_designation
FOR EACH ROW
EXECUTE FUNCTION app.enforce_required_primary_beneficiary();

-- === RLS scaffold ===
ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_is_self ON tenant
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- Tenant-only tables
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN
    SELECT 'person'::text tbl UNION ALL
    SELECT 'trust' UNION ALL
    SELECT 'address' UNION ALL
    SELECT 'contact_point' UNION ALL
    SELECT 'person_name_history'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', r.tbl);
    EXECUTE format($f$CREATE POLICY %I_rls ON %I USING (tenant_id = current_setting('app.tenant_id', true)::uuid);$f$, r.tbl, r.tbl);
  END LOOP;
END $$;

-- Client-scoped tables
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN
    SELECT 'client'::text tbl UNION ALL
    SELECT 'client_account' UNION ALL
    SELECT 'client_grant' UNION ALL
    SELECT 'person_role' UNION ALL
    SELECT 'child_profile' UNION ALL
    SELECT 'parentage' UNION ALL
    SELECT 'marital_record' UNION ALL
    SELECT 'asset' UNION ALL
    SELECT 'asset_valuation' UNION ALL
    SELECT 'beneficiary_designation' UNION ALL
    SELECT 'liability' UNION ALL
    SELECT 'will' UNION ALL
    SELECT 'will_bequest'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', r.tbl);
    EXECUTE format($f$CREATE POLICY %I_rls ON %I USING (tenant_id = current_setting('app.tenant_id', true)::uuid);$f$, r.tbl, r.tbl);
  END LOOP;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_membership_role ON membership(tenant_id, role) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_person_role_client ON person_role(client_id, role);
CREATE INDEX IF NOT EXISTS idx_asset_client_category ON asset(client_id, category);
CREATE INDEX IF NOT EXISTS idx_liability_client_kind ON liability(client_id, kind);
CREATE INDEX IF NOT EXISTS idx_asset_valuation_asset_date ON asset_valuation(asset_id, valuation_date);

-- Example seed (commented)
-- INSERT INTO "users"(email, password_digest, status) VALUES ('owner@example.com','<bcrypt>','active') RETURNING user_id;
-- INSERT INTO tenant(owner_user_id, display_name) VALUES ('<user_uuid>','A. Smith, Esq.') RETURNING tenant_id;
-- INSERT INTO membership(tenant_id, user_id, role) VALUES ('<tenant_uuid>','<user_uuid>','attorney_owner');
