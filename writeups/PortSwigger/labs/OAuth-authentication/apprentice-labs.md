# Lab: Authentication bypass via OAuth implicit flow

**Category:** OAuth authentication

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab uses an OAuth service to allow users to log in with their social media account. Flawed validation by the client application makes it possible for an attacker to log in to other users' accounts without knowing their password. To solve the lab, log in to Carlos's account. His email address is `carlos@carlos-montoya.net`. You can log in with your own social media account using the following credentials: `wiener:peter`.

## Vulnerability
The client application (the blog) trusts user-supplied data, specifically the email, in the `POST /authenticate` request without server-side validation. Instead of securely deriving the email from the access token, the server reads it directly from the request body, which the client (browser) fully controls.

## Steps to Reproduce
1. With Burp proxying traffic, clicked "My account" and completed the OAuth login flow using `wiener:peter`.
2. In **Proxy > HTTP History**, reviewed the OAuth traffic, starting from `GET /auth?client_id=...`.
3. Observed that after receiving user info from the OAuth service, the app sends a `POST /authenticate` request containing the email and access token to log the user in.
4. Sent this request to **Repeater**, changed the email to `carlos@carlos-montoya.net`, and sent it, accepted with no error.

<img width="1175" height="789" alt="Screenshot 2026-09-09 175854" src="https://github.com/user-attachments/assets/55175347-31e3-4a71-8563-ab215a8c46c0" />

5. Right-clicked the request → **Request in browser > In original session**, opened the generated URL in the browser, and was logged in as Carlos. ✅ Lab solved.


## Root Cause
The server trusts an identity value (email) that is manipulable by the client/browser, instead of deriving identity directly and securely from the access token (e.g., by calling the OAuth service's `/user` endpoint or validating a signed token).

## Suggested Fix
- Determine user identity only via a validated access token (by calling the OAuth provider's `/user` endpoint directly), never from client-supplied request body parameters.
- Prefer the Authorization Code flow over the Implicit flow, where token exchange happens server-side.
