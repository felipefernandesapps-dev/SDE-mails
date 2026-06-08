import { Request, Response } from 'express';
import prisma from '../config/database';
import Joi from 'joi';

const dataComemorativaSchema = Joi.object({
  profissao: Joi.string().required().min(3),
  dataComemorativa: Joi.string().pattern(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
  descricao: Joi.string().required().min(3),
  ativo: Joi.boolean().optional()
});

export const createDataComemorativa = async (req: Request, res: Response) => {
  const { error, value } = dataComemorativaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const data = await prisma.dataComemorativa.create({
    data: {
      profissao: value.profissao,
      dataComemorativa: value.dataComemorativa,
      descricao: value.descricao,
      ativo: value.ativo ?? true
    }
  });

  res.status(201).json(data);
};

export const getDatasComemorativas = async (req: Request, res: Response) => {
  const { profissao } = req.query;

  const where = profissao
    ? { profissao: { contains: String(profissao), mode: 'insensitive' as const } }
    : {};

  const datas = await prisma.dataComemorativa.findMany({
    where,
    orderBy: { profissao: 'asc' }
  });

  res.json(datas);
};

export const getDataComemorativa = async (req: Request, res: Response) => {
  const { id } = req.params;

  const data = await prisma.dataComemorativa.findUnique({
    where: { id: Number(id) }
  });

  if (!data) {
    return res.status(404).json({ error: 'Data comemorativa não encontrada' });
  }

  res.json(data);
};

export const updateDataComemorativa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error, value } = dataComemorativaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const data = await prisma.dataComemorativa.update({
    where: { id: Number(id) },
    data: {
      profissao: value.profissao,
      dataComemorativa: value.dataComemorativa,
      descricao: value.descricao,
      ativo: value.ativo
    }
  });

  res.json(data);
};

export const deleteDataComemorativa = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.dataComemorativa.delete({
    where: { id: Number(id) }
  });

  res.status(204).send();
};
