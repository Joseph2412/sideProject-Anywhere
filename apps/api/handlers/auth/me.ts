import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../libs/prisma";

export const meHandler = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const userId = (request.user as any).id;
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        
        if (!user) {
            return reply.code(404).send({ error: "Utente non trovato" });
        }
        
        return reply.send(user);
    } catch (error) {
        console.error("Error in meHandler:", error);
        return reply.code(500).send({ error: "Errore server" });
    }
};