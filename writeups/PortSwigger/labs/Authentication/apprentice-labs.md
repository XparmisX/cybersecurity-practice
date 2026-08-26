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
