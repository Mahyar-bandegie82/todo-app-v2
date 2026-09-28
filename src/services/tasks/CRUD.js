import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createTask(jsonData) {
    try {
        if (!jsonData.user_id) {
            throw new Error('user_id is required to create a task');
        }
        const existingUser = await prisma.user.findUnique({
            where: { id: jsonData.user_id }
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        const newTask = await prisma.todo.create({
            data: jsonData
        });
        return newTask;
    } catch (err) {
        console.error('Create Task Error:', err);
        throw err;
    }
}

export async function getTasksByUserId(jsonData) {
    try {
        const tasks = await prisma.todo.findMany({
            where: { user_id: jsonData.user_id }
        })
        tasks.sort((a, b) => a.id - b.id);
        return tasks;
    } catch (err) {
        console.error('Get Tasks Error:', err);
        throw err;
    }
}

export async function updateTasks(jsonData) {
    try {
        const editedTask = {}
        const existingTask = await prisma.todo.findUnique({
            where: { id: jsonData.task_id }
        });
        editedTask = {...existingTask}
        if (jsonData.task_title) {
            editedTask.task_title = jsonData.task_title
        }
        else {
            editedTask.task_title = existingTask.task_title
        }
        if (jsonData.due_date) {
            editedTask.due_date = jsonData.due_date
        }
        else {
            editedTask.due_date = existingTask.due_date
        }
        const updatedTask = await prisma.todo.update({
            where: { id: jsonData.task_id },
            data: editedTask
        });
        
        return updatedTask;
    } catch (err) {
        console.error('Update Task Error:', err);
        throw err;
    }
}

export async function deleteTask(jsonData) {
    try {
        const deletedTask = await prisma.todo.delete({
            where: { id: jsonData.task_id }
        });
        return deletedTask;
    } catch (err) {
        console.error('Delete Task Error:', err);
        throw err;
    }
}