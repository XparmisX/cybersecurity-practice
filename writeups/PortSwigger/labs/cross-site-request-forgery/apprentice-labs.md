# Lab: CSRF vulnerability with no defenses

**Category:** CSRF

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab's email change functionality is vulnerable to CSRF. To solve the lab, craft some HTML that uses a CSRF attack to change the viewer's email address and upload it to your exploit server. You can log in to your own account using the following credentials: ‍‍`wiener:peter`

## What CSRF Actually Is
Before going through the steps, I wanted to actually understand what's happening, because just following the solution mechanically didn't make it click at first.
 
**CSRF (Cross-Site Request Forgery)** abuses the fact that browsers automatically attach a user's cookies to *any* request sent to a site, no matter which page or origin actually triggered that request. If I'm logged into `vulnerable-site.com` and my browser is holding a valid session cookie for it, then it doesn't matter whether the request to `vulnerable-site.com` was initiated by me clicking a button on their own page, or by some unrelated page I visited that secretly submitted a form to `vulnerable-site.com` in the background — the browser attaches my session cookie either way, and the server sees a request that looks 100% legitimate and authenticated.
 
So the attack isn't about stealing my cookie or bypassing login. It's about **tricking my own browser into using my already-authenticated session to perform an action I never intended**. In this case, changing my account's email address, just by getting me to visit a malicious page while I'm logged in.
 
The reason this particular lab is called "no defenses" is that a properly built app would block this using things like:
- A **CSRF token**: a random, unpredictable value embedded in the legitimate form, tied to my session, that the server checks on submission. A forged request from another origin wouldn't know this token.
- Checking the `Origin` or `Referer` header to confirm the request actually came from the site's own pages.
- `SameSite` cookie attributes, which tell the browser not to send the cookie on cross-site requests in the first place.
This lab's email-change endpoint has none of that, it only checks whether a valid session cookie was attached, which (as explained above) happens automatically regardless of where the request actually originated.
 
## The Exploit Server (initially unclear to me)
 
PortSwigger labs give access to a separate **exploit server**, basically a scratch web server at its own domain, where I can host arbitrary HTML/JS content and get a real, working URL for it. This exists so I can simulate the "malicious third-party site" in a CSRF attack: in a real attack, this would be any page an attacker controls (a phishing page, a compromised forum post, an ad, etc.) that a logged-in victim might visit. The exploit server just gives us a safe, sandboxed stand-in for that in the lab environment.
 
There are two important buttons here:
- **View exploit**: loads the hosted page *as myself*, so I can test that the attack logic actually works before using it on the real "victim" (which, in these labs, is a simulated user account the lab checks against).
- **Deliver to victim**: actually sends the hosted page to the lab's simulated victim, who is logged in as themselves. If the exploit works, it silently changes the victim's account email solving the lab.
## Steps I Followed
 
1. **Captured the legitimate request.** Opened Burp's browser, logged in with `wiener:peter`, went to the "Update email" form, and submitted a change. In **Proxy > HTTP history**, found the resulting request a `POST` to `/my-account/change-email` with an `email` parameter in the body.
2. **Built the forged HTML.** Since I'm on Burp Suite Community Edition (no built-in "Generate CSRF PoC" tool, which is a Pro-only feature), I used the manual template:
```html
   <form method="POST" action="https://YOUR-LAB-ID.web-security-academy.net/my-account/change-email">
       <input type="hidden" name="email" value="anything@web-security-academy.net">
   </form>
   <script>
       document.forms[0].submit();
   </script>
```
   This is just a normal HTML form that mimics the real one, same target URL, same parameter name (`email`), except it's hosted on a completely different, attacker-controlled origin, and it has a `<script>` tag that submits it **automatically** the instant the page loads, with no user interaction needed. Whoever's browser renders this page (while logged into the lab) will silently fire off this POST request with their own session cookie attached.
 
3. **Hosted it on the exploit server.** Pasted this HTML into the exploit server's "Body" field and clicked **Store**, which gave it a real, live URL.
4. **Verified it on myself first.** Clicked **View exploit**. This loaded my hosted page as myself, the form auto-submitted, and I confirmed (via the request/response Burp captured) that my own account's email actually changed. This step matters: it proves the exploit mechanics work correctly *before* firing it at the real target, which is standard practice in real engagements too — always validate your PoC against a throwaway/test account first.
5. **Adjusted the payload for delivery.** Since the "View exploit" test already changed *my* email to `anything@web-security-academy.net`, I needed a fresh value that wouldn't just match what my account already had — the lab specifically checks that the victim's email is changed to something new via this cross-origin request, so I updated the `value` in the hidden input to a different address before delivering it for real.
6. **Delivered it to the victim.** Clicked **Deliver to victim**, which simulates the victim (an authenticated user in the lab's backend) visiting my hosted page. The auto-submit script fired the forged POST request using the victim's session, the server accepted it with no CSRF checks, and the victim's email got silently changed. Lab solved.

## Why This Works, Tying It Back Together 
The entire attack hinges on one fact: **the browser doesn't care where a request came from when deciding whether to attach cookies, it only cares which domain the request is going *to*.** My hosted exploit page lives on `exploit-server.net`, an entirely different origin from `web-security-academy.net`, but because the `<form>`'s `action` targets `web-security-academy.net` directly, the browser treats it just like any other request to that domain and attaches the relevant session cookie automatically.
 
Since the server-side endpoint never checks *anything* beyond "is there a valid session cookie attached", no CSRF token, no Origin/Referer check, no SameSite cookie restriction, it has absolutely no way to distinguish a legitimate request (submitted from its own account settings page) from this forged one (submitted from a hidden auto-submitting form on a totally unrelated site). Both arrive looking identical from the server's point of view.
 
## Takeaways
- CSRF doesn't require stealing credentials or session tokens. It just needs the victim to be logged in and to visit (or be tricked into visiting) a malicious page while that session is active. The attacker never sees the cookie value at all; they just ride on top of it.
- State-changing actions (changing email, password, making a purchase, transferring funds, etc.) are the real targets of CSRF, not pages that just read/display data, since a forged request can't read back the response due to cross-origin restrictions, but it *can* still trigger a side effect on the server.
- The presence or absence of a CSRF token is one of the first things worth checking when testing any form that changes account state. If a form has no token and the server doesn't validate Origin/Referer either, it's very likely exploitable exactly like this lab.
- Always test a CSRF PoC against your own throwaway/test account first (`View exploit`) before delivering it for real. Same logic applies in real world engagements, where you would want to confirm the payload behaves as expected in a safe, controlled way before demonstrating impact.
