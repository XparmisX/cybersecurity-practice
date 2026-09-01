# Lab: Unprotected admin functionality

**Category:** Access control

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab has an unprotected admin panel. Solve the lab by deleting the user `carlos`.

### Solution
Go to the lab and view `robots.txt` by appending `/robots.txt` to the lab URL. Notice that the `Disallow` line discloses the path to the admin panel. In the URL bar, replace `/robots.txt` with `/administrator-panel` to load the admin panel. Delete `carlos`.

# Lab: Unprotected admin functionality with unpredictable URL

**Category:** Access control

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab has an unprotected admin panel. It's located at an unpredictable location, but the location is disclosed somewhere in the application. Solve the lab by accessing the admin panel, and using it to delete the user `carlos`.

### Solution
Review the lab home page's source using Burp Suite or your web browser's developer tools. Observe that it contains some JavaScript that discloses the URL of the admin panel.

<img width="601" height="228" alt="Screenshot 2026-09-01 085239" src="https://github.com/user-attachments/assets/1e1f2b28-e394-4a05-9e0e-2ddc21f92d41" />

Load the admin panel and delete `carlos`.

#### Note: 

# Lab: User role controlled by request parameter

**Category:** Access control

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab has an admin panel at `/admin`, which identifies administrators using a forgeable cookie. Solve the lab by accessing the admin panel and using it to delete the user `carlos`. You can log in to your own account using the following credentials: `wiener:peter`
## Vulnerability
 
This vulnerability is a case of **insecure client-side role validation via cookie** (Client-Side Cookie Manipulation). The server determines whether a request comes from an admin purely by trusting the value of a cookie named `Admin` sent by the browser:
 
- `Admin=false` → treated as a regular user.
- `Admin=true` → treated as an administrator.
Since this value lives entirely on the client side and is never cryptographically signed or re-validated server-side against the actual authenticated session, anyone can simply edit their own cookie and grant themselves admin privileges.
 
## Solution
 
### Method 1: Browser DevTools (fastest way)
 
1. **Log in** using the lab credentials:
   - Username: `wiener`
   - Password: `peter`
2. **Edit the cookie:**
   - Pressed `F12` to open Developer Tools.
   - Went to the **Application** tab (Chrome/Edge) — or **Storage** in Firefox.
   - In the left sidebar, opened **Cookies** and selected the site's domain.
   - Found the cookie named `Admin` in the cookie table.
   - Double-clicked its **Value** field (currently `false`) and changed it to `true`.
3. **Delete Carlos:**
   - Navigated to:
```
     https://LAB-ID.web-security-academy.net/admin
```
   - The admin panel loaded successfully.
   - Clicked **Delete** next to the username `carlos` — lab solved.
### Method 2: Burp Suite (matches the official PortSwigger approach)
 
1. In **Proxy > Intercept**, turned **Intercept is on**.
2. To make Burp also intercept responses (not just requests) coming back from the server:
   - Went to **Proxy > Options > Intercept Server Responses** and enabled **"Intercept responses based on the following rules."**
3. Logged in through the browser using `wiener:peter`.
4. Burp intercepted the `POST /login` request — forwarded it as-is.
5. Because response interception was now on, Burp paused the **response** to that login request. In the response headers, found:
```
   Set-Cookie: Admin=false; Path=/
```
6. Edited this header value directly in Burp, changing it to:
```
   Set-Cookie: Admin=true; Path=/
```
7. Forwarded the modified response. The browser now stored `Admin=true` as if the server itself had issued it.
8. Navigated to `/admin`, and deleted the user `carlos` — lab solved.
## Why This Works
 
Both methods exploit the exact same root flaw, just at different points in the pipeline:
 
- **Method 1** edits the cookie *after* it's already stored in the browser, directly through DevTools.
- **Method 2** edits the cookie *in transit*, intercepting the server's own `Set-Cookie` response header before it ever reaches the browser, so the browser ends up storing the tampered value as though the server had legitimately issued it.
Either way, the server has no way to tell the difference — because it never actually verifies the `Admin` cookie against anything on the server side (like a database-backed role tied to the authenticated session). It just reads whatever cookie value shows up on each request and trusts it blindly.
 
## Takeaways
 
- **Never trust client-controlled data for authorization decisions.** A cookie, header, or hidden form field that the client can freely read and modify must never be the sole source of truth for privilege checks. Role/permission state should be derived server-side from the authenticated session (e.g., a session ID mapped to a role in a database), not passed back and forth as a plain, unsigned value.
- If cookies must carry any security-relevant state, they need to be cryptographically signed and verified (e.g., signed JWT, HMAC) so tampering is detectable — a naive `true`/`false` string offers zero protection.
- This is functionally similar to IDOR/broken access control issues in general: whenever an app's authorization logic depends on something the user can directly edit (URL parameter, cookie, hidden field), assume it can and will be manipulated during testing.
- Burp's **Intercept Server Responses** option is a good tool to know for cases like this — it lets you tamper with data on the way *into* the browser, not just on the way out, which is useful when you want to see how the client behaves with attacker-modified server responses.
