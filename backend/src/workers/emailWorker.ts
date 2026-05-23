import { emailQueue, EmailJobData } from "../queues/emailQueue";
import {
  processarAniversariantes,
  processarDatasComemorativas,
} from "../jobs/emailDispatchJob";
import logger from "../utils/logger";

const concurrency = Number(process.env.EMAIL_WORKER_CONCURRENCY || 2);

emailQueue.process(concurrency, async (job: any) => {
  const data: EmailJobData = job.data;
  logger.info({ job: job.id, type: data.type }, "Processing email job");

  try {
    if (data.type === "aniversario") {
      await processarAniversariantes();
    } else if (data.type === "profissao") {
      await processarDatasComemorativas();
    } else if (data.type === "manual") {
      // manual payload handling: can call specific functions or send single email
      logger.info("Manual email job payload: %o", data.payload);
    }

    return Promise.resolve();
  } catch (error: any) {
    logger.error({ err: error }, "Error processing email job");
    throw error;
  }
});

emailQueue.on("completed", (job: any) => {
  logger.info({ job: job.id }, "Email job completed");
});

emailQueue.on("failed", (job: any, err: Error) => {
  logger.error({ job: job?.id, err: err.message }, "Email job failed");
});

logger.info("Email worker initialized");
