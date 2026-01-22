import type { FastifyInstance } from "fastify";
import { findGroupById } from "../../../service/group.service.js";

export default async function getGroupsIdRoute(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const groupId = request.params.id;

    const result = await findGroupById(userId, groupId);

    return reply.code(200).send(result);
  });
}
