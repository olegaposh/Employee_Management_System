//const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
//const cTable = require('console.table');
const functions = require('./Functions/main-functions')
const help = require('./Functions/helper-functions')

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

        await functions.userPrompt(connection);
        //how to get rid of index? when to use try?

        //await viewAll(connection);
        //await viewEmployees(connection);
        //await viewRoles(connection);
        //await viewDepts(connection)
        //await addEmployee(connection);  
        //await addRole(connection);
        //await addDept(connection);
        //await updateEmployeeRole(connection)
        //await deleteEmployee(connection)
        //await deleteDept(connection);
        //await deleteRole(connection)
        //await help.getManagers(connection)
        //await help.getManagerID(connection)
        
        //connection.end();
    } catch (err) {
        console.log(err);
    }

}

main();




