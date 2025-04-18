 import { db } from "../database.js";
 
 export const getAllTask = async (req, res) => {
 
   try {
     const sql = `SELECT
        daily_updates.id,
        users.name AS user_name,
        daily_updates.title,
        daily_updates.description,
        daily_updates.work_hours,
        daily_updates.status,
        daily_updates.created_at
      FROM daily_updates
      JOIN users ON daily_updates.user_id = users.id `
 
     const [rows] = await db.execute(sql);
 
     if (rows.length == 0) {
       return res.status(404).json({
         success: false,
         message: "No task found with the provided ID",
       });
     }
 
     return res.status(200).json({
       success: true,
       message: "Task retrieved succesfully",
       data: rows,
     });
   } catch (error) {
     console.error("Error Fetching Task", error);
     return res.status(500).json({
       success: false,
       message: error.message,
     });
   }
 };
 