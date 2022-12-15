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
            db.query('Select * FROM employee', function (err, results) {
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