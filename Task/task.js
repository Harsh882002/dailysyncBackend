import { db } from "../database.js";

const submitTask = async (req, res) => {
  
  try {
    const {user_id, title, description, workHours, status } = req.body;
    console.log(req.body)
 
    // Basic input check
    if (!user_id || !title || !description || !workHours || !status) {
      return res.status(400).json({ 
        success: false,
        message: "Please fill out the entire form." 
      });
    } 

    // Convert and validate workHours
    const hours = parseFloat(workHours);
    if (isNaN(hours) || hours <= 0) {
      return res.status(400).json({
        success: false,
        message: "Work hours must be a positive number.",
      });
    }

    // Insert query
    const sql = `INSERT INTO daily_updates (user_id,title, description, work_hours, status) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      user_id,
      title.trim(),
      description.trim(),
      hours,
      status.trim(),
    ]);

    // Success response
    return res.status(201).json({
      success: true,
      message: "Task submitted successfully.",
      data: {
        taskId: result.insertId,
      },
    });

  } catch (error) {
    console.error("Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export { submitTask };
