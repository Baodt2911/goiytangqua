import { Document } from "mongoose";
import { Relationship } from "src/types";

export type RelationshipRequestDTO = Omit<
  Relationship,
  keyof Document | "userId"
>;
