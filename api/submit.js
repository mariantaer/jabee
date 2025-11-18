// api/submit.js
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { full_name, email, phone_number, preferred_location, interest } = req.body;

  // Validate input
  if (!full_name || !email || !phone_number || !preferred_location || !interest) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Connect to Aiven MySQL with SSL
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT, // 19393 for Aiven
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: {
        // Read CA certificate from local file
        ca: fs.readFileSync(path.resolve(process.cwd(), "ca.pem"))
      }
    });

    // Insert data
    await db.execute(
      "INSERT INTO franchise_applications (full_name, email, phone_number, preferred_location, interest) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, phone_number, preferred_location, interest]
    );

    await db.end();
    return res.status(200).json({ message: "Application submitted successfully!" });

  } catch (err) {
    console.error("DB ERROR:", err);

    // Always return JSON
    return res.status(500).json({ message: "Database error. Check server logs." });
  }
}
