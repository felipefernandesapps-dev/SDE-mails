import { Request, Response } from 'express';
import prisma from '../config/database';

export const getHistorico = async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, dataInicio, dataFim } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (status) {
    where.status = String(status);
  }

  if (dataInicio || dataFim) {
    where.dataDisparo = {};
    if (dataInicio) {
      where.dataDisparo.gte = new Date(String(dataInicio));
    }
    if (dataFim) {
      where.dataDisparo.lte = new Date(String(dataFim));
    }
  }

  const [historicos, total] = await Promise.all([
    prisma.historicoDisparo.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        destinatario: true,
        template: true
      },
      orderBy: { dataDisparo: 'desc' }
    }),
    prisma.historicoDisparo.count({ where })
  ]);

  res.json({
    data: historicos,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
};

export const getStats = async (req: Request, res: Response) => {
  const { dataInicio, dataFim } = req.query;

  const where: any = {};

  if (dataInicio || dataFim) {
    where.dataDisparo = {};
    if (dataInicio) {
      where.dataDisparo.gte = new Date(String(dataInicio));
    }
    if (dataFim) {
      where.dataDisparo.lte = new Date(String(dataFim));
    }
  }

  const [total, enviados, falhas, pendentes] = await Promise.all([
    prisma.historicoDisparo.count({ where }),
    prisma.historicoDisparo.count({ where: { ...where, status: 'enviado' } }),
    prisma.historicoDisparo.count({ where: { ...where, status: 'falha' } }),
    prisma.historicoDisparo.count({ where: { ...where, status: 'pendente' } })
  ]);

  const taxaSucesso = total > 0 ? ((enviados / total) * 100).toFixed(2) : '0';

  res.json({
    total,
    enviados,
    falhas,
    pendentes,
    taxaSucesso: Number(taxaSucesso)
  });
};
