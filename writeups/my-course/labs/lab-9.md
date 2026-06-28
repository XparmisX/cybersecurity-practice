# Attribute-based XSS Bypass

The goal was to execute a Cross-Site Scripting (XSS) attack by injecting an alert function into an input tag attribute. The required alert message was: attribute xss attack.

During the initial testing, I discovered several filters implemented by the application:

1. Space Filtering: The application was stripping or blocking standard space characters ( ).
  
2. Quote Handling: Standard double quotes were sometimes being misinterpreted or filtered depending on the context.

3. HTML Encoding: Some characters like < and > were encoded to &lt; and &gt;, making it impossible to break out of the tag using ><script>.
