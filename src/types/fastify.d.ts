// src/types/fastify.d.ts
import "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      type: "access_token" | "refresh_token";
    };
    user: {
      sub: string;
      type: "access_token" | "refresh_token";
    };
  }
}
