export interface CommentType {
  _id?: string;
  userId: {
    name: string;
  };
  postId: string;
  content: string;
  createdAt: string;
}
