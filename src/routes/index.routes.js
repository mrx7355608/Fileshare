import { Router } from "express";
import multer from "multer";

import { indexControllers } from "../controllers/index.controllers.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/", indexControllers.renderHomePage);
router.get("/upload-file", indexControllers.renderUploadFilePage);
router.post("/upload-file", upload.single("file"), indexControllers.uploadFile);
router.get("/download-file/:id", indexControllers.renderDownloadFilePage);
router.post("/download-file/:id", indexControllers.downloadFile);
router.get("/search", indexControllers.renderSearchPage);

export default router;
