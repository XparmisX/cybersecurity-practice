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

# Lab: Source code disclosure via backup files

**Category:** Information disclosure

**Difficulty:** Apprentice

**Status:** Solved
 
## Lab Description
This lab leaks its source code via backup files in a hidden directory. To solve the lab, identify and submit the database password, which is hard-coded in the leaked source code.

## Solution
Browse to `/robots.txt` and notice that it reveals the existence of a `/backup` directory. Browse to `/backup` to find the file `ProductTemplate.java.bak`. Alternatively, right-click on the lab in the site map and go to "Engagement tools" > "Discover content". Then, launch a content discovery session to discover the `/backup` directory and its contents. Browse to `/backup/ProductTemplate.java.bak` to access the source code. In the source code, notice that the connection builder contains the hard-coded password for a Postgres database. Go back to the lab, click "Submit solution", and enter the database password to solve the lab.
