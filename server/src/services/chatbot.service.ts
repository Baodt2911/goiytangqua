import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const chi = async () => {
  try {
    return {
      status: StatusCodes.CREATED,
      message: "Bình luận thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
