import { Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import { patchGroupById } from "../../../service/group.service.js";

const _Schema = Type.Optional(
  Type.Object({
    name: Type.String({ minLength: 1 }),
  })
);

export type PatchGroupSchema = Static<typeof _Schema>;

export default async function patchGroupsIdRoute(app: FastifyInstance) {
  app.patch<{ Params: { id: string } }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const groupId = request.params.id;

    const body = request.body as PatchGroupSchema;

    const result = await patchGroupById(userId, groupId, body);

    return reply.code(200).send(result);
  });
}
