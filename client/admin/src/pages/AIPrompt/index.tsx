import React, { useState } from "react";
import AIPromptCard from "../../components/AIPromptCard";
import AIPromptForm from "../../components/AIPromptForm";
import ModalSchedule from "../../components/ModalSchedule";

const AIPrompt: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(true);
  const handleCancelModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  return (
    <div>
      <ModalSchedule open={true} />
      <AIPromptForm open={isOpenModal} onCancel={handleCancelModal} />
      <AIPromptCard
        data={{
          name: "Daily Tech News",
          promptTemplate:
            "Write a comprehensive tech news summary for {date} focusing on {topics}. Include the latest developments in AI, blockchain, and mobile technology... ",
          description: "This is a description of the prompt",
          systemMessage: "You are a helpful assistant",
          aiProvider: "openai",
          aiModel: "gpt-4",
          temperature: 0.5,
          maxTokens: 1000,
          defaultTags: ["tech", "news"],
          targetWordCount: 100,
          availableVariables: ["name", "age"],
          categories: ["article"],
          isActive: true,
        }}
        onOpenModalEdit={handleOpenModal}
      />
    </div>
  );
};

export default AIPrompt;
