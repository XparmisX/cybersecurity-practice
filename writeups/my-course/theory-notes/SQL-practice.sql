--SQL different syntax

--1) Data Definition Language (DDL)
--CREATE, ALERT, DROP

CREATE TABLE Customers (
    ID INT,
    FirstName VARCHAR(255),
    Age INT,
    Address VARCHAR
);

--2) Data Query Language (DQL)
--SELECT, WHERE, ORDER BY

SELECT LastName, Age
FROM Customers
WHERE Age > 18
ORDER BY Age ASC;
--UNION operator
SELECT FirstName, LastName FROM Tehran_Customers
UNION
SELECT FirstName, LastName FROM Others_Customers;
