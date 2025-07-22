// index.ts
import fastify from "fastify";
var server = fastify();
server.get("/ping", async (request, reply) => {
  const { t } = request.query;
  if (!t) {
    return reply.code(400).send({ error: "Errore" });
  }
  return reply.send({ value: t });
});
server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
