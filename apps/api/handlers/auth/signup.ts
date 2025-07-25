import { FastifyReply, FastifyRequest } from 'fastify'
import { User } from '@repo/types/src/user/user' //Usa questo USER e ROLE
import bcrypt from 'bcrypt'
import { PrismaClient, Prisma } from '@prisma/client'
import { SignupPayload } from '@repo/types/src/auth/auth'

const prisma = new PrismaClient()

const userBase: User = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: {
        id:true,
        email:true,
        name: true,
        role:true
    },
});
export type UserFromDb = Prisma.UserGetPayload<typeof userBase>

export const signupHandler = async (
    request: FastifyRequest<{Body: SignupPayload}>,
    reply: FastifyReply
    ) => {
    const {email, password, name, role } = request.body


    try {
        const existingUser = await prisma.user.findUnique({ where: {email}})
        
        if(existingUser) {
            return reply.code(409).send({error: "Email Alredy Registred"})
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data:  {
                email,
                password: hashedPassword,
                name, 
                role
            },
            select: {
                id:true,
                email:true,
                name:true,
                role:true
            }
        })
        return reply.code(201).send({ user: newUser})
    } catch (error) {
        return reply.code(500).send({error : "Huston, Abbiamo un Problema"})
    }
}