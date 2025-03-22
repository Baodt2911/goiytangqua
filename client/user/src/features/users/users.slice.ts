import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type UserState = {
  name: string;
  email: string;
  gender: string;
  birthday: string;
};
const initialState: UserState = {
  name: "",
  email: "",
  gender: "",
  birthday: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        ...action.payload,
        birthday: new Date(action.payload.birthday).toISOString(),
      };
    },
  },
});
export default userSlice.reducer;
