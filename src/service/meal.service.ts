import { and, eq, ilike } from "drizzle-orm";
import { db } from "../db/db.js";
import { meals } from "../db/schema.js";
import { CreateMealSchema } from "../routes/meals/post.route.js";
import { PatchMealSchema } from "../routes/meals/[id]/patch.route.js";

const PAGE_SIZE = 10;

export async function findMeals(
  userId: string,
  query: string | undefined,
  page: number | undefined
) {
  const _page = Math.max(1, page ?? 1);
  const offset = (_page - 1) * PAGE_SIZE;

  const conditions = [eq(meals.userId, userId)];

  if (query) {
    conditions.push(ilike(meals.title, `%${query}%`));
  }

  return await db
    .select()
    .from(meals)
    .where(and(...conditions))
    .limit(PAGE_SIZE)
    .offset(offset);
}

export async function createMeal(userId: string, body: CreateMealSchema) {
  const [meal] = await db
    .insert(meals)
    .values({
      userId: userId,
      title: body.title,
      photoUrl: body.photoUrl,
      mealDate: body.mealDate,
      mealType: body.mealType,
      latitude: body.latitude,
      longitude: body.longitude,
    })
    .returning();

  return meal;
}

export async function findMealById(userId: string, mealId: string) {
  const [meal] = await db
    .select()
    .from(meals)
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)));

  return meal;
}

export async function patchMealById(
  userId: string,
  mealId: string,
  body: PatchMealSchema
) {
  const updateData = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined)
  );

  const [meal] = await db
    .update(meals)
    .set({ ...updateData, updatedAt: new Date() })
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
    .returning();

  return meal;
}

export async function deleteMealById(userId: string, mealId: string) {
  await db
    .delete(meals)
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)));
}
