BEGIN TRANSACTION;

INSERT into users
  (name, pet, age, email, entries, joined)
values
  ('James', 'Cat', 21, 'dardar@gmail.com', 5, '2018-01-01');

INSERT into login
  (hash, email)
values
  ('$2a$10$Uaq4HKIGuFoo2Miqwiakh.2DtOinSqOIwhTNho0q3fNqWUbfNsYAK', 'dardar@gmail.com');

COMMIT;