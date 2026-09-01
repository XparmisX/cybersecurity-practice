# Lab: Reflected XSS into HTML context with nothing encoded

**Category:** XSS

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab contains a simple reflected cross-site scripting vulnerability in the search functionality. To solve the lab, perform a cross-site scripting attack that calls the `alert` function.

## Solution
Copy and paste the following into the search box:
```
<script>alert(1)</script>
```
Click "Search".

# Lab: Stored XSS into HTML context with nothing encoded

**Category:** XSS

**Difficulty:** Apprentice

**Status:** Solved

## Lab Description
This lab contains a stored cross-site scripting vulnerability in the comment functionality. To solve this lab, submit a comment that calls the `alert` function when the blog post is viewed.

## Solution
Enter the following into the comment box:
```
<script>alert(1)</script>
```
Enter a name, email and website. Click "Post comment". Go back to the blog.
