import type { FastifyInstance } from "fastify";
import { getMe } from "../../../service/user-service.js";

export default async function getMeRoute(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const userId = request.user.sub;
    const user = await getMe(userId);

    return reply.code(200).send({
      result: "success",
      message: "User retrieved",
      user: user,
    });
  });
}
