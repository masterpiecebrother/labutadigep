# Sistema CGPE (Full Stack)

Aplicacao full stack para gestao de entregas e carga de trabalho da CGPE, com frontend em React/Vite e backend serverless para persistencia de estado.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Vercel Serverless Functions (`/api/state`)
- Persistencia:
  - Producao: Vercel KV (quando configurado)
  - Fallback: memoria da funcao + `localStorage` no navegador

## Estrutura

- `src/App.jsx`: aplicacao principal
- `api/state.js`: endpoint de leitura/escrita do estado
- `api/audit.js`: endpoint de consulta da trilha de auditoria
- `api/_lib/store.js`: camada de persistencia

O estado inicial completo permanece no frontend e e enviado para a API na primeira sincronizacao.

## Funcionalidades adicionadas

- Persistencia automatica do estado com autosave
- Exportacao de dados em JSON e CSV
- Trilha de auditoria administrativa (eventos de atualizacao)
- Controle de tela administrativa por perfil de usuario

## Rodar localmente

1. Instale dependencias:

```bash
npm install
```

2. Frontend local (modo rapido):

```bash
npm run dev
```

3. Full stack local com API serverless (recomendado para testes completos):

```bash
npm run vercel-dev
```

## Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: transformar sistema-cgpe em app full stack"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/sistema-cgpe.git
git push -u origin main
```

## Publicar no Vercel

1. Acesse `https://vercel.com/new`.
2. Importe o repositorio.
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

## Persistencia com Vercel KV (opcional, recomendado)

1. No painel da Vercel, adicione um banco KV ao projeto.
2. Defina as variaveis de ambiente:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
3. Faça novo deploy.

Sem KV, o sistema continua funcional com fallback local.
