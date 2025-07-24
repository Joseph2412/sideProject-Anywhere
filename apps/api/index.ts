import fastify from 'fastify'
import cors from '@fastify/cors'
import {User} from "@repo/types"
import {signupSchema, loginSchema} from "./schemas/authSchema"

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

server.post('/signup', {schema: signupSchema}, async (request, reply) => {
  return reply.code(200).send({ message: 'EndPoint SignUp' })
})

server.post('/login',{schema:loginSchema}, async (request, reply) => {
  return reply.code(200).send({ message: 'EndPoint login' })
})

server.post('/resetPassword', async (request, reply) => {
  return reply.code(200).send({ message: 'EndPoint Reset' })
})

server.post('/restorePassword', async (request, reply) => {
  return reply.code(200).send({ message: 'EndPoint Restore' })
})


server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})