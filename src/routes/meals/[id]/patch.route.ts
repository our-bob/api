import type { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { patchMealById } from "../../../service/meal.service.js";

const _Schema = Type.Partial(
  Type.Object({
    title: Type.String({ minLength: 1 }),
    photoUrl: Type.String({ format: "uri" }),
    latitude: Type.String(),
    longitude: Type.String(),
    mealDate: Type.String({ format: "date" }),
    mealType: Type.Union([
      Type.Literal("breakfast"),
      Type.Literal("lunch"),
      Type.Literal("dinner"),
      Type.Literal("snack"),
    ]),
  })
);
export type PatchMealSchema = Static<typeof _Schema>;

export default async function patchMealsIdRoute(app: FastifyInstance) {
  app.patch<{ Params: { id: string } }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const mealId = request.params.id;
    const body = request.body as PatchMealSchema;

    const result = await patchMealById(userId, mealId, body);

    return reply.code(200).send(result);
  });
}
