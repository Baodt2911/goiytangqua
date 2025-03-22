import { Document } from "mongoose";
import { Filter } from "src/types";

export type FilterRequestDTO = Omit<Filter, keyof Document>;
