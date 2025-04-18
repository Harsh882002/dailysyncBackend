 
import bcrypt from "bcrypt";
import { db } from "../database.js";

//api for signup
export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, department, designation } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !department ||
    !designation
  ) {
    return res.status(400).json({ message: "Please fill complete form." });
  }
  

  //checking password matching or not
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password do not match." });
  }

  try {
    //check if user is already exist or not
    const [existUser] = await db.execute(
      "SELECT * FROM users where email = ?",
      [email]
    );
    if (existUser.length > 0) {
      return res.json({ message: "Email is Already Regsitered." });
    }

    //Hash Password
    const hashPass = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users(name, email,password,department,designation) VALUES (?,?,?,?,?)",
      [name, email, hashPass, department, designation]
    );

    return res
      .status(201)
      .json({ success: true, message: "User Register SuccessFully.." });
  } catch (error) {
     return res.status(500).json({ message: "Server error" });
  }
};
