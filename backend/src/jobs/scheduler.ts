import cron from "node-cron";
import prisma from "../config/database";
import { emailQueue } from "../queues/emailQueue";

let scheduledTaskAniversario: cron.ScheduledTask | null = null;
let scheduledTaskProfissao: cron.ScheduledTask | null = null;

export const initializeScheduler = async () => {
  console.log("[Scheduler] Inicializando scheduler...");

  // Para os jobs existentes
  if (scheduledTaskAniversario) {
    scheduledTaskAniversario.stop();
  }
  if (scheduledTaskProfissao) {
    scheduledTaskProfissao.stop();
  }

  const config = await prisma.configuracaoSmtp.findFirst();

  if (!config) {
    console.log(
      "[Scheduler] Configuração SMTP não encontrada. Scheduler não iniciado.",
    );
    return;
  }

  // Job para aniversariantes
  const [horaAniv, minutoAniv] = config.horarioDisparoAniversario.split(":");
  const cronExpressionAniv = `${minutoAniv} ${horaAniv} * * *`;

  scheduledTaskAniversario = cron.schedule(cronExpressionAniv, async () => {
    console.log(
      `[Scheduler] Executando job de ANIVERSÁRIOS às ${config.horarioDisparoAniversario}`,
    );

    try {
      await emailQueue.add({ type: "aniversario" });
    } catch (error) {
      console.error("[Scheduler] Erro ao executar job de aniversários:", error);
    }
  });

  console.log(
    `[Scheduler] Job de ANIVERSÁRIOS agendado para ${config.horarioDisparoAniversario} (${cronExpressionAniv})`,
  );

  // Job para datas comemorativas (profissões)
  const [horaProf, minutoProf] = config.horarioDisparoProfissao.split(":");
  const cronExpressionProf = `${minutoProf} ${horaProf} * * *`;

  scheduledTaskProfissao = cron.schedule(cronExpressionProf, async () => {
    console.log(
      `[Scheduler] Executando job de PROFISSÕES às ${config.horarioDisparoProfissao}`,
    );

    try {
      await emailQueue.add({ type: "profissao" });
    } catch (error) {
      console.error("[Scheduler] Erro ao executar job de profissões:", error);
    }
  });

  console.log(
    `[Scheduler] Job de PROFISSÕES agendado para ${config.horarioDisparoProfissao} (${cronExpressionProf})`,
  );
};

export const restartScheduler = async () => {
  console.log("[Scheduler] Reiniciando scheduler...");
  await initializeScheduler();
};
