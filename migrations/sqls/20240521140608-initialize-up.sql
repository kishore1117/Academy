/* Replace with your SQL commands */

CREATE TABLE franchise (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    client_unique_id VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

 CREATE TABLE location (
    id SERIAL NOT NULL PRIMARY KEY,
    name varchar(50),
    active BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    phone_number varchar,
    logo_url VARCHAR,
    address VARCHAR(100),
    city VARCHAR(30),
    state VARCHAR(20),
    zip_code INT,
    country VARCHAR(30),
    franchise_id  INT REFERENCES franchise(id)
)

