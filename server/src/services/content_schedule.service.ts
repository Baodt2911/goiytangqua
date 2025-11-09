import { ReasonPhrases, StatusCodes } from "http-status-codes";
import slugify from "slugify";
import {
  ContentScheduleRequestDTO,
  ContentScheduleUpdateRequestDTO,
} from "src/dtos";
import { _contentSchedule, _aiPrompt, _post, _product } from "src/models";
import { callAIWithPrompt } from "src/utils";
import logger from "src/utils/logger";

// src/utils/schedule.ts
export function calculateNextRunAt(
  frequency: "once" | "daily" | "weekly" | "monthly",
  scheduleTime: string
): Date {
  const now = new Date();
  let nextRunAt = new Date();

  if (frequency === "daily") {
    const [hour, minute] = scheduleTime.split(":").map(Number);
    nextRunAt.setHours(hour, minute, 0, 0);
    if (nextRunAt <= now) nextRunAt.setDate(nextRunAt.getDate() + 1);
  }

  if (frequency === "weekly") {
    const [dayStr, timeStr] = scheduleTime.split("-");
    const [hour, minute] = timeStr.split(":").map(Number);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const targetDay = days.indexOf(dayStr);
    nextRunAt.setHours(hour, minute, 0, 0);
    while (nextRunAt.getDay() !== targetDay || nextRunAt <= now) {
      nextRunAt.setDate(nextRunAt.getDate() + 1);
    }
  }

  if (frequency === "once") {
    nextRunAt = new Date(scheduleTime);
  }

  if (frequency === "monthly") {
    const [dayStr, timeStr] = scheduleTime.split("-");
    const day = Number(dayStr);
    const [hour, minute] = timeStr.split(":").map(Number);
    nextRunAt.setDate(day);
    nextRunAt.setHours(hour, minute, 0, 0);
    if (nextRunAt <= now) nextRunAt.setMonth(nextRunAt.getMonth() + 1);
  }

  return nextRunAt;
}

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
    const nextRunAt = calculateNextRunAt(data.frequency, data.scheduleTime);
    await _contentSchedule.create({ ...data, nextRunAt });
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
  data: Partial<ContentScheduleUpdateRequestDTO>
) => {
  try {
    let updateFields: Partial<ContentScheduleUpdateRequestDTO> = {};
    if (data.name) updateFields.name = data.name;
    if (data.autoPublish) updateFields.autoPublish = data.autoPublish;
    if (data.frequency) updateFields.frequency = data.frequency;
    if (data.scheduleTime) updateFields.scheduleTime = data.scheduleTime;
    if (data.status) updateFields.status = data.status;
    if (data.frequency && data.scheduleTime) {
      const nextRunAt = calculateNextRunAt(data.frequency, data.scheduleTime);
      updateFields.nextRunAt = nextRunAt;
    }
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
      status: StatusCodes.OK,
      message: "Cập nhật schedule thành công",
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
      status: StatusCodes.OK,
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
    const products = await _product.find().lean();
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
      defaultTags,
      targetWordCount,
    } = existingPrompt;

    const userPrompt = `
      Tạo một bài viết gợi ý quà tặng với các thông tin sau:
      - Tags: ${defaultTags}
      - Prompt template: ${promptTemplate}

      Yêu cầu bắt buộc:
      1. Trả về theo định dạng sau, CHÍNH XÁC theo cấu trúc này:

      ===TITLE===
      [Tiêu đề ngắn gọn, thu hút, <= 70 ký tự]
      ===DESCRIPTION===
      [Mô tả ngắn khoảng 1-2 câu để thu hút người đọc]
      ===CONTENT===
      [Nội dung chi tiết khoảng ${targetWordCount} từ, viết theo dạng HTML]
      ===END===

      2. Phần CONTENT viết theo dạng HTML body (giống TinyMCE):
        - Chỉ viết nội dung, không có thẻ <html>, <head>, <body>
        - Sử dụng các thẻ như <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>, ... các thẻ html
        - Bắt buộc chứa ít nhất 5-10 link và ảnh sản phẩm từ danh sách: ${JSON.stringify(
          products
        )}
        - Nên viết theo dạng có các chỉ mục, ví dụ: <h2>1. Tên sản phẩm</h2>
        - Bắt buộc phải css cho đẹp, cỡ chữ, căn chỉnh ảnh và nội dung phù hợp, không css màu cho nội dung

      3. Format link sản phẩm: <a href="URL_SẢN_PHẨM" target="_blank">TÊN_SẢN_PHẨM</a>
      4. Format ảnh sản phẩm: <img src="URL_HÌNH_SẢN_PHẨM" alt="TÊN_SẢN_PHẨM">
      5. Ảnh phải được set width height phù hợp, không quá to hoặc nhỏ
      6. Giữ đúng tone: tích cực, ấm áp, truyền cảm hứng, thân thiện
      7. QUAN TRỌNG: Tuân thủ chính xác format trên, bắt đầu bằng ===TITLE=== và kết thúc bằng ===END===

      Ví dụ format mong muốn:
      ===TITLE===
      10 Món Quà Tặng Ý Nghĩa Cho Người Thân Yêu
      ===DESCRIPTION===
      Khám phá những món quà độc đáo, mang đến niềm vui và kết nối tình cảm gia đình.
      ===CONTENT===
      <h2>Những món quà từ trái tim</h2>
      <p>Việc chọn quà tặng không chỉ đơn thuần là trao đổi vật chất...</p>
      <p>Hãy cân nhắc <a href="/product1" target="_blank">Áo len cao cấp</a> với thiết kế tinh tế...</p>
      <img src="URL_HÌNH_SẢN_PHẨM" alt="TÊN_SẢN_PHẨM">
      ===END===
      `;

    const maxOutputTokens =
      Math.round(targetWordCount * 2.8) > maxTokens
        ? Math.round(targetWordCount * 2.8)
        : maxTokens;
    const AI_Response = (await callAIWithPrompt(
      {
        aiProvider,
        aiModel,
        temperature,
        maxTokens: maxOutputTokens,
        systemMessage,
      },
      userPrompt
    )) as any;

    // Improved parsing with better regex patterns
    const titleMatch = AI_Response.match(
      /===TITLE===\s*\n?\s*([\s\S]*?)\s*\n?\s*===DESCRIPTION===/i
    );
    const descMatch = AI_Response.match(
      /===DESCRIPTION===\s*\n?\s*([\s\S]*?)\s*\n?\s*===CONTENT===/i
    );
    const contentMatch = AI_Response.match(
      /===CONTENT===\s*\n?\s*([\s\S]*?)\s*\n?\s*===END===/i
    );

    let title = titleMatch ? titleMatch[1].trim() : "";
    let description = descMatch ? descMatch[1].trim() : "";
    let content = contentMatch ? contentMatch[1].trim() : "";

    if (!title) {
      console.error("⚠️ Title not found or empty");
      const altTitleMatch = AI_Response.match(
        /===TITLE===([\s\S]*?)===DESCRIPTION===/i
      );
      if (altTitleMatch) {
        title = altTitleMatch[1].trim();
      }
    }
    if (!description) {
      console.error("⚠️ Description not found or empty");
      const altDescMatch = AI_Response.match(
        /===DESCRIPTION===([\s\S]*?)===CONTENT===/i
      );
      if (altDescMatch) {
        description = altDescMatch[1].trim();
      }
    }
    if (!content) {
      console.error("⚠️ Content not found or empty");
      // Try to extract content even if ===END=== is missing (truncated response)
      const altContentMatch = AI_Response.match(
        /===CONTENT===\s*\n?\s*([\s\S]*?)(?:===END===|$)/i
      );
      if (altContentMatch) {
        const extractedContent = altContentMatch[1].trim();
        // Use the extracted content if it's substantial enough
        if (extractedContent.length > 50) {
          content = extractedContent;
        }
      }
    }
    if (title && content && description) {
      await _post.create({
        title,
        content,
        description,
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
        publishedAt: schedule.autoPublish ? new Date() : undefined,
      });

      await _contentSchedule.updateOne(
        { _id: schedule._id },
        {
          $inc: { totalRuns: 1 },
          $set: { lastRunAt: new Date() },
        }
      );
    } else {
      throw new Error(
        "Không thể extract được title hoặc content từ AI response"
      );
    }
  } catch (error: any) {
    console.error(error);
    logger.error(error);
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
        nextRun = addDays(schedule.nextRunAt, 7);
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
  const now = new Date();

  const dueSchedules = await _contentSchedule.find({
    status: "active",
    nextRunAt: { $lte: now },
  });
  for (const schedule of dueSchedules) {
    console.log(`Generate "${schedule.name}" schedule content...`);
    try {
      await generateContentService(schedule);
      await updateNextRunService(schedule);
    } catch (error: any) {
      console.error(`Schedule ${schedule.name} failed:`, error.message);
    }
  }
};
