import { documents } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type DocumentSelect = InferSelectModel<typeof documents>;
export type DocumentInsert = InferInsertModel<typeof documents>;