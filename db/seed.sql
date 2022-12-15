INSERT INTO department (name)
VALUES  ('Marketing'),
        ('Engineering'),
        ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Marketing Director', 95000, 1),
        ('Marketing Manager', 50000, 1),
        ('Senior Engineer', 85000, 2),
        ('Junior Engineer', 65000, 2),
        ('HR Manager', 55000, 3) ;


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Boba, Fett', 1, NULL),
        ('Han', 'Solo', 2, 1),
        ('Luke', 'Skywalker', 2, NULL),
        ('Leia', 'Organa', 4, 3),
        ('Darth', 'Vader', 5, NULL);