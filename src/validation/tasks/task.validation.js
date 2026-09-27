import Joi from "joi"

const tasksSchema = Joi.object({
  taskTitle: Joi.string().trim().min(10).max(255).optional(),
  dueDate: Joi.date().iso().optional()
})

export {tasksSchema}