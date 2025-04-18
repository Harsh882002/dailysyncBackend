import { db } from "../database.js";


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, designation } = req.body;

  // Validate required fields
  if (!id || !name || !email || !department || !designation) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, email, department, designation.",
    });
  }

  try {
    // Check if the email already exists for another user
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use by another user.",
      });
    }

    // Perform the update
    const [result] = await db.execute(
      `UPDATE users 
       SET name = ?, email = ?, department = ?, designation = ?
       WHERE id = ?`,
      [name.trim(), email.trim(), department.trim(), designation.trim(), id]
    );

    // Check if any record was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes were made.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};
