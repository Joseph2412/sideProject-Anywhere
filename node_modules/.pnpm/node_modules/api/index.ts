import fastify from 'fastify'

const server = fastify()

server.get('/funge', async (request, reply) => {
  return 'FUNONZIAAAAAAA'
})

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})