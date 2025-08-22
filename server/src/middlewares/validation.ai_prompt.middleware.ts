import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AIPromptRequestDTO } from "src/dtos";
import { isValidString } from "src/utils";
export const validateAIPromptRequest = (
  req: Request<{}, {}, AIPromptRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const {
    name,
    promptTemplate,
    description,
    aiProvider,
    aiModel,
    temperature,
    maxTokens,
    systemMessage,
    categories,
    defaultTags,
    targetWordCount,
    availableVariables,
  } = req.body;

  if (!isValidString(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `name không hợp lệ`,
    });
  }

  if (!isValidString(promptTemplate)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `promptTemplate không hợp lệ`,
    });
  }

  if (description && !isValidString(description)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `description không hợp lệ`,
    });
  }

  if (!["openai", "claude", "gemini"].includes(aiProvider)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `aiProvider không hợp lệ. aiProvider chỉ bao gồm openai | claude | gemini`,
    });
  }

  if (!isValidString(aiModel)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `aiModel không hợp lệ`,
    });
  }

  if (!isNaN(temperature) && typeof temperature !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "temperature phải là số",
    });
  }

  if (!isNaN(maxTokens) && typeof maxTokens !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "temperature phải là số",
    });
  }

  if (systemMessage && !isValidString(systemMessage)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `systemMessage không hợp lệ`,
    });
  }

  if (!["chatbot", "gift", "notification", "article"].includes(categories)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `categories không hợp lệ. categories chỉ bao gồm"chatbot" | "gift" | "notification" | "article"`,
    });
  }

  if (!Array.isArray(defaultTags)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message:
        "defaultTags phải là một mảng (vd: defaultTags:['sinh nhật','valentine',...])",
    });
  }

  if (!isNaN(targetWordCount) && typeof targetWordCount !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "targetWordCount phải là số",
    });
  }

  if (availableVariables && !Array.isArray(availableVariables)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message:
        "availableVariables phải là một mảng (vd: availableVariables:['sinh nhật','valentine',...])",
    });
  }
  next();
};
export const validateUpdateAIPromptRequest = (
  req: Request<{}, {}, AIPromptRequestDTO>,
  res: Response,
  next: NextFunction
): any => {
  const {
    name,
    promptTemplate,
    description,
    aiProvider,
    aiModel,
    temperature,
    maxTokens,
    systemMessage,
    categories,
    defaultTags,
    targetWordCount,
    availableVariables,
  } = req.body;

  if (name && !isValidString(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `name không hợp lệ`,
    });
  }

  if (promptTemplate && !isValidString(promptTemplate)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `promptTemplate không hợp lệ`,
    });
  }

  if (description && !isValidString(description)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `description không hợp lệ`,
    });
  }

  if (aiProvider && !["openai", "claude", "gemini"].includes(aiProvider)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `aiProvider không hợp lệ. aiProvider chỉ bao gồm openai | claude | gemini`,
    });
  }

  if (aiModel && !isValidString(aiModel)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `aiModel không hợp lệ`,
    });
  }

  if (!isNaN(temperature) && typeof temperature !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "temperature phải là số",
    });
  }

  if (!isNaN(maxTokens) && typeof maxTokens !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "temperature phải là số",
    });
  }

  if (systemMessage && !isValidString(systemMessage)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `systemMessage không hợp lệ`,
    });
  }

  if (
    categories &&
    !["chatbot", "gift", "notification", "article"].includes(categories)
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: `categories không hợp lệ. categories chỉ bao gồm"chatbot" | "gift" | "notification" | "article"`,
    });
  }

  if (defaultTags && !Array.isArray(defaultTags)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message:
        "defaultTags phải là một mảng (vd: defaultTags:['sinh nhật','valentine',...])",
    });
  }

  if (!isNaN(targetWordCount) && typeof targetWordCount !== "number") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "targetWordCount phải là số",
    });
  }

  if (availableVariables && !Array.isArray(availableVariables)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message:
        "availableVariables phải là một mảng (vd: availableVariables:['sinh nhật','valentine',...])",
    });
  }
  next();
};
