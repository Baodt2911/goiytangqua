import React, { useEffect, useState } from "react";
import { Card, Flex, Spin } from "antd";

import { getMessagesConversationAsync } from "../../features/chat/chat.service";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import ConversationSidebar from "../../components/ConversationSidebar";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  getMessagesFailure,
  getMessagesStart,
  getMessagesSuccess,
} from "../../features/chat/message.slice";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

const ChatBotPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { messages, loading } = useAppSelector(
    (state: RootState) => state.message
  );
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        dispatch(getMessagesStart());
        const { messages } = await getMessagesConversationAsync(activeId!);

        dispatch(getMessagesSuccess(messages));
      } catch (error: any) {
        console.error(error);
        dispatch(getMessagesFailure(error.message));
      }
    };
    if (activeId) {
      fetchMessages();
    }
  }, [activeId]);

  return (
    <div style={{ padding: 20 }}>
      <Flex gap={16} align="stretch">
        <div style={{ width: 320, maxWidth: 360 }}>
          <ConversationSidebar activeId={activeId!} onSelect={setActiveId} />
        </div>
        <Flex vertical style={{ flex: 1 }}>
          <Card styles={{ body: { padding: 0 } }}>
            <div
              style={{
                padding: 16,
                height: "70vh",
                overflowY: "auto",
                background: "#fff",
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                messages?.map((m, index) => (
                  <MessageBubble key={index} message={m} />
                ))
              )}
            </div>
            <div
              style={{ borderTop: "1px solid #f0f0f0", background: "#fafafa" }}
            >
              <ChatInput onSend={() => {}} />
            </div>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
};

export default ChatBotPage;
