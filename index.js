// Constuctor/employee class?

// Employee - iD, First, Last, role ID, Manager ID
// -Add()
// -View()
// -Update Employee Role()

// Dept - ID, name
// -Add()
// -View()
// Role - ID, Title, Salary, Dept_ID
// -Add()
// -View()

//*BONUS - update employee managers, view employees by manager, delete dept, roles, and employees, view combines salaries in a dept.

//What would you like to do?  required*
// View All Employees*
// View All Roles*
// View All Departments*
// Add Employees*
// Update Employee Role*
// Update Employee Manager
// Remove Employee
// View All Employees By Department
// View All Employees By Manager

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

        await viewEmployees(connection);
        //await addEmployee();



    } catch (err) {
        console.log(err);
    }

}

main();

const viewEmployees = async (connection) => {

    const[rows,fields] = await connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id");
    console.table(rows);
}

const addEmployee = async(connection) => {

    await inquirer.prompt([    //Do I need 'return or await'?

        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: ["Engineering", "Finance", "Sales"]
        },
        {
            type: "input",
            name: "employee_manager",
            message: "Who is the employees's manager?"
        }
    ])
    .then(answers => {

        //console.log(answers);
        

    })
}