import type { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { createMeal } from "../../service/meal.service.js";

const _Schema = Type.Object({
  title: Type.String({ minLength: 1 }),
  photoUrl: Type.Optional(Type.String({ format: "uri" })),
  latitude: Type.Optional(Type.String()),
  longitude: Type.Optional(Type.String()),
  mealDate: Type.String({ format: "date" }),
  mealType: Type.Union([
    Type.Literal("breakfast"),
    Type.Literal("lunch"),
    Type.Literal("dinner"),
    Type.Literal("snack"),
  ]),
});

export type CreateMealSchema = Static<typeof _Schema>;

export default async function postMealsRoute(app: FastifyInstance) {
  app.post("/", { schema: { body: _Schema } }, async (request, reply) => {
    const userId = request.user.sub;
    const body = request.body as CreateMealSchema;

    const meal = await createMeal(userId, body);

    return reply.code(201).send(meal);
  });
}
