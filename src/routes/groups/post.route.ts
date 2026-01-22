import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import { createGroup } from "../../service/group.service.js";

const _Schema = Type.Object({
  name: Type.String({ minLength: 1 }),
});

export type CreateGroupSchema = Static<typeof _Schema>;

export default async function postGroupsRoute(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const userId = request.user.sub;
    const body = request.body as CreateGroupSchema;

    const result = await createGroup(userId, body);

    return reply.code(201).send(result);
  });
}
