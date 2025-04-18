import { db } from "../database.js";

 

export const getTaskById = async (req, res) => {
 
  const { id } = req.params;
 
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Task ID is required",
    });
  }

  try {
    const sql = "SELECT * FROM daily_updates WHERE id = ?";

    const [rows] = await db.execute(sql, [id]);

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
