import type { FastifyInstance } from "fastify";
import { deleteMealById } from "../../../service/meal.service.js";

export default async function deleteMealsIdRoute(app: FastifyInstance) {
  app.delete<{ Params: { id: string } }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const mealId = request.params.id;

    await deleteMealById(userId, mealId);

    return reply.code(204).send();
  });
}
