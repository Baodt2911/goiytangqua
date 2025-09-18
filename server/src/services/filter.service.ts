import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { FilterRequestDTO } from "src/dtos";
import { _filter } from "src/models";
export const getFilterService = async () => {
  try {
    const existingFilters = await _filter.find().lean();
    return {
      status: StatusCodes.OK,
      element: existingFilters,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const addFilterService = async (data: FilterRequestDTO) => {
  try {
    await _filter.findOneAndUpdate(
      { type: data.type },
      {
        $setOnInsert: { type: data.type },
        $set: { options: data.options },
      },
      {
        upsert: true,
      }
    );
    return {
      status: StatusCodes.OK,
      message: "Thêm mới bộ lọc thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const deleteFilterService = async (filterId: string) => {
  try {
    const isDeleted = await _filter.findByIdAndDelete(filterId);
    if (!isDeleted) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Bộ lọc không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Xóa bộ lọc thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updateFilterService = async (
  id: string,
  data: FilterRequestDTO
) => {
  try {
    const updated = await _filter.findByIdAndUpdate(
      id,
      { $set: { type: data.type, options: data.options } },
      { new: true }
    );
    if (!updated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Bộ lọc không tồn tại hoặc đã bị xóa",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhật bộ lọc thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
