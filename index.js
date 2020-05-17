// Constuctor/employee class?

// Employee - iD, First, Last, role ID, Manager ID
// -Add()
// -Update Employee Role()

// Dept - ID, name
// -Add()

// Role - ID, Title, Salary, Dept_ID
// -Add()

// View Table of Employees() and their info

//*BONUS - update employee managers, view employees by manager, delete dept, roles, and employees, view combines salaries in a dept.


const inquirer = require('inquirer');
const mysql = require('mysql2/promise');


const main = async () => {

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'password',
            database: 'employeeTracker_db'

        })
        console.log(`Connected to database with ID ${connection.threadId}`);

    } catch (err) {
        console.log(err);
    }

}

main();