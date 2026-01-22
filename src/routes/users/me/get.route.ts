import type { FastifyInstance } from "fastify";
import { getMe } from "../../../service/user.service.js";

export default async function getUsersMeRoute(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const userId = request.user.sub;
    const user = await getMe(userId);

    return reply.code(200).send(user);
  });
}
