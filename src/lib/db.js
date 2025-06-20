// lib/db.js
import mysql from "mysql2/promise";

// Funktion, die eine Verbindung zur lokalen MySQL-Datenbank herstellt
export async function getDbConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",         // oder dein MySQL-User
    password: "",         // XAMPP-Standard ist leer
    database: "bank_app_uni",  // deine Datenbank
  });
  return connection;
}
