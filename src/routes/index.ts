import type { FastifyInstance } from "fastify";

async function routes(fastify: FastifyInstance) {
  fastify.get("/health", async (_, reply) => {
    return reply.code(200).send({ status: "ok" });
  });
}

export default routes;
