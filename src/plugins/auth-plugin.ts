import fp from "fastify-plugin";

const WHITE_LIST = ["/v1/oauth2", "/v1/health"];

export default fp(async (app) => {
  app.addHook("onRequest", async (request, reply) => {
    const url = request.raw.url ?? "";

    const isWhiteListed = WHITE_LIST.some((u) => url.startsWith(u));

    if (isWhiteListed) {
      return;
    }

    let token: string | undefined;

    // Cookie 확인
    if (request.cookies?.accessToken) {
      token = request.cookies.accessToken;
    }

    // Authorization header fallback
    if (!token && request.headers.authorization) {
      const [type, value] = request.headers.authorization.split(" ");
      if (type === "Bearer") {
        token = value;
      }
    }

    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });
});
