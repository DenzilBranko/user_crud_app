const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const pool =  require('./db_config')

let userSignUp = async(data,) => {
    try {
        let { first_name,last_name,email,password } = data
        let insert_data = `insert into crud_app(first_name,last_name,email,password) values($1,$2,$3,$4) returning id`
        const client  = await pool.connect()
        let  hashPassWord = await bcrypt.hashSync(password,10);
        let  result = await client.query(insert_data,[first_name,last_name,email,hashPassWord])
        if(result.rows.length>0) {
           return true
        } else {
            return false
        }
    }catch(err) {
        throw err
    }
}


const userLogin = async(data) => {
    let query = `select u.id as user_id,u.email,u.password from crud_app u where U.email=$1;`;
    try {
        const client  = await pool.connect()
        let query_result = await client.query(query,[data])
         if(query_result.rows.length>0) {
             return query_result.rows
         } 
    }catch(error) {
        throw error
    }
}

const getUserData = async(data) => {
    let query = `select * from crud_app`;
    try {
        const client  = await pool.connect()
        let query_result = await client.query(query)
        if(query_result.rows.length>0) {
            return query_result.rows
        } else {
            return []
        }
    }catch(error) {
        throw error
    }
}

updateUser = async(data,id) => {
    let { first_name,last_name,email} = data
    let query3 = `update crud_app set first_name=$1,last_name=$2,email=$3 where id=$4 returning id`;
    try {
        const client  = await pool.connect()
        let update_record = await client.query(query3,[first_name,last_name,email,id])
        if(update_record.rows.length>0) {
            return [{status: "updated"}]
        } else {
            return [{status: "no record"}]
        }
    
    } catch(error) {
        throw error
    } 
}


let  deleteUser = async(id) => {
    let query2 = `delete from crud_app where id=$1 returning id`;
    try {
         const client  = await pool.connect()
         let delete_record = await client.query(query2,[id])
         if(delete_record.rows.length>0) {
             return [{status: "deleted"}]
        } else {
            return [{status: "no record deleted"}]
        }
    } catch(error) {
        throw error
     }
 }


module.exports = {
    userSignUp,
    userLogin,
    getUserData,
    deleteUser,
    updateUser
}