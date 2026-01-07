import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { generateState } from "../lib/utils.js";
import { NaverProfileType, NaverTokenType } from "../types/index.js";

const NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0/authorize";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_PROFILE_URL = "https://openapi.naver.com/v1/nid/me";

/**
 * @summary Naver Oauth2 authorized url
 * @returns url
 */
export function getAuthorizedUrl() {
  const state = generateState();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.NAVER_CLIENT_ID!,
    redirect_uri: process.env.NAVER_CALLBACK_URI!,
    state,
  });

  return `${NAVER_AUTH_URL}?${params.toString()}`;
}

/**
 * @summary Naver Oauth2 callback
 * @returns accessToken, refreshToken
 */
export async function handleNaverCallback(code: string, state: string) {
  // STEP 1.
  // code를 사용해서 token 요청
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    code,
    state,
  });

  const tokenRes = await fetch(`${NAVER_TOKEN_URL}?${params.toString()}`);

  if (!tokenRes.ok) {
    throw new Error("Failed to get naver token");
  }

  const token = (await tokenRes.json()) as NaverTokenType;

  // STEP 2.
  // access_token 사용해서 profile 조회
  const profileRes = await fetch(NAVER_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!profileRes.ok) {
    throw new Error("Failed to get naver profile");
  }

  const profile = (await profileRes.json()) as { response: NaverProfileType };
  const user = await upsertOAuth2User(
    profile.response.name,
    profile.response.profile_image,
    "naver",
    profile.response.id
  );

  return {
    user: user,
  };
}

async function upsertOAuth2User(
  name: string,
  profileImage: string,
  provider: "naver" | "kakao" | "google",
  providerId: string
) {
  const [user] = await db
    .insert(users)
    .values({
      name: name,
      profileImage: profileImage,
      provider: provider,
      providerId: providerId,
    })
    .onConflictDoUpdate({
      target: [users.provider, users.providerId],
      set: { updatedAt: new Date() },
    })
    .returning();

  return user;
}
