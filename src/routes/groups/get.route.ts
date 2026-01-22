import type { FastifyInstance } from "fastify";
import { findGroups } from "../../service/group.service.js";

interface GetMealsQuery {
  query?: string;
  page?: number;
}

export default async function getGroupsRoute(app: FastifyInstance) {
  app.get<{
    Querystring: GetMealsQuery;
  }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const { query, page } = request.query;

    const result = await findGroups(userId, query, page);

    return reply.code(200).send(result);
  });
}
