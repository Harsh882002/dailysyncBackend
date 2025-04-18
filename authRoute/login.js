import express from "express";
import { db } from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
  
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: "Email or Password is missing..." });
  }

  try {
    const sql = "SELECT * FROM users where email = ?";
    const [rows] = await db.execute(sql, [email]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Email or Password" });
    }

    const user = rows[0];

    const plainPassword = String(password);
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid Email or Passwod.." });
    }

    //Generate TOken
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.json({
      success: true,
      message: "Login SuccessFull",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        department: user.department,
        role: user.role,
      },
      token,
    });
  } catch (e) {
    console.log("Error", e);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
