# Plano de Finalização do CHApp

## 0. Status atualizado (18/03/2026)

Entregue nesta etapa:

- Fase 1 do app concluída:
  - `AuthContext` com sessão persistida em `expo-secure-store`.
  - Cliente de API e serviço de autenticação.
  - Guardas de rota para proteger abas sem login.
  - Login real integrado ao contexto (com loading/erro).
  - Logout real funcional.
- Erro de lint corrigido na tela de história.
- Backend base criado em `backend/` com PostgreSQL + Prisma + JWT:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
  - `GET /health`

Pendente principal agora:

- Integrar as telas `jogos`, `titulos`, `historia` e `carteirinha` com dados reais da API.

## 1. Situação atual (estado do projeto)

O app está com a parte visual bem avançada, porém a maior parte dos dados ainda está fixa em código (mock).

Principais pontos encontrados:

- Login agora está ligado à camada de autenticação (`AuthContext`) e pronto para API real.
- Tela de jogos com classificação e placares mockados: `app/(tabs)/jogos.tsx`.
- Tela de títulos com carrossel e dados mockados: `app/(tabs)/titulos.tsx`.
- Tela de história com timeline e conquistas mockadas: `app/(tabs)/historia.tsx`.
- Tela de carteirinha virtual com dados e QR estáticos: `app/(tabs)/carteirinha.tsx`.
- Backend base já existe em `backend/README.md`.

## 2. Problemas técnicos já detectados

- `lint` do app está verde após correção em `historia.tsx`.
- Inconsistência de acentuação/texto em várias telas (`Socio`, `Associacao`, `Furacao`, `Serie A`, etc.).
- Mesma imagem usada para escudo/avatar/foto do sócio em todas as telas (sem separação de assets por contexto).
- Telas de conteúdo ainda em mock (faltam serviços de `jogos`, `titulos`, `historia`, `carteirinha`).
- Ainda falta definir/confirmar fonte oficial dos dados esportivos e da carteirinha.

## 3. O que precisa implementar para funcionar de ponta a ponta

## 3.1 Base de arquitetura (obrigatório)

1. Criar estrutura de dados e serviços:
- `src/services/apiClient.ts` (base URL, headers, auth token).
- `src/services/*.service.ts` por domínio (`auth`, `jogos`, `titulos`, `historia`, `carteirinha`).
- `src/types/*.ts` com contratos das respostas.

2. Criar gerenciamento de sessão:
- `AuthContext` com `signIn`, `signOut`, `user`, `token`.
- Persistência segura do token (`expo-secure-store`).
- Guardas de rota para impedir acesso às abas sem login.

3. Configurar variáveis de ambiente:
- `EXPO_PUBLIC_API_BASE_URL` por ambiente (`dev`, `hml`, `prod`).
- Política de fallback quando API estiver fora.

## 3.2 Integrações necessárias por tela

1. Login (`index.tsx`):
- Trocar `handleLogin` mock por chamada real de autenticação.
- Tratar erro de credencial, loading e bloqueio de múltiplos cliques.
- Status atual: `login` e `cadastro` funcionando com API real.

2. Jogos (`jogos.tsx`):
- Buscar próximos jogos, últimos resultados e classificação atual.
- Exibir data/hora/local e status (agendado, ao vivo, encerrado).
- Implementar pull-to-refresh.

3. Títulos (`titulos.tsx`):
- Buscar lista oficial de títulos + ano + descrição.
- Permitir ordenação cronológica.

4. História (`historia.tsx`):
- Conteúdo deve vir de CMS/JSON versionado (não hardcoded).
- Atualização eventual sem precisar publicar nova versão do app.

5. Carteirinha (`carteirinha.tsx`):
- Buscar dados do sócio autenticado (nome, matrícula, plano, validade).
- Gerar/renderizar QR dinâmico vindo da API.
- Implementar ações reais: exportar, copiar e remover (com confirmação).

## 3.3 Backend/API (ponto crítico)

Hoje não há confirmação no projeto sobre API oficial para:
- títulos,
- jogos/classificação,
- carteirinha do sócio.

Plano recomendado:

1. Validar primeiro se existe API oficial do clube/parceiro do sócio.
2. Se não existir, criar um backend intermediário (BFF) para:
- concentrar integrações externas,
- padronizar payload para o app,
- proteger credenciais/chaves.
3. Para história e títulos, ter fallback com JSON remoto versionado (CDN/S3/GitHub Raw).

## 3.3.1 Backend já implementado

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /health`
- PostgreSQL + Prisma + JWT configurados no diretório `backend/`

## 3.3.2 Geração do JWT secret

Para gerar o segredo do backend:

```bash
openssl rand -hex 32
```

Adicionar o valor em `backend/.env`:

```env
JWT_SECRET="seu-valor-gerado"
```

## 3.3.3 URL do app por ambiente de teste

O valor de `EXPO_PUBLIC_API_BASE_URL` muda conforme onde o app está rodando:

- Web no mesmo computador:
  - `EXPO_PUBLIC_API_BASE_URL=http://localhost:3333`
- Android Emulator:
  - `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3333`
- Celular físico com Expo Go na mesma rede:
  - `EXPO_PUBLIC_API_BASE_URL=http://IP_DA_SUA_MAQUINA:3333`
  - Exemplo real deste ambiente: `http://192.168.2.19:3333`
- iOS Simulator:
  - `EXPO_PUBLIC_API_BASE_URL=http://localhost:3333`

O path atual de login permanece:

```env
EXPO_PUBLIC_AUTH_LOGIN_PATH=/auth/login
EXPO_PUBLIC_AUTH_REGISTER_PATH=/auth/register
```

## 3.4 Estilo/UX (ajustes para finalizar com qualidade)

1. Padronizar Safe Area em todas as telas (`SafeAreaView` e espaçamentos).
2. Padronizar tipografia e tokens de cor em arquivo único de tema.
3. Corrigir textos/acentuação e nomenclaturas.
4. Adicionar estados de `loading`, `empty`, `error` em todas as listas/telas de dados.
5. Revisar responsividade em telas menores (larguras fixas no carrossel e na carteirinha).
6. Melhorar acessibilidade:
- `accessibilityLabel` em botões,
- contraste mínimo,
- tamanho de toque.

## 4. Ordem de implementação (roadmap prático)

Fase 1 (infra mínima):
1. Sessão/autenticação + API client + env. `CONCLUÍDO`
2. Guardas de navegação e logout real. `CONCLUÍDO`
3. Corrigir lint e padronizar textos. `LINT CONCLUÍDO / PADRONIZAÇÃO DE TEXTO PENDENTE`
4. Integrar cadastro do app ao backend. `CONCLUÍDO`

Fase 2 (dados vivos):
1. Integrar jogos.
2. Integrar títulos.
3. Integrar história por conteúdo remoto.

Fase 3 (carteirinha):
1. Endpoint de carteirinha + QR dinâmico.
2. Exportação e ações.
3. Regras de expiração/renovação e mensagens de status.

Fase 4 (qualidade para release):
1. Testes (unitários + integração básica).
2. Telemetria/erros (Sentry/Crashlytics).
3. Checklist de publicação Android/iOS.

## 5. Definição de pronto (DoD)

O app pode ser considerado funcional para produção quando:

1. Login real com sessão persistida estiver estável.
2. Jogos, títulos e história forem carregados de fonte remota.
3. Carteirinha virtual mostrar dados reais do sócio + QR válido.
4. Todas as telas tiverem `loading/empty/error`.
5. Lint e build em CI estiverem verdes.

## 6. Riscos e decisões pendentes

1. Dependência de API oficial de sócio/carteirinha (maior risco).
2. Origem oficial dos dados de jogos/classificação e limites de uso.
3. Governança de conteúdo da história (quem atualiza e aprova).
4. Regras de segurança/LGPD para dados pessoais do torcedor.

## 7. Próxima ação recomendada (imediata)

1. Subir backend local (`backend/docker-compose.yml` + Prisma).
2. Criar usuário de teste (`POST /auth/register`).
3. Apontar app para o `EXPO_PUBLIC_API_BASE_URL` correto conforme ambiente de teste.
4. Começar Fase 2 com integração da tela `jogos`.
