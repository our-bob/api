import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ---------- ENUM ---------- */
/* ---------- ENUM ---------- */
/* ---------- ENUM ---------- */

export const groupRoleEnum = pgEnum("group_role", ["owner", "member"]);

export const mealTypeEnum = pgEnum("meal_type", [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

export const oauthProviderEnum = pgEnum("oauth_provider", [
  "naver",
  "kakao",
  "google",
]);

/* ---------- TABLES ---------- */
/* ---------- TABLES ---------- */
/* ---------- TABLES ---------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    provider: oauthProviderEnum("provider").notNull(),
    providerId: text("provider_id").notNull(),

    name: text("name").notNull(),
    profileImage: text("profile_image"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },

  /* ---------- CONSTRAINTS ---------- */
  /* ---------- CONSTRAINTS ---------- */
  /* ---------- CONSTRAINTS ---------- */
  (t) => ({
    providerUnique: uniqueIndex("users_provider_uidx").on(
      t.provider,
      t.providerId
    ),
  })
);

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: uuid("id").primaryKey().defaultRandom(),

  groupId: uuid("group_id")
    .references(() => groups.id, { onDelete: "cascade" })
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  role: groupRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  mealDate: date("meal_date").notNull(),
  mealType: mealTypeEnum("meal_type").notNull(),

  title: text("title").notNull(),
  photoUrl: text("photo_url"),

  // location
  latitude: text("latitude"),
  longitude: text("longitude"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mealGroups = pgTable(
  "meal_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    mealId: uuid("meal_id")
      .references(() => meals.id, { onDelete: "cascade" })
      .notNull(),

    groupId: uuid("group_id")
      .references(() => groups.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    uniqueMealGroup: uniqueIndex("meal_groups_uidx").on(t.mealId, t.groupId),
  })
);

// DB의 구조
// User ── GroupMember ── Group
//   │
//   └── Meal ── MealGroup ── Group
