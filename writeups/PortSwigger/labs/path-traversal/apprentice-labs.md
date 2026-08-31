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
