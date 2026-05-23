import nodemailer from 'nodemailer';
import prisma from '../config/database';
import { decrypt } from '../utils/crypto';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const getTransporter = async () => {
  const config = await prisma.configuracaoSmtp.findFirst();

  if (!config) {
    throw new Error('Configuração SMTP não encontrada');
  }

  const senhaDecriptada = decrypt(config.senha);

  const transporter = nodemailer.createTransport({
    host: config.servidor,
    port: config.porta,
    secure: config.porta === 465,
    auth: {
      user: config.usuario,
      pass: senhaDecriptada
    }
  });

  return { transporter, fromEmail: config.usuario };
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { transporter, fromEmail } = await getTransporter();

  await transporter.sendMail({
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    html: options.html
  });

  await new Promise(resolve => setTimeout(resolve, 1500));
};

export const substituirVariaveis = (texto: string, destinatario: any): string => {
  let resultado = texto;
  resultado = resultado.replace(/\{\{nome\}\}/g, destinatario.nome);
  resultado = resultado.replace(/\{\{email\}\}/g, destinatario.email);
  resultado = resultado.replace(/\{\{profissao\}\}/g, destinatario.profissao);
  resultado = resultado.replace(/\{\{data_aniversario\}\}/g, destinatario.dataAniversario.toLocaleDateString('pt-BR'));
  resultado = resultado.replace(/\{\{ano_atual\}\}/g, new Date().getFullYear().toString());
  return resultado;
};
