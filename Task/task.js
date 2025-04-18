import { db } from "../database.js";

// API to submit task
const submitTask = async (req, res) => {
  try {
    const { user_id, title, description, workHours, status } = req.body;
    console.log(req.body);

    // Basic input check
    if (!user_id || !title || !description || !workHours || !status) {
      return res.status(400).json({
        success: false,
        message: "Please fill out the entire form.",
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

    // Step 1: Create the table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS daily_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        work_hours FLOAT NOT NULL,
        status ENUM('Completed', 'Pending') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Step 2: Insert the task into daily_updates table
    const sql = `INSERT INTO daily_updates (user_id, title, description, work_hours, status) VALUES (?, ?, ?, ?, ?)`;
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
