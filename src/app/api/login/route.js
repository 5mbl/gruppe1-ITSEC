// pages/api/login.js (App Router, POST endpoint)

import { getDbConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const connection = await getDbConnection();

    // UNSICHER: absichtlich für Demo-Zwecke (anfällig für SQL-Injection)
    const query = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`;
    const [rows] = await connection.query(query);

    if (rows.length > 0) {
      // Benutzer gefunden → Cookie setzen (userId)
      const user = rows[0];

      return new Response(
        JSON.stringify({ success: true, userId: user.id }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `userId=${user.id}; Path=/; HttpOnly`,
          },
        }
      );
    } else {
      return new Response(JSON.stringify({ error: "Ungültige Anmeldedaten" }), { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Serverfehler" }), { status: 500 });
  }
}
