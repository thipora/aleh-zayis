// import mysql from 'mysql2';
// import 'dotenv/config';

// async function executeQuery(query, params) {
//     return new Promise((resolve, reject) => {
//         const connection = mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             port: 3306,
//             database: process.env.DB_NAME || 'alehZayis',
//             password: process.env.DB_PASSWORD || 'TZ1234'
//         });

//         connection.connect(err => {
//             if (err) {
//                  reject(err);
//                 return;
//             }

//             connection.execute(query, params, (error, results) => {
//                 if (error) {
//                     reject(error);
//                     return;
//                 }

//                 resolve(results);
//                 connection.end();
//             });
//         });
//     });
// }

// export default executeQuery;
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'TZ1234',
  database: process.env.DB_NAME || 'alehZayis',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function executeQuery(query, params = []) {
  const [rows] = await pool.execute(query, params);
  return rows;
}
