# Lab: Information disclosure in error messages

**Category:** Information disclosure

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab's verbose error messages reveal that it is using a vulnerable version of a third-party framework. To solve the lab, obtain and submit the version number of this framework.

## Solution
With Burp running, open one of the product pages. In Burp, go to "Proxy" > "HTTP history" and notice that the `GET` request for product pages contains a `productID` parameter. Send the `GET /product?productId=1` request to Burp Repeater. Note that your productId might be different depending on which product page you loaded. In Burp Repeater, change the value of the `productId` parameter to a non-integer data type, such as a string. Send the request:
```
GET /product?productId="example"
```
The unexpected data type causes an exception, and a full stack trace is displayed in the response. This reveals that the lab is using Apache Struts 2 2.3.31.
Go back to the lab, click "Submit solution", and enter **2 2.3.31** to solve the lab.

# Lab: Information disclosure on debug page

**Category:** Information disclosure

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab contains a debug page that discloses sensitive information about the application. To solve the lab, obtain and submit the `SECRET_KEY` environment variable.

## Solution
With Burp running, browse to the home page. Go to the "Target" > "Site Map" tab. Right-click on the top-level entry for the lab and select "Engagement tools" > "Find comments". Notice that the home page contains an HTML comment that contains a link called "Debug". This points to `/cgi-bin/phpinfo.php`. In the site map, right-click on the entry for `/cgi-bin/phpinfo.php` and select "Send to Repeater". In Burp Repeater, send the request to retrieve the file. Notice that it reveals various debugging information, including the `SECRET_KEY` environment variable. Go back to the lab, click "Submit solution", and enter the `SECRET_KEY` to solve the lab.
