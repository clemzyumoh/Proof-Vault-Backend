import express from "express";
import multer from "multer";
import { uploadFileToIPFS } from "../controllers/ipfsController.js";

const router = express.Router();

// Use multer to handle file upload
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFileToIPFS);

export default router;
