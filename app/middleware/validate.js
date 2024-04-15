const httpStatus = require('http-status');

const validate = (schema, source = 'body') => async (req, res, next) => {
    const data = req[source];
    const { error } = schema.validate(data);
    const valid = error == null;
    if (valid) {
        return next();
    } else {
        const { details } = error;
        const message = details.map((i) => i.message).join(',');
        return res.status(httpStatus.BAD_REQUEST).json({ msgCode: 'VALIDATION_ERROR', data: message });
    }
};

module.exports = {
    validate
};
