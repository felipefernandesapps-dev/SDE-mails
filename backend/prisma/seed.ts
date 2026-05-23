import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const datasComemorativas = [
    { profissao: 'Médico', dataComemorativa: '10-18', descricao: 'Dia do Médico' },
    { profissao: 'Professor', dataComemorativa: '10-15', descricao: 'Dia do Professor' },
    { profissao: 'Enfermeiro', dataComemorativa: '05-12', descricao: 'Dia do Enfermeiro' },
    { profissao: 'Advogado', dataComemorativa: '08-11', descricao: 'Dia do Advogado' },
    { profissao: 'Engenheiro', dataComemorativa: '12-11', descricao: 'Dia do Engenheiro' },
    { profissao: 'Contador', dataComemorativa: '04-25', descricao: 'Dia do Contador' },
    { profissao: 'Jornalista', dataComemorativa: '04-07', descricao: 'Dia do Jornalista' },
    { profissao: 'Dentista', dataComemorativa: '10-25', descricao: 'Dia do Dentista' },
    { profissao: 'Farmacêutico', dataComemorativa: '01-20', descricao: 'Dia do Farmacêutico' },
    { profissao: 'Programador', dataComemorativa: '09-13', descricao: 'Dia do Programador' },
    { profissao: 'Designer', dataComemorativa: '11-05', descricao: 'Dia do Designer Gráfico' },
    { profissao: 'Arquiteto', dataComemorativa: '12-11', descricao: 'Dia do Arquiteto' }
  ];

  for (const data of datasComemorativas) {
    await prisma.dataComemorativa.upsert({
      where: {
        id: datasComemorativas.indexOf(data) + 1
      },
      update: {},
      create: data
    });
  }

  const templateAniversario = await prisma.template.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tipo: 'aniversario',
      assunto: 'Feliz Aniversário, {{nome}}! 🎉',
      corpo: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #4CAF50; text-align: center;">🎂 Feliz Aniversário! 🎂</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Olá, <strong>{{nome}}</strong>!
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hoje é um dia especial! Queremos desejar a você um feliz aniversário repleto de alegrias,
              realizações e momentos inesquecíveis.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Que este novo ano de vida traga muita saúde, prosperidade e sucesso em sua carreira como
              <strong>{{profissao}}</strong>.
            </p>
            <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px;">🎉 Parabéns pelo seu dia! 🎉</p>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">
              Um grande abraço!<br>
              Equipe
            </p>
          </div>
        </div>
      `,
      ativo: true
    }
  });

  const templateProfissao = await prisma.template.upsert({
    where: { id: 2 },
    update: {},
    create: {
      tipo: 'profissao',
      assunto: 'Feliz Dia do(a) {{profissao}}! 🎊',
      corpo: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #2196F3; text-align: center;">🎊 Feliz Dia do(a) {{profissao}}! 🎊</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Olá, <strong>{{nome}}</strong>!
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hoje é o dia de celebrar a sua profissão! Queremos reconhecer e valorizar todo o seu
              trabalho, dedicação e profissionalismo.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Parabéns por ser um(a) <strong>{{profissao}}</strong> exemplar! Seu comprometimento e
              excelência fazem toda a diferença.
            </p>
            <div style="background-color: #2196F3; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-size: 18px;">🌟 Continue brilhando! 🌟</p>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">
              Com admiração,<br>
              Equipe
            </p>
          </div>
        </div>
      `,
      ativo: true
    }
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`   - ${datasComemorativas.length} datas comemorativas criadas`);
  console.log('   - 2 templates criados (aniversário e profissão)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
