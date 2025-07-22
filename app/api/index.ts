import fastify from 'fastify'
import cors from '@fastify/cors'

const server = fastify()
server.register(cors, { origin: true })

server.get('/ping',async (request, reply) => {
  //return 'pong' test con curl corretto
  const { t } = request.query as { t?: string}
  if(!t){
    return reply.code(400).send({ error: "Errore: Manca Value"})
  }

  return reply.send({ value : t })
})

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})