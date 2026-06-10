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

--3) Data Manipulation Language (DML)
--INSERT, DELETE, UPDATE, SELECT (maybe?!)

INSERT INTO Customers (ID, FirstName, LastName, Age, Address)
VALUES (5, 'Ali', 'Alavi', 20, 'Tehran')
DELETE FROM Customers
WHERE FirstName = 'Ali' AND LastName = 'Alavi';
UPDATE Customers
SET Address = 'Shiraz'
WHERE FirstName = 'Ali' AND LastName = 'Alavi';

--4) Data Control Language (DCL)
--GRANT

--5) Transaction Control Language (TCL)
--ROLLBACK, COMMIT


