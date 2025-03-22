import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/users/users.slice";
import socketSlice from "../features/sockets/sockets.slice";
import notificationSlice from "../features/notifications/notifications.slice";
import authSlice from "../features/auth/auth.slice";
import themeSlice from "../features/theme/theme.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    users: userSlice,
    sockets: socketSlice,
    notifications: notificationSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
