import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (app) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
  });
});
