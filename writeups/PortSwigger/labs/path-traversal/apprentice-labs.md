# Lab: File path traversal, simple case

**Category:** Path traversal

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description

This lab contains a path traversal vulnerability in the display of product images. To solve the lab, retrieve the contents of the /etc/passwd file.

## Solution

I solved this lab by clicking on one of pictures in products section, the URL looked like this 
```
https://0ac9006303247340803444db00b70035.web-security-academy.net/image?filename=10.jpg
```
I changed the filename in URL using .../etc/passwd
```
https://0ac9006303247340803444db00b70035.web-security-academy.net/image?filename=.../etc/passwd
```
And the lab have been solved, but let's also take a look at PortSwigger solution itself : 

Use Burp Suite to intercept and modify a request that fetches a product image. Modify the filename parameter, giving it the value:
```
../../../etc/passwd
```
Observe that the response contains the contents of the /etc/passwd file.

It seems I am supposed to see the contents, which I didn't using my own method. So, let's also do the solution to learn more about Burp Suit.

## Doing It the Burp Suite Way
 
### Step 1: Set Up Burp Suite
 
1. Opened Burp Suite → **Proxy** tab.
2. Under **Intercept**, toggled **Intercept is on** → **Intercept is off** (so pages load normally without pausing on every request).
3. Clicked **Open Browser** to launch Burp's built-in Chromium-based browser, pre-configured with Burp's proxy and CA cert.
 
### Step 2: Generate the Traffic
 
1. In Burp's browser, accessed the lab.
2. On the shop homepage, clicked into a product (**View details**), clicked into the product image. This makes the browser request that product's image from the server.
### Step 3: Find the Request in HTTP History
 
1. Went to **Proxy > HTTP history**.
2. Looked for a request where the URL contains `/image?filename=` (e.g. `/image?filename=74.jpg`).

<img width="1535" height="828" alt="Screenshot 2026-08-31 112453" src="https://github.com/user-attachments/assets/dfdc5e8c-3b17-4cef-9d2c-cb1e50cfcc9a" />

### Step 4: Send to Repeater
 
1. Right-clicked the request → **Send to Repeater** (or `Ctrl+R`).
2. Switched to the **Repeater** tab.
### Step 5: Modify and Exploit
 
1. In the Repeater request panel, edited the first line from:
```
   GET /image?filename=74.jpg HTTP/2
```
   to:
```
   GET /image?filename=../../../etc/passwd HTTP/2
```
2. Clicked **Send**.
 
### Step 6: Observe the Actual Response
 
Unlike the browser method, the Repeater **Response** panel shows the raw HTTP response body directly. Instead of an image (or nothing), the response body literally contained:
 
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
...
```
 
<img width="1178" height="744" alt="Screenshot 2026-08-31 112412" src="https://github.com/user-attachments/assets/f915a4ab-b3bb-4f1a-87da-59f7d90d6161" />

## My Method vs. the Burp Method
 
| | My method (browser URL edit) | Burp Repeater method |
|---|---|---|
| Payload used | `.../etc/passwd` | `../../../etc/passwd` |
| Solves the lab | ✅ Yes | ✅ Yes |
| Shows raw response content | ❌ No | ✅ Yes |
 
Both payloads worked here because this lab's traversal filter is naive — `../../../` and `.../` variants can both land on the right relative path. The real difference isn't the exploit itself, it's visibility: the browser tries to render the response as an image (since the request came from an `<img>` context) and shows nothing useful, while Repeater shows the exact raw bytes the server returned, with no rendering logic in the way. That's why the lab marked itself solved in both cases, but I only actually *saw* the `/etc/passwd` contents through Burp.
 
## Takeaway
 
A lab (or app) marking a request as "successful" confirms the server-side condition was met but it doesn't guarantee you personally saw the proof. For real testing/reporting, always verify by inspecting the raw response in Burp rather than trusting what the browser renders.
