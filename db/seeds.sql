INSERT INTO department (department_name)
VALUES  ("Engineering"),
        ("Finance"),
        ("Legal"),
        ("Sales"),
        ("Marketing");

INSERT INTO employee_role (title, salary, department_id)
VALUES  ("Manager", 7100, 1),
        ("Accountant", 7500.5, 2),
        ("Lawyer", 8300, 3),
        ("Vendor", 6500, 4),
        ("Driver",2700,5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, NULL),
        ("Janie","Sue", 2, 1),
        ("Carrie","Dwee",4, 1),
        ("Linda", "Dou", 3, 2),
        ("Mary","Loue",5, 2);