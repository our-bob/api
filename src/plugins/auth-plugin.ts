import fp from "fastify-plugin";

const WHITE_LIST = ["/v1/oauth2", "/health"];

export default fp(async (app) => {
  app.addHook("onRequest", async (request, reply) => {
    const url = request.raw.url ?? "";

    const isWhiteListed = WHITE_LIST.some((u) => url.startsWith(u));

    if (isWhiteListed) {
      return;
    }

    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
});
