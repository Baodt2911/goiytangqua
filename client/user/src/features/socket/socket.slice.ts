import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
  error: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  error: null,
};

const socketSlice = createSlice({
  name: "sockets",
  initialState,
  reducers: {
    setConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
    },
    setSocketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setDisconnected, setSocketError } =
  socketSlice.actions;
export default socketSlice.reducer;
