import joi from 'joi';

export const signupSchema = joi.object({
    username: joi.string().trim().min(5).max(50).required(),
    name: joi.string().trim().min(3).max(50).required(),
    password: joi.string().trim().min(6).max(100).required(),
    age: joi.number().integer().min(0).max(120).required(),
    recoveryQuestion: joi.string().min(10).max(250).required(),
});

export const loginSchema = joi.object({
    username: joi.string().trim().min(5).max(50).required(),
    password: joi.string().trim().min(6).max(100).required()
})