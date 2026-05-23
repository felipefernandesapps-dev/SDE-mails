import { Request, Response } from 'express';
import prisma from '../config/database';
import Joi from 'joi';

const destinatarioSchema = Joi.object({
  nome: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  dataAniversario: Joi.date().required(),
  profissao: Joi.string().required().min(3),
  ativo: Joi.boolean().optional()
});

export const createDestinatario = async (req: Request, res: Response) => {
  const { error, value } = destinatarioSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const destinatario = await prisma.destinatario.create({
    data: {
      nome: value.nome,
      email: value.email,
      dataAniversario: new Date(value.dataAniversario),
      profissao: value.profissao,
      ativo: value.ativo ?? true
    }
  });

  res.status(201).json(destinatario);
};

export const getDestinatarios = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = search
    ? {
        OR: [
          { nome: { contains: String(search), mode: 'insensitive' as const } },
          { email: { contains: String(search), mode: 'insensitive' as const } },
          { profissao: { contains: String(search), mode: 'insensitive' as const } }
        ]
      }
    : {};

  const [destinatarios, total] = await Promise.all([
    prisma.destinatario.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { nome: 'asc' }
    }),
    prisma.destinatario.count({ where })
  ]);

  res.json({
    data: destinatarios,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
};

export const getDestinatario = async (req: Request, res: Response) => {
  const { id } = req.params;

  const destinatario = await prisma.destinatario.findUnique({
    where: { id: Number(id) }
  });

  if (!destinatario) {
    return res.status(404).json({ error: 'Destinatário não encontrado' });
  }

  res.json(destinatario);
};

export const updateDestinatario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error, value } = destinatarioSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const destinatario = await prisma.destinatario.update({
    where: { id: Number(id) },
    data: {
      nome: value.nome,
      email: value.email,
      dataAniversario: new Date(value.dataAniversario),
      profissao: value.profissao,
      ativo: value.ativo ?? true
    }
  });

  res.json(destinatario);
};

export const deleteDestinatario = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.destinatario.delete({
    where: { id: Number(id) }
  });

  res.status(204).send();
};
