import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../types/user.type";
export type UserState = UserType;
const initialState: UserState = {
  email: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;
