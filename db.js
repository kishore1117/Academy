const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "admin",
    host : "localhost",
    port: 5432,
    database: "academy"
});
// pool.query(`
// CREATE TABLE "user" (
//     "id" SERIAL NOT NULL ,
//     "name" varchar,
//     "email" varchar UNIQUE,
//     "phone_number" varchar(20) NOT NULL,
//     "password" varchar, 
//     "picture" varchar,
//     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "role" varchar
//   );`)

module.exports = pool;  