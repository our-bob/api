import "dotenv/config";
import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt-plugin.js";
import authPlugin from "./plugins/auth-plugin.js";
import cookiePlugin from "./plugins/cookie-plugin.js";
import routes from "./routes/index.js";
import corsPlugin from "./plugins/cors-plugin.js";

const fastify = await Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        singleLine: false,
      },
    },
  },
});

// plugins
await fastify.register(corsPlugin);
await fastify.register(cookiePlugin);
await fastify.register(jwtPlugin);
await fastify.register(authPlugin);

// routes
await fastify.register(routes, { prefix: "/v1" });

fastify.listen({ port: 3000 });
