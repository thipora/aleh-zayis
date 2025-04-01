import mysql from 'mysql2';
import 'dotenv/config';

async function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            port: 3306,
            database: process.env.DB_NAME || 'alehZayis',
            password: process.env.DB_PASSWORD || 'TZ1234'
        });

        connection.connect(err => {
            if (err) {
                 reject(err);
                return;
            }

            connection.execute(query, params, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(results);
                connection.end();
            });
        });
    });
}

export default executeQuery;
