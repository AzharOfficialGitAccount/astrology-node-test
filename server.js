const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./app/config/db');
require('dotenv').config();

const app = express();
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/users', require('./app/routes/user'));

const startServer = () => {
    const httpServer = http.createServer(app).listen(process.env.PORT, () => {
        console.info(`Server up successfully - port: ${process.env.PORT}`);
    });

    const closeHandler = () => {
        connection.end((err) => {
            if (err) {
                console.error('Error closing MySQL connection:', err);
            } else {
                console.info('MySQL connection closed');
            }
            httpServer.close(() => {
                console.info('Server is stopped successfully');
                process.exit(0);
            });
        });
    };

    process.on('SIGTERM', closeHandler);
    process.on('SIGINT', closeHandler);
};

startServer();
