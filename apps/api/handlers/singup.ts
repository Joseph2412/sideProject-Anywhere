import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient, Role } from 'generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const singupHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const {email, password, name } = request.body as {
        email: string
        password: string
        name: string
    }


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
                role: ROLE
            }
        })
    } 
}