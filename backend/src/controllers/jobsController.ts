import { Request, Response } from "express";
import { emailQueue } from "../queues/emailQueue";

export const runJob = async (req: Request, res: Response) => {
  const { type } = req.body;

  if (!type || !["aniversario", "profissao", "manual"].includes(type)) {
    return res.status(400).json({ error: "Tipo de job inválido" });
  }

  const job = await emailQueue.add({ type, payload: req.body.payload || null });

  res.json({ jobId: job.id });
};
