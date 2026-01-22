import type { FastifyInstance } from "fastify";
import { findMealById } from "../../../service/meal.service.js";

export default async function getMealsIdRoute(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const mealId = request.params.id;

    const result = await findMealById(userId, mealId);

    if (!result) {
      return reply
        .code(404)
        .send({ code: "NOT_FOUND", message: "meal not found" });
    }

    return reply.code(200).send(result);
  });
}
