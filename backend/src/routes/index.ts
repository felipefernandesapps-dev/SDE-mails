import { Router } from "express";
import destinatarioRoutes from "./destinatarioRoutes";
import templateRoutes from "./templateRoutes";
import smtpRoutes from "./smtpRoutes";
import datasComemorativasRoutes from "./datasComemorativasRoutes";
import historicoRoutes from "./historicoRoutes";
import jobsRoutes from "./jobsRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/destinatarios", destinatarioRoutes);
router.use("/templates", templateRoutes);
router.use("/config/smtp", smtpRoutes);
router.use("/datas-comemorativas", datasComemorativasRoutes);
router.use("/historico", historicoRoutes);
router.use("/jobs", jobsRoutes);
router.use("/auth", authRoutes);

export default router;
