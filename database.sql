CREATE TABLE "user" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "password" varchar, 
  "picture" varchar,
  "createdAt" timestamp,
  "updatedAt" timestamp,
  "role" varchar
);

DROP TABLE 'user';