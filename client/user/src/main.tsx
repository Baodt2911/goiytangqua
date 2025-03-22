import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css";
import "./assets/styles/index.css";
import { SocketProvider } from "./contexts/socket/socket.provider.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </StrictMode>
);
