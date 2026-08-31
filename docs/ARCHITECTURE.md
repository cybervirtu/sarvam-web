# Architectural Overview: Sarvam 

Sarvam is comprised of a modern web application communicating with a robust Python backend, persisting data to a relational database.

## 1. Components
* **Frontend (`sarvam-web`)**: React application built with Vite, TypeScript, and Tailwind CSS. State is managed locally where appropriate, and global state relies on Zustand.
* **Backend (`sarvam-api`)**: Python application powered by FastAPI, serving a RESTful API.
* **Database**: PostgreSQL 18 used as the primary relational database for entity storage (tasks, projects, users).

## 2. Infrastructure & Deployment Setup
The application is hosted via **Coolify** on a Virtual Private Server (VPS), which manages the lifecycle, routing, and reverse proxies.

### Environment Segregation
Complete segregation exists between the Staging and Production environments.
* **Staging Environment**: Connected to the `develop` Git branch. Consists of a Staging UI (`ss.jewelminds.com`), a Staging API (`ssapi.jewelminds.com`), and an isolated `sarvam_pg_staging` database.
* **Production Environment**: Connected to the `main` Git branch. Consists of a Production UI (`sarvam.jewelminds.com`), a Production API (`sarvamapi.jewelminds.com`), and an isolated `sarvam_pg_prod` database.

### Networking
* Databases (PostgreSQL 18) are only accessible via the internal Coolify Docker network and are not exposed directly to the public internet.
* Let's Encrypt certificates are automatically provisioned by Coolify, ensuring all web and API traffic is over HTTPS.

## 3. Security & Authentication Model
We use a **Cookie-Based Session** architecture for authentication to maximize security against XSS.

### Details & Constraints
* **Session Cookies**: Upon successful login, the backend issues an `HTTP-only` cookie (`sarvam_session`).
* **Attributes**:
  * `Secure=true` in production to enforce transmission over HTTPS.
  * `SameSite=lax` is sufficient as the API and Web UI share the same apex domain (`*.jewelminds.com`).
  * `Max-Age` dictates the TTL for the session.
* **CORS**: The backend enforces strict Cross-Origin Resource Sharing. `allow_origins` strictly matches the deployed frontend URL (no wildcards `*`), and `allow_credentials=True` is set to accept cookies cross-origin.
* **Fetch Handling**: The frontend API client requires the `credentials: 'include'` flag for all requests to ensure the browser transmits the secure cookie automatically. No bearer tokens are used or stored in `localStorage`.
