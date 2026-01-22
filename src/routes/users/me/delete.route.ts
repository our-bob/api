import type { FastifyInstance } from "fastify";
import { deleteMe } from "../../../service/user.service.js";

export default async function deleteUsersMeRoute(app: FastifyInstance) {
  app.delete("/", async (request, reply) => {
    const userId = request.user.sub;
    await deleteMe(userId);

    return reply.code(204).send();
  });
}
