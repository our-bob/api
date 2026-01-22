import type { FastifyInstance } from "fastify";
import { findMeals } from "../../service/meal.service.js";

interface GetMealsQuery {
  query?: string;
  page?: number;
}

export default async function getMealsRoute(app: FastifyInstance) {
  app.get<{
    Querystring: GetMealsQuery;
  }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const { query, page } = request.query;

    const result = await findMeals(userId, query, page);

    return reply.code(200).send(result);
  });
}
