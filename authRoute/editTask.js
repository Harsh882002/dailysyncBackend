import { db } from "../database.js";

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, work_hours, status } = req.body;
  
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(18, 0, 0, 0); //6:00 PM

    if (now > cutoff) {
      return res.status(403).json({
        success: false,
        message: "Task editing is allowed only before 6:00 PM.",
      });
    }

    if (( !title || !description || ! work_hours || !status)) {
      return res.status(400).json({
        success: false,
        message: "Please fill out the entire form.",
      });
    }

    const hours = parseFloat(work_hours);
    if (isNaN(hours) || hours <= 0)
      return res.status(400).json({
        success: false,
        message: "Work hours must be positive number",
      });

    const sql = `UPDATE daily_updates SET title= ?,description=?, work_hours=?,status=? WHERE id=?`;

    const [result] = await db.execute(sql, [
      title.trim(),
      description.trim(),
      hours,
      status.trim(),
      id,
    ]);

    //check if record was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not Found or already register",
      });
    }

    //success response
    return res.status(201).json({
      success: true,
      message: "Task Edit SuccessFully",
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
