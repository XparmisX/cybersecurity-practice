# SQL Injection Lab Writeup — Extracting a Hidden Flag from an Unusually-Named Table

## Challenge Goal
Somewhere in the database was a table with an unconventional name, containing exactly one row and one column called `flag`. The task was to discover the table (name unknown/undocumented) and extract the value of `flag`, which held a secret URL leading to the completion page.

## My Process (step by step, including the dead ends)

### Step 1 — Reusing the table enumeration technique from the previous lab
Since the table name wasn't given, I went back to the same approach that worked for finding the `users` table earlier: querying `sqlite_master` through the same injection point in the product search box to list every table in the database:

```
' UNION SELECT 1, name, 3, 0, 5 FROM sqlite_master WHERE type='table' --
```

Scanning through the returned table names, one clearly stood out from the normal Django tables (`auth_permission`, `django_migrations`, etc.) — a deliberately strange, non-standard name:

```
Look4_Lik3_Y0u_Foun5_M3
```

This was obviously placed there intentionally as a hint/marker for this specific challenge.

### Step 2 — Initial confusion: mistaking the table name for the flag itself
At first I assumed simply *finding* this unusual table name was the goal, and tried clicking on the fake "product" card that displayed it — expecting it to lead somewhere. This gave a **404 error**, same as clicking on any other table name discovered via `sqlite_master` in the previous lab.

This was a dead end because the table *name* itself isn't the flag — it's just a table like any other. The actual flag is a **value stored inside a `flag` column inside that table**, which still needed to be queried separately.

### Step 3 — Querying the actual flag value
Once I realized I needed to select data *from* the table rather than just its name, I built a UNION query targeting it directly, using its exact (case-sensitive, underscore-heavy) name:

```
' UNION SELECT 1, flag, 3, 4, 5 FROM "Look4_Lik3_Y0u_Foun5_M3" --
```

Key details that mattered here:
- The table name was wrapped in **double quotes** (`"..."`) since it's a non-standard identifier (mixed case, underscores, digits) — SQLite requires this to correctly parse it as a table name rather than risk it being misread.
- The `flag` column was placed in the same column **position** that earlier tests confirmed was actually rendered on the page (the same position `username` had been placed in during the previous lab).

### Step 4 — Success
This query correctly returned the secret URL stored in the `flag` column, displayed on the page as a fake product card. Navigating to that URL led to the completion page and the lab was marked as solved.

## Final Working Payload

```
' UNION SELECT 1, flag, 3, 4, 5 FROM "Look4_Lik3_Y0u_Foun5_M3" --
```

## Key Takeaways
- Enumerating tables via `sqlite_master` (learned in the previous lab) is a reusable technique — once you have it, spotting an intentionally odd table name among standard framework tables is usually a strong hint you're on the right track.
- **Finding a table's name is not the same as extracting its data** — a table name showing up in results doesn't mean the job is done; you still need to `SELECT` from it to get the actual contents.
- Table names with mixed case, digits, or underscores should be wrapped in double quotes in SQLite to be safely referenced as identifiers.
- Column position still matters for every UNION query — reusing the same "visible" positions identified in earlier labs saved time here instead of re-testing from scratch.

## Remediation
- Obscure or "randomly named" tables are **not a real security control** — security through obscurity doesn't hold up against an attacker who can enumerate `sqlite_master`.
- The same fixes as previous labs apply: parameterized queries, least-privilege DB accounts, and restricting access to system introspection tables like `sqlite_master` at the application/database-permissions level.

---
*Lab completed on Quera College — SQL Injection (data exfiltration via UNION) module.*
