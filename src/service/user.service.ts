import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { PatchMeSchema } from "../routes/users/me/patch.route.js";

export async function getMe(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function deleteMe(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

export async function patchMe(id: string, body: PatchMeSchema) {
  const [user] = await db
    .update(users)
    .set({ name: body.name, profileImage: body.profileImage })
    .where(eq(users.id, id))
    .returning();

  return user;
}
