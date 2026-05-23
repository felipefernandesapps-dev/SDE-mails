import { Router } from "express";
import * as historicoController from "../controllers/historicoController";
import auth from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";

const router = Router();

// Historico viewing restricted to admins
router.use(auth, requireAdmin);

router.get("/", historicoController.getHistorico);
router.get("/stats", historicoController.getStats);

export default router;
