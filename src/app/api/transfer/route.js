import { getDbConnection } from "@/lib/db";

export async function POST(req) {
  console.log("Transfer API: Request received");
  
  try {
    const { userId, amount, recipient, description } = await req.json();
    console.log("Transfer API: Request data:", { userId, amount, recipient, description });

    if (!userId || !amount || !recipient) {
      console.log("Transfer API: Missing required fields");
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    console.log("Transfer API: Connecting to database...");
    const connection = await getDbConnection();

    // Begin transaction
    console.log("Transfer API: Beginning database transaction...");
    await connection.beginTransaction();

    // 1. Neue Transaktion einfügen
    console.log("Transfer API: Inserting transaction record...");
    await connection.execute(
      "INSERT INTO transactions (user_id, amount, recipient, description) VALUES (?, ?, ?, ?)",
      [userId, amount, recipient, description || ""]
    );

    // 2. Kontostand anpassen (z. B. -100)
    console.log("Transfer API: Updating account balance...");
    await connection.execute(
      "UPDATE accounts SET balance = balance + ? WHERE user_id = ?",
      [amount, userId] // Betrag kann auch negativ sein
    );

    console.log("Transfer API: Committing transaction...");
    await connection.commit();
    await connection.end();
    console.log("Transfer API: Transfer completed successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transfer API: Error occurred:", error);
    return new Response(JSON.stringify({ error: "Transfer failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
