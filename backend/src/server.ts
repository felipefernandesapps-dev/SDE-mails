import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";
import { initializeScheduler } from "./jobs/scheduler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📧 Sistema de disparo de e-mails iniciado`);

    await initializeScheduler();
  });
}

export default app;
