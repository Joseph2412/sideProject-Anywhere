import { FastifyRequest, FastifyReply } from "fastify";

export const profileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.user as {
    id: number;
    email: string;
    role: "USER" | "HOST";
    name?: string;
  };

  if (!user) {
    return reply.code(401).send({ message: "Utente non autenticato" });
  }

  return reply.send({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? "Utente",
    },
  });
};
