import { Client } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

await client.connect();

export const db = drizzle(client);
