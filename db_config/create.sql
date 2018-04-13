DROP DATABASE IF EXISTS machine;
CREATE DATABASE machine;

\c machine;

CREATE TABLE images (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  data TEXT
);

INSERT INTO images (name, data)
  VALUES ('Test 1', '123456');

INSERT INTO images (name, data)
  VALUES ('Test 2', '789012');

INSERT INTO images (name, data)
  VALUES ('Test 3', '345678');