# Guia de Deploy (Render) e Apontamento de Domínio (`refrimaqrs.com.br`)

Este projeto já inclui o arquivo [`render.yaml`](./render.yaml) pronto para deploy automático como **Static Site** no Render, com redirecionamento das URLs antigas (`/home`, `/produtos`, `/servicos`, `/quem-somos`, `/contato`), headers de segurança e cache otimizado de imagens.

---

## Etapa 1 — Subir o código para o GitHub

O remoto `origin` já está pré-configurado para `https://github.com/robersonoliveira1-commits/refrimaq-site.git`.

1. Acesse [github.com/new](https://github.com/new) logado na conta **`robersonoliveira1-commits`**.
2. Em **Repository name**, digite exatamente `refrimaq-site`.
3. Deixe **desmarcadas** as opções *Add a README file*, *.gitignore* e *license* (repositório vazio).
4. Clique em **Create repository**.
5. No terminal PowerShell, envie o código:

```powershell
cd C:\Users\Particular\Documents\GitHub\refrimaq-site
git push -u origin main
```

---

## Etapa 2 — Deploy automático no Render (via Blueprint `render.yaml`)

1. Acesse [dashboard.render.com](https://dashboard.render.com/).
2. Clique em **New +** → **Blueprint**.
3. Selecione o repositório **`robersonoliveira1-commits/refrimaq-site`**.
4. O Render lerá automaticamente o arquivo `render.yaml` (`npm ci && npm run build`, publicação em `./dist`, redirects e cache) e pedirá as 2 variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   > **Onde copiar:** no próprio Render, abra o serviço **`Refrimaq-connect-final`** → menu **Environment** (ou no Supabase → botão **Connect**) e copie exatamente os mesmos dois valores.
5. Clique em **Apply**. Em ~2 minutos o site estará no ar na URL temporária (ex.: `https://refrimaq-site.onrender.com`).

### Checklist rápido antes de trocar o domínio
- Abra `https://refrimaq-site.onrender.com` e verifique se os produtos do **Catálogo do Site** (Supabase) carregam normalmente.
- Faça um teste rápido: altere 1 produto no **Refrimaq Connect → Catálogo do Site** e atualize (`F5`) o novo site para confirmar a sincronização ao vivo.
- Teste a gaveta **Lista de Cotação → Enviar no WhatsApp**.

---

## Etapa 3 — Apontar `refrimaqrs.com.br` sem derrubar os e-mails

### Diagnóstico real do DNS atual de `refrimaqrs.com.br`
Auditoria executada sobre a zona ativa em **OpenWeb / Plesk (`plesk44.openwebhost.com.br`)**:

| Tipo | Nome / Host | Valor atual | Ação na migração |
| :--- | :--- | :--- | :--- |
| **A** | `refrimaqrs.com.br` (`@`) | `148.72.158.172` | **ALTERAR** para `216.24.57.1` (Render) |
| **CNAME** | `www.refrimaqrs.com.br` | `refrimaqrs.com.br` | **ALTERAR** para `refrimaq-site.onrender.com` (ou hostname exibido no Render) |
| **NS** | `refrimaqrs.com.br` | `ns1.refrimaqrs.com.br` / `ns2.refrimaqrs.com.br` | **NÃO MEXER** |
| **A** | `ns1` / `ns2` | `148.72.158.172` | **NÃO MEXER** |
| **MX** | `refrimaqrs.com.br` | `mail.refrimaqrs.com.br` (prioridade `10`) | **NÃO MEXER** (e-mails continuam funcionando) |
| **A** | `mail.refrimaqrs.com.br` | `148.72.158.172` | **NÃO MEXER** (`cotacoes@refrimaqrs.com.br` continua 100% ativo) |
| **TXT** | `refrimaqrs.com.br` | `v=spf1 +a +mx +a:plesk44.openwebhost.com.br include:spf.44.openweb.com.br -all` | **NÃO MEXER** |
| **TXT** | `refrimaqrs.com.br` | `google-site-verification=CD8iJnMqLUYUtIWq363GSWtsi2XHSG8L3B22RLQu1xs` | **NÃO MEXER** |

> **Confirmado:** não existem registros `AAAA` (IPv6) ativos em `refrimaqrs.com.br` ou `www.refrimaqrs.com.br`, portanto não há conflito de IPv6 com o Render.

### Passo a passo da virada (zero downtime de e-mail)

1. **No painel do Render** (serviço `refrimaq-site`):
   - Vá em **Settings** → **Custom Domains** → **Add Custom Domain**.
   - Adicione `refrimaqrs.com.br` (o Render normalmente já oferece adicionar `www.refrimaqrs.com.br` junto e redirecionar `www` → raiz automaticamente; confirme o hostname `.onrender.com` exibido).
2. **No painel de DNS da hospedagem atual (Plesk / OpenWeb):**
   - **Dica opcional:** se puder reduzir o TTL dos registros `A` (`@`) e `CNAME` (`www`) para `300` (5 min) antes da troca, a propagação fica muito mais rápida.
   - Edite **apenas** estes 2 registros:
     - `A` | `refrimaqrs.com.br` (ou `@`) | **`216.24.57.1`**
     - `CNAME` | `www` | **`refrimaq-site.onrender.com`** *(use o subdomínio exato mostrado no Render caso ele adicione sufixo)*
   - Salve a zona DNS mantendo todos os demais registros (`NS`, `MX`, `mail`, `TXT`).
3. **Verificação e Certificado SSL (HTTPS):**
   - Volte ao Render em **Settings → Custom Domains** e clique em **Verify**.
   - Assim que o DNS propagar (de 5 minutos a algumas horas), o Render emite automaticamente o certificado HTTPS (Let's Encrypt) gratuito e renovável.

---

## Plano de Rollback (voltar ao site antigo em 1 minuto)

Caso precise reverter por qualquer motivo, basta restaurar os mesmos 2 registros no Plesk/OpenWeb:
- `A` | `refrimaqrs.com.br` (`@`) → `148.72.158.172`
- `CNAME` | `www` → `refrimaqrs.com.br`
