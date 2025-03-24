import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/db";
import { categories } from "@/db/schema";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    return db.select().from(categories);
  }),
});

