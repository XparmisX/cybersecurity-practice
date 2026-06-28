# Attribute-based XSS Bypass

The goal was to execute a Cross-Site Scripting (XSS) attack by injecting an alert function into an input tag attribute. The required alert message was: attribute xss attack.

During the initial testing, I discovered several filters implemented by the application:

1. Space Filtering: The application was stripping or blocking standard space characters ( ).
  
2. Quote Handling: Standard double quotes were sometimes being misinterpreted or filtered depending on the context.

3. HTML Encoding: Some characters like < and > were encoded to &lt; and &gt;, making it impossible to break out of the tag using ><script>.

Attempt 1: Standard Injection

Payload: " onclick="alert('attribute xss attack')"

Result: Failed. The spaces were removed, resulting in value="onclick="alert(...)", which is not executable.

Attempt 2: Slash as a Separator

Payload: "/onclick=alertattribute xss attack /"

Result: Failed. While the slash sometimes acts as a separator in HTML, the browser’s parser was still treating the entire string as part of the value attribute.

# The Breakthrough: Tab Injection (Filter Evasion)

After analyzing how the server handled inputs, I decided to bypass the space filter by using an alternative whitespace character. Instead of a standard space, I used a Horizontal Tab.

The Logic:

In URL encoding, a Space is %20, but a Tab is %09.

Most filters only look for %20 or literal spaces.

Browsers treat a Tab as a valid separator between HTML attributes.

Final Payload (Via URL): ?q=x%09onclick=alert('attribute\x20xss\x20attack')

Explanation:

x: A dummy value for the value attribute.

%09: The URL-encoded Tab character, which successfully separated value="x" from our injected onclick attribute.

onclick=: The event handler we wanted to trigger.

\x20: Hexadecimal representation of a space used inside the Javascript string to ensure the alert message met the lab requirements without using a literal space.

## By navigating to the crafted URL, the HTML source code became: <input ... value="x" onclick="alert('attribute xss attack')">

When I clicked the search box, the alert was successfully triggered, and the lab was marked as Completed.

# Key Takeaways

Filter Bypass: When a character is blocked, look for its ASCII/Hex/URL equivalents (like %09 for Tab or %0a for Newline).

Context is Everything: Understanding that we were inside an input tag’s value attribute allowed us to focus on attribute-based injection rather than tag-based injection.
