// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: Request) {
  const { phone_number, password } = await req.json();

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hakimAI", // adjust this if needed
    });

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE phone_number = ? AND password = ?",
      [phone_number, password]
    );

    await connection.end();

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = (rows as any[])[0];

    return NextResponse.json({
      user,
      accessToken: "mock-token",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
