// app/api/transactions/route.js
import mysql from "mysql2/promise";
import { getDbConnection } from "@/lib/db";


export async function GET() {
    const connection = await getDbConnection();


  // Fetch transactions for user_id = 2 (Max Mustermann)
  const [rows] = await connection.execute(
    "SELECT id, amount, recipient, description, created_at FROM transactions WHERE user_id = ?",
    [2]
  );

  //console.log("Tx rows:", rows); // Debug-Log


  await connection.end();

  // Return as JSON
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
