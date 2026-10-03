import { Prisma } from "@prisma/client"
import Joi from "joi"

const tasksSchema = Joi.object({
  task_title: Joi.string().trim().max(255).optional(),
  due_date: Joi.date().iso().optional()
})

const readTasksSchema = Joi.object({
  user_id: Joi.number().integer().required()
})

const updateTaskSchema = Joi.object({
  id: Joi.number().integer().required(),
  task_title: Joi.string().trim().max(255).optional(),
  due_date: Joi.date().iso().optional()
})

const deleteTaskSchema = Joi.object({
  id: Joi.number().integer().required()
})


export {tasksSchema, readTasksSchema, updateTaskSchema, deleteTaskSchema}