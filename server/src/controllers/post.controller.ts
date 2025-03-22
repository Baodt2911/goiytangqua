import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getAllPostRequestQueryDTO, PostRequestDTO } from "src/dtos";
import {
  createPostService,
  updatePostService,
  getPostService,
  getAllPostsService,
  deletePostService,
} from "src/services";
export const getAllPostsController = async (
  req: Request<
    {},
    {},
    { filters: Record<string, string> },
    Partial<getAllPostRequestQueryDTO>
  >,
  res: Response
) => {
  try {
    const { filters } = req.body;
    const { page = 1, pageSize = 10, tags } = req.query;
    const { status, element } = await getAllPostsService(filters, {
      page: +page,
      pageSize: +pageSize,
      tags,
    });
    res.status(status).json({
      status,
      posts: element,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const getPostController = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const { status, element, message } = await getPostService(slug);
    res.status(status).json({
      status,
      message,
      posts: element,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const createPostController = async (
  req: Request<{}, {}, PostRequestDTO>,
  res: Response
) => {
  try {
    const { title, content, slug, filters, products, tags } = req.body;
    const data = {
      title,
      content,
      slug,
      filters,
      products,
      tags,
    };
    const { status, message } = await createPostService(data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updatePostController = async (
  req: Request<{ id: string }, {}, Partial<PostRequestDTO>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { title, content, slug, tags, filters, products } = req.body;
    const data = {
      title,
      content,
      slug,
      tags,
      filters,
      products,
    };
    const { status, message } = await updatePostService(id, data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const deletePostController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, message } = await deletePostService(id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
