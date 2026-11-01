-- plant care database (postgresql)
-- create the database first:  createdb plant_care
-- then run this file:  psql -d plant_care -f database.sql

DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS plants;

CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    scientific_name VARCHAR(100),
    description TEXT,
    water_amount VARCHAR(100),
    watering_days INT, -- water every x days
    light VARCHAR(100),
    min_temp INT, -- in celsius
    max_temp INT,
    humidity VARCHAR(50),
    soil VARCHAR(100),
    care_instructions TEXT
);

-- one plant can have a few problems, so separate table
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(id),
    problem VARCHAR(100),
    solution TEXT
);

-- SELECT * FROM plants;
