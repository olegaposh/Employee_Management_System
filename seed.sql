INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES("Gary","Oak",2,7),("Severus","Snape",3,11),("Ash","Ketchup",4,7),
("Rick","Sanchez",6,11),("Jackie","Chan",5,11),("Tom","Cruise",5,11),("Barack","Obama",8,null),
("Adam","Sandler",3,7),("Harry","Potter",6,11),("Hermione","Granger",1,7),
("Spongebob","Squarepants",7,null),("Johnny","Bravo",3,11);

INSERT INTO role (title,salary,department_id)
VALUES("Marketing Analyst",95000,1),("Sales Executive",90000,2),
("Sales Associate",70000,2),("Business Analyst",85000,4),("Engineer I",110000,5),
("Engineer II",150000,5),("Vice President",240000,6),("CEO",350000,6);

INSERT INTO department (dept_name)
VALUES("Marketing"),("Sales"),("Finance"),("Business Strategy"),("Engineering"),("Executive");
