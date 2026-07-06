-- Section1
    your 1st query here --SELECT
-- Section2
    your 2nd query here --INSERT
-- Section3
    your 3rd query here --UPDATE
-- Section4
    your 4th query here --DELETE


-- Final Answer :
-- Section1
SELECT country, new_cases
FROM covid_stats
WHERE new_cases > 10000
ORDER BY new_cases DESC;

-- Section2
INSERT INTO covid_stats (date_reported, country_code, country, new_cases, new_deaths)
VALUES ('2020-08-19', 'IRN', 'ایران', 15000, 50);

-- Section3
UPDATE covid_stats
SET new_cases = 16000
WHERE country = 'ایران' AND date_reported = '2020-08-18';

-- Section4
DELETE FROM covid_stats
WHERE new_deaths = 0;
