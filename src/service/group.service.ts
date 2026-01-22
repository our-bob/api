import { and, eq, exists, ilike, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { groupMembers, groups, users } from "../db/schema.js";
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
    .select({
      id: groups.id,
      name: groups.name,
      createdAt: groups.createdAt,
      memberCount: sql<number>`count(${groupMembers.userId})`.as("memberCount"),
    })
    .from(groups)
    .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .where(and(...conditions))
    .groupBy(groups.id)
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
    .select({
      id: groups.id,
      name: groups.name,
      createdAt: groups.createdAt,
    })
    .from(groups)
    .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
    .where(and(eq(groups.id, groupId), eq(groupMembers.userId, userId)));

  const members = await db
    .select({
      id: groupMembers.id,
      role: groupMembers.role,
      name: users.name,
      profileImg: users.profileImage,
    })
    .from(groupMembers)
    .innerJoin(users, eq(groupMembers.userId, users.id))
    .where(eq(groupMembers.groupId, groupId));

  return { group, members };
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
