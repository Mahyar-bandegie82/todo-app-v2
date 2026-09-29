import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function signUpUser(jsonData) {
    jsonData.password = await bcrypt.hash(jsonData.password, 13);
    try {
        const userName = await prisma.user.findUnique({
            where: { user_name: jsonData.user_name}
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
        return { user_name: user.user_name }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function editUser(jsonData) {
    try {
        if (!jsonData.user_name) {
            throw new Error('user_name is required to edit user');
        }
        if (jsonData.changed_user_name) {
            const existingUser = await prisma.user.findUnique({
                where: { user_name: jsonData.changed_user_name }
            });
            if (existingUser) {
                throw new Error('Username is already taken');
            }
        }

        const requestedUser = await prisma.user.findUnique({
            where: { user_name: jsonData.user_name }
        })

        if (!requestedUser) {
            throw new Error('User not found');
        }

        requestedUser.user_name = jsonData.changed_user_name ? jsonData.changed_user_name : requestedUser.user_name;
        requestedUser.user_name = jsonData.changed_user_name ? jsonData.changed_user_name : requestedUser.user_name;
        requestedUser.name = jsonData.name ? jsonData.name : requestedUser.name;
        requestedUser.password = jsonData.password ? await bcrypt.hash(jsonData.password, 13) : requestedUser.password;
        requestedUser.age = jsonData.age ? jsonData.age : requestedUser.age;
        requestedUser.recovery_question = jsonData.recovery_question ? jsonData.recovery_question : requestedUser.recovery_question;
        requestedUser.recovery_answer = jsonData.recovery_answer ? jsonData.recovery_answer : requestedUser.recovery_answer;

        const updatedUser = await prisma.user.update({
            where: { user_name: jsonData.user_name },
            data: requestedUser
        })
        return updatedUser

    }
    catch (err) {
        console.log(err)
        throw err
    }
}