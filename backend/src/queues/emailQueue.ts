import Queue from "bull";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const emailQueue = new Queue("email-queue", redisUrl);

export type EmailJobData = {
  type: "aniversario" | "profissao" | "manual";
  payload?: any;
};

export default emailQueue;
