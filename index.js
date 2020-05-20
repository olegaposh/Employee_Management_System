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

        await userPrompt(connection);
        //how to get rid of index? when to use try?

        //await viewAll(connection);
        //await viewEmployees(connection);
        //await viewRoles(connection);
        //await viewDepts(connection)
        //await addEmployee(connection);  
        //await addRole(connection);
        //await addDept(connection);
        //await updateEmployeeRole(connection)
        
        connection.end();
    } catch (err) {
        console.log(err);
    }

}

main();



// Main functions

function userPrompt(connection) {
    return inquirer.prompt({

        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices:["View All","View Employees","View Roles","View Departments","Add Employee","Add Role","Add Department","Update Employee Role","Exit"]
    })
    .then(async(response) => {

        switch (response.menu) {

            case "View All":
                await viewAll(connection);
                break;

            case "View Employees":
                await viewEmployees(connection);
                break;
            
            case "View Roles":
                await viewRoles(connection);
                break;

            case "View Departments":
                await viewDepts(connection);
                break;
            
            case "Add Employee":
                await addEmployee(connection);
                break;

            case "Add Role":
                await addRole(connection);
                break;

            case "Add Department":
                await addDept(connection);
                break;

            case "Update Employee Role":
                await updateEmployeeRole(connection);
                break;

        }

        await userPrompt(connection)

    })
}

const viewAll = async (connection) => {

    const[rows,fields] = await connection.query("SELECT e.emp_id,e.first_name,e.last_name,r.title,department.dept_name,r.salary,mgr_name FROM role r INNER JOIN employee e ON r.role_id = e.role_id INNER JOIN department ON r.department_id = department.dept_id INNER JOIN manager ON e.manager_id = manager.mgr_id");
    console.table(rows);
}

const viewEmployees = async (connection) => {

    const[rows,fields] = await connection.query("SELECT emp_id,first_name,last_name FROM employee");
    console.table(rows);
}

const viewRoles = async (connection) => {

    const[rows,fields] = await connection.query("SELECT role_id,title,salary FROM role");
    console.table(rows);
}

const viewDepts = async (connection) => {

    const[rows,fields] = await connection.query("SELECT dept_id,dept_name FROM department");
    console.table(rows);
}


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

const addDept = async(connection) => {
    
    
    
    await inquirer.prompt(    

        {
            type: "input",
            name: "newDept",
            message: "What is the name of the department you want to add?"
        }
    )
    .then(async (answers) => {
    
    const sqlQuery = "INSERT INTO department SET ?"
    const params = {dept_name:answers.newDept}

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`${answers.newDept} has been added!`);
    })
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
            name: "role",
            message: "Choose new role for the employee",
            choices: roles

        }

    ])
    .then(async(answers) => {

        //UPDATE employee SET role_id=4 WHERE first_name="Alex" AND last_name="Posh"
        let array = answers.update.split(' ');
        let roleID = await getRoleID(connection, answers.role);
        //const Query = `UPDATE employee SET role_id=${roleID} WHERE first_name=${array[0]} AND last_name=${array[1]}`
        const sqlQuery = "UPDATE employee SET ? WHERE ? AND ?"
        const params = [{role_id:roleID}, {first_name:array[0]}, {last_name:array[1]}]

        const [rows, fields] = await connection.query(sqlQuery, params);
        console.log(`${answers.update} is now a ${answers.role}!`);
    })
}

// Helper functions 

const getRoleID = async (connection, role) => {

//whats the ID of the chosen role (sales/finance/engineer)
    const sqlQuery = "SELECT role_id FROM role WHERE ?"
    const params = {title: role}

    const [rows, fields] = await connection.query(sqlQuery, params);

    return rows[0].role_id;
    
}


const getRoles = async (connection) => {

    const[rows,fields] = await connection.query("SELECT title FROM role");
    
    // map applies a function you define to each element in the array
    let titles = rows.map((item) => { return item.title });
   // console.log(titles);
   return titles;
}

const getDepartments = async (connection) => {

    const[rows,fields] = await connection.query("SELECT dept_name FROM department");
    
    //map applies a function you define to each element in the array
    let deptName = rows.map((item) => { return item.dept_name });
   // console.log(titles);
    return deptName;

}

const getDeptID = async (connection, dept) => {

//whats the ID of the chosen Department (Marketing/Treasury/R&D)    
    const sqlQuery = "SELECT dept_id FROM department WHERE ?"
    const params = {dept_name: dept}
    
    const [rows, fields] = await connection.query(sqlQuery, params);
    
    return rows[0].dept_id;
        
}
    
const getEmployees = async (connection) => {

    const[rows,fields] = await connection.query("SELECT first_name, last_name FROM employee");
    //map applies a function you define to each element in the array
    let employees = rows.map((item) => { return (`${item.first_name} ${item.last_name}`)});
   
    return employees;
}
