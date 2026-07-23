# SSTI Lab
## The purpose of this lab is to find the SSTI exploit and get access to server and run a specific code (find a flag and its link), using the comment section.
## Process
### First thing i had to do was recognizing the template engine of the web application. 
I tried this : 
```
${{<%[%'"}}@{%\.#{<%=
```
And i got this an error, errors matter in SSTI :
```
Error rendering comment: Could not parse the remainder: '<%[%'"' from '<%[%'"'
```
Since I'm not knowledgable enough about different kinds of template engines, I asked Claude what does this error tell me. Its answer : This confirmed the input was being passed into a template renderer rather than displayed as plain text — a strong signal of SSTI. The specific phrasing of the error ("Could not parse the remainder: '...' from '...'") turned out to be a very distinctive, engine-specific message.

And it recommended trying this input in comment sections :
```
{{ 7*7 }}
```
And i got this error :
```
Error rendering comment: Could not parse the remainder: '*7' from '7*7'
```
Again, i asked Claude how this error would help me, it told me : This was the key identifying clue. In Jinja2, `{{ 7*7 }}` would have rendered as `49`. Instead, the engine tried to parse `7*7` as a variable lookup and choked on the `*7` part — this exact failure mode, combined with the earlier error phrasing, matches the **Django Template Language (DTL)**, not Jinja2, Twig, or another engine. DTL does not support arithmetic expressions or function calls with parentheses directly inside `{{ }}`, which made this a reliable fingerprint.

So we (me and claude) found out the template engine of this web application is Django Template Language (DTL).
