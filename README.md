# Refrimaq Refrigeração — Novo Site Comercial

Vitrine comercial e canal de cotação da **Refrimaq Refrigeração**, representante exclusiva **Memo** no Rio Grande do Sul, representante **Kegsbrasil** e assistência técnica especializada em chopeiras, torres de chopp, pré-resfriadores, barris e peças originais.

## Recursos

- **Catálogo completo real (206 produtos)** com imagens locais, busca instantânea, filtros por categoria e ordenação.
- **Gestão centralizada pelo Refrimaq Connect (Supabase):** adicione, edite, altere preço, suba fotos, destaque na Home ou oculte produtos direto na aba **Catálogo do Site** do Refrimaq Connect — com fallback automático para o catálogo local caso o Supabase não esteja configurado.
- **Lista de Cotação → WhatsApp:** gaveta lateral estilo e-commerce com cálculo de itens com preço + itens sob consulta e envio estruturado direto para o WhatsApp oficial `(51) 98574-7069`.
- **Assistência Técnica e Institucional:** detalhamento dos serviços de manutenção preventiva (assepsia), corretiva e projetos/instalações, além dos canais oficiais da Refrimaq.

## Sincronização com o Refrimaq Connect (Supabase)

Copie `.env.example` para `.env` (ou configure as variáveis no Render/Vercel) com as mesmas credenciais Supabase do Refrimaq Connect:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## Scripts

```bash
npm install
npm run dev       # ambiente de desenvolvimento
npm test          # testes unitários do motor de cotação/busca
npm run typecheck # checagem TypeScript
npm run lint      # ESLint
npm run build     # build de produção (dist/)
```

## Deploy no Render e Domínio (`refrimaqrs.com.br`)

O repositório já conta com [`render.yaml`](./render.yaml) (Blueprint pronto para **Static Site** no Render com redirects das URLs antigas, headers de segurança e cache) e o roteiro completo de virada de DNS sem interromper e-mails em [`DEPLOY_E_DOMINIO.md`](./DEPLOY_E_DOMINIO.md).
