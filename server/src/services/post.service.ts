import { ReasonPhrases, StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { getAllPostRequestQueryDTO, PostRequestDTO } from "src/dtos";
import { _post } from "src/models";
import { normalizeTagsToSlug } from "src/utils";

export const createPostService = async (data: PostRequestDTO) => {
  try {
    let { slug, tags, ...other } = data;

    slug = slugify(slug, { lower: true, strict: true, locale: "vi" });
    if (tags) {
      tags = normalizeTagsToSlug(tags);
    }
    await _post.create({
      ...other,
      slug,
      tags,
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
    const existingPosts = await _post.findOne({ slug });
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
export const getAllPostsService = async (
  filters: Record<string, string>,
  data: Partial<getAllPostRequestQueryDTO>
) => {
  try {
    const { page = 1, pageSize = 10, tags } = data;
    let query: any = {};

    if (tags) {
      query.tags = {
        $in: tags.split(","),
      };
    }
    if (filters) {
      query.$and = Object.entries(filters).map(([key, value]) => ({
        [`filters.${key}`]: value,
      }));
    }
    console.log(query);

    const skip = (page - 1) * pageSize;
    const totalItem = await _post.countDocuments();
    const totalPage = Math.ceil(totalItem / pageSize);
    const existingProduct = await _post
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .lean();
    return {
      status: StatusCodes.OK,
      element: { products: existingProduct, currentPage: page, totalPage },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updatePostService = async (
  id: string,
  data: Partial<PostRequestDTO>
) => {
  try {
    let { title, content, tags, slug, filters, products } = data;
    if (tags) {
      tags = normalizeTagsToSlug(tags);
    }
    if (slug) {
      slug = slugify(slug, { lower: true, strict: true, locale: "vi" });
    }
    let updateFields: Partial<PostRequestDTO> = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (tags) updateFields.tags = tags;
    if (slug) updateFields.slug = slug;
    if (filters) updateFields.filters = filters;
    if (products) updateFields.products = products;
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
