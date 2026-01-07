import type { FastifyInstance } from "fastify";
import { patchMe } from "../../../service/user-service.js";
import { Static, Type } from "@sinclair/typebox";

const _PatchMeSchema = Type.Object({
  name: Type.String(),
  profileImage: Type.String(),
});

export type PatchMeSchema = Static<typeof _PatchMeSchema>;

export default async function patchMeRoute(app: FastifyInstance) {
  app.patch(
    "/",
    { schema: { body: _PatchMeSchema } },
    async (request, reply) => {
      const userId = request.user.sub;
      const body = request.body as PatchMeSchema;

      const updatedUser = await patchMe(userId, body);

      return reply.code(200).send({
        result: "success",
        message: "User updated",
        user: updatedUser,
      });
    }
  );
}
