import { getDbConnection } from "@/lib/db";

export async function POST(req) {
    console.log("Transfer API: Request received");
  
    const origin = req.headers.get('origin') || ''
    const isAllowed = allowedOrigins.includes(origin)
  
    const cookie = req.headers.get("cookie") || "";
    console.log("Transfer API: Raw cookie:", cookie);
    const userId = cookie.match(/userId=([^;]+)/)?.[1];
    console.log("Transfer API: Extracted userId:", userId);
  
    const { amount, recipient, description } = await req.json();
    console.log("Transfer API: Request data:", { userId, amount, recipient, description });
  
    if (!userId || !amount || !recipient) {
      console.log("Transfer API: Validation failed - missing fields");
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': isAllowed ? origin : '',
          'Access-Control-Allow-Credentials': 'true',
        },
      })
    }
  
    const connection = await getDbConnection();
    await connection.beginTransaction();
  
    console.log("Transfer API: Inserting transaction record");
    await connection.execute(
      "INSERT INTO transactions (user_id, amount, recipient, description) VALUES (?, ?, ?, ?)",
      [userId, amount, recipient, description || ""]
    );
    console.log("Transfer API: Transaction record inserted successfully");
  
    await connection.execute(
      "UPDATE accounts SET balance = balance + ? WHERE user_id = ?",
      [amount, userId]
    );
    console.log("Transfer API: Account balance updated successfully");
  
    await connection.commit();
    await connection.end();
  
    console.log("Transfer API: Transfer completed successfully");
  
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }
  

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
  ]
  
  export async function OPTIONS(req) {
    const origin = req.headers.get('origin') || ''
    const isAllowed = allowedOrigins.includes(origin)
  
    return new Response(null, {
      status: 204,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }