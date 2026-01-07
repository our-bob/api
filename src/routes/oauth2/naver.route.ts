import type { FastifyInstance } from "fastify";
import {
  getAuthorizedUrl,
  handleNaverCallback,
} from "../../service/oauth2-service.js";

export default async function naverOAuth2Route(app: FastifyInstance) {
  app.get("/", async (_, reply) => {
    const url = getAuthorizedUrl();
    return reply.redirect(url);
  });

  app.get("/callback", async (req, reply) => {
    const { code, state } = req.query as {
      code?: string;
      state?: string;
    };

    if (!code || !state) {
      return reply.status(400).send({ message: "Invalid callback" });
    }

    const result = await handleNaverCallback(code, state);

    const accessToken = app.jwt.sign(
      { sub: result.user!.id!, type: "access_token" },
      { expiresIn: "30d" }
    );

    const refreshToken = app.jwt.sign(
      { sub: result.user!.id!, type: "refresh_token" },
      { expiresIn: "30d" }
    );

    // access token 쿠키
    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: false, // 개발환경
      sameSite: "lax",
      path: "/",
    });

    // refresh token 쿠키
    reply.setCookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    // 프론트로 이동
    return reply.redirect(process.env.OAUTH2_REDIRECT_URL!);
  });
}
