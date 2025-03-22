import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { cloudinary } from "src/configs";
export const deleteImageService = async (public_id: string) => {
  try {
    const { result } = await cloudinary.uploader.destroy(
      `images_product/${public_id}`
    );
    if (result !== "ok") {
      return {
        status: StatusCodes.NOT_FOUND,
        message: result,
      };
    }
    return {
      status: StatusCodes.OK,
      message: result,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
