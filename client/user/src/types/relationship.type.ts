export type RelationshipType = {
  _id: string;
  name: string;
  relationshipType: string;
  preferences?: string[];
  anniversaries: {
    name: string;
    date: {
      day: number;
      month: number;
    };
  }[];
};
