import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ProductRequestDTO, getAllProductRequestQueryDTO } from "src/dtos";
import {
  createProductService,
  deleteProductService,
  getAllProductService,
  getProductService,
  updateProductService,
} from "src/services";

export const createProductController = async (
  req: Request<{}, {}, ProductRequestDTO>,
  res: Response
) => {
  try {
    const { name, price, slug, link, description, tags, image, category } =
      req.body;
    const data = {
      name,
      price,
      slug,
      link,
      description,
      tags,
      image,
      category,
    };
    const { status, message, product } = await createProductService(data);
    res.status(status).json({ status, message, product });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getProductController = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const { status, element, message } = await getProductService(slug);
    res.status(status).json({
      status,
      message,
      products: element,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getAllProductController = async (
  req: Request<{}, {}, {}, Partial<getAllProductRequestQueryDTO>>,
  res: Response
) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      min_price,
      max_price,
      tags,
      category,
      sort,
      search,
    } = req.query;
    const data = {
      page: +page,
      pageSize: +pageSize,
      min_price,
      max_price,
      tags,
      category,
      sort,
      search,
    };
    const { status, element } = await getAllProductService(data);
    res.status(status).json({
      status,
      products: element.products,
      currentPage: element.currentPage,
      totalPage: element.totalPage,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updateProductController = async (
  req: Request<{ id: string }, {}, Partial<ProductRequestDTO>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, price, slug, link, description, tags, image, category } =
      req.body;
    const data = {
      name,
      price,
      slug,
      link,
      description,
      tags,
      image,
      category,
    };
    const { status, message } = await updateProductService(id, data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const deleteProductController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, message } = await deleteProductService(id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
