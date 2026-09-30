import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function signUpUser(jsonData) {
    jsonData.password = await bcrypt.hash(jsonData.password, 13);
    try {
        const userName = await prisma.user.findUnique({
            where: { user_name: jsonData.user_name }
        })
        if (userName) throw new Error("username ia already taken")
        const newUser = await prisma.user.create({
            data: jsonData
        })
        console.log(newUser)
        return newUser
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function loginUser(jsonData) {
    const { user_name, password } = jsonData;
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

export async function editUser(userID, changes) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: userID }
        });
        if (!existingUser) throw new AppError('User not found', 404);

        if (changes.user_name && changes.user_name !== existingUser.user_name) {
            const taken = await prisma.user.findFirst({
                where: { user_name: changes.user_name, id: { not: userID } }
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
            where: { id: userID },
            data: existingUserCopy
        })
        return updatedUser

    }
    catch (err) {
        console.log(err)
        throw err
    }
}