# Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

**Category:** SQLi

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab contains a SQL injection vulnerability in the product category filter. When the user selects a category, the application carries out a SQL query like the following:
```sql
SELECT * FROM products WHERE category = 'Gifts' AND released = 1
```
To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products.

## Solution
Use Burp Suite to intercept and modify the request that sets the product category filter. Modify the `category` parameter, giving it the value `'+OR+1=1--` Submit the request, and verify that the response now contains one or more unreleased products.

# Lab: SQL injection vulnerability allowing login bypass

**Category:** SQLi

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab contains a SQL injection vulnerability in the login function. To solve the lab, perform a SQL injection attack that logs in to the application as the `administrator` user.

## Solution
Use Burp Suite to intercept and modify the login request. Modify the `username` parameter, giving it the value: `administrator'--`
