import { Request, Response } from 'express';
import prisma from '../config/database';
import Joi from 'joi';

const templateSchema = Joi.object({
  tipo: Joi.string().valid('aniversario', 'profissao').required(),
  assunto: Joi.string().required().min(3),
  corpo: Joi.string().required().min(10),
  ativo: Joi.boolean().optional()
});

export const createTemplate = async (req: Request, res: Response) => {
  const { error, value } = templateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const template = await prisma.template.create({
    data: {
      tipo: value.tipo,
      assunto: value.assunto,
      corpo: value.corpo,
      ativo: value.ativo ?? true
    }
  });

  res.status(201).json(template);
};

export const getTemplates = async (req: Request, res: Response) => {
  const { tipo } = req.query;

  const where = tipo ? { tipo: String(tipo) as 'aniversario' | 'profissao' } : {};

  const templates = await prisma.template.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  res.json(templates);
};

export const getTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = await prisma.template.findUnique({
    where: { id: Number(id) }
  });

  if (!template) {
    return res.status(404).json({ error: 'Template não encontrado' });
  }

  res.json(template);
};

export const updateTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error, value } = templateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const template = await prisma.template.update({
    where: { id: Number(id) },
    data: {
      tipo: value.tipo,
      assunto: value.assunto,
      corpo: value.corpo,
      ativo: value.ativo
    }
  });

  res.json(template);
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.template.delete({
    where: { id: Number(id) }
  });

  res.status(204).send();
};

export const previewTemplate = async (req: Request, res: Response) => {
  const { corpo, destinatarioId } = req.body;

  if (!corpo || !destinatarioId) {
    return res.status(400).json({ error: 'Corpo e destinatarioId são obrigatórios' });
  }

  const destinatario = await prisma.destinatario.findUnique({
    where: { id: Number(destinatarioId) }
  });

  if (!destinatario) {
    return res.status(404).json({ error: 'Destinatário não encontrado' });
  }

  let preview = corpo;
  preview = preview.replace(/\{\{nome\}\}/g, destinatario.nome);
  preview = preview.replace(/\{\{email\}\}/g, destinatario.email);
  preview = preview.replace(/\{\{profissao\}\}/g, destinatario.profissao);
  preview = preview.replace(/\{\{data_aniversario\}\}/g, destinatario.dataAniversario.toLocaleDateString('pt-BR'));
  preview = preview.replace(/\{\{ano_atual\}\}/g, new Date().getFullYear().toString());

  res.json({ preview });
};
