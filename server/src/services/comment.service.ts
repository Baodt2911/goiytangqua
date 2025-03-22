import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CommentRequestDTO } from "src/dtos";
import { _comment } from "src/models";

export const createCommentService = async (
  user: any,
  data: CommentRequestDTO
) => {
  try {
    await _comment.create({ userId: user.userId, ...data });
    return {
      status: StatusCodes.CREATED,
      message: "Bình luận thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getCommentsService = async (postId: string) => {
  try {
    const existingComments = await _comment
      .find({ postId })
      .populate("userId", "name")
      .lean();
    return {
      status: StatusCodes.OK,
      element: existingComments,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
