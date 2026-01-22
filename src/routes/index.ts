import type { FastifyInstance } from "fastify";
import deleteUsersMeRoute from "./users/me/delete.route.js";
import getUsersMeRoute from "./users/me/get.route.js";
import patchUsersMeRoute from "./users/me/patch.route.js";
import getMealsRoute from "./meals/get.route.js";
import postMealsRoute from "./meals/post.route.js";
import patchMealsIdRoute from "./meals/[id]/patch.route.js";
import getMealsIdRoute from "./meals/[id]/get.route.js";
import deleteMealsIdRoute from "./meals/[id]/delete.route.js";
import getGroupsRoute from "./groups/get.route.js";
import postGroupsRoute from "./groups/post.route.js";
import getGroupsIdRoute from "./groups/[id]/get.route.js";
import patchGroupsIdRoute from "./groups/[id]/patch.route.js";
import deleteGroupsIdRoute from "./groups/[id]/delete.route.js";
import naverOAuth2Route from "./oauth2/naver.route.js";

async function routes(fastify: FastifyInstance) {
  // health 체크 전용
  fastify.get("/health", async (_, reply) => {
    return reply.code(200).send({ status: "ok" });
  });

  fastify.register(getMealsRoute, { prefix: "/meals" });
  fastify.register(postMealsRoute, { prefix: "/meals" });

  fastify.register(getMealsIdRoute, { prefix: "/meals/:id" });
  fastify.register(patchMealsIdRoute, { prefix: "/meals/:id" });
  fastify.register(deleteMealsIdRoute, { prefix: "/meals/:id" });

  fastify.register(getGroupsRoute, { prefix: "/groups" });
  fastify.register(postGroupsRoute, { prefix: "/groups" });

  fastify.register(getGroupsIdRoute, { prefix: "/groups/:id" });
  fastify.register(patchGroupsIdRoute, { prefix: "/groups/:id" });
  fastify.register(deleteGroupsIdRoute, { prefix: "/groups/:id" });

  fastify.register(getUsersMeRoute, { prefix: "/users/me" });
  fastify.register(patchUsersMeRoute, { prefix: "/users/me" });
  fastify.register(deleteUsersMeRoute, { prefix: "/users/me" });

  fastify.register(naverOAuth2Route, { prefix: "/oauth2/naver" });
}

export default routes;
