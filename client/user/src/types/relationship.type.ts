import { Dayjs } from "dayjs";

export type RelationshipType = {
  _id: string;
  name: string;
  relationshipType: string;
  preferences?: string[];
  anniversaries: {
    name: string;
    date:
      | Dayjs
      | {
          day: number;
          month: number;
        };
  }[];
};
