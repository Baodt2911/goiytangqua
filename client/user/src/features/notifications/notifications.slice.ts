import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Notification = {
  _id: string;
  relationshipId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};
type NotificationState = {
  list: Notification[];
};
const initialState: NotificationState = {
  list: [],
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification[]>) => {
      state.list = action.payload;
    },
  },
});
export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
