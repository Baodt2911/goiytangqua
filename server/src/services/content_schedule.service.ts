import { ReasonPhrases, StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { ContentScheduleRequestDTO } from "src/dtos";
import { _contentSchedule, _aiPrompt, _post } from "src/models";
import { callAIWithPrompt } from "src/utils/AI_service";
export const createScheduleService = async (
  data: ContentScheduleRequestDTO
) => {
  try {
    const isPrompt = await _aiPrompt.findById(data.aiPromptId).lean();
    if (!isPrompt) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Prompt không tồn tại hoặc đã bị xóa",
      };
    }
    if (!isPrompt.isActive) {
      return {
        status: StatusCodes.CONFLICT,
        message:
          "Prompt đang trong trạng thái tắt, vui lòng bật lại để sử dụng",
      };
    }
    await _contentSchedule.create(data);
    return {
      status: StatusCodes.CREATED,
      message: "Tạo schedule thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const updateScheduleService = async (
  id: string,
  data: Partial<ContentScheduleRequestDTO>
) => {
  try {
    let updateFields: Partial<ContentScheduleRequestDTO> = {};
    if (data.name) updateFields.name = data.name;
    if (data.aiPromptId) updateFields.aiPromptId = data.aiPromptId;
    if (data.autoPublish) updateFields.autoPublish = data.autoPublish;
    if (data.frequency) updateFields.frequency = data.frequency;
    if (data.lastRunAt) updateFields.lastRunAt = data.lastRunAt;
    if (data.nextRunAt) updateFields.nextRunAt = data.nextRunAt;
    if (data.scheduleTime) updateFields.scheduleTime = data.scheduleTime;
    if (data.status) updateFields.status = data.status;
    if (data.totalRuns) updateFields.totalRuns = data.totalRuns;

    const isUpdated = await _contentSchedule.findByIdAndUpdate(id, {
      $set: updateFields,
    });
    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Schedule không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.CREATED,
      message: "Tạo schedule thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getScheduleService = async (aiPromptId: string) => {
  try {
    const existingSchedule = await _contentSchedule
      .findOne({ aiPromptId })
      .lean();
    return {
      status: StatusCodes.CREATED,
      element: existingSchedule,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const deleteScheduleService = async (id: string) => {
  try {
    const isDeleted = await _contentSchedule.findByIdAndDelete(id);
    if (!isDeleted) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Schedule không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Xóa schedule thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const generateContentService = async (schedule: any) => {
  try {
    const existingPrompt = await _aiPrompt.findById(schedule.aiPromptId).lean();

    if (!existingPrompt) {
      throw new Error("Prompt không tồn tại");
    }

    const {
      aiProvider,
      aiModel,
      temperature,
      maxTokens,
      promptTemplate,
      systemMessage,
    } = existingPrompt;

    const promptDefault = `Tạo bài viết theo dạng {title, content}, title là tên tiêu đề bài viết (Không dùng ký tự đặc biệt), content sẽ chứa nội dung bài viết (content viết thành dạng html giống TinyMCE, chỉ viết body và không viết đầy đủ cầu trúc html)`;

    const AI_Response = (await callAIWithPrompt(
      {
        aiProvider,
        aiModel,
        temperature,
        maxTokens,
        systemMessage,
      },
      promptDefault + promptTemplate
    )) as any;
    console.log(AI_Response);

    const titleRegex = /"title": "(.*?)"/;
    const contentRegex = /"content": "(.*?)"/;

    const titleMatch = AI_Response.match(titleRegex);
    const contentMatch = AI_Response.match(contentRegex);

    const title = titleMatch ? titleMatch[1] : "";
    const content = contentMatch ? contentMatch[1] : "";

    await _post.create({
      title,
      content,
      slug: slugify(title, {
        lower: true,
        strict: true,
        locale: "vi",
      }),
      tags: existingPrompt.defaultTags,
      generatedBy: "ai",
      aiPromptId: schedule.aiPromptId,
      status: schedule.autoPublish ? "published" : "draft",
      author: aiProvider,
      // thumbnail: await generateThumbnail(AI_Response.title),
      publishedAt: schedule.autoPublish ? new Date() : undefined,
    });

    await _contentSchedule.updateOne(
      { _id: schedule._id },
      {
        $inc: { totalRuns: 1 },
        $set: { lastRunAt: new Date() },
      }
    );
    return {
      status: StatusCodes.OK,
      message: "Xóa schedule thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updateNextRunService = async (schedule: any) => {
  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  function addMonths(date: Date, months: number) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  try {
    let nextRun;

    switch (schedule.frequency) {
      case "once":
        await _contentSchedule.updateOne(
          { _id: schedule._id },
          { status: "completed" }
        );
        return;

      case "daily":
        nextRun = addDays(schedule.nextRunAt, 1);
        break;

      case "weekly":
        nextRun = addDays(schedule.nextRunAt, 1);
        break;

      case "monthly":
        nextRun = addMonths(schedule.nextRunAt, 1);
        break;
    }

    await _contentSchedule.updateOne(
      { _id: schedule._id },
      { nextRunAt: nextRun }
    );
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const checkScheduleService = async () => {
  try {
    const now = new Date();

    const dueSchedules = await _contentSchedule.find({
      status: "active",
      nextRunAt: { $lte: now },
    });

    for (const schedule of dueSchedules) {
      try {
        await generateContentService(schedule);
        await updateNextRunService(schedule);
      } catch (error) {
        console.error(`Schedule ${schedule.name} failed:`, error);
      }
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
