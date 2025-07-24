import { FastifyRequest, FastifyReply } from "fastify"
import { PrismaClient } from "generated/prisma"
import bcrypt from "bcrypt"
const Prisma = new PrismaClient()

export const  loginHandler = async (request:FastifyRequest, reply:FastifyReply) => {
    const { email, password } = request.body as {
        email:string
        password:string
    }

    try {
        const user = await Prisma.user.findUnique({
            where: { email }
        })

        //Blocco Errori se !user e !passWord Sbagliata
        if(!user) {
            return reply.code(401).send({error: "Email non corretta"})
        }
        const passwordFound = await bcrypt.compare(password, user.password)

        if(!passwordFound){
            return reply.code(401).send({ error: "PassoWord Errata"})
        }

        //Login Corretto. Ritorno l'utente con le specifiche
        return reply.send({ message:"Login Effettuato con Successo", 
            user:{
            id:user.id, 
            name:user.name, 
            email: user.email, 
            role:user.role
        }})

    }catch(error){
        console.error(error)
        return reply.code(500).send({ error: "Huston, Abbiamo un Problema"})
    }
}