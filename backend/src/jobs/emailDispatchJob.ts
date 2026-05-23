import prisma from '../config/database';
import { sendEmail, substituirVariaveis } from '../services/emailService';

export const processarAniversariantes = async () => {
  console.log('[Job] Processando aniversariantes do dia...');

  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const dia = hoje.getDate();

  const destinatarios = await prisma.destinatario.findMany({
    where: {
      ativo: true
    }
  });

  const aniversariantes = destinatarios.filter(d => {
    const dataAniv = new Date(d.dataAniversario);
    return dataAniv.getMonth() + 1 === mes && dataAniv.getDate() === dia;
  });

  if (aniversariantes.length === 0) {
    console.log('[Job] Nenhum aniversariante hoje.');
    return;
  }

  const template = await prisma.template.findFirst({
    where: {
      tipo: 'aniversario',
      ativo: true
    }
  });

  if (!template) {
    console.log('[Job] Template de aniversário não encontrado.');
    return;
  }

  for (const destinatario of aniversariantes) {
    const jaEnviado = await prisma.historicoDisparo.findFirst({
      where: {
        destinatarioId: destinatario.id,
        templateId: template.id,
        dataDisparo: {
          gte: new Date(hoje.setHours(0, 0, 0, 0)),
          lt: new Date(hoje.setHours(23, 59, 59, 999))
        }
      }
    });

    if (jaEnviado) {
      console.log(`[Job] E-mail já enviado para ${destinatario.nome}`);
      continue;
    }

    try {
      const assunto = substituirVariaveis(template.assunto, destinatario);
      const corpo = substituirVariaveis(template.corpo, destinatario);

      await sendEmail({
        to: destinatario.email,
        subject: assunto,
        html: corpo
      });

      await prisma.historicoDisparo.create({
        data: {
          destinatarioId: destinatario.id,
          templateId: template.id,
          status: 'enviado'
        }
      });

      console.log(`[Job] E-mail enviado para ${destinatario.nome}`);
    } catch (error: any) {
      console.error(`[Job] Erro ao enviar e-mail para ${destinatario.nome}:`, error.message);

      await prisma.historicoDisparo.create({
        data: {
          destinatarioId: destinatario.id,
          templateId: template.id,
          status: 'falha',
          erroMensagem: error.message
        }
      });
    }
  }

  console.log(`[Job] Processamento concluído. ${aniversariantes.length} aniversariantes.`);
};

export const processarDatasComemorativas = async () => {
  console.log('[Job] Processando datas comemorativas...');

  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  const dataHoje = `${mes}-${dia}`;

  const datasComemorativas = await prisma.dataComemorativa.findMany({
    where: {
      dataComemorativa: dataHoje,
      ativo: true
    }
  });

  if (datasComemorativas.length === 0) {
    console.log('[Job] Nenhuma data comemorativa hoje.');
    return;
  }

  const template = await prisma.template.findFirst({
    where: {
      tipo: 'profissao',
      ativo: true
    }
  });

  if (!template) {
    console.log('[Job] Template de profissão não encontrado.');
    return;
  }

  for (const dataComemorativa of datasComemorativas) {
    const destinatarios = await prisma.destinatario.findMany({
      where: {
        profissao: {
          contains: dataComemorativa.profissao,
          mode: 'insensitive'
        },
        ativo: true
      }
    });

    for (const destinatario of destinatarios) {
      const jaEnviado = await prisma.historicoDisparo.findFirst({
        where: {
          destinatarioId: destinatario.id,
          templateId: template.id,
          dataDisparo: {
            gte: new Date(hoje.setHours(0, 0, 0, 0)),
            lt: new Date(hoje.setHours(23, 59, 59, 999))
          }
        }
      });

      if (jaEnviado) {
        console.log(`[Job] E-mail já enviado para ${destinatario.nome}`);
        continue;
      }

      try {
        const assunto = substituirVariaveis(template.assunto, destinatario);
        const corpo = substituirVariaveis(template.corpo, destinatario);

        await sendEmail({
          to: destinatario.email,
          subject: assunto,
          html: corpo
        });

        await prisma.historicoDisparo.create({
          data: {
            destinatarioId: destinatario.id,
            templateId: template.id,
            status: 'enviado'
          }
        });

        console.log(`[Job] E-mail enviado para ${destinatario.nome}`);
      } catch (error: any) {
        console.error(`[Job] Erro ao enviar e-mail para ${destinatario.nome}:`, error.message);

        await prisma.historicoDisparo.create({
          data: {
            destinatarioId: destinatario.id,
            templateId: template.id,
            status: 'falha',
            erroMensagem: error.message
          }
        });
      }
    }
  }

  console.log('[Job] Processamento de datas comemorativas concluído.');
};
