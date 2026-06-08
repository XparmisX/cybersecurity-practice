we  must enter the system and receive the user's token according to the cookie, so we can access to the management's page.

i entered the website, checked the cookies and found "access_token" cookie. then i decoded the value using jwt.io, added a new part -> "is_admin_token" : "true", to the payload, encoded it and changed the value of that cookie. then i used /admin to access to the admin page and deleted the specific user.

by the way, it is literally impossible to do in real world lol.

in general (written by beloved gemini ^^) : This lab demonstrated a JWT implementation flaw where the server failed to verify the token signature, allowing for client-side payload manipulation (Privilege Escalation).
