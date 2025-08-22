import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.config";
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const width = Number(req.query.width) || 500;
    const height = Number(req.query.height) || 500;
    const crop = (req.query.crop as string) || "fill";
    return {
      folder: "images_product",
      format: "webp",
      public_id: file.originalname.split(".")[0],
      transformation: [
        { quality: "auto", fetch_format: "webp", width, height, crop },
      ],
    };
  },
});
// const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
