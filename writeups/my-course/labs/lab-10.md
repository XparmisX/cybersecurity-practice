# Stored XSS

There is a section in the comments that is vulnerable to Stored XSS. This section must be identified, and a code containing JavaScript commands to display a warning message must be entered. This code should display the text “you are hacked” as an alert when rendered by the web application. The content of the comments is HTML encoded before being stored, so the chance of a direct vulnerability is low. I realized that actually, the name used for the username, which is used inside the comments as the person who posted it, is vulnerable. Therefore, instead of a name, I used the code 
<pre>
<script>alert('you are hacked')</script>
</pre>
received the score, and the lab was solved.
