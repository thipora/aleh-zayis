// utils/executeQuery.js
import db from '../config/db';

async function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.execute(query, params, (error, results) => {
            if (error) {
                console.log("Error executing query:", error);
                reject(error);
                return;
            }

            resolve(results);
        });
    });
}

export default executeQuery;