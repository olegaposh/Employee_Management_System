const help = require('./helper-functions')
const inquirer = require('inquirer');
const cTable = require('console.table');


// Main functions

const userPrompt = async (connection) => {
    return inquirer.prompt({

        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices:["View All","View Employees","View Roles","View Departments","Add Employee","Add Role","Add Department","Update Employee Role","Remove Employee","Remove Role","Remove Department"]
    })
    .then(async(response) => {

        switch (response.menu) {

            case "View All":
                console.log("         *****-------------------- View All --------------------*****");
                await viewAll(connection);
                break;

            case "View Employees":
                console.log("         *****-------------------- View Employees --------------------*****");
                await viewEmployees(connection);
                break;
            
            case "View Roles":
                console.log("         *****-------------------- View Roles --------------------*****");
                await viewRoles(connection);
                break;

            case "View Departments":
                console.log("         *****-------------------- View Departments --------------------*****");
                await viewDepts(connection);
                break;
            
            case "Add Employee":
                console.log("         *****-------------------- Add Employee --------------------*****");
                await addEmployee(connection);
                break;

            case "Add Role":
                console.log("         *****-------------------- Add Role --------------------*****");
                await addRole(connection);
                break;

            case "Add Department":
                console.log("         *****-------------------- Add Department --------------------*****");
                await addDept(connection);
                break;

            case "Update Employee Role":
                console.log("         *****-------------------- Update Employee Role --------------------*****");
                await updateEmployeeRole(connection);
                break;

            case "Remove Employee":
                console.log("         *****-------------------- Remove Employee --------------------*****");
                await deleteEmployee(connection);
                break;

            case "Remove Role":
            console.log("         *****-------------------- Remove Role --------------------*****");
            await deleteRole(connection);
            break;

            case "Remove Department":
            console.log("         *****-------------------- Remove Department --------------------*****");
            await deleteDept(connection);
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
    
    let roles = await help.getRoles(connection);

    let managers;
    // I am the manger
    
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
        },
        // 
        // {
        //     type: "input",
        //     name: "employee_manager",
        //     message: "Who is the employees's manager?"
                //choices: managers
        // }
    ])
    .then(async (answers) => {
    let roleID = await help.getRoleID(connection, answers.role);
    const sqlQuery = "INSERT INTO employee SET ?"
    const params = {first_name:answers.first_name, last_name:answers.last_name, role_id:roleID}

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`*${answers.first_name} ${answers.last_name} has been added*`);
    })
}

const addRole = async(connection) => {
    
    let departments = await help.getDepartments(connection);
    
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

    let deptID = await help.getDeptID(connection, answers.dept);
    const params = {title:answers.title, salary:answers.salary, department_id:deptID}
    const sqlQuery = "INSERT INTO role SET ?"
    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`*The ${answers.title} role has been added*`);
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

    console.log(`*${answers.newDept} has been added!*`);
    })
}

const updateEmployeeRole = async (connection) => {

    let employees = await help.getEmployees(connection);
    let roles = await help.getRoles(connection);
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

        
        let array = answers.update.split(' ');
        let roleID = await help.getRoleID(connection, answers.role);
        //const Query = `UPDATE employee SET role_id=${roleID} WHERE first_name=${array[0]} AND last_name=${array[1]}`
        const sqlQuery = "UPDATE employee SET ? WHERE ? AND ?"
        const params = [{role_id:roleID}, {first_name:array[0]}, {last_name:array[1]}]

        const [rows, fields] = await connection.query(sqlQuery, params);
        console.log(`*${answers.update} is now in a ${answers.role} role.*`);
    })
}

const deleteEmployee = async(connection) => {
    
    let employees = await help.getEmployees(connection);
    
    await inquirer.prompt([   

        {
            type: "list",
            name: "remove",
            message: "Which employee would you like to remove?",
            choices: employees
        }
        
    ])
    .then(async (answers) => {
    
    let array = answers.remove.split(' ');
    const sqlQuery = "DELETE FROM employee WHERE ? and ?"
    const params = [{first_name: array[0]}, {last_name: array[1]}]

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`*${answers.remove} has been removed.*`);
    })
}

const deleteDept = async(connection) => {
    
    let depts = await help.getDepartments(connection);
    
    await inquirer.prompt(    

        {
            type: "list",
            name: "delDept",
            message: "Which department would you like to remove?",
            choices: depts
        }
    )
    .then(async (answers) => {
    
    const sqlQuery = "DELETE FROM department WHERE ?"
    const params = {dept_name:answers.delDept}

    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`*${answers.delDept} department has been removed.*`);
    })
}

const deleteRole = async(connection) => {
    
    let roles = await help.getRoles(connection);
    
    await inquirer.prompt([ 

        {
            type: "list",
            name: "delRole",
            message: "Which role would you like to remove?",
            choices: roles
        }
    ])
    .then(async (answers) => {

    const sqlQuery = "DELETE FROM Role WHERE ?";
    const params = {title:answers.delRole};
    const [rows, fields] = await connection.query(sqlQuery, params);

    console.log(`*The ${answers.delRole} role has been removed.*`);
    })
}

exports.userPrompt = userPrompt;
exports.viewAll = viewAll;
exports.viewEmployees = viewEmployees;
exports.viewRoles = viewRoles;
exports.viewDepts = viewDepts;
exports.addEmployee = addEmployee;
exports.addRole = addRole;
exports.addDept = addDept;
exports.updateEmployeeRole = updateEmployeeRole;
exports.deleteEmployee = deleteEmployee;
exports.deleteDept = deleteDept;
exports.deleteRole = deleteRole;
