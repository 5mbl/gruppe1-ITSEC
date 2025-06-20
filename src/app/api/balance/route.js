// app/api/balance/route.js
import { getDbConnection } from "@/lib/db";

export async function GET() {
  const connection = await getDbConnection();

  const [rows] = await connection.execute(
    "SELECT balance FROM accounts WHERE user_id = ?",
    [2] // Max Mustermann hat user_id 2
  );

  console.log("Balance rows:", rows); // Debug-Log


  await connection.end();

  // Falls kein Konto gefunden wurde
  if (rows.length === 0) {
    return new Response(JSON.stringify({ balance: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(rows[0]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
