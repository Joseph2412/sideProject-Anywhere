import fastify from 'fastify'

const server = fastify()
//To Do
//Esporre un endpoint GET /ping su BE, l'endooint legge un parametro t in queryString e ritorna un JSON
// {
//   "value": t
// }
// Sul front effettuare una chiamata alla GET /ping?t=xxx, aspettare la risposta e mostrare a schermo il valore tornato da value
// Fare in modo che la chiamata punti all'ambiente di sviluppo corretto in base allo script lanciato

//Idea: Modifico con queryString => richiamo il value Corretto t: tipo Stringa
//Se value corretto => risposta 200?
//Ritorno tipo JSON e mando value : t
//Ho scritto una cazzata? Forse


server.get('/ping', async (request, reply) => {
  //return 'pong' test con curl corretto
})

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})