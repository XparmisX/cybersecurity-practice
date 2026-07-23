# SSTI Lab
## The purpose of this lab is to find the SSTI exploit and get access to server and run a specific code, using the comment section.
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
