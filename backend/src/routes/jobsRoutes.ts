import { Router } from "express";
import { runJob } from "../controllers/jobsController";

const router = Router();

router.post("/run", runJob);

export default router;
