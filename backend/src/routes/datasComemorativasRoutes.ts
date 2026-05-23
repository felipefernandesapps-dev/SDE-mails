import { Router } from "express";
import * as datasComemorativasController from "../controllers/datasComemorativasController";
import auth from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";

const router = Router();

// Datas comemorativas management restricted to admins
router.use(auth, requireAdmin);

router.post("/", datasComemorativasController.createDataComemorativa);
router.get("/", datasComemorativasController.getDatasComemorativas);
router.get("/:id", datasComemorativasController.getDataComemorativa);
router.put("/:id", datasComemorativasController.updateDataComemorativa);
router.delete("/:id", datasComemorativasController.deleteDataComemorativa);

export default router;
