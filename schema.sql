DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE employee (
emp_id INTEGER AUTO_INCREMENT NOT NULL,
PRIMARY KEY(emp_id),
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INTEGER,
manager_id INTEGER
);

CREATE TABLE role (
role_id INTEGER AUTO_INCREMENT NOT NULL,
PRIMARY KEY(role_id),
title VARCHAR(30),
salary DECIMAL(9,2),
department_id INTEGER
);

CREATE TABLE department (
dept_id INTEGER AUTO_INCREMENT NOT NULL,
PRIMARY KEY(dept_id),
dept_name VARCHAR(30)
);


CREATE TABLE manager (
mgr_id INTEGER AUTO_INCREMENT NOT NULL,
PRIMARY KEY(mgr_id),
mgr_name VARCHAR(30)
);



