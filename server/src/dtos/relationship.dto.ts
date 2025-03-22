export type RelationshipRequestDTO = {
  name: string;
  relationshipType: string;
  anniversaries?: { name: string; date: { day: number; month: number } }[];
};
export type UpdateRelationshipRequestDTO = {
  name?: string;
  relationshipType?: string;
  anniversaries?: { name: string; date: { day: number; month: number } }[];
};
