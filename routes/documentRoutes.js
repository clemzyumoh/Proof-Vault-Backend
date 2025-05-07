


import express from "express";
import multer from "multer";
import {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// @route   POST /api/documents/upload
// @desc    Upload a document (requires wallet address)
// @access  Private
router.post("/upload", upload.single("file"), uploadDocument);

// @route   GET /api/documents/
// @desc    Get all documents for authenticated user using wallet address
// @access  Private
router.get("/", getUserDocuments);




router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument)

export default router;
