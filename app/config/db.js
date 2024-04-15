const mysql = require('mysql');
require('dotenv').config();

const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};

let connection;

function createConnection() {
    connection = mysql.createConnection(mysqlConfig);

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            return;
        }
        console.info('Connected to MySQL');
    });

    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Attempting to reconnect...');
            createConnection();
        }
    });
}

createConnection();

module.exports = {
    getConnection: () => connection
};
