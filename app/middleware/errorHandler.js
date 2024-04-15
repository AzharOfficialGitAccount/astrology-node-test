const HttpStatus = require('http-status');

exports.notFound = (req, res) => {
    res.status(HttpStatus.NOT_FOUND).json({
        error: {
            msgCode: 'NOT_FOUND'
        }
    });
};

exports.methodNotAllowed = (req, res) => {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
        error: {
            msgCode: 'INVALID_ROUTE'
        }
    });
};
