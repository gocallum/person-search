'use server'

import { revalidatePath } from 'next/cache'
import { PrismaClient } from '@prisma/client'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import prisma  from '@/lib/prisma'


export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query)
    const results = await prisma.user.findMany({
        where: { name: { startsWith: query, mode: 'insensitive' } }
    })
    const validatedResults = results.map(user => userSchema.parse(user))
    console.log('Search results:', validatedResults)
    return validatedResults
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    // Check if user already exists by email or phone number
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                { phoneNumber: data.phoneNumber }
            ]
        }
    });

    if (existingUser) {
        throw new Error('User with this email or phone number already exists.');
    }

    // Create the new user if not found
    const newUser = await prisma.user.create({ data });

    // Validate the new user against the Zod schema
    return userSchema.parse(newUser);
}


export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
    console.log(`User with id ${id} has been deleted.`)
    revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const updatedUser = await prisma.user.update({
        where: { id },
        data
    })
    const validatedUser = userSchema.parse(updatedUser)
    console.log(`User with id ${id} has been updated.`)
    revalidatePath('/')
    return validatedUser
}

export const getUserById = cache(async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? userSchema.parse(user) : null
})
