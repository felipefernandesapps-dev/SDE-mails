import { Router } from "express";
import * as destinatarioController from "../controllers/destinatarioController";
import auth from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";

const router = Router();

// Destinatários management restricted to admins
router.use(auth, requireAdmin);

router.post("/", destinatarioController.createDestinatario);
router.get("/", destinatarioController.getDestinatarios);
router.get("/:id", destinatarioController.getDestinatario);
router.put("/:id", destinatarioController.updateDestinatario);
router.delete("/:id", destinatarioController.deleteDestinatario);

export default router;
