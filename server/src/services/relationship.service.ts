import mongoose from "mongoose";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { RelationshipRequestDTO } from "src/dtos";
import { _relationship } from "src/models";
export const addNewRelationshipService = async (
  user: any,
  data: RelationshipRequestDTO
) => {
  try {
    const { name, relationshipType, anniversaries, preferences } = data;
    await _relationship.create({
      userId: user.userId,
      name,
      relationshipType,
      anniversaries,
      preferences,
    });
    return {
      status: StatusCodes.CREATED,
      message: "Thêm thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getRelationshipService = async (user: any) => {
  try {
    const existingRelationship = await _relationship
      .find({ userId: user.userId })
      .lean();
    return {
      status: StatusCodes.OK,
      element: existingRelationship,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const deleteRelationshipService = async (user: any, id: string) => {
  try {
    const isDeleted = await _relationship.findOneAndDelete({
      $and: [{ _id: id }, { userId: user.userId }],
    });
    if (!isDeleted) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Mối quan hệ không tồn tại hoặc đã bị xóa trước đó",
      };
    }

    return {
      status: StatusCodes.OK,
      message: "Xóa thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const updateRelationshipService = async (
  user: any,
  id: string,
  data: Partial<RelationshipRequestDTO>
) => {
  try {
    const { name, relationshipType, anniversaries, preferences } = data;
    const updateFields: Partial<RelationshipRequestDTO> = {};
    if (name) updateFields.name = name;
    if (relationshipType) updateFields.relationshipType = relationshipType;
    if (preferences) updateFields.preferences = preferences;
    if (anniversaries) updateFields.anniversaries = anniversaries;
    const isUpdated = await _relationship.findOneAndUpdate(
      {
        $and: [{ _id: id }, { userId: user.userId }],
      },
      {
        $set: updateFields,
      }
    );
    if (!isUpdated) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Mối quan hệ không tồn tại hoặc đã bị xóa trước đó",
      };
    }
    return {
      status: StatusCodes.OK,
      message: "Cập nhật thành công",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getRelationshipsWithAnniversaryToday = async (
  day: Number,
  month: Number
) => {
  try {
    const exitstingAnniversaries = await _relationship
      .find({
        "anniversaries.date.day": day,
        "anniversaries.date.month": month,
      })
      .lean();

    return exitstingAnniversaries;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
