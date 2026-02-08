# Tutorial — Como Testar as Rotas no Postman

---

## Passo a passo após clonar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/Thales971/food-db.git
cd food-db
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar o banco de dados
Certifique-se de ter o **PostgreSQL** instalado e rodando na porta `7777`.

Crie o banco de dados `food_db` caso ainda não exista:
```sql
CREATE DATABASE food_db;
```

### 4. Configurar o arquivo `.env`
Na raiz do projeto, crie um arquivo `.env` (se não existir) com:
```
DATABASE_URL="postgresql://postgres:amods@localhost:7777/food_db"
PORT=3000
```
> Altere `postgres:amods` para seu usuário e senha do PostgreSQL se forem diferentes.

### 5. Rodar as migrações do Prisma
```bash
npx prisma migrate dev --name init
```

### 6. Gerar o Prisma Client
```bash
npx prisma generate
```

### 7. Popular o banco com dados iniciais (seed)
```bash
npx prisma db seed
```

### 8. Iniciar o servidor
```bash
npm run dev
```

Você deve ver: `🚀 Servidor rodando em http://localhost:3000`

---

## 📌 URL BASE: `http://localhost:3000/foods`

---

## 1 — GET ALL (Listar todas as comidas)

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `http://localhost:3000/foods` |
| **Body** | Nenhum |
| **Headers** | Nenhum extra necessário |

**Com filtros (query params):**
- Por nome: `http://localhost:3000/foods?name=bruschetta`
- Por categoria: `http://localhost:3000/foods?category=entrada`
- Por disponibilidade: `http://localhost:3000/foods?available=true`
- Combinados: `http://localhost:3000/foods?category=bebida&available=true`

**No Postman:**
1. Abra o Postman
2. Clique em **"+"** para nova requisição
3. Selecione **GET** no dropdown
4. Cole a URL: `http://localhost:3000/foods`
5. Clique em **Send**

**Resposta esperada (200):**
```json
[
    {
        "id": 1,
        "name": "Bruschetta",
        "description": "Pão italiano tostado com tomate, manjericão e azeite",
        "price": "18.9",
        "category": "entrada",
        "available": true,
        "createdAt": "2026-02-08T..."
    }
]
```

---

## 2 — GET BY ID (Buscar por ID)

| Campo | Valor |
|---|---|
| **Método** | `GET` |
| **URL** | `http://localhost:3000/foods/1` |
| **Body** | Nenhum |

**No Postman:**
1. Método: **GET**
2. URL: `http://localhost:3000/foods/1`
3. Clique em **Send**

**Resposta esperada (200):**
```json
{
    "data": {
        "id": 1,
        "name": "Bruschetta",
        "description": "Pão italiano tostado com tomate, manjericão e azeite",
        "price": "18.9",
        "category": "entrada",
        "available": true,
        "createdAt": "2026-02-08T..."
    }
}
```

**Erro — ID inexistente (404):**
- URL: `http://localhost:3000/foods/999`
```json
{ "error": "Registro não encontrado." }
```

---

## 3 — POST (Criar nova comida)

| Campo | Valor |
|---|---|
| **Método** | `POST` |
| **URL** | `http://localhost:3000/foods` |
| **Header** | `Content-Type: application/json` |
| **Body** | JSON (raw) |

**No Postman:**
1. Método: **POST**
2. URL: `http://localhost:3000/foods`
3. Vá na aba **Body**
4. Selecione **raw**
5. No dropdown à direita, selecione **JSON**
6. Cole o body abaixo:

```json
{
    "name": "Coxinha",
    "description": "Coxinha de frango com catupiry",
    "price": 8.50,
    "category": "entrada",
    "available": true
}
```

7. Clique em **Send**

**Resposta esperada (201):**
```json
{
    "message": "Registro cadastrado com sucesso!",
    "data": {
        "id": 6,
        "name": "Coxinha",
        "description": "Coxinha de frango com catupiry",
        "price": "8.5",
        "category": "entrada",
        "available": true,
        "createdAt": "2026-02-08T..."
    }
}
```

**Categorias válidas:**
- `entrada`
- `prato principal`
- `sobremesa`
- `bebida`

---

## 4 — PUT (Atualizar comida)

| Campo | Valor |
|---|---|
| **Método** | `PUT` |
| **URL** | `http://localhost:3000/foods/1` |
| **Header** | `Content-Type: application/json` |
| **Body** | JSON (raw) — apenas campos que deseja alterar |

**No Postman:**
1. Método: **PUT**
2. URL: `http://localhost:3000/foods/1`
3. Body → **raw** → **JSON**
4. Cole:

```json
{
    "price": 22.90,
    "available": false
}
```

5. Clique em **Send**

**Resposta esperada (200):**
```json
{
    "message": "O registro \"Bruschetta\" foi atualizado com sucesso!",
    "data": {
        "id": 1,
        "name": "Bruschetta",
        "description": "Pão italiano tostado com tomate, manjericão e azeite",
        "price": "22.9",
        "category": "entrada",
        "available": false,
        "createdAt": "2026-02-08T..."
    }
}
```

**Nota:** Você pode enviar **apenas os campos que quer alterar** (update parcial).

---

## 5 — DELETE (Deletar comida)

| Campo | Valor |
|---|---|
| **Método** | `DELETE` |
| **URL** | `http://localhost:3000/foods/1` |
| **Body** | Nenhum |

**No Postman:**
1. Método: **DELETE**
2. URL: `http://localhost:3000/foods/1`
3. Clique em **Send**

**Resposta esperada (200):**
```json
{
    "message": "O registro \"Bruschetta\" foi deletado com sucesso!",
    "deletado": {
        "id": 1,
        "name": "Bruschetta",
        "description": "Pão italiano tostado com tomate, manjericão e azeite",
        "price": "18.9",
        "category": "entrada",
        "available": true,
        "createdAt": "2026-02-08T..."
    }
}
```

---

## Resumo das Rotas

```
BASE URL: http://localhost:3000

GET    /foods          → Lista todas as comidas
GET    /foods/:id      → Busca uma comida por ID
POST   /foods          → Cria nova comida
PUT    /foods/:id      → Atualiza uma comida
DELETE /foods/:id      → Deleta uma comida
```

---

## Possíveis Erros e Soluções

| Problema | Causa | Solução |
|---|---|---|
| `404 - Rota não encontrada` | URL errada | Use `http://localhost:3000/foods` |
| `ECONNREFUSED` | Servidor não está rodando | Execute `npm run dev` no terminal |
| Body vazio no POST/PUT | Não selecionou "raw" + "JSON" no Postman | Em Body → raw → dropdown **JSON** |
| `Content-Type` errado | Postman enviando form-data em vez de JSON | Selecione **raw** e **JSON** no body |
| Dados não aparecem no GET | Seed não foi executado | Execute `npx prisma db seed` |
| Erro de conexão com banco | PostgreSQL não está rodando | Verifique se PostgreSQL está ativo na porta `7777` |
| `Categoria inválida` | Enviou categoria diferente das permitidas | Use: `entrada`, `prato principal`, `sobremesa`, `bebida` |
| `O preço deve ser um número positivo!` | Preço negativo, zero ou texto | Envie um número maior que 0 |
| `Registro não encontrado` (404) | O ID não existe no banco | Faça um GET ALL para ver os IDs disponíveis |
| `ID inválido` (400) | Enviou texto em vez de número no ID | Use apenas números na URL, ex: `/foods/1` |
| `SyntaxError: Unexpected token` | JSON malformado no body | Verifique aspas duplas, vírgulas e chaves no JSON |

