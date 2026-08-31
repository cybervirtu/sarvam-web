# Product Requirements Document (PRD)

## 1. Overview
Sarvam is a unified task and project management ecosystem designed to offer a cohesive, high-performance user experience.

## 2. Core Functional Requirements
* **Task Management**: Create, Read, Update, and Delete tasks. Support for sub-tasks, nesting, and complex metadata (due dates, labels, urgency).
* **Project Organization**: Tasks can be grouped into distinct user-defined projects and sections.
* **Drag and Drop Engine**: Fluid user interaction to reprioritize and reorganize tasks within lists and sections.
* **User Accounts**: Secure user registration, authentication, and session management.

## 3. High-Level Non-Functional Requirements
### 3.1 Environments & Separation
The system must guarantee isolation between testing data and user production data.
* **Strict Separation**: Production and Staging databases must be physically or logically separated (e.g., separate PostgreSQL 18 containers).
* **Feature Rollouts**: Features must deploy to the Staging environment (`develop` branch) and pass verification before promotion to the Production environment (`main` branch).

### 3.2 Security
* **Authentication Storage**: Must use secure, HTTP-only session cookies. Usage of `localStorage` for authentication tokens is explicitly forbidden to prevent Cross-Site Scripting (XSS) leaks.
* **CORS Strategy**: The API layer must whitelist precise consumer client domains. Generic wildcard CORS configurations (`*`) are prohibited.
* **Network Isolation**: The application's database and internal storage layers must not expose ports publicly unless explicitly tunneled.

### 3.3 Scalability & Performance
* Interactions in the frontend UI (especially Drag and Drop) must run smoothly at 60fps without layout jitter.
* The API must process requests and deliver payloads efficiently, backed by relational data modeling optimized via indices.
