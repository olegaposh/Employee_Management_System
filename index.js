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
// View All Departments
// Add Employees - done
//update employee role
//update employee manager
//Add Roles - done
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

        //how to get rid of index? when to use try?

        //await viewEmployees(connection);
        //await viewRoles(connection);
        //await addEmployee(connection);  
        //await addRole(connection);
        //await practice(connection);
        //await getRoles(connection);
        //await getDepartments(connection);
        await updateEmployeeRole(connection)
        
        connection.end();
    } catch (err) {
        console.log(err);
    }

}

main();

// View Employees
const viewEmployees = async (connection) => {

    const[rows,fields] = await connection.query("SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name,role.salary FROM role INNER JOIN employee ON role.id = employee.role_id INNER JOIN department ON role.department_id = department.id");
    console.table(rows);
}
// View Roles/depts
const viewRoles = async (connection) => {

    const[rows,fields] = await connection.query("SELECT role.id,title,salary,name FROM role INNER JOIN department ON role.department_id = department.id");
    console.table(rows);
}
// add Employee
const addEmployee = async(connection) => {
    
    let roles = await getRoles(connection);
    
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
            choices: roles
        }
        // {
        //     type: "input",
        //     name: "employee_manager",
        //     message: "Who is the employees's manager?"
        // }
    ])
    .then(async (answers) => {
    let roleID = await getRoleID(connection, answers.role);
    const sqlQuery = "INSERT INTO employee SET ?"
    const params = {first_name:answers.first_name, last_name:answers.last_name, role_id:roleID}

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`${answers.first_name} ${answers.last_name} has been added`);
    })
}
// add Role
const addRole = async(connection) => {
    
    let departments = await getDepartments(connection);
    
    await inquirer.prompt([    //Do I need 'return or await'?

        {
            type: "input",
            name: "title",
            message: "What is the title of the new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of this new role?"
        },
        {
            type: "list",
            name: "dept",
            message: "What department does this role belong to?",
            choices: departments
        }
    ])
    .then(async (answers) => {

    let deptID = await getDeptID(connection, answers.dept);
    const params = {title:answers.title, salary:answers.salary, department_id:deptID}
    const sqlQuery = "INSERT INTO role SET ?"
    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`The ${answers.title} role has been added`);
    })
}

const getRoleID = async (connection, role) => {

//whats the ID of the chosen role (sales/finance/engineer)
    const sqlQuery = "SELECT id FROM role WHERE ?"
    const params = {title: role}

    const [rows, fields] = await connection.query(sqlQuery, params);

    return rows[0].id;
    
}

const practice = async (connection) => {

    const sqlQuery = "INSERT INTO employee SET ?"
    const params = {first_name:"Alex", last_name:"Posh", role_id:3, manager_id:2}

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(rows);
    
}

const getRoles = async (connection) => {

    const[rows,fields] = await connection.query("SELECT title FROM role");
    
    // map applies a function you define to each element in the array
    let titles = rows.map((item) => { return item.title });
   // console.log(titles);
   return titles;
}

const getDepartments = async (connection) => {

    const[rows,fields] = await connection.query("SELECT name FROM department");
    
    //map applies a function you define to each element in the array
    let deptName = rows.map((item) => { return item.name });
   // console.log(titles);
    return deptName;

}

const getDeptID = async (connection, dept) => {

//whats the ID of the chosen Department (Marketing/Treasury/R&D)    
    const params = {name: dept}
    
    const [rows, fields] = await connection.query(sqlQuery, params);
    
    return rows[0].id;
        
}
    
const updateEmployeeRole = async (connection) => {

    let employees = await getEmployees(connection);
    let roles = await getRoles(connection);
    await inquirer.prompt([

        {
            type: "list",
            name: "update",
            message: "For which employee would you like to update their role?",
            choices: employees

        },
        {
            type: "list",
            name: "roles",
            message: "Choose new role for the employee",
            choices: roles

        }

    ])
    .then(async(answers) => {

        
        let array = answers.update.split(' ');
        let roleID = await getRoleID(connection, answers.role);
        const sqlQuery = "UPDATE employee SET ? WHERE ? AND ?"
        const params = [{role_id:roleID}, {first_name:array[0]}, {last_name:array[1]}]

        const [rows, fields] = await connection.query(sqlQuery, params);
        console.log(rows);
    })
}

const getEmployees = async (connection) => {

    const[rows,fields] = await connection.query("SELECT first_name, last_name FROM employee");
    //map applies a function you define to each element in the array
    let employees = rows.map((item) => { return (`${item.first_name} ${item.last_name}`)});
   
    return employees;
}
