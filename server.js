const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Connect to 
const db = mysql.createConnection(
    {
        user: 'root',
        password: 'rootroot',
        database: 'employee_db'
    },

    console.log('Connected to the employee_db.')
);

function employee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'What is the employee\'s role id? 1 for Marketing Director, 2 for Marketing Manager, 3 for Senior Engineer, 4 for Junior Engineer, and 5 for HR Manager',
            name: 'role_id'
        },
    ])
        .then(answers => {
            db.query('INSERT INTO employee SET ?', answers, function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`First Name: ${answers.first_name} Last Name: ${answers.last_name} Role ID: ${answers.role_id}`);
                    menu();
                }
            });
        })
}


function roles() {
    inquirer.prompt ([
        {
            type: 'input',
            message: 'What is the role name?',
            name: 'title'
        },
        {
            type: 'input',
            message: 'What is the employee\'s salary?',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'Enter a number corresponding to a department. 1 for Marketing, 2 for Engineering or 3 for Human Resources.',
            name: 'department_id'
        },
    ]).then(answers => {
        // Query to add a new role to DB using the values from Inquirer prompt
        db.query('INSERT INTO roles SET ?', answers, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Title: ${answers.title}, Salary: ${answers.salary}, Department: ${answers.department_id}`);
                menu();
            }
        });
    });
}


function menu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Make a selection from the following:',
            choices: [
                'View All Departments',
                'View All Employees',
                'View All Roles',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Update Employee Role'
            ],
            name: 'selection',
        }
    ]).then(answers => {
        console.log(answers);

        if (answers.selection === 'View All Employees') {
            db.query('SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, roles.salary FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id', function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.table(results);
                }
            });
        }
    });
}

menu();