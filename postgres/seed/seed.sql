BEGIN TRANSACTION;

INSERT into users
  (name, email, entries, joined)
values
  ('Jessy', 'dardar@gmail.com', 5, '2018-01-01');

INSERT into login
  (hash, email)
values
  ('$2a$10$Uaq4HKIGuFoo2Miqwiakh.2DtOinSqOIwhTNho0q3fNqWUbfNsYAK', 'dardar@gmail.com');

COMMIT;