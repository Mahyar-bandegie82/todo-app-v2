import express from 'express';
import { validatorMIddleware } from '../../../middleware/userSchemaValidation.js';
import { tasksSchema } from '../../../../validation/tasks/task.validation.js';
import { createTask } from '../../../../services/tasks/CRUD.js';
import { getTasksByUserId } from '../../../../services/tasks/CRUD.js';
import { readTasksSchema } from '../../../../validation/tasks/task.validation.js';
import { updateTasks } from '../../../../services/tasks/CRUD.js';
import { updateTaskSchema } from '../../../../validation/tasks/task.validation.js';
import { deleteTaskSchema } from '../../../../validation/tasks/task.validation.js';
import { deleteTask } from '../../../../services/tasks/CRUD.js';
import validateJWT from '../../../middleware/jwtvalidation.js';

const router = express.Router()

router.use(validateJWT)

router.post('/create', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = tasksSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const userId = req.user
        if (!userId) {
            return res.status(400).json({
                message: 'user_id is required to create a task'
            });
        }
        const newTask = await createTask(value, userId);
        return res.status(200).json({
            message: 'Task created successfully',
            task: newTask
        });
    } catch (err) {
        console.error('Create Task Error:', err);
        return res.status(500).json({
            message: 'Error creating task'
        });
    }
})

router.get('/gettasks', async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(400).json({
                message: 'user_id is required to get tasks'
            });
        }
        const tasks = await getTasksByUserId(userId);
        return res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks: tasks
        });
    } catch (err) {
        console.error('Get Tasks Error:', err);
        return res.status(500).json({
            message: 'Error retrieving tasks'
        });
    }
});

router.put('/update', async (req, res) => {
    try {
        const data = req.body;
        const { error, value } = updateTaskSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const userId = req.user
        if (!value.id || !userId) {
            return res.status(400).json({
                message: 'task_id and userid is required to update a task'
            });
        }
        const updatedTask = await updateTasks(value, userId);
        return res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (err) {
        console.error('Update Task Error:', err);
        return res.status(500).json({
            message: 'Error updating task'
        });
    }
});

router.delete('/delete', async (req, res) => {
    try {
       const data = req.body;
        const { error, value } = deleteTaskSchema.validate(data, { abortEarly: false });
        if (error) {
            return res.status(402).json({ error: error.details.map(err => err.message) })
        }
        const userid = req.user
        if (!value.id || !userid) {
            return res.status(400).json({
                message: 'task_id and user_id are required to delete a task'
            });
        }
        const deletedTask = await deleteTask(value);
        return res.status(200).json({
            message: 'Task deleted successfully',
            task: deletedTask
        });
    } catch (err) {
        console.error('Delete Task Error:', err);
        return res.status(500).json({
            message: 'Error deleting task'
        });
    }
});
export default router;