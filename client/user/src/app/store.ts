import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/user/user.slice";
import socketSlice from "../features/socket/socket.slice";
import notificationSlice from "../features/notification/notification.slice";
import authSlice from "../features/auth/auth.slice";
import themeSlice from "../features/theme/theme.slice";
import postSlice from "../features/post/post.slice";
import productSlice from "../features/product/product.slice";
import relationshipSlice from "../features/relationship/relationship.slice";
import conversationSlice from "../features/chat/conversation.slice";
import messageSlice from "../features/chat/message.slice";
import navigationSlice from "../features/navigation/navigation.slice";
import commentSlice from "../features/comment/comment.slice";
import filterSlice from "../features/filter/filter.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    user: userSlice,
    socket: socketSlice,
    notification: notificationSlice,
    post: postSlice,
    product: productSlice,
    relationship: relationshipSlice,
    conversation: conversationSlice,
    message: messageSlice,
    navigation: navigationSlice,
    comment: commentSlice,
    filter: filterSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
