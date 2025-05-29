import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// export async function executeQuery(query, params = [], connection = null) {
//   console.log("aaaa")
//   const [rows] = connection
//     ? await connection.execute(query, params)
//     : await pool.execute(query, params);
//     console.log("bbb")
//   return rows;
// }
export async function executeQuery(query, params = [], connection = null) {
  try {
    const [rows] = connection
      ? await connection.execute(query, params)
      : await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("❌ executeQuery error:", error.message);
    throw error;
  }
}


export async function getDBConnection() {
  return await pool.getConnection();
}

export { pool };
