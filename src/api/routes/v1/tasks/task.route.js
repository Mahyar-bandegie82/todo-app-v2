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

const router = express.Router()

router.post('/api/v1/tasks/create', validatorMIddleware(tasksSchema), async (req, res) => {
    try {
        const data = req.body;
        if (!data.user_id) {
            return res.status(400).json({
                message: 'user_id is required to create a task'
            });
        }
        const newTask = await createTask(data);
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

router.get('/api/v1/tasks', validatorMIddleware(readTasksSchema), async (req, res) => {
    try {
        const data = req.body.user_id;
        if (!data) {
            return res.status(400).json({
                message: 'user_id is required to get tasks'
            });
        }
        const tasks = await getTasksByUserId({ user_id: data });
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

router.put('/api/v1/tasks/update', validatorMIddleware(updateTaskSchema), async (req, res) => {
    try{
        const data = req.body;
        if (!data.task_id) {
            return res.status(400).json({
                message: 'task_id is required to update a task'
            });
        }
        const updatedTask = await updateTasks(data);
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

router.delete('/api/v1/tasks/delete', validatorMIddleware(deleteTaskSchema), async (req, res) => {
    try {
        const data = req.body;
        if (!data.task_id || !data.user_id) {
            return res.status(400).json({
                message: 'task_id and user_id are required to delete a task'
            });
        }
        const deletedTask = await deleteTask(data);
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