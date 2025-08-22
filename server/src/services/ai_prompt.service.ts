import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AIPromptRequestDTO } from "src/dtos";
import { _aiPrompt } from "src/models";
export const createPromptService = async (data: AIPromptRequestDTO) => {
  try {
    await _aiPrompt.create(data);
    return {
      status: StatusCodes.CREATED,
      message: "Tạo prompt thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const changeActivePromptService = async (
  id: string,
  isActive: boolean
) => {
  try {
    const isUpdated = await _aiPrompt.findByIdAndUpdate(id, {
      $set: { isActive },
    });
    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Prompt không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: isActive ? "Đã bật prompt" : "Đã tắt prompt",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updatePromptService = async (
  id: string,
  data: Partial<AIPromptRequestDTO>
) => {
  try {
    let updateFields: Partial<AIPromptRequestDTO> = {};
    if (data.name) updateFields.name = data.name;
    if (data.aiModel) updateFields.aiModel = data.aiModel;
    if (data.aiProvider) updateFields.aiProvider = data.aiProvider;
    if (data.availableVariables)
      updateFields.availableVariables = data.availableVariables;
    if (data.categories) updateFields.categories = data.categories;
    if (data.defaultTags) updateFields.defaultTags = data.defaultTags;
    if (data.description) updateFields.description = data.description;
    if (data.maxTokens) updateFields.maxTokens = data.maxTokens;
    if (data.promptTemplate) updateFields.promptTemplate = data.promptTemplate;
    if (data.systemMessage) updateFields.systemMessage = data.systemMessage;
    if (data.targetWordCount)
      updateFields.targetWordCount = data.targetWordCount;
    if (data.temperature) updateFields.temperature = data.temperature;

    const isUpdated = await _aiPrompt.findByIdAndUpdate(id, {
      $set: updateFields,
    });

    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Prompt không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhật prompt thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getPromptService = async (promptId: string) => {
  try {
    const existingPrompt = await _aiPrompt.findById(promptId).lean();
    return {
      status: StatusCodes.OK,
      element: existingPrompt,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getAllPromptService = async () => {
  try {
    const existingPrompts = await _aiPrompt.find().lean();
    return {
      status: StatusCodes.OK,
      element: existingPrompts,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const deletePromptService = async (id: string) => {
  try {
    const isDeleted = await _aiPrompt.findByIdAndDelete(id);
    if (!isDeleted) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Prompt không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Xóa prompt thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
