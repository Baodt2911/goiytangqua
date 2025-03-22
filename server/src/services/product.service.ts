import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ProductRequestDTO, getAllProductRequestQueryDTO } from "src/dtos";
import { _product } from "src/models";
import slugify from "slugify";
import { normalizeTagsToSlug } from "src/utils";
export const createProductService = async (data: ProductRequestDTO) => {
  try {
    let { slug, name, tags, ...other } = data;
    slug = slugify(slug, { lower: true, strict: true, locale: "vi" });
    if (tags) {
      tags = normalizeTagsToSlug(tags);
    }
    await _product.create({
      name,
      ...other,
      slug,
      tags,
    });
    return {
      status: StatusCodes.CREATED,
      message: "Tạo sản phẩm thành công",
    };
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: "slug đã tồn tại",
      };
    }
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getProductService = async (slug: string) => {
  try {
    const existingProduct = await _product.findOne({ slug });
    if (!existingProduct) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Sản phẩm không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      element: existingProduct,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getAllProductService = async (
  data: Partial<getAllProductRequestQueryDTO>
) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      min_price,
      max_price,
      tags,
      category,
    } = data;
    let query: any = {};

    if (tags) {
      query.tags = {
        $in: tags.split(","),
      };
    }
    if (category) query.category = category;
    if (min_price && max_price) {
      query.$and = [
        { price: { $gte: min_price } },
        { price: { $lte: max_price } },
      ];
    }
    const skip = (page - 1) * pageSize;
    const totalItem = await _product.countDocuments();
    const totalPage = Math.ceil(totalItem / pageSize);
    const existingProduct = await _product
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
export const updateProductService = async (
  id: string,
  data: Partial<ProductRequestDTO>
) => {
  try {
    let { name, price, tags, category, slug, image, description, link } = data;
    if (tags) {
      tags = normalizeTagsToSlug(tags);
    }
    if (slug) {
      slug = slugify(slug, { lower: true, strict: true, locale: "vi" });
    }
    let updateFields: Partial<ProductRequestDTO> = {};
    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (tags) updateFields.tags = tags;
    if (category) updateFields.category = category;
    if (slug) updateFields.slug = slug;
    if (image) updateFields.image = image;
    if (description) updateFields.description = description;
    if (link) updateFields.link = link;

    const isUpdated = await _product.findByIdAndUpdate(id, {
      $set: updateFields,
    });
    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Sản phẩm không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhật sản phẩm thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const deleteProductService = async (id: string) => {
  try {
    const isDeleted = await _product.findByIdAndDelete(id);
    if (!isDeleted) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Sản phẩm không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Xóa sản phẩm thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
