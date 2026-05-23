import { Request, Response } from 'express';
import prisma from '../config/database';
import Joi from 'joi';
import { encrypt, decrypt } from '../utils/crypto';
import nodemailer from 'nodemailer';

const smtpSchema = Joi.object({
  servidor: Joi.string().required(),
  porta: Joi.number().required(),
  usuario: Joi.string().email().required(),
  senha: Joi.string().required(),
  horarioDisparoAniversario: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required(),
  horarioDisparoProfissao: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required()
});

export const saveConfigSmtp = async (req: Request, res: Response) => {
  const { error, value } = smtpSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const senhaEncriptada = encrypt(value.senha);

  const existingConfig = await prisma.configuracaoSmtp.findFirst();

  let config;
  if (existingConfig) {
    config = await prisma.configuracaoSmtp.update({
      where: { id: existingConfig.id },
      data: {
        servidor: value.servidor,
        porta: value.porta,
        usuario: value.usuario,
        senha: senhaEncriptada,
        horarioDisparoAniversario: value.horarioDisparoAniversario,
        horarioDisparoProfissao: value.horarioDisparoProfissao
      }
    });
  } else {
    config = await prisma.configuracaoSmtp.create({
      data: {
        servidor: value.servidor,
        porta: value.porta,
        usuario: value.usuario,
        senha: senhaEncriptada,
        horarioDisparoAniversario: value.horarioDisparoAniversario,
        horarioDisparoProfissao: value.horarioDisparoProfissao
      }
    });
  }

  const { senha, ...configSemSenha } = config;

  res.json(configSemSenha);
};

export const getConfigSmtp = async (req: Request, res: Response) => {
  const config = await prisma.configuracaoSmtp.findFirst();

  if (!config) {
    return res.status(404).json({ error: 'Configuração SMTP não encontrada' });
  }

  const { senha, ...configSemSenha } = config;

  res.json(configSemSenha);
};

export const testSmtpConnection = async (req: Request, res: Response) => {
  const { servidor, porta, usuario, senha } = req.body;

  if (!servidor || !porta || !usuario || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: servidor,
      port: porta,
      secure: porta === 465,
      auth: {
        user: usuario,
        pass: senha
      }
    });

    await transporter.verify();

    res.json({ success: true, message: 'Conexão SMTP estabelecida com sucesso!' });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Falha ao conectar ao servidor SMTP',
      error: error.message
    });
  }
};
