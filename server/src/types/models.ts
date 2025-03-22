import { Document, ObjectId } from "mongoose";
export type User = Document & {
  name?: string;
  email: string;
  password?: string;
  googleId?: string;
  birthday?: Date;
  gender?: "nam" | "nữ";
  preferences?: string[];
  role: "admin" | "user";
  googleRefreshToken?: string;
};
export type Post = Document & {
  title: string;
  slug: string;
  content: string;
  tags?: string[];
  filters?: Record<string, string>;
  products?: ObjectId[];
};
export type Comment = Document & {
  content: string;
  postId: ObjectId;
  userId: ObjectId;
};
export type Product = Document & {
  name: string;
  slug: string;
  price: number;
  image: string;
  link: string;
  description: string;
  tags?: string[];
  category: string;
};
export type RefreshToken = Document & {
  token: string;
  userId: ObjectId;
  expires: Date;
};
export type Relationship = Document & {
  userId: ObjectId;
  name: string;
  relationshipType: string;
  preferences?: string[];
  anniversaries: {
    name: string;
    date: {
      day: number;
      month: number;
    };
  }[];
};
export type Notification = Document & {
  userId: ObjectId;
  relationshipId: ObjectId;
  message: string;
  title: string;
  read: boolean;
};
export type Filter = Document & {
  type: string;
  options: string[];
};
export type Otp = Document & {
  email: string;
  otp: string;
  expires: Date;
};
