const Joi = require('joi');

const Signup = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z]*$/, 'alphabets characters').min(1).max(30).trim().required(),
  email: Joi.string().email().min(5).max(100)
    .required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .required(),
});

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateProfile = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z]*$/, 'alphabets characters').min(1).max(30).trim().optional(),
  email: Joi.string().email().min(5).max(100)
    .optional(),
  password: Joi.string()
    .min(8)
    .max(20)
    .optional(),
});

module.exports = {
  Signup,
  login,
  updateProfile
};
