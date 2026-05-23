import { Router } from "express";
import * as smtpController from "../controllers/smtpController";
import auth from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";

const router = Router();

// All SMTP config endpoints require admin
router.use(auth, requireAdmin);

router.post("/", smtpController.saveConfigSmtp);
router.get("/", smtpController.getConfigSmtp);
router.post("/test", smtpController.testSmtpConnection);

export default router;
