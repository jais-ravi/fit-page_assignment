import pool from "../config/db.js";
import jwt from "jsonwebtoken";

export const findOrCreateUser = async (profile) => {
  const email = profile?.emails?.[0]?.value;
  const name = profile?.displayName || "Unknown"

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    const insertResult = await pool.query(
        "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *",
        [name,email]
    )

    return insertResult.rows[0];
  } catch (error) {
    console.error("Error in findOrCreateUser:",error);
    throw error;
  }
};

export const getMe = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      user: {
        id: decoded.id,
        email: decoded.email,
      },
    });
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}
