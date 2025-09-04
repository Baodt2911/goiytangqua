import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RelationshipType } from "../../types/relationship.type";
type RelationshipState = {
  relationships: RelationshipType[];
  loading: boolean;
  error: string | null;
};
const initialState: RelationshipState = {
  relationships: [],
  loading: false,
  error: null,
};
const relationshipSlice = createSlice({
  name: "relationship",
  initialState,
  reducers: {
    // GET
    getRelationshipsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRelationshipsSuccess: (
      state,
      action: PayloadAction<RelationshipType[]>
    ) => {
      state.relationships = action.payload;
      state.loading = false;
    },
    getRelationshipsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE
    createRelationship: (state, action: PayloadAction<RelationshipType>) => {
      state.relationships.push(action.payload);
    },

    // UPDATE
    updateRelationship: (state, action: PayloadAction<RelationshipType>) => {
      const index = state.relationships.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.relationships[index] = action.payload;
      }
    },

    // DELETE
    deleteRelationship: (state, action: PayloadAction<string>) => {
      state.relationships = state.relationships.filter(
        (p) => p._id !== action.payload
      );
    },
  },
});
export const {
  getRelationshipsStart,
  getRelationshipsSuccess,
  getRelationshipsFailure,
  createRelationship,
  updateRelationship,
  deleteRelationship,
} = relationshipSlice.actions;
export default relationshipSlice.reducer;
