import Joi from 'joi'

const passwordRegex = /^(?=(?:.*[A-Z]){2,})(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const signupSchema = Joi.object({
    user_name: Joi.string().trim().min(5).max(50).required(),
    name: Joi.string().trim().min(3).max(50).required(),
    password: Joi.string().trim().min(8).max(50).required().pattern(passwordRegex),
    age: Joi.number().integer().min(10).max(120).required(),
    recovery_question: Joi.string().min(10).max(250).required(),
    recovery_answer: Joi.string().required()
});

export const loginSchema = Joi.object({
    username: Joi.string().trim().min(5).max(50).required(),
    password: Joi.string().trim().min(6).max(100).required().pattern(passwordRegex)
})

export const editUserSchema = Joi.object({
    user_name: Joi.string().trim().min(5).max(50),
    name: Joi.string().trim().min(3).max(50),
    password: Joi.string().trim().min(8).max(50).optional().pattern(passwordRegex),
    age: Joi.number().integer().min(10).max(120),
    recovery_question: Joi.string().min(10).max(250).optional(),
    recovery_answer: Joi.string().optional()
})

export const deleteUserSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});
