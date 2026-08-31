# Sarvam Web Database Design

## 1. Overview

### Purpose
This document outlines the database schema and architectural patterns for the Sarvam Web application, a comprehensive, Todoist Pro-style task management platform. It serves as the definitive guide for data models, constraints, and operational guidelines to ensure strict data integrity and high performance.

### Scope
This design supports current capabilities and establishes a robust foundation for future features, encompassing:
- User authentication via secure, HTTP-only cookie sessions.
- Project and section organization, including a guaranteed system-managed "Inbox" project per user.
- Complex task management involving nested subtasks, priority levels, labels, and recurrence logic.
- Fluid Drag-and-Drop (DnD) ordering within specific containers (projects, sections, or parent tasks).
- Stored criteria for user-defined Saved Filters using JSONB.

### Key Design Principles
- **PostgreSQL Native (v18)**: Leverage the latest PostgreSQL 18 features (e.g., native UUIDs, JSONB, optimized indexes, constraints) for robust data integrity without relying on an ORM layer.
- **Data Integrity at the Edge**: Rely on database-level Foreign Keys, `ON DELETE CASCADE`, and Check Constraints to prevent orphaned records and invalid states natively.
- **Performant Ordering**: Optimize the schema for fast updates and retrieval required by fluid DnD interactions using floating-point or scoped sparse-integer `sort_order` mechanisms.
- **Multi-Environment Safety**: Built to be safely deployable across isolated dev, staging, and production environments via Coolify, managed by raw SQL migrations.

---

## 2. Entity Relationship Summary

The schema is built around the following core entities:

- **users**: Core identity and authentication data.
- **sessions**: Tracks active user sessions for cookie-based authentication.
- **projects**: Top-level task containers belonging to a user (includes the Inbox).
- **sections**: Optional sub-containers within a project to group tasks.
- **labels**: User-defined tags for categorizing tasks.
- **tasks**: The central entity representing a defined piece of work. Contains self-referencing hierarchy for subtasks.
- **task_labels**: Join table resolving the many-to-many relationship between tasks and labels.
- **saved_filters**: User-created dynamic views using structured JSONB criteria.
- **schema_migrations**: Tracks applied database migrations to ensure environment consistency.

**Primary Relationships:**
- **User $\rightarrow$ Projects/Labels/Saved Filters**: One-to-Many. A user owns multiple projects, labels, and filters.
- **User $\rightarrow$ Sessions**: One-to-Many. A user can have multiple active sessions across devices.
- **Project $\rightarrow$ Sections**: One-to-Many. A project can contain multiple sections.
- **Project $\rightarrow$ Tasks**: One-to-Many. Tasks belong to exactly one project.
- **Section $\rightarrow$ Tasks**: One-to-Many. Tasks can optionally belong to one section within their project.
- **Task $\rightarrow$ Subtasks**: One-to-Many (Self-Referencing). A task can have multiple child tasks.
- **Tasks $\leftrightarrow$ Labels**: Many-to-Many via `task_labels`.

---

## 3. Schema Definition

### `users`
**Purpose**: Stores authentication credentials, preferences, and core identity.
- **Columns**:
  - `id` (`UUID`, PK, Default: `gen_random_uuid()`)
  - `email` (`TEXT`, Not Null)
  - `password_hash` (`TEXT`, Not Null)
  - `full_name` (`TEXT`, Nullable)
  - `timezone` (`TEXT`, Not Null, Default: `'UTC'`)
  - `created_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
  - `updated_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
- **Unique Constraints**:
  - `email` must be unique.
- **Indexes**: 
  - `idx_users_email` (implicitly created by UNIQUE constraint) to quickly look up users during login.

### `sessions`
**Purpose**: Tracks active HTTP-only cookie sessions.
- **Columns**:
  - `id` (`TEXT`, PK) - The cryptographically secure session string. 
  - `user_id` (`UUID`, Not Null, FK $\rightarrow$ `users.id` `ON DELETE CASCADE`)
  - `expires_at` (`TIMESTAMPTZ`, Not Null)
  - `created_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
- **Indexes**:
  - `idx_sessions_user_id` to quickly invalidate all sessions for a user.
  - `idx_sessions_expires_at` to facilitate cleanup of expired sessions via cron jobs.

### `projects`
**Purpose**: Represents user-defined folders/boards for tasks.
- **Columns**:
  - `id` (`UUID`, PK, Default: `gen_random_uuid()`)
  - `user_id` (`UUID`, Not Null, FK $\rightarrow$ `users.id` `ON DELETE CASCADE`)
  - `name` (`TEXT`, Not Null)
  - `color` (`TEXT`, Nullable)
  - `is_inbox` (`BOOLEAN`, Not Null, Default: `false`)
  - `is_favorite` (`BOOLEAN`, Not Null, Default: `false`)
  - `sort_order` (`DOUBLE PRECISION`, Not Null)
  - `created_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
  - `updated_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
- **Unique Constraints**:
  - Partial Unique Index on `(user_id)` where `is_inbox = true` to enforce exactly one Inbox per user.
- **Indexes**:
  - `idx_projects_user_id_sort` (`user_id`, `sort_order`) for retrieving a user's projects in sidebars.
- **Example Query**:
  - `SELECT * FROM projects WHERE user_id = $1 ORDER BY sort_order ASC;`

### `sections`
**Purpose**: Represents groups/columns within a project.
- **Columns**:
  - `id` (`UUID`, PK, Default: `gen_random_uuid()`)
  - `project_id` (`UUID`, Not Null, FK $\rightarrow$ `projects.id` `ON DELETE CASCADE`)
  - `name` (`TEXT`, Not Null)
  - `sort_order` (`DOUBLE PRECISION`, Not Null)
  - `created_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
  - `updated_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
- **Indexes**:
  - `idx_sections_project_id_sort` (`project_id`, `sort_order`) for retrieving sections within a project.

### `tasks`
**Purpose**: Core entity for actionable items.
- **Columns**:
  - `id` (`UUID`, PK, Default: `gen_random_uuid()`)
  - `user_id` (`UUID`, Not Null, FK $\rightarrow$ `users.id` `ON DELETE CASCADE`)
  - `project_id` (`UUID`, Not Null, FK $\rightarrow$ `projects.id` `ON DELETE CASCADE`)
  - `section_id` (`UUID`, Nullable, FK $\rightarrow$ `sections.id` `ON DELETE SET NULL`)
  - `parent_id` (`UUID`, Nullable, FK $\rightarrow$ `tasks.id` `ON DELETE CASCADE`)
  - `title` (`TEXT`, Not Null)
  - `description` (`TEXT`, Nullable)
  - `priority` (`INTEGER`, Not Null, Default: 4) - 1 (High) to 4 (Default).
  - `due_date` (`DATE`, Nullable) - Local calendar date.
  - `due_time` (`TIME`, Nullable) - Exact local wall-clock time if defined.
  - `timezone` (`TEXT`, Nullable) - User's timezone when the due date was set.
  - `recurrence_rule` (`TEXT`, Nullable) - RRULE format for recurring logic.
  - `is_completed` (`BOOLEAN`, Not Null, Default: `false`)
  - `completed_at` (`TIMESTAMPTZ`, Nullable)
  - `sort_order` (`DOUBLE PRECISION`, Not Null)
  - `created_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
  - `updated_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
- **Check Constraints**:
  - `chk_priority`: `priority >= 1 AND priority <= 4`
  - `chk_due_time_requires_date`: `(due_time IS NULL OR due_date IS NOT NULL)`
  - `chk_parent_differs`: `parent_id != id` (Prevents immediate recursive loop).
- **Indexes**:
  - `idx_tasks_container` (`project_id`, `section_id`, `parent_id`, `sort_order`) for retrieving ordered tasks inside a specific UI view.
  - `idx_tasks_user_id_due_date` (`user_id`, `due_date`) where `is_completed = false` for fast filtering of "Today" and "Upcoming" views.
- **Example Queries**:
  - *Fetch Today's Tasks*: `SELECT * FROM tasks WHERE user_id = $1 AND due_date <= CURRENT_DATE AND is_completed = false ORDER BY due_date ASC, priority ASC;`
  - *Fetch Project Tasks*: `SELECT * FROM tasks WHERE project_id = $1 AND section_id IS NULL AND parent_id IS NULL ORDER BY sort_order ASC;`

### `labels`
**Purpose**: Cross-project categorizations.
- **Columns**:
  - `id` (`UUID`, PK, Default: `gen_random_uuid()`)
  - `user_id` (`UUID`, Not Null, FK $\rightarrow$ `users.id` `ON DELETE CASCADE`)
  - `name` (`TEXT`, Not Null)
  - `color` (`TEXT`, Nullable)
- **Unique Constraints**:
  - `UNIQUE(user_id, name)` - Users cannot duplicate label names.
- **Indexes**:
  - `idx_labels_user_id` (`user_id`)

### `task_labels`
**Purpose**: Many-to-many resolution for tasks and labels.
- **Columns**:
  - `task_id` (`UUID`, Not Null, FK $\rightarrow$ `tasks.id` `ON DELETE CASCADE`)
  - `label_id` (`UUID`, Not Null, FK $\rightarrow$ `labels.id` `ON DELETE CASCADE`)
- **Primary Key**: `(task_id, label_id)`
- **Indexes**:
  - `idx_task_labels_label_id` for retrieving all tasks under a specific label.

### `saved_filters`
**Purpose**: Stores user-defined dynamic views.
- **Columns**:
  - `id` (`UUID`, PK, Default: `gen_random_uuid()`)
  - `user_id` (`UUID`, Not Null, FK $\rightarrow$ `users.id` `ON DELETE CASCADE`)
  - `name` (`TEXT`, Not Null)
  - `color` (`TEXT`, Nullable)
  - `criteria` (`JSONB`, Not Null) - Stores structured instructions.
  - `is_favorite` (`BOOLEAN`, Not Null, Default: `false`)
  - `sort_order` (`DOUBLE PRECISION`, Not Null)
  - `created_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
  - `updated_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)
- **Indexes**:
  - `idx_saved_filters_user_id_sort` (`user_id`, `sort_order`)

### `schema_migrations`
**Purpose**: Tracks which database migrations have run explicitly.
- **Columns**:
  - `version` (`TEXT`, PK)
  - `applied_at` (`TIMESTAMPTZ`, Not Null, Default: `now()`)

---

## 4. Ordering and Container Model

### What is a "Container"?
To provide fluid, scoped Drag-and-Drop (DnD) sorting, task sequences are strictly isolated within "containers". A container is defined by a unique combination of:
`(user_id, project_id, section_id, parent_id)`

### The `sort_order` Strategy
We use a **`DOUBLE PRECISION`** float for `sort_order` (Sparse Ordering) rather than integer array lists. 
- *Insertion*: Moving a task between Task A (`sort_order: 100`) and Task B (`sort_order: 200`) sets the new task's `sort_order` to `(100 + 200) / 2 = 150`.
- *Rebalancing*: If floating-point precision constraints are hit, a background job can linearly rebalance the container's orders without downtime.

### Move and Reorder Operations
When a user drags a task (e.g., from Project A to Project B, or reprioritizing within Project A):
1. **Transaction Boundary**: The backend opens an explicit transaction in `asyncpg`.
2. **Move**: The task's `project_id`, `section_id`, and `parent_id` are updated to match the target container.
3. **Reorder**: The `sort_order` is recalculated to slot perfectly into the target container's existing task sequence.
4. **Commit**: The transaction is committed. 

### Reparenting Subtasks
When a subtask changes parents, the explicit rule is: **A subtask must belong to the exact same `project_id` and `section_id` as its parent.** The backend service enforces this cascading update during the move transaction.

### Concurrency Considerations
To prevent race conditions where two clients assign the same `sort_order` or edit concurrently, transactions modifying `tasks` within the same container can use `SELECT ... FOR UPDATE` locks on adjacent rows to sequence writes safely.

---

## 5. Inbox Project Rule

Every user must have exactly one "Inbox" project serving as a default catch-all.
### Enforcement
- **Application Logic**: When registering, the API synchronously creates the associated Inbox in the `projects` table within the same transaction.
- **Database Enforcement**: A partial unique index prevents the creation of multiple inboxes reliably at the data layer natively in PostgreSQL 18.
```sql
CREATE UNIQUE INDEX idx_unique_inbox_per_user 
ON projects(user_id) 
WHERE is_inbox = true;
```

---

## 6. Subtasks and Re-parenting Rules

### Nesting Mechanism
Tasks have a `parent_id` linking back to the `tasks` table. 

### Inheritance and Consistency Rules
- **Orphan Management**: The foreign key `ON DELETE CASCADE` ensures that when a parent task is deleted, all dependent subtasks are instantly removed across all depth levels by the database engine, requiring zero application logic.
- **Cycle Prevention**: To prevent infinite recursion (Task A $\rightarrow$ Task B $\rightarrow$ Task A):
  - The API performs an ancestry validity check on the path before execution. 
  - The `chk_parent_differs` constraint blocks trivial single-level loops `(parent_id != id)`.
  - *(Future Enhancement)*: A PostgreSQL `CONSTRAINT TRIGGER` utilizing a Recursive CTE can be deployed to natively enforce deep cycle checks synchronously at write time.

---

## 7. Due Dates, Deadlines, and Recurrence

### Storage Matrix
- `due_date` (`DATE`): Ensures timezone-agnostic relative queries. "Due Today" securely matches the local boundary.
- `due_time` (`TIME`): Tracks explicit local wall-clock time for the deadline.
- `timezone` (`TEXT`): Maintains the IANA timezone string (e.g., `America/New_York`) ensuring that Daylight Saving Time (DST) transitions don't corrupt the logic.
- `recurrence_rule` (`TEXT`): Standard RRULE strings (e.g., `FREQ=WEEKLY;BYDAY=MO`).

### Recurrence Completion Flow
When a user completes a recurring task:
1. The API detects `recurrence_rule IS NOT NULL`.
2. Instead of marking `is_completed = true`, it calculates the next chronological occurrence based on the RRULE.
3. The API updates `due_date` and `due_time` to the future occurrence.
4. *(Sprint 6)*: A historical record of the completion is written to an event log table to visually satisfy user feedback.

---

## 8. Filters

### JSONB Storage Format
Saved filters encapsulate complex querying logic. The `criteria` column utilizes `JSONB` for structural formatting.

**Example Payload**:
```json
{
  "operator": "AND",
  "conditions": [
    { "field": "due_date", "op": "lte", "value": "today" },
    { "field": "priority", "op": "in", "value": [1, 2] },
    { "field": "project_id", "op": "neq", "value": "INBOX_ID" }
  ]
}
```

### Computation Strategy
- **Current (Frontend)**: The application loads the tasks into the Zustand store and utilizes array `filter()` predicates executing against the JSON criteria.
- **Migration (SQL)**: As data scales, the API will parse the JSONB structure directly into parameterized dynamic `SQL` `WHERE` clauses (e.g., `WHERE due_date <= CURRENT_DATE AND priority IN (1, 2)`). Indexes on these columns guarantee sub-millisecond filtration.

---

## 9. Operational Concerns (PostgreSQL 18)

- **SQL Migrations**: Managed via plain robust `.sql` execution scripts targeting the `schema_migrations` table before Uvicorn boots.
- **Environment Isolation**: Coolify spins up independent `postgres` containers for Dev, Staging, and Prod. Network isolation ensures Staging never touches Prod data.
- **Backups**: Coolify supports automated scheduled `pg_dump` backups pushed to S3/external volumes.
- **Performance Notes**: 
  - Routine query analysis using `EXPLAIN ANALYZE` must be executed to verify `idx_tasks_container` usage.
  - The `pg_stat_statements` extension should be enabled in PostgreSQL 18 config (`shared_preload_libraries = 'pg_stat_statements'`) to monitor aggregate query bottlenecks in production.
- **Connection Pooling**: Uses `asyncpg` built-in connection pooling, keeping max pool sizes tight to avoid thrashing PostgreSQL 18 memory allocations connection limits over the Coolify bridge.

---

## 10. Appendix: Schema Initialization SQL (Runnable)

```sql
-- Enables UUID generation if not native, but native in modern PG
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. sessions
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- 3. projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    is_inbox BOOLEAN NOT NULL DEFAULT false,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    sort_order DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_unique_inbox_per_user ON projects(user_id) WHERE is_inbox = true;
CREATE INDEX idx_projects_user_id_sort ON projects(user_id, sort_order);

-- 4. sections
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sections_project_id_sort ON sections(project_id, sort_order);

-- 5. tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER NOT NULL DEFAULT 4,
    due_date DATE,
    due_time TIME,
    timezone TEXT,
    recurrence_rule TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    sort_order DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT chk_priority CHECK (priority >= 1 AND priority <= 4),
    CONSTRAINT chk_due_datetime_requires_date CHECK (due_time IS NULL OR due_date IS NOT NULL),
    CONSTRAINT chk_parent_differs CHECK (parent_id != id)
);

CREATE INDEX idx_tasks_container ON tasks(project_id, section_id, parent_id, sort_order);
CREATE INDEX idx_tasks_user_id_due_date ON tasks(user_id, due_date) WHERE is_completed = false;

-- 6. labels
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    UNIQUE(user_id, name)
);

CREATE INDEX idx_labels_user_id ON labels(user_id);

-- 7. task_labels
CREATE TABLE task_labels (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY(task_id, label_id)
);

CREATE INDEX idx_task_labels_label_id ON task_labels(label_id);

-- 8. saved_filters
CREATE TABLE saved_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    criteria JSONB NOT NULL,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    sort_order DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_filters_user_id_sort ON saved_filters(user_id, sort_order);

-- 9. schema_migrations
CREATE TABLE schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
