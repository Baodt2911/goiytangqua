import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Flex, Spin, Button, Typography } from "antd";

import {
  getMessagesConversationAsync,
  getAllConversationsAsync,
} from "../../features/chat/chat.service";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import ConversationSidebar from "../../components/ConversationSidebar";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  getMessagesFailure,
  getMessagesStart,
  getMessagesSuccess,
  clearCurrentConversationId,
  setCurrentConversationId,
  clearMessages,
} from "../../features/chat/message.slice";
import {
  getConversationsStart,
  getConversationsSuccess,
  getConversationsFailure,
} from "../../features/chat/conversation.slice";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../features/socket/socket.service";

const ChatBotPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading } = useAppSelector(
    (state: RootState) => state.message
  );
  const streaming = useAppSelector(
    (state: RootState) => state.message.streaming
  );
  const currentConversationId = useAppSelector(
    (state: RootState) => state.message.currentConversationId
  );
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming]);

  // Remove automatic redirect - we'll show notification instead

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        dispatch(getMessagesStart());
        const { messages } = await getMessagesConversationAsync(activeId!);

        dispatch(getMessagesSuccess(messages));
        // Set current conversation ID when loading existing conversation
        dispatch(setCurrentConversationId(activeId!));
      } catch (error: any) {
        console.error(error);
        dispatch(getMessagesFailure(error.message));
      }
    };
    if (activeId) {
      fetchMessages();
    } else {
      // Clear conversation state when no active conversation (new chat)
      dispatch(clearCurrentConversationId());
    }
  }, [activeId, dispatch]);

  // Refresh conversation list and auto-select new conversation
  const refreshConversations = useCallback(async () => {
    try {
      dispatch(getConversationsStart());
      const { conversations } = await getAllConversationsAsync();
      dispatch(getConversationsSuccess(conversations));

      // Auto-select the newest conversation if we have one and no activeId
      if (conversations.length > 0 && !activeId) {
        const newestConversation = conversations[0]; // Assuming newest is first
        setActiveId(newestConversation._id);
      }
    } catch (error: any) {
      console.error(error);
      dispatch(getConversationsFailure(error.message));
    }
  }, [dispatch, activeId]);

  // Refresh conversations when currentConversationId changes (new conversation created)
  useEffect(() => {
    if (currentConversationId && !activeId) {
      // New conversation was created, refresh the list
      refreshConversations();
    }
  }, [currentConversationId, activeId, refreshConversations]);

  const handleNewChat = () => {
    setActiveId(null);
    dispatch(clearCurrentConversationId());
    dispatch(clearMessages());
  };

  const handleSelectConversation = (id: string) => {
    setActiveId(id);
  };

  // Show authentication notification if user is not authenticated
  if (!isAuthenticated) {
    return (
        <Card style={{ width: "50%", margin: "0 auto",marginTop:50 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
            }}
          >
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              Bạn cần phải đăng nhập để sử dụng chatbot
            </Typography.Title>
            <Typography.Text style={{ marginBottom: 32, fontSize: "16px" }}>
              Vui lòng đăng nhập để tiếp tục sử dụng tính năng chatbot AI
            </Typography.Text>
            <Flex gap={16}>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate("/auth/login")}
              >
                Đăng nhập
              </Button>
              <Button 
                size="large"
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
            </Flex>
          </div>
        </Card>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Flex gap={16} align="stretch">
        <div style={{ width: 320, maxWidth: 360 }}>
          <ConversationSidebar
            activeId={activeId}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
          />
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
                <>
                  {activeId === null && messages.length === 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#666",
                        fontSize: "16px",
                      }}
                    >
                      Bắt đầu cuộc trò chuyện mới với AI
                    </div>
                  )}
                  {messages?.map((m, index) => (
                    <MessageBubble key={index} message={m} />
                  ))}
                  {streaming?.content ? (
                    <MessageBubble
                      key="streaming"
                      message={{
                        _id: "streaming",
                        role: "assistant",
                        content: streaming.content,
                      }}
                      isStreaming={true}
                    />
                  ) : null}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <div
              style={{ borderTop: "1px solid #f0f0f0", background: "#fafafa" }}
            >
              <ChatInput
                onSend={(msg: string) =>
                  sendChatMessage({
                    msg,
                    conversationId: currentConversationId || undefined,
                  })
                }
              />
            </div>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
};

export default ChatBotPage;
