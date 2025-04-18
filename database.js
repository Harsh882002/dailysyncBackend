import mysql from 'mysql2';
import dotenv  from 'dotenv';

//Loading .env file
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});




//function to handle connection error
const handleDBConnection = () =>{
    pool.getConnection((err,connection) =>{
        if(err){
            console.error("Database Connection error : ",err);
            process.exit(1); //Exit process if database connection fails
        }

        if(connection){
            console.log("MYSQL Connected...");
            connection.release();
        }
    })
}

handleDBConnection();

//Export pool for use in other files
export   const db = pool.promise();