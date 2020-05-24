const mysql = require('mysql2/promise');
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
       
    } catch (err) {
        console.log(err);
    }

}

main();




