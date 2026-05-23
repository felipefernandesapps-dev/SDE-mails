#!/bin/bash

echo "🚀 Sistema de Disparo de E-mails - Instalação Rápida"
echo "=================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm
fi

# Verificar se PostgreSQL está rodando
if ! pg_isready &> /dev/null; then
    echo -e "${RED}PostgreSQL não está rodando!${NC}"
    echo "Por favor, inicie o PostgreSQL antes de continuar."
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL está rodando${NC}"
echo ""

# Backend
echo "📦 Instalando dependências do backend..."
cd backend
pnpm install

echo ""
echo "⚙️  Configurando banco de dados..."

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Por favor, edite o arquivo backend/.env com suas configurações${NC}"
fi

# Executar migrations
echo "Executando migrations..."
pnpm prisma:generate
pnpm prisma:migrate

# Executar seed
echo "Populando banco com dados iniciais..."
pnpm prisma:seed

echo -e "${GREEN}✓ Backend configurado com sucesso!${NC}"
echo ""

# Frontend
echo "📦 Instalando dependências do frontend..."
cd ../frontend
pnpm install

# Criar .env.local se não existir
if [ ! -f .env.local ]; then
    echo "Criando arquivo .env.local..."
    cp .env.local.example .env.local
fi

echo -e "${GREEN}✓ Frontend configurado com sucesso!${NC}"
echo ""

echo "=================================================="
echo -e "${GREEN}✅ Instalação concluída com sucesso!${NC}"
echo ""
echo "Para iniciar o sistema:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && pnpm dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && pnpm dev"
echo ""
echo "Acesse: http://localhost:3000"
echo "=================================================="
