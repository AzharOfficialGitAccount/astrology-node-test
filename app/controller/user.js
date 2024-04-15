const transaction = require('../config/transaction');
const services = require('../services/common');
const httpStatus = require('http-status');
const passwordHash = require("../utils/password");
const ms = require('ms');
const authJwt = require("../middleware");
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = await transaction(async (dbConnection) => {
            const checkUser = await services.findByCondition('users', { email: email.toLowerCase() }, dbConnection);
            if (checkUser && checkUser.email === email.toLowerCase()) {
                throw new Error("User already exists");
            }
            const newUser = await services.create('users', {
                username,
                email: email.toLowerCase(),
                password: await passwordHash.generateHash(password)
            }, dbConnection);
            if (!newUser) {
                throw new Error("Failed to add user");
            }
            return newUser;
        });
        return res.status(httpStatus.OK).json({ msgCode: "SIGNUP_SUCCESSFUL", data: newUser });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msgCode: "INTERNAL_SERVER_ERROR" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkUserCondition = { email: email.toLowerCase() };

        const resultData = await transaction(async (dbConnection) => {
            const checkUser = await services.findByCondition('users', checkUserCondition, dbConnection);
            if (!checkUser) {
                throw new Error("Invalid credentials");
            }
            const isLogin = passwordHash.comparePassword(password, checkUser.password);
            if (!isLogin) {
                throw new Error("Invalid credentials");
            }
            const expiresIn = typeof process.env.TOKEN_EXPIRES_IN === 'string' ? ms(process.env.TOKEN_EXPIRES_IN) / 1000 : process.env.TOKEN_EXPIRES_IN;
            const tokenPayload = {
                id: checkUser.id,
                email,
            };
            const token = authJwt.generateAuthJwt({ ...tokenPayload }, expiresIn);
            if (!token) {
                throw new Error("Internal server error");
            }
            await services.updateByCondition('users', { id: checkUser.id }, { accessToken: token });
            delete checkUser.password;
            return { ...checkUser, accessToken: token };
        });
        return res.status(httpStatus.OK).json({ msgCode: "LOGIN_SUCCESSFUL", data: resultData });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.UNAUTHORIZED).json({ msgCode: "INVALID_CREDENTIALS" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, password } = req.body;

        const updatedUserData = {};

        if (username) {
            updatedUserData.username = username;
        }
        if (email) {
            updatedUserData.email = email;
        }
        if (password) {
            const hashedPassword = await passwordHash.generateHash(password);
            updatedUserData.password = hashedPassword;
        }
        await services.updateByCondition('users', { id: userId }, updatedUserData);
        return res.status(httpStatus.OK).json({ msgCode: "USER_UPDATED", data: updatedUserData });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msgCode: "INTERNAL_SERVER_ERROR" });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const deletedUser = await services.removeById('users', userId);
        if (!deletedUser) {
            return res.status(httpStatus.NOT_FOUND).json({ msgCode: "USER_NOT_FOUND" });
        }
        return res.status(httpStatus.OK).json({ msgCode: "USER_DELETED" });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msgCode: "INTERNAL_SERVER_ERROR" });
    }
};

