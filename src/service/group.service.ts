import { and, eq, exists, ilike, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { groupMembers, groups } from "../db/schema.js";
import { CreateGroupSchema } from "../routes/groups/post.route.js";
import { PatchGroupSchema } from "../routes/groups/[id]/patch.route.js";

const PAGE_SIZE = 10;

export async function findGroups(
  userId: string,
  query: string | undefined,
  page: number | undefined
) {
  const _page = Math.max(1, page ?? 1);
  const offset = (_page - 1) * PAGE_SIZE;

  const conditions = [eq(groupMembers.userId, userId)];

  if (query) {
    conditions.push(ilike(groups.name, `%${query}%`));
  }

  return await db
    .select()
    .from(groups)
    .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .where(and(...conditions))
    .limit(PAGE_SIZE)
    .offset(offset);
}

export async function createGroup(userId: string, body: CreateGroupSchema) {
  return await db.transaction(async (tx) => {
    const [group] = await tx
      .insert(groups)
      .values({ name: body.name })
      .returning();

    await tx.insert(groupMembers).values({
      userId,
      groupId: group.id,
      role: "owner",
    });

    return group;
  });
}

export async function findGroupById(userId: string, groupId: string) {
  const [group] = await db
    .select()
    .from(groups)
    .where(and(eq(groups.id, groupId)));
}
export async function patchGroupById(
  userId: string,
  groupId: string,
  body: PatchGroupSchema
) {
  const updateData = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined)
  );

  const [group] = await db
    .update(groups)
    .set({ ...updateData, updatedAt: new Date() })
    .from(groupMembers)
    .where(
      and(
        eq(groups.id, groupMembers.groupId),
        eq(groupMembers.userId, userId),
        eq(groupMembers.role, "owner"),
        eq(groups.id, groupId)
      )
    )
    .returning();

  return group;
}

export async function deleteGroupById(userId: string, groupId: string) {
  await db.delete(groups).where(
    and(
      eq(groups.id, groupId),
      exists(
        db
          .select({ one: sql`1` })
          .from(groupMembers)
          .where(
            and(
              eq(groupMembers.groupId, groups.id),
              eq(groupMembers.userId, userId),
              eq(groupMembers.role, "owner")
            )
          )
      )
    )
  );
}
