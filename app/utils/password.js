const bcrypt = require('bcrypt');
require('dotenv').config();

let saltRounds = process.env.SALT_ROUND;

exports.generateHash = async (password) => {
    try {
        saltRounds = parseInt(saltRounds);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password.toString(), salt);
        return hash;
    } catch (err) {
        return err;
    }
};
exports.comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
