SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, roles.salary 
FROM employee 
JOIN roles ON employee.role_id = roles.id 
JOIN department ON roles.department_id = department.id