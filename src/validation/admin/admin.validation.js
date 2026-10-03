import Joi from "joi";

const passwordRegex = /^(?=(?:.*[A-Z]){2,})(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export const loginAdmin = Joi.object({
  user_name: Joi.string().trim().min(5).max(50).required(),
  password: Joi.string().trim().min(6).max(100).required().pattern(passwordRegex)
})
export const createUserSchema = Joi.object({
  user_name: Joi.string().trim().min(5).max(50).required(),
  name: Joi.string().trim().min(3).max(50).required(),
  password: Joi.string().trim().min(8).max(50).required().pattern(passwordRegex),
  age: Joi.number().integer().min(10).max(120).required(),
  is_admin: Joi.boolean().optional(),
  recovery_question: Joi.string().min(10).max(250).required(),
  recovery_answer: Joi.string().required()
});

export const loginuser = Joi.object({
  user_name: Joi.string().trim().min(5).max(50).required(),
  password: Joi.string().trim().min(6).max(100).required().pattern(passwordRegex)
})

export const updateUserCredentials = Joi.object({
  original_user_name: Joi.string().trim().min(5).max(50).required(),
  user_name: Joi.string().trim().min(5).max(50).optional(),
  name: Joi.string().trim().min(3).max(50).optional(),
  password: Joi.string().trim().min(8).max(50).optional().pattern(passwordRegex),
  age: Joi.number().integer().min(10).max(120).optional(),
  is_admin: Joi.boolean().optional(),
  recovery_question: Joi.string().min(10).max(250).optional(),
  recovery_answer: Joi.string().optional()
});

export const deleteUserSchema = Joi.object({
  user_name: Joi.string().trim().min(5).max(50).required(),
});

export const createTasks = Joi.object({
  id: Joi.number().required(),
  task_title: Joi.string().trim().min(1).max(255).required(),
  due_date: Joi.date().iso().greater('now').optional()
});

export const editTask = Joi.object({
  id: Joi.number().required(),
  task_title: Joi.string().trim().min(1).max(255).optional(),
  due_date: Joi.date().iso().optional()
}).min(1)

export const deleteTaskSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

