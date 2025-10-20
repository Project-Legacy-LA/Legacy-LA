# Data Models Reference for Legacy Louisiana Frontend

## Overview

This document provides detailed data models and field mappings for all frontend components, aligned with the backend database schema.

## 1. Person Model

### Frontend Structure (AboutYouComprehensive.jsx)

```javascript
const [formData, setFormData] = useState({
  // Person table fields
  legalFirstName: "",
  middleName: "",
  legalLastName: "",
  suffix: "",
  preferredName: "",
  socialSecurityNumber: "",
  dateOfBirth: {
    month: "",
    day: "",
    year: "",
  },
  birthCountry: "",
  birthState: "",
  birthCity: "",

  // Client table fields
  residenceCountry: "",
  residenceState: "",
  residenceParish: "",
  residenceCity: "",
  residenceZipCode: "",
  residenceAddress1: "",
  residenceAddress2: "",

  // Additional fields
  gender: "",
  usCitizen: "",
  additionalCitizenship: "",
  otherCitizenship: "",
  priorNames: "",

  // Marriage Status
  hasBeenMarried: false,

  // Executor/Administrator Information
  isExecutorOrAdmin: false,
  decedentInfo: {
    firstName: "",
    lastName: "",
    dateOfDeath: "",
  },

  // Contact Information
  phone: "",
  email: "",

  // Children Information
  children: [],
});
```

### Backend Mapping

```sql
-- Person table
first_name VARCHAR(100)
middle_name VARCHAR(100)
last_name VARCHAR(100)
suffix VARCHAR(20)
preferred_name VARCHAR(100)
ssn VARCHAR(11)
date_of_birth DATE
birth_country VARCHAR(100)
birth_state VARCHAR(100)
birth_city VARCHAR(100)
life_status life_status_enum DEFAULT 'alive'
date_of_death DATE
place_of_death VARCHAR(200)
is_decedent BOOLEAN DEFAULT FALSE

-- Client table
residence_country VARCHAR(100)
residence_state VARCHAR(100)
residence_parish VARCHAR(100)
residence_city VARCHAR(100)
residence_zip_code VARCHAR(20)
residence_address1 VARCHAR(200)
residence_address2 VARCHAR(200)
gender VARCHAR(20)
us_citizen BOOLEAN
additional_citizenship VARCHAR(100)
other_citizenship VARCHAR(100)
prior_names TEXT
phone VARCHAR(20)
email VARCHAR(255)
```

## 2. Asset Model

### Frontend Structure (Assets.jsx)

```javascript
const [assets, setAssets] = useState([
  {
    id: 1,
    category: "real_estate",
    description: "",
    institution: "",
    accountNumber: "",
    titleForm: "",
    valuation: {
      amount: "",
      currency: "USD",
      valuationDate: "",
    },
    ownershipPercentage: 100,
    maritalCharacter: "",
    probateClass: "",
    isLouisianaProperty: true,
    propertyLocation: "",
    stateLocation: "",
    beneficiaryDesignationRequired: false,
    excludedFromTaxableEstate: false,
    propertyType: "",
    annuityQualified: false,
    annuityNonQualified: false,
    propertyAddress: {
      street: "",
      city: "",
      zipCode: "",
    },
    owners: [],
    beneficiaries: [],
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Asset table
asset_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
category asset_category_enum
description TEXT
institution VARCHAR(200)
account_number VARCHAR(100)
title_form title_form_enum
valuation_amount DECIMAL(15,2)
valuation_currency VARCHAR(3) DEFAULT 'USD'
valuation_date DATE
ownership_percentage DECIMAL(5,2) DEFAULT 100
marital_character marital_character_enum
probate_class probate_class_enum
is_louisiana_property BOOLEAN
property_location VARCHAR(200)
state_location VARCHAR(100)
beneficiary_designation_required BOOLEAN DEFAULT FALSE
excluded_from_taxable_estate BOOLEAN DEFAULT FALSE
property_type VARCHAR(100)
annuity_qualified BOOLEAN DEFAULT FALSE
annuity_non_qualified BOOLEAN DEFAULT FALSE
property_address_street VARCHAR(200)
property_address_city VARCHAR(100)
property_address_zip_code VARCHAR(20)
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 3. Liability Model

### Frontend Structure (Liabilities.jsx)

```javascript
const [liabilities, setLiabilities] = useState([
  {
    id: 1,
    type: "mortgage",
    description: "",
    amount: "",
    monthlyPayment: "",
    associatedAssetId: null,
    creditor: "",
    accountNumber: "",
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Liability table
liability_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
kind liability_kind_enum
description TEXT
amount DECIMAL(15,2)
monthly_payment DECIMAL(15,2)
associated_asset_id UUID REFERENCES asset(asset_id)
creditor VARCHAR(200)
account_number VARCHAR(100)
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 4. Decision Maker Model

### Frontend Structure (DecisionMakers.jsx)

```javascript
const [decisionMakers, setDecisionMakers] = useState([
  {
    id: 1,
    personId: null,
    role: "executor",
    isCoRole: false,
    coRolePersonId: null,
    relationship: "",
    importantInfo: "",
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Decision maker table
decision_maker_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
person_id UUID REFERENCES person(person_id)
role VARCHAR(100)
is_co_role BOOLEAN DEFAULT FALSE
co_role_person_id UUID REFERENCES person(person_id)
relationship VARCHAR(100)
important_info TEXT
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 5. Advisor Model

### Frontend Structure (Advisors.jsx)

```javascript
const [advisors, setAdvisors] = useState([
  {
    id: 1,
    personId: null,
    advisorType: "attorney",
    firmName: "",
    specializations: [],
    yearsOfExperience: "",
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Advisor table
advisor_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
person_id UUID REFERENCES person(person_id)
advisor_type VARCHAR(100)
firm_name VARCHAR(200)
specializations TEXT[]
years_of_experience INTEGER
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 6. Document Model

### Frontend Structure (Documents.jsx)

```javascript
const [documents, setDocuments] = useState([
  {
    id: 1,
    documentType: "will",
    title: "",
    dateCreated: "",
    dateLastUpdated: "",
    location: "",
    attorneyId: null,
    witnesses: [],
    isCurrent: true,
    notes: "",
    files: [],
  },
]);
```

### Backend Mapping

```sql
-- Document table
document_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
document_type VARCHAR(100)
title VARCHAR(200)
date_created DATE
date_last_updated DATE
location VARCHAR(200)
attorney_id UUID REFERENCES person(person_id)
witnesses UUID[] -- Array of person IDs
is_current BOOLEAN DEFAULT TRUE
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 7. Spouse Access Model

### Frontend Structure (SpouseAccessManager.jsx)

```javascript
const [accessSettings, setAccessSettings] = useState({
  spouseHasAccess: true,
  spouseEmail: "",
  spousePassword: "",
  spouseStatus: "current",
  hasPrenup: false,
  hasDivorceDecree: false,
  prenupDate: "",
  divorceDecreeDate: "",

  // View permissions
  canViewPersonalInfo: false,
  canViewChildren: false,
  canViewAssets: false,
  canViewBeneficiaries: false,
  canViewDecisionMakers: false,
  canViewAdvisors: false,

  // Edit permissions
  canEditPersonalInfo: false,
  canEditChildren: false,
  canEditAssets: false,
  canEditBeneficiaries: false,
  canEditDecisionMakers: false,
  canEditAdvisors: false,

  // Delete permissions
  canDeletePersonalInfo: false,
  canDeleteChildren: false,
  canDeleteAssets: false,
  canDeleteBeneficiaries: false,
  canDeleteDecisionMakers: false,
  canDeleteAdvisors: false,
});
```

### Backend Mapping

```sql
-- Spouse access table
spouse_access_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
spouse_has_access BOOLEAN DEFAULT FALSE
spouse_email VARCHAR(255)
spouse_password VARCHAR(255) -- Hashed
spouse_status VARCHAR(20) DEFAULT 'current'
has_prenup BOOLEAN DEFAULT FALSE
has_divorce_decree BOOLEAN DEFAULT FALSE
prenup_date DATE
divorce_decree_date DATE

-- View permissions
can_view_personal_info BOOLEAN DEFAULT FALSE
can_view_children BOOLEAN DEFAULT FALSE
can_view_assets BOOLEAN DEFAULT FALSE
can_view_beneficiaries BOOLEAN DEFAULT FALSE
can_view_decision_makers BOOLEAN DEFAULT FALSE
can_view_advisors BOOLEAN DEFAULT FALSE

-- Edit permissions
can_edit_personal_info BOOLEAN DEFAULT FALSE
can_edit_children BOOLEAN DEFAULT FALSE
can_edit_assets BOOLEAN DEFAULT FALSE
can_edit_beneficiaries BOOLEAN DEFAULT FALSE
can_edit_decision_makers BOOLEAN DEFAULT FALSE
can_edit_advisors BOOLEAN DEFAULT FALSE

-- Delete permissions
can_delete_personal_info BOOLEAN DEFAULT FALSE
can_delete_children BOOLEAN DEFAULT FALSE
can_delete_assets BOOLEAN DEFAULT FALSE
can_delete_beneficiaries BOOLEAN DEFAULT FALSE
can_delete_decision_makers BOOLEAN DEFAULT FALSE
can_delete_advisors BOOLEAN DEFAULT FALSE

created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 8. Beneficiary Model

### Frontend Structure (Assets.jsx)

```javascript
const [beneficiaries, setBeneficiaries] = useState([
  {
    id: 1,
    personId: null,
    relationship: "",
    allAssets: false,
    residualAssets: false,
    contingentAssets: false,
    inheritanceType: "",
    percentage: 0,
    specificAssets: [],
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Beneficiary table
beneficiary_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
person_id UUID REFERENCES person(person_id)
relationship VARCHAR(100)
all_assets BOOLEAN DEFAULT FALSE
residual_assets BOOLEAN DEFAULT FALSE
contingent_assets BOOLEAN DEFAULT FALSE
inheritance_type VARCHAR(100)
percentage DECIMAL(5,2) DEFAULT 0
specific_assets UUID[] -- Array of asset IDs
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 9. Child Model

### Frontend Structure (AboutYouComprehensive.jsx)

```javascript
const [children, setChildren] = useState([
  {
    id: 1,
    personId: null,
    relationship: "",
    relationshipType: "",
    parentalRights: "",
    adoptionStatus: "",
    isMinor: false,
    guardianInfo: {},
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Child table
child_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
person_id UUID REFERENCES person(person_id)
relationship VARCHAR(100)
relationship_type relationship_type_enum
parental_rights parental_rights_enum
adoption_status adoption_status_enum
is_minor BOOLEAN DEFAULT TRUE
guardian_info JSONB
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## 10. Spouse Model

### Frontend Structure (AboutYouComprehensive.jsx)

```javascript
const [spouses, setSpouses] = useState([
  {
    id: 1,
    personId: null,
    relationship: "",
    marriageDate: {
      month: "",
      day: "",
      year: "",
    },
    divorceDate: {
      month: "",
      day: "",
      year: "",
    },
    deathDate: {
      month: "",
      day: "",
      year: "",
    },
    isCurrent: false,
    notes: "",
  },
]);
```

### Backend Mapping

```sql
-- Spouse table
spouse_id UUID PRIMARY KEY
client_id UUID REFERENCES client(client_id)
person_id UUID REFERENCES person(person_id)
relationship VARCHAR(100)
marriage_date DATE
divorce_date DATE
death_date DATE
is_current BOOLEAN DEFAULT FALSE
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
```

## Enum Values Reference

### Asset Categories

```sql
asset_category_enum: 'real_estate', 'personal_property', 'vehicle', 'bank', 'brokerage', 'retirement', 'annuity', 'life_insurance', 'employer_equity', 'education_account', 'hsa_fsa', 'crypto_alts', 'reits_interest', 'business_interest', 'trust_interest', 'future_interest_iou', 'promissory_note', 'donor_advised_fund', 'patent', 'royalty_interest', 'mineral_interest', 'savings_bond', 'other'
```

### Title Forms

```sql
title_form_enum: 'sole', 'jtwros', 'tenancy_in_common', 'trust_titled', 'custodial_utma', 'custodial_ugma', 'usufruct', 'naked_ownership', 'other'
```

### Marital Character

```sql
marital_character_enum: 'community', 'separate', 'quasi_community', 'unknown'
```

### Probate Class

```sql
probate_class_enum: 'probate', 'non_probate', 'contingent_to_trust'
```

### Liability Kinds

```sql
liability_kind_enum: 'primary_mortgage', 'second_mortgage', 'heloc', 'vehicle_loan', 'personal_loan', 'credit_card', 'student_loan', 'business_loan', 'admin_cost', 'other'
```

### Life Status

```sql
life_status_enum: 'alive', 'deceased'
```

### Relationship Status

```sql
relationship_status_enum: 'single', 'married', 'divorced', 'widowed', 'partnered', 'other'
```

## Data Validation Rules

### Required Fields

- **Person**: first_name, last_name, ssn
- **Client**: residence_country, residence_state, residence_city
- **Asset**: category, description, valuation_amount
- **Liability**: kind, description, amount
- **Decision Maker**: person_id, role
- **Advisor**: person_id, advisor_type
- **Document**: document_type, title

### Format Validation

- **Email**: Valid email format
- **Phone**: 10-digit US phone number
- **SSN**: XXX-XX-XXXX format
- **Date**: YYYY-MM-DD format
- **Percentage**: 0-100 range
- **Amount**: Positive decimal values

### Business Rules

- **Asset Ownership**: Total ownership percentages should not exceed 100%
- **Beneficiary Percentages**: Total beneficiary percentages should not exceed 100%
- **Date Logic**: Marriage date < divorce date < death date
- **Age Logic**: Birth date < death date
- **Required Relationships**: Decision makers must have assigned persons

## API Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "field1": "value1",
    "field2": "value2"
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### List Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid1",
      "field1": "value1"
    },
    {
      "id": "uuid2",
      "field1": "value2"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

This reference provides all the necessary information for backend developers to understand the frontend data structures and implement the corresponding API endpoints.

