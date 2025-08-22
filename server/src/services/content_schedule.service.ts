import { ReasonPhrases, StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { ContentScheduleRequestDTO } from "src/dtos";
import { _contentSchedule, _aiPrompt, _post, _product } from "src/models";
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
        1. Chỉ trả về dữ liệu dưới dạng JSON thuần, không được bao quanh bởi bất kỳ ký hiệu mở/đóng khối code (ví dụ: ba dấu backtick) hoặc bất kỳ văn bản nào ngoài JSON.
        2. JSON phải có cấu trúc:
        {
          "title": "Tiêu đề ngắn gọn, thu hút, <= 70 ký tự",
          "description": "Mô tả ngắn khoảng 1-2 câu để thu hút người đọc",
          "content": "Nội dung chi tiết khoảng ${targetWordCount} từ, viết theo phong cách gần gũi, gợi cảm xúc, có kèm vài gợi ý quà cụ thể từ danh sách quà này (${products})"
        }
        3. Trường "content" viết theo dạng HTML body (giống TinyMCE) — chỉ viết phần nội dung, không viết thẻ <html>, <head> hoặc <body>. Bắt buộc phải chứa link sản phẩm từ danh sách ${products} trong nội dung.
        4. Tuyệt đối không được thêm ký hiệu ba dấu backtick hoặc thẻ code block vào bất kỳ đâu trong phản hồi.
        5. Giữ đúng tone: tích cực, ấm áp, truyền cảm hứng.
        6. Đảm bảo JSON trả về hợp lệ để có thể parse trực tiếp bằng JSON.parse().`;

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
    let raw = String(AI_Response).trim();
    let title = "";
    let content = "";
    try {
      const obj = JSON.parse(raw);
      title = obj.title ?? "";
      content = obj.content ?? "";
    } catch {
      // title: regex JSON-safe
      const t = raw.match(/"title"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (t) title = (t[1] ?? "").replace(/\\"/g, '"');

      // content: field cuối → cắt theo vị trí
      const keyIdx = raw.indexOf('"content"');
      if (keyIdx !== -1) {
        const firstQuote = raw.indexOf('"', keyIdx + 9); // sau \"content\":
        const lastBrace = raw.lastIndexOf("}");
        const lastQuote = raw.lastIndexOf('"', lastBrace);
        if (firstQuote !== -1 && lastQuote !== -1 && lastQuote > firstQuote) {
          content = raw.substring(firstQuote + 1, lastQuote);
          // bỏ escape tối thiểu
          content = content.replace(/\\"/g, '"');
        }
      }
    }
    const titleRegex = /"title"\s*:\s*"((?:\\.|[^"\\])*)"/;
    const descriptionRegex = /"title"\s*:\s*"((?:\\.|[^"\\])*)"/;
    const contentRegex = /"content"\s*:\s*"((?:\\.|[^"\\])*)"/;

    const titleMatch = AI_Response.match(titleRegex);
    const descriptionMatch = AI_Response.match(descriptionRegex);
    const contentMatch = AI_Response.match(contentRegex);

    // const title = titleMatch ? titleMatch[1] : "";
    // const description = descriptionMatch ? descriptionMatch[1] : "";
    // const content = contentMatch ? contentMatch[1] : "";

    console.log({ title, content });
    // await _post.create({
    //   title,
    //   content,
    //   slug: slugify(title, {
    //     lower: true,
    //     strict: true,
    //     locale: "vi",
    //   }),
    //   tags: existingPrompt.defaultTags,
    //   generatedBy: "ai",
    //   aiPromptId: schedule.aiPromptId,
    //   status: schedule.autoPublish ? "published" : "draft",
    //   author: aiProvider,
    //   // thumbnail: await generateThumbnail(AI_Response.title),
    //   publishedAt: schedule.autoPublish ? new Date() : undefined,
    // });

    // await _contentSchedule.updateOne(
    //   { _id: schedule._id },
    //   {
    //     $inc: { totalRuns: 1 },
    //     $set: { lastRunAt: new Date() },
    //   }
    // );
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
