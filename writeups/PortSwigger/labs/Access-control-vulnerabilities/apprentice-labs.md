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

**Status:** 
 
## Lab Description
This lab has an admin panel at `/admin`, which identifies administrators using a forgeable cookie. Solve the lab by accessing the admin panel and using it to delete the user `carlos`. You can log in to your own account using the following credentials: `wiener:peter`
