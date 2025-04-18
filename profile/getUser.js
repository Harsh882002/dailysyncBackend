 
 import { db } from "../database.js";

 
 export const getUserById = async (req, res) => {
   const { id } = req.params;
 
   // Basic validation
   if (!id) {
     return res.status(400).json({
       success: false,
       message: "User ID is required.",
     });
   }
 
   try {
     // Query to fetch user details
     const [rows] = await db.execute(
       `SELECT id, name, email, department, designation 
        FROM users 
        WHERE id = ?`,
       [id]
     );
 
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
       user: rows[0],
     });
 
   } catch (error) {
     console.error("Fetch User Error:", error);
     return res.status(500).json({
       success: false,
       message: "An internal server error occurred. Please try again later.",
     });
   }
 };
 