import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createTask(jsonData, userId) {
    try {
        if (!userId) {
            throw new Error('user_id is required to create a task');
        }
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        const newTask = await prisma.todo.create({
            data: {
                ...jsonData,
                user_id : userId
            }
            
        });
        return newTask;
    } catch (err) {
        console.error('Create Task Error:', err);
        throw err;
    }
}

export async function getTasksByUserId(userID) {
    try {
        const tasks = await prisma.todo.findMany({
            where: { user_id : userID} ,
        })
        tasks.sort((a, b) => a.id - b.id);
        return tasks;
    } catch (err) {
        console.error('Get Tasks Error:', err);
        throw err;
    }
}

export async function updateTasks(jsonData, userId) {
    try {
        let editedTask = {}
        const existingTask = await prisma.todo.findUnique({
            where: { id: jsonData.id , user_id : userId }
        });
        editedTask = {...existingTask}
        if(jsonData.task_title) [
            editedTask.task_title = jsonData.task_title
        ]
        if (jsonData.due_date) {
            editedTask.due_date = jsonData.due_date
        }

        const updatedTask = await prisma.todo.update({
            where: { id: jsonData.id , user_id : userId },
            data: editedTask
        });
        
        return updatedTask;
    } catch (err) {
        console.error('Update Task Error:', err);
        throw err;
    }
}

export async function deleteTask(jsonData, userId) {
    try {
        const deletedTask = await prisma.todo.delete({
            where: { id: jsonData.id , user_id : userId }
        });
        return deletedTask;
    } catch (err) {
        console.error('Delete Task Error:', err);
        throw err;
    }
}