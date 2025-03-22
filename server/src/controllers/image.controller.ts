import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { deleteImageService } from "src/services";

export const uploadImageController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    res.status(200).json({
      message: "Upload ảnh thành công",
      url: file?.path,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const deleteImageController = async (
  req: Request<{ public_id: string }>,
  res: Response
) => {
  try {
    const { public_id } = req.params;

    const { status, message } = await deleteImageService(public_id);
    res.status(status).json({
      status,
      message,
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
