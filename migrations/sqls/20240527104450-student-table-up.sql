/* Replace with your SQL commands */


CREATE TABLE student(
id SERIAL NOT NULL PRIMARY KEY,
name varchar(30) NOT NULL,
active BOOLEAN DEFAULT TRUE,
client_unique_id varchar(30) NOT NULL,
birth_date DATE,
phone_number varchar(20) NOT NULL,
email varchar(50),
image_url varchar,
school varchar(100), 
createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
kit_bag BOOLEAN,
cricket_role varchar(50),
student_type varchar(100),
location_id INT REFERENCES location(id)
)