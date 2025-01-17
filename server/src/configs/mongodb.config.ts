import mongoose from "mongoose";

export const connectMongoDb = async () => {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log("***Connected to MongoDB successfully***");
  } catch (error) {
    console.log({ MongooseError: error });
    process.exit(1); // Exit if connection fails
  }
};
