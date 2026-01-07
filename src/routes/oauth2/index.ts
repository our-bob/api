import type { FastifyInstance } from "fastify";
import naverOAuth2Route from "./naver.route.js";

export default async function oAuth2Routes(app: FastifyInstance) {
  app.register(naverOAuth2Route, { prefix: "/naver" });
}
