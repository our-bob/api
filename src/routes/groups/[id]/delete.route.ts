import type { FastifyInstance } from "fastify";
import { deleteGroupById } from "../../../service/group.service.js";

export default async function deleteGroupsIdRoute(app: FastifyInstance) {
  app.delete<{ Params: { id: string } }>("/", async (request, reply) => {
    const userId = request.user.sub;
    const groupId = request.params.id;

    await deleteGroupById(userId, groupId);

    return reply.code(204).send();
  });
}
