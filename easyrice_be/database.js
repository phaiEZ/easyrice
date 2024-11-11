// database.js
import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost", // Database host (usually localhost for local development)
  user: "root", // Your MySQL username
  password: "password", // Your MySQL password
  database: "InspectionDB", // Your database name
});

export default pool;
