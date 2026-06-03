# Security Lab: DOM-based XSS Vulnerability Analysis

## 1. Overview
This lab focuses on identifying and exploiting a DOM-based Cross-Site Scripting (XSS) vulnerability within a user profile environment. The goal was to execute an arbitrary script while bypassing specific security constraints.

## 2. Vulnerability Identification
During the reconnaissance phase, I analyzed how the web application handles user input in the **"Profile Name"** field.
*   **Source:** User-controlled input (Profile Name field).
*   **Sink:** The input is rendered directly into the page's header via client-side JavaScript.
*   **Observation:** The application fails to sanitize the input, allowing HTML tags to be interpreted and executed by the browser.

## 3. Exploit Design & Bypass
The challenge imposed several restrictions to simulate a real-world Web Application Firewall (WAF) or basic filtering:
*   **Constraint 1:** No `<script>` tags allowed.
*   **Constraint 2:** No usage of the `document` object.
*   **Constraint 3:** Must trigger via an HTML Attribute.

### Strategy:
I utilized an **Event Handler** approach. By injecting an `<img>` tag with an invalid source, I could trigger the `onerror` event to execute JavaScript.

**Final Payload:**
```html
<img src="x" onerror="alert('DOM XSS Successfully Executed')">

## 4. Technical Analysis
The attack was successful due to the following technical flaws:
1.  **Insecure DOM Manipulation:** The application used a method like `.innerHTML` to update the profile name instead of `.textContent`. This forced the browser to parse the injected string as actual HTML.
2.  **Lack of Sanitization:** No client-side or server-side library was used to strip dangerous attributes (like `onerror`) from the input.
3.  **Global Object Access:** Since `alert()` is a method of the `window` object, it could be called directly without needing the restricted `document` object.

## 5. Mitigation & Prevention
To prevent such vulnerabilities, the following best practices should be implemented:
*   **Use Safe APIs:** Prefer `.textContent` or `.innerText` over `.innerHTML` when handling user-provided strings.
*   **Sanitization Libraries:** Use trusted libraries like **DOMPurify** to clean HTML before rendering.
*   **Content Security Policy (CSP):** Implement a strict CSP to disallow inline scripts and restrict the execution of unauthorized event handlers.


---
*Created as part of my Web Security learning journey.*
