"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const server = (0, fastify_1.default)();
server.register(cors_1.default, { origin: true });
server.get('/ping', async (request, reply) => {
    //return 'pong' test con curl corretto
    const { t } = request.query;
    if (!t) {
        return reply.code(400).send({ error: "Errore: Manca Value" });
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
