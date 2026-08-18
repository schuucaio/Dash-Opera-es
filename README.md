# OPS Dashboard — Selettra

Dashboard de operações (Planejamento ManPower, PCM, TMR, KPI PCM, Ciclo de
Vida do Projeto, KPI Operações) em um único arquivo HTML.

Este repositório tem duas formas de usar o dashboard:

1. **Só o HTML, hospedado no GitHub Pages** — grátis, simples, cada pessoa
   que acessa guarda os dados só no próprio navegador (não compartilha com
   os outros).
2. **HTML + servidor Node** (pasta `server/`) — os dados ficam guardados num
   servidor e todo mundo que acessa vê e edita as mesmas informações. Exige
   rodar o servidor em algum lugar (seu PC, ou um serviço como o Render —
   veja a seção mais abaixo).

Se você só quer subir o HTML rapidinho no GitHub Pages, siga a seção 1. Se
quer que a equipe toda compartilhe os mesmos dados, vá direto para a seção 2.

---

## 1. Publicar só o HTML no GitHub Pages

### Passo a passo

1. **Crie um repositório novo no GitHub** (pode ser público ou privado —
   privado também funciona no GitHub Pages se sua conta tiver esse plano).

2. **Suba os arquivos** deste pacote para o repositório. No seu computador,
   dentro desta pasta (`ops-dashboard`), rode:

   ```
   git init
   git add .
   git commit -m "Primeira versão do OPS Dashboard"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```

   (troque `SEU_USUARIO/SEU_REPOSITORIO` pelo endereço do repositório que
   você criou)

3. **Ative o GitHub Pages:**
   - No repositório, vá em **Settings** → **Pages** (menu à esquerda)
   - Em "Build and deployment" → "Source", escolha **Deploy from a branch**
   - Em "Branch", escolha **main** e a pasta **/ (root)**
   - Clique em **Save**

4. Espere 1–2 minutos. O GitHub mostra o link do site no topo da mesma
   página (algo como `https://SEU_USUARIO.github.io/SEU_REPOSITORIO/`).

Pronto — o `index.html` (o dashboard) fica publicado nesse link.

### Sobre os dados nesse modo

Sem o servidor, o dashboard salva tudo no `localStorage` do navegador de
cada pessoa — ou seja, os dados **não são compartilhados** entre quem
acessa. Cada um vê e edita só a própria cópia. Isso é normal e esperado
nesse modo; para dados compartilhados, veja a seção 2.

Um indicador de sincronização foi desativado por pedido anterior, então o
dashboard não avisa visualmente se está "online" ou "offline" — ele
simplesmente tenta falar com um servidor (que não existe no GitHub Pages) e,
não conseguindo, segue salvando local. Isso é esperado e não é um erro.

### Atualizar o site depois de mudanças

Sempre que quiser publicar uma nova versão do `index.html`:

```
git add index.html
git commit -m "Atualiza dashboard"
git push
```

O GitHub Pages atualiza sozinho em 1–2 minutos.

---

## 2. Dados compartilhados (servidor Node)

Se quiser que todo mundo veja os mesmos dados (não só uma cópia local por
navegador), use a pasta `server/`. Duas formas de rodar:

### 2a. Na sua própria rede (mais simples, grátis)

Veja as instruções completas em [`server/README.md`](server/README.md) —
resumindo: instala o Node.js num computador, roda `npm install` e
`npm start` dentro da pasta `server/`, e a equipe acessa pelo IP daquele
computador na rede interna.

### 2b. Hospedado na nuvem (acessível de qualquer lugar, não só na rede local)

Serviços como o [Render](https://render.com) rodam o servidor Node
diretamente a partir do seu repositório GitHub, de graça no plano básico:

1. Suba este repositório para o GitHub (seção 1, passos 1–2).
2. Crie uma conta no Render e clique em **New +** → **Web Service**.
3. Conecte sua conta do GitHub e escolha este repositório.
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Clique em **Create Web Service**. O Render te dá uma URL pública (tipo
   `https://ops-dashboard.onrender.com`) — é nela que a equipe acessa.

> No plano gratuito do Render, o servidor "dorme" depois de um tempo sem
> uso e demora alguns segundos para acordar no primeiro acesso do dia — é
> normal, não é bug. Para evitar isso, dá pra usar um plano pago ou outro
> provedor (Railway, Fly.io funcionam de forma parecida).

**Atenção — backup dos dados:** nesse modo, os dados ficam guardados dentro
do servidor (`server/data.json`), não no seu computador. Nem todo provedor
mantém esse arquivo se o serviço reiniciar (isso é chamado de "armazenamento
efêmero"). No Render, por exemplo, o plano gratuito **não garante isso** —
para persistência de verdade, seria necessário um "Persistent Disk" (pago)
ou trocar a forma de guardar os dados (ex: um banco de dados de verdade).
Se os dados forem importantes para o negócio, use o botão **"Exportar
JSON"** dentro do dashboard (aba Configurações) periodicamente como backup
de segurança, e considere pedir ajuda para configurar um disco persistente
antes de depender disso em produção.

---

## Estrutura deste repositório

```
ops-dashboard/
├── index.html          → o dashboard (versão estática, para GitHub Pages)
├── README.md            → este arquivo
├── .gitignore
└── server/              → servidor opcional para dados compartilhados
    ├── server.js
    ├── package.json
    ├── public/index.html  → mesma versão do dashboard, servida pelo Node
    ├── start.bat           → atalho para Windows
    └── README.md           → instruções específicas do servidor
```
