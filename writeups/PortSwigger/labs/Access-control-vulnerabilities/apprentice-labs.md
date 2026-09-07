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
   - Went to the **Application** tab (Chrome/Edge) or **Storage** in Firefox.
   - In the left sidebar, opened **Cookies** and selected the site's domain.
   - Found the cookie named `Admin` in the cookie table.
   - Double-clicked its **Value** field (currently `false`) and changed it to `true`.
3. **Delete Carlos:**
   - Navigated to:
```
     https://LAB-ID.web-security-academy.net/admin
```
   - The admin panel loaded successfully.
   - Clicked **Delete** next to the username `carlos` -> lab solved.
### Method 2: Burp Suite (matches the official PortSwigger approach)
 
1. In **Proxy > Intercept**, turned **Intercept is on**.
2. To make Burp also intercept responses (not just requests) coming back from the server:
   - Went to **Proxy > Options > Intercept Server Responses** and enabled **"Intercept responses based on the following rules."**
3. Logged in through the browser using `wiener:peter`.
4. Burp intercepted the `POST /login` request, forwarded it as it is.
5. Because response interception was now on, Burp paused the **response** to that login request. In the response headers, found:
```
   Set-Cookie: Admin=false; Path=/
```
6. Edited this header value directly in Burp, changing it to:
```
   Set-Cookie: Admin=true; Path=/
```
7. Forwarded the modified response. The browser now stored `Admin=true` as if the server itself had issued it.
8. Navigated to `/admin`, and deleted the user `carlos` -> lab solved.
## Why This Works
 
Both methods exploit the exact same root flaw, just at different points in the pipeline:
 
- **Method 1** edits the cookie *after* it's already stored in the browser, directly through DevTools.
- **Method 2** edits the cookie *in transit*, intercepting the server's own `Set-Cookie` response header before it ever reaches the browser, so the browser ends up storing the tampered value as though the server had legitimately issued it.
Either way, the server has no way to tell the difference because it never actually verifies the `Admin` cookie against anything on the server side (like a database-backed role tied to the authenticated session). It just reads whatever cookie value shows up on each request and trusts it blindly.
 
## Takeaways
 
- **Never trust client-controlled data for authorization decisions.** A cookie, header, or hidden form field that the client can freely read and modify must never be the sole source of truth for privilege checks. Role/permission state should be derived server-side from the authenticated session (e.g., a session ID mapped to a role in a database), not passed back and forth as a plain, unsigned value.
- If cookies must carry any security-relevant state, they need to be cryptographically signed and verified (e.g., signed JWT, HMAC) so tampering is detectable, a naive `true`/`false` string offers zero protection.
- This is functionally similar to IDOR/broken access control issues in general: whenever an app's authorization logic depends on something the user can directly edit (URL parameter, cookie, hidden field), assume it can and will be manipulated during testing.
- Burp's **Intercept Server Responses** option is a good tool to know for cases like this. It lets you tamper with data on the way *into* the browser, not just on the way out, which is useful when you want to see how the client behaves with attacker-modified server responses.

# Lab: User ID controlled by request parameter

**Category:** Access control

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab has a horizontal privilege escalation vulnerability on the user account page. To solve the lab, obtain the API key for the user `carlos` and submit it as the solution. You can log in to your own account using the following credentials: `wiener:peter`

## Solution 
Log in using the supplied credentials and go to your account page. Note that the URL contains your username in the "id" parameter. Send the request to Burp Repeater. Change the "id" parameter to `carlos`. Retrieve and submit the API key for `carlos`.

# Lab: User ID controlled by request parameter, with unpredictable user IDs

**Category:** Access control

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab has a horizontal privilege escalation vulnerability on the user account page, but identifies users with GUIDs. To solve the lab, find the GUID for `carlos`, then submit his API key as the solution. You can log in to your own account using the following credentials: `wiener:peter`

## Solution 
At first, I thought I have to generate a GUID for carlos somehow! But it turns out that the lab has given carlos GUID secretly somewhere! So here is the solution :

Find a blog post by `carlos`. Click on `carlos` and observe that the URL contains his user ID. Make a note of this ID. Log in using the supplied credentials and access your account page. Change the "id" parameter to the saved user ID. Retrieve and submit the API key.

# Lab: User ID controlled by request parameter with data leakage in redirect

**Category:** Access control

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab contains an access control vulnerability where sensitive information is leaked in the body of a redirect response. To solve the lab, obtain the API key for the user `carlos` and submit it as the solution. You can log in to your own account using the following credentials: `wiener:peter`

## Solution 
After logging in as `wiener`, the account page loads at a URL like:
```
GET /my-account?id=wiener HTTP/2
Host: <lab-id>.web-security-academy.net
Cookie: session=<wiener's session token>
```

The page renders wiener's own account details, including an API key field. The presence of an `id` parameter directly in the URL — rather than the server inferring the identity purely from the session cookie — is the first red flag: it suggests the server *might* be using this parameter to decide whose data to display, rather than relying solely on the authenticated session.

This is a classic setup for an **IDOR (Insecure Direct Object Reference)** test: if the server trusts the `id` parameter for data lookup without properly re-validating it against the logged-in session, an attacker can potentially request another user's data just by changing the parameter — while still being authenticated as themselves.

## Step-by-Step Solution with Burp Suite

1. **Intercept the request.** With Burp's proxy running and the browser configured to route through it, I loaded `/my-account` while logged in as `wiener`. I caught the request in Burp Proxy's "Intercept" tab.

2. **Send to Repeater.** Right-clicked the intercepted request → "Send to Repeater" (or `Ctrl+R`). This lets me freely modify and resend the request as many times as needed without re-triggering the browser flow each time.

3. **Baseline request.** First, I sent the original, unmodified request (`id=wiener`) in Repeater just to confirm the normal response: HTTP `200 OK`, with wiener's account page and his own API key in the body. This confirms the app's *normal* behavior before tampering with anything.

4. **Tamper with the `id` parameter.** In the Repeater request line, I changed:
```
GET /my-account?id=wiener HTTP/2
```
   to:
```
GET /my-account?id=carlos HTTP/2
```
   Critically, the `Cookie` header (wiener's session) was left untouched — I'm still authenticated as `wiener`, just asking for `carlos`'s `id`.

5. **Send and inspect the raw response.** The response came back as:
```
HTTP/2 302 Found
Location: /
```
   At a glance, in Repeater's **"Render"** view (which behaves more like a browser), this looks like nothing — a redirect with no visible content, since the render tab tends to follow/represent the redirect behavior.

   The key step was switching to the **raw response view** ("Raw" tab in Repeater) instead of "Render" or "Pretty." In raw mode, Burp shows the *literal bytes* the server sent, unprocessed. There, below the `302` status line and `Location` header, the full HTML body was still present — and it was **carlos's account page**, including his API key in plaintext.

<img width="1178" height="753" alt="Screenshot 2026-09-07 113553" src="https://github.com/user-attachments/assets/340a3c20-d545-49eb-8e83-d10b44ac83ae" />


<img width="519" height="113" alt="Screenshot 2026-09-07 113647" src="https://github.com/user-attachments/assets/36fc0604-0ff2-4eb9-91af-d5910c25dfa7" />
