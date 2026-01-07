import type { FastifyInstance } from "fastify";
import deleteMeRoute from "./me/delete-me.route.js";
import getMeRoute from "./me/get-me.route.js";
import patchMeRoute from "./me/patch-me.route.js";

export function userRoutes(fastify: FastifyInstance) {
  fastify.register(deleteMeRoute, { prefix: "/me" });
  fastify.register(getMeRoute, { prefix: "/me" });
  fastify.register(patchMeRoute, { prefix: "/me" });
}

export default userRoutes;
