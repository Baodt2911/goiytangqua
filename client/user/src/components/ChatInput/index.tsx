import React, { useRef, useState } from "react";
import { Button, Flex, Input, Space, Tag, Tooltip } from "antd";
import {
  PaperClipOutlined,
  SmileOutlined,
  AudioOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
const ChatInput: React.FC<{ onSend: (text: string) => void }> = ({
  onSend,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<any>(null);
  const suggestions = [
    { text: "Gợi ý quà tặng cho người yêu", color: "magenta" },
    { text: "Quà tặng sinh nhật cho bạn thân", color: "geekblue" },
    { text: "Quà tặng cho người lớn tuổi", color: "gold" },
    { text: "Gợi ý quà tặng cho trẻ em", color: "green" },
    { text: "Quà tặng cho đồng nghiệp", color: "cyan" },
    { text: "Gợi ý quà tặng handmade", color: "orange" },
    { text: "Quà tặng cho người thích thể thao", color: "red" },
    { text: "Gợi ý quà tặng cho người thích đọc sách", color: "purple" },
    { text: "Quà tặng cho người thích nấu ăn", color: "volcano" },
    { text: "Gợi ý quà tặng cho người thích du lịch", color: "lime" },
    { text: "Quà tặng cho người thích âm nhạc", color: "blue" },
    { text: "Gợi ý quà tặng cho người thích công nghệ", color: "geekblue" },
  ];
  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    inputRef.current?.focus();
  };
  const handlePick = (s: string) => {
    if (!value) setValue(s);
    else setValue((prev) => `${prev} ${s}`);
    setTimeout(() => inputRef.current?.focus?.(), 0);
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div style={{ padding: 12 }}>
      <Flex wrap="wrap" gap={8} style={{ marginBottom: 8 }}>
        {suggestions.map((s) => (
          <Tag
            key={s.text}
            color={s.color as any}
            style={{ cursor: "pointer", borderRadius: 16, padding: "4px 10px" }}
            onClick={() => handlePick(s.text)}
          >
            {s.text}
          </Tag>
        ))}
      </Flex>
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 14,
          padding: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <Flex align="center" justify="space-between" gap={8}>
          <Space>
            <Tooltip title="Đính kèm">
              <Button type="text" icon={<PaperClipOutlined />} />
            </Tooltip>
            <Tooltip title="Biểu cảm">
              <Button type="text" icon={<SmileOutlined />} />
            </Tooltip>
            <Tooltip title="Thu âm">
              <Button type="text" icon={<AudioOutlined />} />
            </Tooltip>
          </Space>
          <Flex align="center" gap={8} style={{ flex: 1 }}>
            <Input.TextArea
              ref={inputRef as any}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              placeholder="Bạn đang nghĩ gì?"
              onKeyDown={onKeyDown}
              style={{ border: "none", boxShadow: "none" }}
            />
          </Flex>
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            disabled={!value.trim()}
            onClick={handleSend}
          />
        </Flex>
      </div>
    </div>
  );
};
export default ChatInput;
