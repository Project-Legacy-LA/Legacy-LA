-- === indexes.sql ===
SET search_path = app, public;

CREATE INDEX IF NOT EXISTS idx_client_tenant ON app.client(tenant_id);
CREATE INDEX IF NOT EXISTS idx_membership_role ON app.membership(tenant_id, role) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_person_role_client ON app.person_role(client_id, role);
CREATE INDEX IF NOT EXISTS idx_person_role_tenant_person_client ON app.person_role(tenant_id, person_id, client_id);
CREATE INDEX IF NOT EXISTS idx_asset_client_category ON app.asset(client_id, category);
CREATE INDEX IF NOT EXISTS idx_asset_valuation_asset_date ON app.asset_valuation(asset_id, valuation_date);
CREATE INDEX IF NOT EXISTS idx_liability_client_kind ON app.liability(client_id, kind);
CREATE INDEX IF NOT EXISTS idx_client_account_enabled ON app.client_account(tenant_id, client_id, user_id) WHERE is_enabled;
CREATE INDEX IF NOT EXISTS idx_client_grant_enabled ON app.client_grant(tenant_id, client_id, grantee_user_id) WHERE is_enabled;
CREATE UNIQUE INDEX IF NOT EXISTS uq_contact_point_primary ON app.contact_point(person_id, kind) WHERE is_primary;
