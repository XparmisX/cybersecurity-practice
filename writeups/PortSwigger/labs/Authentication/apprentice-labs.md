# Lab: Username enumeration via different responses

**Category:** Authentication

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
 
This lab is vulnerable to username enumeration and password brute-force attacks. It has an account with a predictable username and password, findable via two wordlists (candidate usernames, candidate passwords). Goal: enumerate a valid username, brute-force that user's password, then access the account page.
 
## Setup
 
I ran the lab inside Burp's built-in browser (opened via **Proxy > Intercept > Open Browser**) instead of regular Chrome. This browser already comes pre-configured with Burp's proxy settings and CA certificate, so there's no need to manually set the system proxy to `127.0.0.1:8080` or install Burp's CA cert to avoid HTTPS certificate errors. Using regular Chrome would work too, but it requires that extra manual configuration.
 
## Step 1: Username Enumeration
 
1. With Burp running, I submitted an invalid username/password on the login page and caught the `POST /login` request in **Proxy > HTTP history**.
2. I highlighted the `username` parameter value and sent the request to **Intruder**.
3. In Intruder, the `username` position was auto-marked (`username=§invalid-username§`), and I left the password field as a static value.
4. Attack type: **Sniper**. Payload type: **Simple list**, pasted with the candidate usernames wordlist.
5. Started the attack and sorted results by the **Length** column.
**Key observation:** Almost every response came back with the same length and contained the message `Invalid username`. One entry stood out with a different length — its response said `Incorrect password` instead.
 
This is the core of the vulnerability: the app returns a *different message* depending on whether the username exists, even though both cases return the same HTTP status (200). Since all "invalid username" responses share identical page content/length, and the "valid username, wrong password" response has different content, the response length is a reliable side channel for enumerating valid usernames.
 
→ Identified valid username from the outlier row.
 
## Step 2: Password Brute-Force
 
1. Cleared the previous payload position, set `username` to the identified value, and added a payload position to `password`:
   `username=identified-user&password=§invalid-password§`
2. Payload type: Simple list, replaced with the candidate passwords wordlist.
3. Started the attack and this time sorted by the **Status** column.
**Key observation:** Every failed login attempt returned **200 OK** (the login page re-rendered with an error message). Exactly one request returned **302 Found**.
 
### Why 302 instead of 200?
 
- **Wrong password → 200:** the server just re-renders the login page inline with an error message. It's a normal HTML response, so status is 200.
- **Correct password → 302:** on successful login, the server doesn't render content directly — it redirects the browser (via a `Location` header) to the account page, e.g. `/my-account`. This is the classic **Post/Redirect/Get (PRG)** pattern, commonly used after successful form submissions to prevent duplicate submissions on refresh.
So the two signals used at each stage make sense given what actually changes in the response:
 
| Stage | What varies | Why |
|---|---|---|
| Username enumeration | Response **length/content** | Both valid and invalid usernames return status 200, but the error message text differs (`Invalid username` vs `Incorrect password`) |
| Password brute-force | **HTTP status code** | Failed attempts re-render the same login page (200); success triggers a redirect (302) |
 
## Step 3: Access the Account
 
Logged in manually with the identified username/password pair and reached the account page. Lab solved.
 
## Takeaways
 
- Any observable difference between "invalid user" and "valid user, wrong password" responses (message text, length, timing, status code) can be used for username enumeration. A secure implementation should return an identical generic message (e.g. "Invalid username or password") regardless of which part was wrong.
- Redirects (302) after login are a useful behavioral oracle during brute-forcing when status codes otherwise look uniform — worth checking the `Location` header to confirm it actually points to an authenticated page rather than assuming success from the status code alone.
- Sorting Intruder results by **Length** and by **Status** are two of the fastest ways to spot the "odd one out" in a large batch of automated requests.

# Lab: 2FA simple bypass

**Category:** Authentication / Multi-Factor Authentication

**Difficulty:** Apprentice

**Status:** Solved

## Lab Description

The lab's two-factor authentication can be bypassed. I already have a valid username and password for my own account, but no access to the victim's (Carlos's) 2FA verification code.

- My credentials: `wiener:peter`
- Victim's credentials: `carlos:montoya`

Goal: access Carlos's account page without knowing his 2FA code.

## Steps

1. Logged in with my own credentials (`wiener:peter`). As expected, the app sent a 2FA verification code to my email and prompted me to enter it. I opened the lab's built-in email client to see the code and noted the URL of this verification step.
2. Entered the code and completed login normally. Once on the account page, I noted the URL — `/my-account`.
3. Logged out.
4. Logged back in with the victim's credentials (`carlos:montoya`). Username and password were accepted, and the app again prompted for a 2FA verification code — this time it would go to Carlos's email, which I don't have access to.
5. Instead of entering any code, I manually changed the browser URL to `/my-account`.
6. The page loaded directly as Carlos's account page — lab solved.

## Why This Works

The vulnerability is that **the server doesn't actually enforce the 2FA step on the backend**. The flow looks like:

1. Submit username + password → server validates them and creates a *partially authenticated* session.
2. Server redirects to a "enter verification code" page.
3. If the correct code is submitted, the server upgrades the session to a fully authenticated one and lets you reach `/my-account`.

The flaw: the server treats reaching the verification page as good enough proof of identity, without properly checking that the 2FA challenge was actually passed before granting access to protected pages. In other words, `/my-account` isn't protected by checking "has this session completed 2FA?" — it's likely only checking "is this session logged in past step 1?" or not gating server-side access on the 2FA outcome at all. So simply navigating to `/my-account` directly, skipping the code entry, bypasses the control entirely.

This is a classic example of a **broken/missing server-side enforcement of a multi-step auth flow**: the client-side flow (prompt for code, disable navigation elsewhere) suggests 2FA is mandatory, but nothing on the server actually blocks direct access to the protected resource once step 1 (password) succeeds.

## Takeaways

- 2FA is only as strong as the server-side session-state checks behind it. If a session is granted "authenticated" status after step 1 (password) and the app relies on the *UI flow* (rather than a real server-side flag like `mfa_verified: true`) to force the user through step 2, the second factor can be trivially skipped by requesting a protected URL directly.
- Always test multi-step auth flows by trying to jump straight to the "logged in" state URL after only completing the first factor — a surprising number of implementations don't independently verify that every required step was actually completed.
- A correct implementation would tie session state to a `pending_2fa` flag that is checked (and rejected) by every protected route, not just relying on the login UI not offering a link to skip it.

# Lab: Password reset broken logic

**Category:** Authentication

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
 
This lab's password reset functionality is vulnerable. Goal: reset Carlos's password, then log in and access his "My account" page.
 
- My credentials: `wiener:peter`
- Victim's username: `carlos`
## Step 1: Trigger My Own Password Reset
 
1. With Burp running, I clicked **Forgot your password?** on the login page and entered my own username (`wiener`).
2. Opened the lab's built-in email client and found the password reset email. Clicked the reset link inside it.
3. This opened a page with two fields (new password, confirm new password). I initially confused this step with the actual reset submission — clicking the email link only sends a `GET /forgot-password?temp-forgot-password-token=...` request, which just *loads the reset form*. It does **not** contain any `username` parameter, since it's just rendering the page.
4. Filled in a new password and clicked the reset/submit button. This is the request that actually matters — a `POST /forgot-password?temp-forgot-password-token=...`.
**Where I got confused:** I initially sent the GET request to Repeater looking for a `username` field to edit — it's not there. The `username` only shows up in the **POST** request body, which only fires *after* you actually submit the new password form, not when you just open the reset link. Lesson: GET (loading the form) and POST (submitting the form) are two separate requests, and you have to catch the right one.
 
## Step 2: Find and Inspect the POST Request
 
1. Went to **Proxy > HTTP history**, filtered for `forgot-password`, and found the `POST /forgot-password?temp-forgot-password-token=...` request (the one triggered by clicking submit, not the link click).
2. Looked at the request body:
```
   temp-forgot-password-token=<long-random-token>&username=wiener&new-password-1=...&new-password-2=...
```
3. This confirmed the form includes a **hidden input field** (`username`) that isn't visible on the page but gets sent along with the password fields when the form is submitted. This is just standard HTML: the field is `type="hidden"`, so nothing shows on screen, but it's still part of the form data POSTed to the server.
## Step 3: Test Whether the Token Is Actually Checked
 
1. Sent this POST request to **Repeater**.
2. Deleted the token value in the URL (`temp-forgot-password-token=` with nothing after `=`) and in the body (same).
3. Sent it. The password reset still worked — meaning **the server never actually validates the token** when processing this request. It just trusts whatever `username` is in the body.
This is the actual vulnerability: the reset token is supposed to prove "this request came from the person who owns this email," but the server doesn't check it at all during the final reset step — it only relies on the `username` field, which the client fully controls.
 
## Step 4: Exploit — Reset Carlos's Password Instead
 
1. Went back to the browser, requested a **new** password reset for myself (to get a fresh valid session/flow going), and reached the reset form again.
2. Submitted a new password, caught the fresh `POST /forgot-password?...` request, sent it to Repeater again.
3. In Repeater, edited the raw request:
   - Emptied the token value in the URL: `temp-forgot-password-token=`
   - In the body, emptied the token value there too
   - Changed `username=wiener` → `username=carlos`
   - Set `new-password-1` and `new-password-2` to a new password of my choosing (`1384`)
4. Final body looked like:
```
   temp-forgot-password-token=&username=carlos&new-password-1=1384&new-password-2=1384
```
5. Clicked **Send**.
**Response:**
```
HTTP/2 302 Found
Location: /
Set-Cookie: session=...
```
 
A 302 redirect to `/` with a fresh `Set-Cookie` — same success signal pattern as the login brute-force lab (PRG pattern: successful state-changing action → redirect, not a re-rendered form).
 
## Step 5: Log In as Carlos
 
1. Logged out of my own session in the browser.
2. Logged in with `carlos` / `1384`.
3. Clicked **My account** — reached Carlos's account page. Lab solved.
## Why This Works
 
The password reset flow is supposed to be:
 
1. User requests reset → server generates a random, single-use token tied to that specific username → emails a link containing the token.
2. User clicks the link, submits a new password → server checks: "does this token match a pending reset request for this username?" → if valid, updates that user's password.
The flaw: step 2's validation is broken. The server **never re-checks that the token actually belongs to (or is valid for) the username in the request body**. It just takes `username` at face value and resets *that* account's password — regardless of which token (or lack of one) was submitted alongside it.
 
Since the token is meant to be the only thing binding "this reset request" to "this specific user," and it's not checked at all, anyone can request a password reset for their own account, then reuse (or blank out) the resulting POST request while swapping in a different `username`, and hijack any account.
 
## Takeaways
 
- Hidden form fields are still just parameters the client controls — "hidden" only means invisible in the UI, not protected or server-trusted. If sensitive fields like `username` are passed this way instead of being derived server-side from the token/session, they can be tampered with.
- A security token (like a password reset token) is worthless if the endpoint that consumes it doesn't actually validate it against the resource being modified. Always test: does removing/blanking a token change the outcome? If not, it's not really being enforced.
- Multi-step flows (request reset → email link → submit new password) need to be traced request-by-request in Burp's HTTP history. It's easy to grab the wrong request (e.g., the initial GET that just loads a form) instead of the one that actually performs the state change (the POST). When in doubt, check the HTTP method and whether the request body contains the data you'd expect from submitting the form.
- The 302 + Set-Cookie response pattern is a reliable signal that a state-changing action (login, password reset, etc.) succeeded server-side — same principle as in the earlier brute-force lab.
