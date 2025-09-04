import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { RelationshipRequestDTO, UpdateRelationshipRequestDTO } from "src/dtos";
import {
  addNewRelationshipService,
  deleteRelationshipService,
  getRelationshipService,
  updateRelationshipService,
} from "src/services";
export const addNewRealationshipController = async (
  req: Request<{}, {}, RelationshipRequestDTO>,
  res: Response
) => {
  try {
    const user = req.user;
    const { name, relationshipType } = req.body;
    const { message, status } = await addNewRelationshipService(user, {
      name,
      relationshipType,
    });
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getRelationshipController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    const { status, element } = await getRelationshipService(user);
    res.status(status).json({ relationships: element });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const deleteRelationshipController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, message } = await deleteRelationshipService(user, id);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
export const updateRelationshipController = async (
  req: Request<{ id: string }, {}, UpdateRelationshipRequestDTO>,
  res: Response
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { name, relationshipType, anniversaries } = req.body;
    const data = {
      name,
      relationshipType,
      anniversaries,
    };
    const { status, message } = await updateRelationshipService(user, id, data);
    res.status(status).json({ status, message });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
