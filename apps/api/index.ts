import fastify from 'fastify'
import cors from '@fastify/cors'
import { signupSchema, loginSchema } from './schemas/authSchema'
import { loginHandler } from './handlers/auth/login'
import { signupHandler } from './handlers/auth/signup'

const server = fastify()

server.register(cors, { origin: true })

// Signup
server.post('/signup', { schema: signupSchema }, signupHandler)

// Login
server.post('/login', { schema: loginSchema }, loginHandler)

// Reset Password
server.post('/resetPassword', async (request, reply) => {
  return reply.code(200).send({ message: 'EndPoint Reset' })
})

// Restore Password
server.post('/restorePassword', async (request, reply) => {
  return reply.code(200).send({ message: 'EndPoint Restore' })
})

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`✅ Server listening at ${address}`)
})
