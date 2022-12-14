const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Connection
const db = mysql.createConnection(
    {
        user: 'root',
        password: 'rootroot',
        database: 'employee_db'
    },

    console.log('Connected to the employee_db.')
);

// start running
function init() {
    startup();
}

// add a new employee
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
            type: 'input',
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
                    startup();
                }
            });
        })
}

// add a new role
function roles() {
    inquirer.prompt([
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
                startup();
            }
        });
    });
}

function updateRoleQuestions(rolesArray, employeesArray) {
    return [
        {
            name: 'name',
            type: 'list',
            message: 'What is the employees name?',
            choices: employeesArray
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is the employees new role?',
            choices: rolesArray
        },
    ];
};

// update role
function updateRole() {
    var rolesArray = [];
    var employeesArray = [];
    db.query('SELECT title FROM role', (err, results) => {
        for (i = 0; i < results.length; i++) {
            rolesArray.push(results[i].title);
        }
        db.query(`SELECT concat(first_name, ' ', last_name) AS employee FROM employee`, (err, results) => {
            for (i = 0; i < results.length; i++) {
                employeesArray.push(results[i].employee);
            }
            inquirer
                .prompt(updateRoleQuestions(rolesArray, employeesArray))
                .then((response) => {
                    db.query(`SELECT id FROM role WHERE title = ?`, response.role, function (err, results) {
                        var roleId = results[0].id;
                        console.log(roleId)
                        db.query(`UPDATE employee SET role_id = ? WHERE concat(first_name, ' ', last_name) = ?;`, [roleId, response.name], function (err, results) {
                            console.log(`\n Employee Role Updated \n`);
                            init();
                        })
                    })
                })

        });
    });
}

// Add a new department
function department() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'name'
        }
    ]).then(answers => {
        db.query('INSERT INTO department SET ?', answers, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(`Name: ${answers.name}`);
                startup();
            }
        });
    });
}

// serves the menu
function startup() {
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
                    startup();
                }
            });
        } else if (answers.selection === 'View All Roles') {
            db.query('Select title FROM roles', function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.table(results);
                    startup();
                }
            });
        } else if (answers.selection === 'View All Departments') {
            db.query('Select name FROM department', function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.table(results);
                    startup();
                }
            });
        } else if (answers.selection === 'Add Employee') {
            employee();
        } else if (answers.selection === 'Add Role') {
            roles();
        } else if (answers.selection === 'Add Department') {
            department();
        } else if (answers.selection === 'Update Employee Role') {
            updateRole();
        }
    });
}
init();
