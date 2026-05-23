# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Sistema de Disparo de E-mails!

## Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/email-dispatcher.git
cd email-dispatcher
```

### 2. Instalar Dependências

```bash
# Método 1: Script automático
./quick-start.sh

# Método 2: Manual
pnpm install:all
```

### 3. Criar Branch

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

**Padrão de nomenclatura:**
- `feature/` - Novas funcionalidades
- `fix/` - Correções de bugs
- `docs/` - Alterações em documentação
- `refactor/` - Refatoração de código
- `test/` - Adição de testes

### 4. Fazer Alterações

- Siga os padrões de código existentes
- Mantenha a consistência com o código atual
- Adicione testes quando apropriado
- Atualize documentação se necessário

### 5. Testar Localmente

```bash
# Backend
cd backend
pnpm dev

# Frontend
cd frontend
pnpm dev

# Verificar se tudo funciona
# Testar manualmente as mudanças
```

### 6. Commit

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: adiciona filtro de busca por profissão"
git commit -m "fix: corrige erro no envio de emails"
git commit -m "docs: atualiza README com novas instruções"
```

**Tipos de commit:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação (não afeta código)
- `refactor` - Refatoração
- `test` - Testes
- `chore` - Manutenção

### 7. Push e Pull Request

```bash
git push origin feature/minha-feature
```

Abra um Pull Request no GitHub com:
- Descrição clara das mudanças
- Screenshots (se aplicável)
- Referências a issues relacionadas

## Padrões de Código

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any`
- Prefira interfaces para objetos
- Use enums para valores fixos

### Backend

```typescript
// ✅ Bom
export const createDestinatario = async (req: Request, res: Response) => {
  const { error, value } = schema.validate(req.body);
  // ...
};

// ❌ Evitar
export const createDestinatario = async (req: any, res: any) => {
  const data = req.body;
  // ...
};
```

### Frontend

```typescript
// ✅ Bom
interface Destinatario {
  id: number;
  nome: string;
  email: string;
}

const [data, setData] = useState<Destinatario[]>([]);

// ❌ Evitar
const [data, setData] = useState([]);
```

### Nomenclatura

- **Variáveis/Funções:** camelCase
  - `const userName = 'João';`
  - `function getUserById() {}`

- **Componentes React:** PascalCase
  - `MainLayout.tsx`
  - `<DestinatarioForm />`

- **Arquivos:** kebab-case ou PascalCase
  - `email-service.ts`
  - `DestinatarioController.ts`

- **Constantes:** UPPER_SNAKE_CASE
  - `const MAX_RETRIES = 3;`

## Estrutura de Commits

### Boa mensagem

```
feat: adiciona paginação na listagem de destinatários

- Implementa paginação no backend
- Atualiza componente de tabela no frontend
- Adiciona parâmetros page e limit na API

Closes #42
```

### Mensagem ruim

```
atualização
```

## Diretrizes

### 1. Código Limpo

- Funções pequenas e focadas
- Nomes descritivos
- Comentários apenas quando necessário
- DRY (Don't Repeat Yourself)

### 2. Segurança

- Nunca commitar senhas ou chaves
- Validar todas as entradas
- Sanitizar dados do usuário
- Use prepared statements (Prisma faz isso)

### 3. Performance

- Evite N+1 queries
- Use includes do Prisma quando necessário
- Pagination em listagens grandes
- Índices no banco de dados

### 4. Testes

Atualmente o projeto não tem testes automatizados, mas são bem-vindos!

```typescript
// Exemplo de teste futuro
describe('DestinatarioController', () => {
  it('should create a new destinatario', async () => {
    // ...
  });
});
```

## Pull Request Checklist

Antes de abrir um PR, verifique:

- [ ] Código funciona localmente
- [ ] Sem erros de TypeScript
- [ ] Sem warnings no console
- [ ] Documentação atualizada
- [ ] Commits seguem o padrão
- [ ] Branch está atualizada com main
- [ ] PR tem descrição clara

## Reportar Bugs

Use o template de issue:

```markdown
**Descrição do Bug**
Descrição clara e concisa.

**Passos para Reproduzir**
1. Vá em '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável.

**Ambiente**
- OS: [e.g. Ubuntu 22.04]
- Node: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]
```

## Sugerir Funcionalidades

```markdown
**Sua sugestão está relacionada a um problema?**
Descrição clara do problema.

**Descreva a solução**
Como você imagina a funcionalidade.

**Alternativas consideradas**
Outras abordagens que você pensou.

**Contexto adicional**
Qualquer outra informação relevante.
```

## Processo de Review

1. Mantenedor revisa o código
2. Feedback é dado (se necessário)
3. Você faz as alterações solicitadas
4. PR é aprovado e merged

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite feedback construtivo
- Foque no que é melhor para o projeto
- Seja paciente com iniciantes

## Primeiros Passos

Não sabe por onde começar? Procure por issues com a label:
- `good first issue` - Bom para iniciantes
- `help wanted` - Precisamos de ajuda
- `documentation` - Melhorias na documentação

## Dúvidas?

- Abra uma issue
- Entre em contato via [email/discord/etc]
- Consulte a documentação existente

---

**Obrigado pela sua contribuição!** 🎉
