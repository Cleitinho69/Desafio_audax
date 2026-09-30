# desafio_audax

API de recepção e classificação de leads via Gemini AI, construída com **Bun**, **Hono** e **Prisma 8** (PostgreSQL).

## Arquitetura

```
POST /leads
  → zValidator (schema)
  → AiService.classifyLead(message)
       → GoogleGenAI (gemini-2.5-flash)
       → fallback em erro/schema inválido
  → LeadModule.saveLead(input, aiResult)
       → Prisma ORM (PostgreSQL)
  → 201 JSON com lead + classificação
```

## Estrutura de diretórios

```
src/
├── app.ts                  # App Hono: rotas + error handler global
├── index.ts                # Entrypoint; exporta port + fetch handler
├── controllers/
│   └── lead.controller.ts  # Lógica de criação do lead
├── routes/
│   └── lead.routes.ts      # POST /leads com validação zod
├── services/
│   └── ai.service.ts       # Chamada Gemini + fallback
├── modules/
│   └── lead.module.ts      # Acesso ao ORM (save/find)
├── middlewares/
│   └── error-handler.ts    # Error handler global do Hono
├── types/
│   └── lead.types.ts       # Schemas Zod + tipos
├── prisma/
│   ├── contract.prisma     # Schema Prisma (Lead)
│   ├── contract.json       # Contrato gerado
│   ├── contract.d.ts       # Tipos gerados
│   └── db.ts               # Cliente Prisma ORM
└── tests/
    └── unit/               # Testes bun test
        ├── ai.service.test.ts
        ├── lead.module.test.ts
        ├── lead.controller.test.ts
        ├── error-handler.test.ts
        └── lead.types.test.ts
migrations/
```

## Modelo de dados — `Lead`

| Campo              | Tipo         | Obrigatório | Padrão   |
|--------------------|--------------|-------------|----------|
| id                 | UUID         | sim         | uuid()   |
| name               | String       | sim         | —        |
| email              | String       | sim         | —        |
| message            | String       | sim         | —        |
| source             | LeadSource   | sim         | —        |
| aiIntent           | LeadIntent   | não         | UNKNOWN  |
| aiPriority         | LeadPriority | não         | MEDIUM   |
| aiSummary          | String?      | não         | —        |
| aiStatus           | AiStatus     | sim         | PENDING  |
| aiErrorMessage     | String?      | não         | null     |
| createdAt / updatedAt | DateTime | —          | now()    |

### Enums

- **LeadSource**: `LANDING_PAGE`
- **LeadIntent**: `SALES`, `UNKNOWN`
- **LeadPriority**: `LOW`, `MEDIUM`, `HIGH`
- **AiStatus**: `PENDING`, `COMPLETED`, `FAILED`, `FALLBACK`

## Requisitos

- [Bun](https://bun.com) ≥ 1.4
- PostgreSQL
- Chave de API Gemini (`GEMINI_API_KEY`)

## Variáveis de ambiente (`.env`)

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
GEMINI_API_KEY="..."
PORT=3000
```

## Instalação e execução

```bash
bun install
bun run db:contract   # gera contract (se necessário)
bun run db:init        # inicializa DB
bun start              # ou: bun run index.ts
```

## Endpoints

### `POST /leads`

**Body:**
```json
{
  "name": "João",
  "email": "joao@example.com",
  "message": "Quero saber o preço",
  "source": "LANDING_PAGE"
}
```

**Resposta 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João",
    "email": "joao@example.com",
    "message": "Quero saber o preço",
    "source": "LANDING_PAGE",
    "classification": {
      "intent": "SALES",
      "priority": "HIGH",
      "summary": "Lead com interesse em pricing",
      "status": "COMPLETED"
    },
    "createdAt": "..."
  }
}
```

## Scripts úteis do Prisma 8

```bash
bun run db:contract      # emite contract
bun run db:infer         # infere schema
bun run db:migrate       # aplica migrations
bun run db:verify        # verifica integridade
bun run db:migration:plan # plano de migration
```

## Tratamento de erros

- Validação inválida → `400` com campos/erros
- `HTTPException` → status + mensagem
- Erro inesperado → `500` com `"Erro interno no servidor"`
- Falha na IA → classificação `FALLBACK` com `errorMessage`

## Testes

```bash
bun test src/tests/unit/   # executa todos os testes unitários
```

### Cobertura

| Arquivo | Cobertura |
|---------|-----------|
| `ai.service.test.ts` | Validação do schema de classificação (sucesso, campos inválidos, campos obrigatórios, null) |
| `lead.types.test.ts` | Validação do `createLeadSchema` (dados válidos, nome vazio, e-mail inválido, source inválido) |
| `lead.module.test.ts` | Lógica de mapeamento `isFallback → COMPLETED/FALLBACK` |
| `lead.controller.test.ts` | Verifica estrutura do controller (método `create`) |
| `error-handler.test.ts` | HTTPException → 404, erro genérico → 500 |

**Status atual:** 16 testes passando, 0 falhas.
