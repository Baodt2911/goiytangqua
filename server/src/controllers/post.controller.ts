import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  getAllPostRequestQueryDTO,
  PostRequestDTO,
  UpdatePostRequestDTO,
} from "src/dtos";
import {
  createPostService,
  updatePostService,
  getPostService,
  getAllPostsService,
  deletePostService,
  increaseViewService,
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
    const viewer = req.user;
    const { page = 1, pageSize = 10, search, tags } = req.query;
    const { status, element } = await getAllPostsService(viewer, filters, {
      page: +page,
      pageSize: +pageSize,
      search,
      tags,
    });
    res.status(status).json({
      status,
      posts: element.posts,
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
      post: element,
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
    const { title, thumbnail, content, slug, filters, products, tags, author } =
      req.body;
    const data = {
      title,
      thumbnail,
      content,
      slug,
      filters,
      products,
      tags,
      author,
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
  req: Request<{ id: string }, {}, Partial<UpdatePostRequestDTO>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const {
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
    } = req.body;
    const data = {
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
    };
    const { status: Status, message } = await updatePostService(id, data);
    res.status(Status).json({ status: Status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const increaseViewController = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;
    const user = req.user;
    const ip = req.ip;

    const { status, message } = await increaseViewService(slug, user, ip);
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
