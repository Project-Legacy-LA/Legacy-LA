-- === tables.sql ===
-- create schema, extensions, enums, core tables, and integrity triggers that do not depend on policy helpers

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS app;
SET search_path = app, public;

-- === Enums (explicitly in schema app) ===
DO $$ BEGIN CREATE TYPE app.user_status_enum        AS ENUM ('active','disabled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.membership_role_enum    AS ENUM ('attorney_owner','paralegal','staff'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.client_status_enum      AS ENUM ('active','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.relationship_status_enum AS ENUM ('single','married','divorced','widowed','partnered','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.person_role_enum        AS ENUM ('client_primary','spouse','child','beneficiary','advisor','trustee','representative','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.life_status_enum        AS ENUM ('alive','deceased'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.adoption_status_enum    AS ENUM ('none','adopted','stepchild','foster'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.incapacity_status_enum  AS ENUM ('none','permanent_incapacity'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.relationship_type_enum  AS ENUM ('biological_parent','adoptive_parent','step_parent','legal_guardian','custodial_parent','non_custodial_parent','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.parental_rights_enum    AS ENUM ('full','joint','sole','terminated','unknown'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.title_form_enum         AS ENUM ('sole','jtwros','tenancy_in_common','trust_titled','custodial_utma','custodial_ugma','usufruct','naked_ownership','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.marital_character_enum  AS ENUM ('community','separate','quasi_community','unknown'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.asset_category_enum     AS ENUM ('real_estate','personal_property','vehicle','bank','brokerage','retirement','annuity','life_insurance','employer_equity','education_account','hsa_fsa','crypto_alts','reits_interest','business_interest','trust_interest','future_interest_iou','promissory_note','donor_advised_fund','patent','royalty_interest','mineral_interest','savings_bond','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.probate_class_enum      AS ENUM ('probate','non_probate','contingent_to_trust'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.instrument_type_enum    AS ENUM ('RSU','ISO','NSO'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.beneficiary_tier_enum   AS ENUM ('primary','contingent'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.verification_status_enum AS ENUM ('draft','confirmed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.liability_kind_enum     AS ENUM ('primary_mortgage','second_mortgage','heloc','vehicle_loan','personal_loan','credit_card','student_loan','business_loan','admin_cost','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.bequest_type_enum       AS ENUM ('specific','percentage','residuary'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE app.trust_type_enum         AS ENUM ('revocable','irrevocable','family','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

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
  status app.user_status_enum NOT NULL,
  person_id uuid,
  is_superuser boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS membership (
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
  role app.membership_role_enum NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  PRIMARY KEY (tenant_id, user_id),
  created_by_user_id uuid REFERENCES "users"(user_id) ON DELETE SET NULL,
  revoked_by_user_id uuid REFERENCES "users"(user_id) ON DELETE SET NULL,
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS client (
  client_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  primary_attorney_user_id uuid NOT NULL REFERENCES "users"(user_id),
  label text NOT NULL,
  status app.client_status_enum NOT NULL,
  relationship_status app.relationship_status_enum NOT NULL,
  residence_country text NOT NULL,
  residence_admin_area text NOT NULL,
  residence_locality text NOT NULL,
  residence_postal_code text,
  residence_line1 text,
  residence_line2 text,
  editing_frozen boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_account (
  client_account_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','spouse','delegate')),
  can_write boolean,
  is_enabled boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES "users"(user_id) ON DELETE SET NULL,
  revoked_by_user_id uuid REFERENCES "users"(user_id) ON DELETE SET NULL,
  revoked_at timestamptz,
  CONSTRAINT uq_client_account UNIQUE (client_id, user_id)
);

CREATE TABLE IF NOT EXISTS client_grant (
  client_grant_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  grantee_user_id uuid NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
  permissions text[] NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES "users"(user_id) ON DELETE SET NULL,
  revoked_by_user_id uuid REFERENCES "users"(user_id) ON DELETE SET NULL,
  revoked_at timestamptz,
  CONSTRAINT uq_client_grant UNIQUE (client_id, grantee_user_id)
);

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
  is_alive boolean default true,
  date_of_death date,
  place_of_death text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_person_life_consistency CHECK ((is_alive = true AND date_of_death IS NULL) OR (is_alive = false AND date_of_death IS NOT NULL))
);

ALTER TABLE "users"
  ADD CONSTRAINT fk_user_person FOREIGN KEY (person_id) REFERENCES person(person_id);

CREATE TABLE IF NOT EXISTS person_role (
  person_role_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  role app.person_role_enum NOT NULL,
  notes text,
  CONSTRAINT uq_person_role UNIQUE (client_id, person_id, role)
);

CREATE TABLE IF NOT EXISTS child_profile (
  profile_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  life_status app.life_status_enum NOT NULL,
  date_of_death date,
  adoption_status app.adoption_status_enum NOT NULL,
  adoption_date date,
  incapacity_status app.incapacity_status_enum NOT NULL,
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
  relationship_type app.relationship_type_enum NOT NULL,
  parental_rights app.parental_rights_enum NOT NULL,
  start_date date,
  end_date date,
  legal_basis text,
  notes text,
  CONSTRAINT chk_parentage_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
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
  CONSTRAINT chk_marital_dates CHECK (dissolution_date IS NULL OR marriage_date IS NULL OR dissolution_date >= marriage_date),
  CONSTRAINT chk_spouses_distinct CHECK (spouse_a_person_id <> spouse_b_person_id)
);

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
  is_current boolean NOT NULL DEFAULT true,
  CONSTRAINT chk_address_owner_xor CHECK ((person_id IS NOT NULL)::int + (client_id IS NOT NULL)::int = 1)
);

CREATE TABLE IF NOT EXISTS contact_point (
  contact_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES person(person_id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('phone','email','other')),
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

CREATE TABLE IF NOT EXISTS trust (
  trust_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  trust_name text NOT NULL,
  trust_type app.trust_type_enum NOT NULL,
  date_signed date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asset (
  asset_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  display_name text NOT NULL,
  institution_or_provider text,
  account_or_policy_identifier_enc text,
  owner_scope text NOT NULL CHECK (owner_scope IN ('household','person')),
  owner_person_id uuid REFERENCES person(person_id),
  title_form app.title_form_enum NOT NULL,
  marital_character app.marital_character_enum NOT NULL,
  percent_owned numeric(5,2),
  category app.asset_category_enum NOT NULL,
  subtype text,
  probate_class app.probate_class_enum NOT NULL,
  beneficiary_designation_required boolean NOT NULL,
  is_excluded_from_taxable_estate boolean NOT NULL,
  insured_person_id uuid REFERENCES person(person_id),
  policy_owner_person_id uuid REFERENCES person(person_id),
  face_amount numeric,
  cash_value numeric,
  plan_type text,
  custodian text,
  is_ira_wrapper boolean NOT NULL DEFAULT false,
  employer text,
  instrument_type app.instrument_type_enum,
  grant_id text,
  vested_value numeric,
  successor_owner_person_id uuid REFERENCES person(person_id),
  legal_description_or_entity text,
  trust_id uuid REFERENCES trust(trust_id),
  trust_capacity text CHECK (trust_capacity IN ('trustee','income_beneficiary','principal_beneficiary')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_percent_owned_range CHECK (percent_owned IS NULL OR (percent_owned >= 0 AND percent_owned <= 100)),
  CONSTRAINT chk_owner_scope_person_null CHECK ((owner_scope = 'household' AND owner_person_id IS NULL) OR (owner_scope = 'person' AND owner_person_id IS NOT NULL)),
  CONSTRAINT chk_non_tic_percent_null CHECK (title_form = 'tenancy_in_common' OR percent_owned IS NULL),
  CONSTRAINT chk_tic_percent_owned CHECK (title_form <> 'tenancy_in_common' OR percent_owned IS NOT NULL),
  CONSTRAINT chk_asset_face_amount_nonneg CHECK (face_amount IS NULL OR face_amount >= 0),
  CONSTRAINT chk_asset_cash_value_nonneg CHECK (cash_value IS NULL OR cash_value >= 0)
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
  CONSTRAINT chk_asset_valuation_amt_nonneg CHECK (amount >= 0),
  CONSTRAINT uq_asset_valuation UNIQUE (asset_id, valuation_date)
);

CREATE TABLE IF NOT EXISTS beneficiary_designation (
  beneficiary_designation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES asset(asset_id) ON DELETE CASCADE,
  tier app.beneficiary_tier_enum NOT NULL,
  party_person_id uuid REFERENCES person(person_id),
  party_trust_id uuid REFERENCES trust(trust_id),
  percent numeric(5,2) NOT NULL CHECK (percent >= 0 AND percent <= 100),
  per_stirpes boolean NOT NULL DEFAULT false,
  effective_date date,
  verification_status app.verification_status_enum NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_exactly_one_party CHECK ((party_person_id IS NOT NULL)::int + (party_trust_id IS NOT NULL)::int = 1)
);

CREATE TABLE IF NOT EXISTS liability (
  liability_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id uuid NOT NULL REFERENCES tenant(tenant_id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client(client_id) ON DELETE CASCADE,
  kind app.liability_kind_enum NOT NULL,
  creditor_name text NOT NULL,
  secured_asset_id uuid REFERENCES asset(asset_id),
  balance numeric(18,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  as_of date NOT NULL,
  interest_rate_apr numeric(5,3),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_liability_balance_nonneg CHECK (balance >= 0),
  CONSTRAINT chk_liability_apr_nonneg CHECK (interest_rate_apr IS NULL OR interest_rate_apr >= 0)
);

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
  bequest_type app.bequest_type_enum NOT NULL,
  description text NOT NULL,
  party_person_id uuid REFERENCES person(person_id),
  party_trust_id uuid REFERENCES trust(trust_id),
  percent numeric(5,2),
  per_stirpes boolean NOT NULL DEFAULT false,
  CONSTRAINT chk_exactly_one_bequest_party CHECK ((party_person_id IS NOT NULL)::int + (party_trust_id IS NOT NULL)::int = 1),
  CONSTRAINT chk_will_bequest_percent_range CHECK (percent IS NULL OR (percent >= 0 AND percent <= 100))
);

-- Enforce beneficiary percentages sum per (asset,tier) = 100 (constraint trigger)
CREATE OR REPLACE FUNCTION app.check_beneficiary_percent()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_asset uuid;
BEGIN
  v_asset := CASE WHEN TG_OP = 'DELETE' THEN OLD.asset_id ELSE NEW.asset_id END;

  PERFORM 1 FROM (
    SELECT bd.tier, ROUND(COALESCE(SUM(bd.percent),0),2) AS total
    FROM app.beneficiary_designation bd
    WHERE bd.asset_id = v_asset
    GROUP BY bd.tier
    HAVING ROUND(COALESCE(SUM(bd.percent),0),2) <> 100.00
  ) bad;

  IF FOUND THEN
    RAISE EXCEPTION 'Sum of beneficiary percents per (asset,tier) must total 100';
  END IF;

  RETURN NULL;
END$$;

CREATE OR REPLACE FUNCTION app.enforce_required_primary_beneficiary()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_asset uuid;
  need boolean;
  has_primary boolean;
BEGIN
  v_asset := CASE WHEN TG_OP = 'DELETE' THEN OLD.asset_id ELSE NEW.asset_id END;
  SELECT a.beneficiary_designation_required INTO need
  FROM app.asset a WHERE a.asset_id = v_asset;

  IF need THEN
    SELECT EXISTS (
      SELECT 1 FROM app.beneficiary_designation bd
      WHERE bd.asset_id = v_asset AND bd.tier = 'primary'
    ) INTO has_primary;

    IF NOT has_primary THEN
      RAISE EXCEPTION 'Primary beneficiary required for this asset';
    END IF;
  END IF;
  RETURN NULL;
END$$;

CREATE CONSTRAINT TRIGGER trg_beneficiary_percent_validate
AFTER INSERT OR UPDATE OR DELETE ON app.beneficiary_designation
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION app.check_beneficiary_percent();

CREATE CONSTRAINT TRIGGER trg_required_primary_beneficiary
AFTER INSERT OR UPDATE OR DELETE ON app.beneficiary_designation
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION app.enforce_required_primary_beneficiary();

-- client.primary_attorney_user_id must be an active attorney_owner (reads membership only)
CREATE OR REPLACE FUNCTION app.enforce_client_primary_attorney()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_role app.membership_role_enum;  -- schema-qualified enum
BEGIN
  SELECT m.role INTO v_role
  FROM app.membership m
  WHERE m.tenant_id = NEW.tenant_id
    AND m.user_id   = NEW.primary_attorney_user_id
    AND m.is_active;

  IF v_role IS NULL OR v_role <> 'attorney_owner' THEN
    RAISE EXCEPTION 'primary_attorney_user_id must be an active attorney_owner within tenant';
  END IF;
  RETURN NEW;
END$$;

CREATE TRIGGER trg_client_primary_attorney
BEFORE INSERT OR UPDATE OF primary_attorney_user_id, tenant_id
ON app.client FOR EACH ROW
EXECUTE FUNCTION app.enforce_client_primary_attorney();

-- Liability compatibility (reads asset table only)
CREATE OR REPLACE FUNCTION app.enforce_liability_asset_compat()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_cat app.asset_category_enum;  -- schema-qualified enum
BEGIN
  IF NEW.secured_asset_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT a.category INTO v_cat
  FROM app.asset a
  WHERE a.asset_id = NEW.secured_asset_id;

  IF NEW.kind IN ('primary_mortgage','second_mortgage','heloc') AND v_cat <> 'real_estate' THEN
    RAISE EXCEPTION 'Mortgage/HELOC must be secured by real_estate asset';
  END IF;

  IF NEW.kind = 'vehicle_loan' AND v_cat <> 'vehicle' THEN
    RAISE EXCEPTION 'Vehicle loan must be secured by vehicle asset';
  END IF;

  RETURN NEW;
END$$;

CREATE TRIGGER trg_liability_asset
BEFORE INSERT OR UPDATE OF kind, secured_asset_id
ON app.liability FOR EACH ROW
EXECUTE FUNCTION app.enforce_liability_asset_compat();
