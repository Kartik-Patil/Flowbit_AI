import express from "express";
import multer from "multer";
import { gfsBucket } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  if (!gfsBucket) return res.status(500).json({ error: "Storage not ready" });

  const { originalname, buffer, mimetype } = req.file;
  const uploadStream = gfsBucket.openUploadStream(originalname, { contentType: mimetype });
  uploadStream.end(buffer);

  uploadStream.on("finish", () => {
    res.json({ fileId: uploadStream.id.toString(), fileName: originalname });
  });

  uploadStream.on("error", (err) => {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  });
});

export default router;
