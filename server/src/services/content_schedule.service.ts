import { ReasonPhrases, StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { ContentScheduleRequestDTO } from "src/dtos";
import { _contentSchedule, _aiPrompt, _post, _product } from "src/models";
import { callAIWithPrompt } from "src/utils";
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
        - Sử dụng các thẻ như <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>
        - Bắt buộc chứa ít nhất 2-3 link sản phẩm từ danh sách: ${JSON.stringify(
          products
        )}

      3. Format link sản phẩm: <a href="URL_SẢN_PHẨM" target="_blank">TÊN_SẢN_PHẨM</a>

      4. Giữ đúng tone: tích cực, ấm áp, truyền cảm hứng, thân thiện

      5. QUAN TRỌNG: Tuân thủ chính xác format trên, bắt đầu bằng ===TITLE=== và kết thúc bằng ===END===

      Ví dụ format mong muốn:
      ===TITLE===
      10 Món Quà Tặng Ý Nghĩa Cho Người Thân Yêu
      ===DESCRIPTION===
      Khám phá những món quà độc đáo, mang đến niềm vui và kết nối tình cảm gia đình.
      ===CONTENT===
      <h2>Những món quà từ trái tim</h2>
      <p>Việc chọn quà tặng không chỉ đơn thuần là trao đổi vật chất...</p>
      <p>Hãy cân nhắc <a href="/product1" target="_blank">Áo len cao cấp</a> với thiết kế tinh tế...</p>
      ===END===
      `;

    const AI_Response = (await callAIWithPrompt(
      {
        aiProvider,
        aiModel,
        temperature,
        maxTokens,
        systemMessage,
      },
      userPrompt
    )) as any;

    console.log(AI_Response);

    // Parsing code cho phiên bản 1:
    const titleMatch = AI_Response.match(
      /===TITLE===\s*(.*?)\s*===DESCRIPTION===/s
    );
    const descMatch = AI_Response.match(
      /===DESCRIPTION===\s*(.*?)\s*===CONTENT===/s
    );
    const contentMatch = AI_Response.match(
      /===CONTENT===\s*(.*?)\s*===END===/s
    );

    const title = titleMatch ? titleMatch[1].trim() : "";
    const description = descMatch ? descMatch[1].trim() : "";
    const content = contentMatch ? contentMatch[1].trim() : "";

    if (!title) {
      console.error("⚠️ Title not found or empty");
    }
    if (!description) {
      console.error("⚠️ Description not found or empty");
    }
    if (!content) {
      console.error("⚠️ Content not found or empty");
    }

    console.log({ title, description, content });
    if (title && content) {
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
