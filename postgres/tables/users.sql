BEGIN TRANSACTION;

CREATE TABLE users
(
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name VARCHAR(100),
  pet VARCHAR(60),
  age INTEGER,
  entries BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL
);

COMMIT;