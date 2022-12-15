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