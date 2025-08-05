import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
  const user = await req.json();

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // your db password
    database: "hakimAI",
  });

  try {
    const [rows] = await connection.execute(
      `INSERT INTO users (
        name, email, password, phone_number, gender, birthdate,
        nationality, address_region, picture, role, sub
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        user.password,
        user.phone_number,
        user.gender,
        user.birthdate,
        user.nationality,
        user.address?.region || null,
        user.picture,
        "patient",
        user.sub,
      ]
    );

    return NextResponse.json({ success: true, message: "User saved" });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    connection.end();
  }
}
