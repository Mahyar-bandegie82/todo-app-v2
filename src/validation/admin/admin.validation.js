import Joi from "joi";

const passwordRegex = /^(?=(?:.*[A-Z]){2,})(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const createUserSchema = Joi.object({
    username: Joi.string().trim().min(5).max(50).required(),
    name: Joi.string().trim().min(3).max(50).required(),
    password: Joi.string().trim().min(8).max(50).required().pattern(passwordRegex),
    age: Joi.number().integer().min(10).max(120).required(),
    isAdmin : Joi.boolean().required(),
    recoveryQuestion: Joi.string().min(10).max(250).required(),
    recoveryAnswer: Joi.string().required()
});

export const updateUserCredentials = Joi.object({
    username: Joi.string().trim().min(5).max(50),
    name: Joi.string().trim().min(3).max(50),
    password: Joi.string().trim().min(8).max(50).optional().pattern(passwordRegex),
    age: Joi.number().integer().min(10).max(120),
    isAdmin : Joi.boolean(),
    recoveryQuestion: Joi.string().min(10).max(250).optional(),
    recoveryAnswer: Joi.string().optional()
});

export const deleteUserSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});

export const createTasks = Joi.object({
  taskTitle: Joi.string().trim().min(1).max(255).required(),
  dueDate: Joi.date().iso().greater('now').optional()
});

export const editTask = Joi.object({
  taskTitle: Joi.string().trim().min(1).max(255).optional(),
  dueDate: Joi.date().iso().optional()
}).min(1)

export const deleteTaskSchema = Joi.object({
  taskId: Joi.number().integer().positive().required()
});