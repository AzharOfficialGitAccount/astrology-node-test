const { getConnection } = require('../config/db');

const transaction = async (callback) => {
    const dbConnection = getConnection();

    return new Promise((resolve, reject) => {
        dbConnection.beginTransaction(async (err) => {
            if (err) {
                console.error('Error beginning transaction:', err);
                reject(err);
                return;
            }
            try {
                const result = await callback(dbConnection);
                dbConnection.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        dbConnection.rollback(() => {
                            console.error('Transaction rolled back');
                            reject(err);
                        });
                    } else {
                        console.log('Transaction committed successfully');
                        resolve(result);
                    }
                });
            } catch (error) {
                console.error('Error in transaction callback:', error);
                dbConnection.rollback(() => {
                    console.error('Transaction rolled back');
                    reject(error);
                });
            }
        });
    });
};

module.exports = transaction;
