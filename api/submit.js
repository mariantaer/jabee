import mysql from "mysql2/promise";
import fs from "fs";

// Load SSL certificate
const ca = fs.readFileSync("./ca.pem");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { full_name, email, phone_number, preferred_location, interest } = req.body;

  if (!full_name || !email || !phone_number || !preferred_location || !interest) {
    return res.status(400).json({ message: "All fields required." });
  }

  try {
    const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, // <--- from .env
  database: process.env.DB_NAME,
  ssl: { ca: fs.readFileSync("./ca.pem") }
});

    await db.execute(
      `INSERT INTO franchise_applications 
        (full_name, email, phone_number, preferred_location, interest)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, phone_number, preferred_location, interest]
    );

    await db.end();

    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: "Database error. Check console." });
  }
}
