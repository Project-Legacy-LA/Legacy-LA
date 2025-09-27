# Legacy-LA

🚀 **Legacy-LA** is a Node.js + Express backend with **PostgreSQL** and **Redis-backed session authentication**.
It powers a multi-tenant estate planning platform where users can securely log in, manage assets, and generate financial reports.

---

## ✨ Features

- 🔑 **Secure Authentication**

  - Passwords hashed with **bcrypt**
  - HTTP-only cookies for session handling
  - Multi-device session tracking in **Redis**

- 📱 **Session Management**

  - View all active sessions (device + location metadata)
  - Logout current session
  - Logout one specific session remotely
  - Logout all sessions (panic button)
  - Sessions auto-expire (24h TTL)

- 📊 **Planned Features**

  - User asset registration and management
  - Generating estate/asset reports using **Python integrations**
  - Advanced analytics & visualization for user portfolios

---

## 🏗️ Tech Stack

- **Node.js / Express** → REST API framework
- **PostgreSQL** → core user & asset data
- **Redis** → in-memory session store
- **bcrypt** → password hashing
- **ua-parser-js** → device parsing
- **geoip-lite** → IP → location lookup
- **Python (planned)** → reporting & data analytics

---

## 📂 Project Structure

```
Legacy-LA/
├── config/                 # Database & Redis configs
├── controllers/            # Request handlers (auth, assets, etc.)
├── middleware/             # Auth & validation middleware
├── routes/                 # Versioned routes (/api/v1)
├── services/               # Business logic (auth, sessions, assets)
├── utils/                  # Helpers (device, location, response)
└── server.js               # Express entrypoint
```

---

## ⚙️ Setup & Installation

### 1. Clone Repo

```bash
git clone https://github.com/your-organization/Legacy-LA.git
cd Legacy-LA
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

`.env` file:

```env
PORT=3000
NODE_ENV=development

# PostgreSQL
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=legacyla

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 4. Database Setup

Run inside PostgreSQL:

```sql
CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE NOT NULL,
  password_digest text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Asset-related tables will be added later
```

### 5. Install Redis (bare metal)

#### macOS (Homebrew)

```bash
brew install redis
brew services start redis
```

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

#### Fedora/CentOS

```bash
sudo dnf install redis
sudo systemctl enable redis
sudo systemctl start redis
```

Verify it’s running:

```bash
redis-cli ping
# should return "PONG"
```

### 6. Start the Server

```bash
npm run dev
```

Server runs at:
👉 `http://localhost:3000/api/v1`

---

## 📡 API Endpoints (v1)

| Endpoint                    | Method | Auth | Description              |
| --------------------------- | ------ | ---- | ------------------------ |
| `/api/v1/auth/register`     | POST   | No   | Register a new user      |
| `/api/v1/auth/login`        | POST   | No   | Login & start session    |
| `/api/v1/auth/logout`       | POST   | Yes  | Logout current session   |
| `/api/v1/auth/me`           | GET    | Yes  | Get current user profile |
| `/api/v1/auth/sessions`     | GET    | Yes  | List all active sessions |
| `/api/v1/auth/sessions`     | DELETE | Yes  | Logout all sessions      |
| `/api/v1/auth/sessions/:id` | DELETE | Yes  | Logout one session by ID |

---

## 📊 Roadmap

- [x] Secure authentication system with Redis sessions
- [x] Session visibility and management (per-device control)
- [ ] Asset management (create, update, track user assets)
- [ ] Reporting engine using **Python** (e.g. Pandas, Matplotlib, ReportLab)
- [ ] User dashboards with analytics & visualizations
- [ ] Role-based access control for tenants (attorney, client, staff)

---

## 📜 License

This project is **proprietary software**.
All rights reserved. Unauthorized copying, modification, or distribution of this software is strictly prohibited without prior written permission from the author/organization.
