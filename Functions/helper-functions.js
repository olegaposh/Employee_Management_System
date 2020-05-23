// helper functions

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

const getManagers = async (connection) => {

    
    const[rows,fields] = await connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL");
    let managers = rows.map((item) => { return (`${item.first_name} ${item.last_name}`)});
    return managers;
   

}
const getManagerID = async (connection, mgr_first,mgr_last) => {

    //whats the ID of the chosen role (sales/finance/engineer)
        const sqlQuery = "SELECT emp_id FROM employee WHERE ? AND ?"
        const params = [{first_name:mgr_first},{last_name:mgr_last}]
    
        const [rows, fields] = await connection.query(sqlQuery, params);
        console.log(rows)
        return rows[0].emp_id;
        
}

exports.getRoleID = getRoleID;
exports.getRoles = getRoles;
exports.getDepartments = getDepartments;
exports.getDeptID = getDeptID;
exports.getEmployees = getEmployees;
exports.getManagers = getManagers;
exports.getManagerID = getManagerID;