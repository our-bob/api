import type { FastifyInstance } from "fastify";
import userRoutes from "./users/index.js";

async function routes(fastify: FastifyInstance) {
  // health 체크 전용
  fastify.get("/health", async (_, reply) => {
    return reply.code(200).send({ status: "ok" });
  });

  fastify.register(userRoutes, { prefix: "/users" });
}

export default routes;
