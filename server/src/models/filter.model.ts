import { Schema, model } from "mongoose";
import { Filter } from "src/types";
const filterSchema = new Schema<Filter>({
  type: { type: String, required: true },
  options: [{ type: String }],
});
export default model<Filter>("filters", filterSchema);
