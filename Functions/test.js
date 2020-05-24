// const mysql = require('mysql2/promise');
// const help = require('./helper-functions')


// const main = async () => {

//     try {
//         const connection = await mysql.createConnection({
//             host: 'localhost',
//             port: 3306,
//             user: 'root',
//             password: 'password',
//             database: 'employeeTracker_db'

//         })
//         console.log(`Connected to database with ID ${connection.threadId}`);
        
//         return connection;

//     } catch (err) {
//         console.log(err);
//     }

// beforeAll(async () => {
       
//         const connection = await mysql.createConnection({
//         host: 'localhost',
//         port: 3306,
//         user: 'root',
//         password: 'password',
//         database: 'employeeTracker_db'

//     });
//  });

//  afterAll(async (connection) => {
    
//     connection.end();
//  });




// test("Can get roles()", (connection) => {
//     const testValue = "Marketing Analyst";
//     expect(help.getRoles(connection)).toContain(testValue);
    
//   });

//   VALUES("Marketing Analyst",95000,1),("Sales Executive",90000,2),
// ("Sales Associate",70000,2),("Business Analyst",85000,4),("Engineer I",110000,5),
// ("Engineer II",150000,5),("Vice President",240000,6),("CEO",350000,6);

// expect.containing 
  