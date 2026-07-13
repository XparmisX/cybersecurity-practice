# SQL Injection Lab Writeup

## Challenge Overview
The lab presented a product search feature backed by a SQLite database. Products had a `hidden` attribute, and only items with `hidden=0` were displayed to normal users. The goal was to exploit a SQL injection vulnerability in the search input to bypass this filter and reveal a hidden product.

## Methodology

### 1. Identifying the Input Vector
I first examined how the search feature sent data to the server. Submitting a normal search term (e.g. `hello`) revealed the query was passed via a GET parameter in the URL:

```
?q=hello
```

This told me the input was reflected directly into the backend query through the `q` parameter, making it a good candidate to test for injection.

### 2. Hypothesizing the Backend Query
Based on the challenge description (SQLite database, search filtering on `hidden=0`), I assumed the backend query looked something like:

```sql
SELECT * FROM products WHERE name LIKE '%q%' AND hidden=0
```

### 3. Confirming the Vulnerability
To test whether user input was properly sanitized, I submitted a single quote (`'`) as the search term. This immediately caused a **500 Internal Server Error**, confirming that:
- The input was inserted directly into the SQL query without sanitization or parameterization.
- The broken quote disrupted the query's syntax, proving the injection point was live.

### 4. Crafting the Payload
Knowing the query structure, the goal was to:
1. Close the open string literal early with a `'`.
2. Inject a condition that is always true (`OR 1=1`) to widen the result set.
3. Comment out the rest of the original query (including `AND hidden=0`) using SQLite's `--` comment syntax, so the hidden-item filter would never be evaluated.

Payload used:

```
' OR 1=1 --
```

Submitted as:

```
?q=' OR 1=1 --
```

### 5. Verifying the Result
After submitting the payload, the number of returned products increased compared to a normal search, indicating the `hidden=0` condition had been successfully bypassed. Scanning through the expanded result list, I located the hidden product among the returned items and clicked it to complete the lab.

## Key Takeaways
- **Unsanitized string concatenation** in SQL queries allows attackers to break out of intended string literals and manipulate query logic.
- A single quote is a simple, low-risk way to **fingerprint** whether an input is vulnerable (a 500 error is a strong signal).
- SQLite's `--` comment syntax (with a trailing space) is effective for **neutralizing trailing query conditions** like access-control filters (`hidden=0`).
- Using `OR 1=1` is a classic technique to force a `WHERE` clause to always evaluate true, exposing rows that should have been filtered out.

```
' OR 1=1 --hidden=0
```

## Remediation (How This Should Be Fixed)
- Use **parameterized queries / prepared statements** instead of string concatenation.
- Apply **input validation** and escape special characters if raw queries must be used.
- Enforce **access control at the application layer**, not solely through query filters that can be bypassed.

---
*Lab completed on Quera College — SQL Injection module.*
