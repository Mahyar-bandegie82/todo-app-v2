
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function adminLogin(data) {
    const { user_name, password } = data;
    try {
        const user = await prisma.user.findUnique({
            where: { user_name: user_name }
        })
        if (!user) {
            console.log('User not found');
            throw new Error('invalid username or password');
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            console.log('Password does not match');
            throw new Error('invalid username or password');
        }
        if (!user.is_admin) {
            throw new Error('user is not admin');
        }
        return { id: user.id, user_name: user.user_name };
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function adminSignupUser(data) {
    data.password = await bcrypt.hash(data.password, 13);
    try {
        const userName = await prisma.user.findUnique({
            where: { user_name: data.user_name }
        })
        if (userName) throw new Error("username ia already taken")
        const newUser = await prisma.user.create({
            data: data
        })
        console.log(newUser)
        return newUser
    } catch (err) {
        console.log(err)
        throw err
    }
}
export async function createTasks(data, userId) {
    try {
        if (!userId) {
            throw new Error('user id is required')
        }
        const targetUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });
        if (!targetUser) {
            throw new Error('Target user does not exist');
        }
        const newTask = await prisma.todo.create({
            where: { id: targetUser.id },
            data: data
        })
        return newTask
    }
    catch (err) {
        console.log(err)
        throw err
    }

}

export async function adminUserLogin(data) {
    const { user_name, password } = data;
    try {
        const user = await prisma.user.findUnique({
            where: { user_name: user_name }
        })
        if (!user) {
            console.log('User not found');
            throw new Error('invalid username or password');
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            console.log('Password does not match');
            throw new Error('invalid username or password');
        }
        return { id: user.id, user_name: user.user_name };
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function editUserCred(changes) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { user_name: changes.original_user_name }
        });
        if (!existingUser) throw new AppError('User not found', 404);

        if (changes.user_name && changes.user_name !== existingUser.user_name) {
            const taken = await prisma.user.findFirst({
                where: { user_name: changes.original_user_name, id: { not: existingUser.id } }
            });
            if (taken) throw new AppError('Username is taken', 409);
        }

        const existingUserCopy = {}
        if (changes.user_name) existingUserCopy.user_name = changes.user_name
        if (changes.name) existingUserCopy.name = changes.name
        if (changes.password) existingUserCopy.password = await bcrypt.hash(changes.password, 13)
        if (changes.age) existingUserCopy.age = changes.age
        if (changes.recovery_question) existingUserCopy.recovery_question = changes.recovery_question
        if (changes.recovery_answer) existingUserCopy.recovery_answer = changes.recovery_answer

        const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: existingUserCopy
        })
        return updatedUser
    } catch (err) {
        throw err
    }

}

export async function getAllUsers() {
    try {
        const allUsers = await prisma.user.findMany()
        return allUsers
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export async function deleteUser(data) {
    try {
        const user = await prisma.user.findUnique({
            where: { user_name: data.user_name }
        })
        await prisma.todo.deleteMany({
            where: { user: { id: user.id } }
        });
        if (!user) {
            throw new Error('user doesnt exist')
        }

        await prisma.user.delete({ where: { id: user.id } })

    }
    catch (err) {
        throw err
    }
}

export async function getAllTasks() {
    try {
        const alltodos = await prisma.todo.findMany()
        return alltodos
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export async function createTaskAdmin(data) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: data.id }
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        delete data.id
        const newTask = await prisma.todo.create({
            data: {
                ...data,
                user_id: existingUser.id
            }
        });
        return newTask;
    }
    catch (err) {
        throw err
    }
}
export async function updateTasks(data) {
    try {
        const updatedTasks = prisma.todo.update({
            where: { id: data.id },
            data: data
        })
        return updatedTasks
    } catch(err){
        throw err
    }
}
export async function deleteTaskAdmin(data) {
    try{
        const deleted = prisma.todo.delete({
            where : {id : data.id}
        })
        return deleted
    }
    catch(err){
        throw err
    }
    
} 
// async function createAdmin() {
//     const newAdmin = await prisma.user.create({
//         data: {
//             user_name: "kirkhar",
//             name: "mahyar",
//             password: await bcrypt.hash('@MAhyar4613', 10), 
//             age: 24,
//             is_admin: true,
//             recovery_question: "What is your favorite cat name?",
//             recovery_answer: "makhmal",
//         },
//     });

//     return newAdmin;
// }

// console.log(createAdmin())