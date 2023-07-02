import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

export const extractPublicIdFromUrl = (url) => {
  const startIndex = url.lastIndexOf("/") + 1;
  const endIndex = url.lastIndexOf(".");
  return url.substring(startIndex, endIndex);
}

export const upload = multer({ storage });
