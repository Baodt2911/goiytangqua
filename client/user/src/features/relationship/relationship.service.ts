import axiosInstance from "../../configs/axios.config";
import { RelationshipType } from "../../types/relationship.type";

export const getRelationshipAsync = async () => {
  const res = await axiosInstance.get(`/user/relationship/get`);
  return res.data;
};

export const createRelationshipAsync = async (data: RelationshipType) => {
  const res = await axiosInstance.post("/user/relationship/add-new", data);
  return res.data;
};

export const deleteRelationshipAsync = async (_id: string) => {
  const res = await axiosInstance.delete(`/user/relationship/delete/${_id}`);
  return res.data;
};

export const updateRelationshipAsync = async (data: RelationshipType) => {
  const { _id, ...other } = data;
  const res = await axiosInstance.patch(
    `/user/relationship/update/${_id}`,
    other
  );
  return res.data;
};
