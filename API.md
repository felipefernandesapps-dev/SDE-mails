# 📡 Documentação da API

Base URL: `http://localhost:3001/api`

## Endpoints

### 🏥 Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 👥 Destinatários

### Listar Destinatários

```http
GET /api/destinatarios?page=1&limit=10&search=joão
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional) - Busca por nome, email ou profissão

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "dataAniversario": "1990-05-15",
      "profissao": "Médico",
      "ativo": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Buscar Destinatário

```http
GET /api/destinatarios/:id
```

**Response:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "dataAniversario": "1990-05-15",
  "profissao": "Médico",
  "ativo": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Criar Destinatário

```http
POST /api/destinatarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "dataAniversario": "1990-05-15",
  "profissao": "Médico",
  "ativo": true
}
```

**Validações:**
- `nome`: obrigatório, mínimo 3 caracteres
- `email`: obrigatório, formato válido, único
- `dataAniversario`: obrigatório, formato ISO
- `profissao`: obrigatório, mínimo 3 caracteres
- `ativo`: opcional, boolean (default: true)

**Response:** 201 Created
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "dataAniversario": "1990-05-15",
  "profissao": "Médico",
  "ativo": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Atualizar Destinatário

```http
PUT /api/destinatarios/:id
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "email": "joao@example.com",
  "dataAniversario": "1990-05-15",
  "profissao": "Médico",
  "ativo": true
}
```

**Response:** 200 OK

### Deletar Destinatário

```http
DELETE /api/destinatarios/:id
```

**Response:** 204 No Content

---

## 📧 Templates

### Listar Templates

```http
GET /api/templates?tipo=aniversario
```

**Query Parameters:**
- `tipo` (string, optional): "aniversario" ou "profissao"

**Response:**
```json
[
  {
    "id": 1,
    "tipo": "aniversario",
    "assunto": "Feliz Aniversário, {{nome}}!",
    "corpo": "<html>...</html>",
    "ativo": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Buscar Template

```http
GET /api/templates/:id
```

### Criar Template

```http
POST /api/templates
Content-Type: application/json

{
  "tipo": "aniversario",
  "assunto": "Feliz Aniversário, {{nome}}!",
  "corpo": "<html><body>Parabéns {{nome}}!</body></html>",
  "ativo": true
}
```

**Variáveis disponíveis:**
- `{{nome}}`
- `{{email}}`
- `{{profissao}}`
- `{{data_aniversario}}`
- `{{ano_atual}}`

**Response:** 201 Created

### Atualizar Template

```http
PUT /api/templates/:id
```

### Deletar Template

```http
DELETE /api/templates/:id
```

### Preview de Template

```http
POST /api/templates/preview
Content-Type: application/json

{
  "corpo": "<p>Olá {{nome}}, feliz aniversário!</p>",
  "destinatarioId": 1
}
```

**Response:**
```json
{
  "preview": "<p>Olá João Silva, feliz aniversário!</p>"
}
```

---

## ⚙️ Configuração SMTP

### Buscar Configuração

```http
GET /api/config/smtp
```

**Response:**
```json
{
  "id": 1,
  "servidor": "smtp.gmail.com",
  "porta": 587,
  "usuario": "seuemail@gmail.com",
  "horarioDisparo": "09:00",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Nota:** A senha **não** é retornada por segurança.

### Salvar/Atualizar Configuração

```http
POST /api/config/smtp
Content-Type: application/json

{
  "servidor": "smtp.gmail.com",
  "porta": 587,
  "usuario": "seuemail@gmail.com",
  "senha": "sua-senha-de-app",
  "horarioDisparo": "09:00"
}
```

**Validações:**
- `servidor`: obrigatório
- `porta`: obrigatório, número entre 1-65535
- `usuario`: obrigatório, formato de email
- `senha`: obrigatório (na criação)
- `horarioDisparo`: obrigatório, formato HH:mm

**Response:** 200 OK

### Testar Conexão SMTP

```http
POST /api/config/smtp/test
Content-Type: application/json

{
  "servidor": "smtp.gmail.com",
  "porta": 587,
  "usuario": "seuemail@gmail.com",
  "senha": "sua-senha-de-app"
}
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "Conexão SMTP estabelecida com sucesso!"
}
```

**Response (erro):**
```json
{
  "success": false,
  "message": "Falha ao conectar ao servidor SMTP",
  "error": "Invalid login: 535-5.7.8 Username and Password not accepted"
}
```

---

## 📅 Datas Comemorativas

### Listar Datas

```http
GET /api/datas-comemorativas?profissao=médico
```

**Response:**
```json
[
  {
    "id": 1,
    "profissao": "Médico",
    "dataComemorativa": "10-18",
    "descricao": "Dia do Médico",
    "ativo": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Criar Data Comemorativa

```http
POST /api/datas-comemorativas
Content-Type: application/json

{
  "profissao": "Médico",
  "dataComemorativa": "10-18",
  "descricao": "Dia do Médico",
  "ativo": true
}
```

**Validações:**
- `profissao`: obrigatório, mínimo 3 caracteres
- `dataComemorativa`: obrigatório, formato MM-DD
- `descricao`: obrigatório, mínimo 3 caracteres
- `ativo`: opcional, boolean

### Atualizar Data

```http
PUT /api/datas-comemorativas/:id
```

### Deletar Data

```http
DELETE /api/datas-comemorativas/:id
```

---

## 📊 Histórico

### Listar Histórico

```http
GET /api/historico?page=1&limit=20&status=enviado&dataInicio=2024-01-01&dataFim=2024-01-31
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional): "enviado", "falha", "pendente"
- `dataInicio` (date, optional): formato YYYY-MM-DD
- `dataFim` (date, optional): formato YYYY-MM-DD

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "destinatarioId": 1,
      "templateId": 1,
      "dataDisparo": "2024-01-15T09:00:00.000Z",
      "status": "enviado",
      "erroMensagem": null,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "destinatario": {
        "id": 1,
        "nome": "João Silva",
        "email": "joao@example.com",
        "dataAniversario": "1990-05-15",
        "profissao": "Médico",
        "ativo": true
      },
      "template": {
        "id": 1,
        "tipo": "aniversario",
        "assunto": "Feliz Aniversário!",
        "corpo": "...",
        "ativo": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Estatísticas

```http
GET /api/historico/stats?dataInicio=2024-01-01&dataFim=2024-01-31
```

**Response:**
```json
{
  "total": 150,
  "enviados": 145,
  "falhas": 3,
  "pendentes": 2,
  "taxaSucesso": 96.67
}
```

---

## 🔐 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 204 | No Content - Deleção bem-sucedida |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Registro duplicado |
| 500 | Internal Server Error - Erro do servidor |

---

## ❌ Formato de Erros

```json
{
  "error": "Mensagem de erro descritiva"
}
```

**Exemplos:**

Validação:
```json
{
  "error": "\"email\" must be a valid email"
}
```

Duplicação:
```json
{
  "error": "Registro duplicado",
  "field": ["email"]
}
```

Não encontrado:
```json
{
  "error": "Registro não encontrado"
}
```

---

## 🧪 Exemplos com cURL

### Criar Destinatário

```bash
curl -X POST http://localhost:3001/api/destinatarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@example.com",
    "dataAniversario": "1985-03-20",
    "profissao": "Professora"
  }'
```

### Listar com Filtro

```bash
curl "http://localhost:3001/api/destinatarios?search=maria&page=1&limit=10"
```

### Configurar SMTP

```bash
curl -X POST http://localhost:3001/api/config/smtp \
  -H "Content-Type: application/json" \
  -d '{
    "servidor": "smtp.gmail.com",
    "porta": 587,
    "usuario": "seuemail@gmail.com",
    "senha": "sua-senha-de-app",
    "horarioDisparo": "09:00"
  }'
```

### Buscar Histórico com Filtros

```bash
curl "http://localhost:3001/api/historico?status=enviado&dataInicio=2024-01-01&dataFim=2024-01-31"
```

---

## 📦 Collection do Postman

Importe esta collection para testar todos os endpoints:

```json
{
  "info": {
    "name": "Sistema de Disparo de E-mails",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Destinatários",
      "item": [
        {
          "name": "Listar",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/destinatarios"
          }
        },
        {
          "name": "Criar",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/destinatarios",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nome\": \"Teste\",\n  \"email\": \"teste@example.com\",\n  \"dataAniversario\": \"1990-01-01\",\n  \"profissao\": \"Teste\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api"
    }
  ]
}
```

---

**Última atualização:** 2024
**Versão da API:** 1.0.0
