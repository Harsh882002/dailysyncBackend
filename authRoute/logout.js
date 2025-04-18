// authRoute/logout.js
import { db } from "../database.js";
import jwt from 'jsonwebtoken';

export const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
 
    // Optionally verify the token first
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: err.message });
      }

      // Step 1: Create the token_blacklist table if it doesn't exist
      await db.execute(`
        CREATE TABLE IF NOT EXISTS token_blacklist (
          id INT AUTO_INCREMENT PRIMARY KEY,
          token TEXT NOT NULL,
          user_id INT NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Step 2: Store the token in the blacklist table
      await db.query('INSERT INTO token_blacklist (token, user_id, expires_at) VALUES (?, ?, ?)', [
        token,
        decoded.id,
        new Date(decoded.exp * 1000) // token expiry in milliseconds
      ]);

      return res.status(200).json({ success: true, message: "Logout successful" });
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
