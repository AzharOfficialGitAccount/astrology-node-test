const db = require('../config/db');

const create = async (table, details) => {
    try {
        const connection = db.getConnection();
        const result = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO ?? SET ?', [table, details], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return result.insertId;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const updateByCondition = async (table, condition, content) => {
    try {
        const connection = db.getConnection();
        const result = await new Promise((resolve, reject) => {
            connection.query('UPDATE ?? SET ? WHERE ?', [table, content, condition], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return result.affectedRows;
    } catch (err) {
        console.error(err);
        return false;
    }
};

const removeById = async (table, id) => {
    try {
        const connection = db.getConnection();
        const result = await new Promise((resolve, reject) => {
            connection.query('DELETE FROM ?? WHERE id = ?', [table, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return result.affectedRows;
    } catch (err) {
        console.error(err);
        return false;
    }
};


const findByCondition = async (table, condition) => {
    try {
        const connection = db.getConnection();
        const result = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ?? WHERE ?', [table, condition], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length ? results[0] : null);
                }
            });
        });
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
};



module.exports = {
    create,
    updateByCondition,
    removeById,
    findByCondition
};
