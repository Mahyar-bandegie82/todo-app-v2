import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function signUpUser(jsonData){
    try {
        const newUser = await prisma.user.create({
            data : jsonData
        })
        console.log(newUser)
        return newUser
    } catch (err) {
        console.log(err)
        if (err.code === 'P2002') {
            const error = new Error('Username is already taken');
            console.log(error)
            throw err
        }
        throw err
    }
}