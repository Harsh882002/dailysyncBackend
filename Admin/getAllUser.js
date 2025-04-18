 
 import { db } from "../database.js";

 
 export const getAllUser = async (req, res) => {
 
   try {
     // Query to fetch user details
     const [rows] = await db.execute(`SELECT * FROM users`);
 
     // Check if user exists
     if (rows.length === 0) {
       return res.status(404).json({
         success: false,
         message: "User not found.",
       });
     }
 
     // Return user data
     return res.status(200).json({
       success: true,
       user: rows,
     });
 
   } catch (error) {
      return res.status(500).json({
       success: false,
       message: "An internal server error occurred. Please try again later.",
     });
   }
 };
 