import type { FastifyInstance } from "fastify";
import userRoutes from "./users/index.js";
import oAuth2Routes from "./oauth2/index.js";

async function routes(fastify: FastifyInstance) {
  // health 체크 전용
  fastify.get("/health", async (_, reply) => {
    return reply.code(200).send({ status: "ok" });
  });

  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(oAuth2Routes, { prefix: "/oauth2" });
}

export default routes;
