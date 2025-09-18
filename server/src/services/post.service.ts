import { ReasonPhrases, StatusCodes } from "http-status-codes";
import slugify from "slugify";
// import redis from "src/configs/redis.cofig";
import {
  getAllPostRequestQueryDTO,
  PostRequestDTO,
  UpdatePostRequestDTO,
} from "src/dtos";
import { _post } from "src/models";
import { normalizeTagsToSlug } from "src/utils";
import { callAIWithPrompt } from "src/utils/AI_service";

export const createPostService = async (data: PostRequestDTO) => {
  try {
    let { slug, tags, description, ...other } = data;

    slug = slugify(slug, { lower: true, strict: true, locale: "vi" });
    if (tags) {
      tags = normalizeTagsToSlug(tags);
    }

    const isSlug = await _post.findOne({ slug });
    if (isSlug) {
      return {
        status: StatusCodes.CONFLICT,
        message: "Slug đã tốn tại",
      };
    }
    if (!description) {
      const prompt = `Tạo cho tôi description cho bài viết này của tôi ngắn gọn dưới 200 từ. Đây là dữ liệu bài viết ${data.content}`;
      const AI_Response = await callAIWithPrompt(
        { aiProvider: "gemini", aiModel: "gemini-1.5-flash" },
        prompt
      );
      description = AI_Response as string;
    }
    await _post.create({
      ...other,
      slug,
      tags,
      description,
    });
    return {
      status: StatusCodes.CREATED,
      message: "Tạo bài viết thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getPostService = async (slug: string) => {
  try {
    const existingPosts = await _post.findOne({ slug }).populate("products");
    if (!existingPosts) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Bài viết không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      element: existingPosts,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getBestPostService = async () => {
  try {
    const existingPosts = await _post.find({status: "published"}).populate("products").sort({views: -1}).limit(10);
    return {
      status: StatusCodes.OK,
      element: existingPosts,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getAllPostsService = async (
  viewer: any,
  data: Partial<getAllPostRequestQueryDTO>
) => {
  try {
    const { page = 1, pageSize = 10, search, isFeatured, generatedBy, tags, filters } = data;
    let query: any = {};

    if (!viewer || viewer.role !== "admin") {
      query.status = "published";
    }

    if (search) {
      query.title = { $regex: `^${search}`, $options: "i" };
    }

    if (isFeatured) {
      query.isFeatured = isFeatured;
    }

    if (generatedBy) {
      query.generatedBy = generatedBy;
    }
    
    if (filters) {
      query.$and = Object.entries(filters).map(([key, value]) => ({
        [`filters.${key}`]: value,
      }));
    }
    console.log(query);

    if (tags) {
      query.tags = {
        $in: tags.split(","),
      };
    }

    const skip = (page - 1) * pageSize;
    const totalItem = await _post.countDocuments();
    const totalPage = Math.ceil(totalItem / pageSize);
    let existingPosts = await _post
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .sort(viewer?.role === "admin" ? { createdAt: -1 } : { publishedAt: -1 })
      .select(
        viewer?.role === "admin"
          ? ""
          : "-status -publishedAt -scheduledFor -views -generatedBy -aiPromptId"
      )
      .populate("products")
      .lean();

    if (!viewer || viewer.role !== "admin") {
    }
    return {
      status: StatusCodes.OK,
      element: { posts: existingPosts, currentPage: page, totalPage },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updatePostService = async (
  id: string,
  data: Partial<UpdatePostRequestDTO>
) => {
  try {
    let {
      title,
      thumbnail,
      slug,
      content,
      tags,
      filters,
      products,
      status,
      publishedAt,
      scheduledFor,
      isFeatured,
      author,
      aiPromptId,
    } = data;
    if (tags) {
      tags = normalizeTagsToSlug(tags);
    }
    if (slug) {
      slug = slugify(slug, { lower: true, strict: true, locale: "vi" });
    }

    let updateFields: Partial<UpdatePostRequestDTO> = {};
    if (title) updateFields.title = title;
    if (thumbnail) updateFields.thumbnail = thumbnail;
    if (content) updateFields.content = content;
    if (tags) updateFields.tags = tags;
    if (slug) updateFields.slug = slug;
    if (filters) updateFields.filters = filters;
    if (products) updateFields.products = products;
    if (status) updateFields.status = status;
    if (publishedAt) updateFields.publishedAt = publishedAt;
    if (scheduledFor) updateFields.scheduledFor = scheduledFor;
    if (isFeatured) updateFields.isFeatured = isFeatured;
    if (author) updateFields.author = author;
    if (aiPromptId) updateFields.aiPromptId = aiPromptId;

    const isUpdated = await _post.findByIdAndUpdate(id, {
      $set: updateFields,
    });
    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Bài viết không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhật bài viết thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
// export const increaseViewService = async (
//   slug: string,
//   user: any,
//   ip: string | undefined
// ) => {
//   try {
//     const existingPosts = await _post.findOne({ slug });
//     if (!existingPosts) {
//       return {
//         status: StatusCodes.NOT_FOUND,
//         message: "Bài viết không tồn tại hoặc đã bị xóa",
//       };
//     }
//     const key = `view:${slug}:${user?.userId || ip}`;

//     const viewed = await redis.get(key);
//     if (!viewed) {
//       await _post.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
//       await redis.set(key, "1", "EX", 60 * 10); // 10 phút
//     }
//     return {
//       status: StatusCodes.OK,
//     };
//   } catch (error: any) {
//     console.error(error);
//     throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
//   }
// };
export const deletePostService = async (id: string) => {
  try {
    const isDeleted = await _post.findByIdAndDelete(id);
    if (!isDeleted) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Bài viết không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Xóa bài viết thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
