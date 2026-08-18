# OPS Dashboard — Servidor de Rede Interna

Este pacote transforma o dashboard (que antes só salvava dados no navegador
de cada pessoa) em um servidor único: todos que acessarem pelo IP deste
computador vão ler e gravar os **mesmos dados** (ManPower, PCM, TMR, KPI,
Ciclo de Vida do Projeto).

## Estrutura da pasta

```
ops-dashboard-server/
├── server.js        → o servidor (Node.js)
├── package.json     → dependências do servidor
├── data.json        → onde os dados ficam salvos (criado automaticamente)
├── start.bat         → atalho para iniciar no Windows (duplo clique)
└── public/
    └── index.html    → o dashboard em si
```

## 1. Pré-requisitos

Instale o **Node.js** neste computador (o que vai servir o dashboard para a
rede): https://nodejs.org — baixe a versão **LTS** e instale normalmente
(Avançar, Avançar, Concluir).

Para confirmar que instalou certo, abra o **Prompt de Comando** (cmd) e
digite:

```
node -v
```

Deve aparecer um número de versão (ex: `v20.x.x`).

## 2. Instalar as dependências

Abra o Prompt de Comando **dentro desta pasta** (`ops-dashboard-server`) e
rode:

```
npm install
```

Isso baixa o Express (framework usado pelo servidor). Só precisa fazer isso
uma vez.

## 3. Descobrir o IP interno deste computador

Ainda no Prompt de Comando, rode:

```
ipconfig
```

Procure por **"Endereço IPv4"** na sua rede local — normalmente algo como
`192.168.0.25` ou `10.0.0.15`. Esse é o IP que as outras pessoas vão usar
para acessar o dashboard.

> Dica: para o IP não mudar toda vez que o computador reiniciar, configure
> um **IP fixo** (estático) nas propriedades de rede do Windows, ou reserve
> o IP no roteador/DHCP da empresa. Assim o link de acesso não muda.

## 4. Iniciar o servidor

Duas opções:

- **Duplo clique em `start.bat`**, ou
- No Prompt de Comando, dentro da pasta:
  ```
  npm start
  ```

Você verá uma mensagem confirmando que o servidor está rodando na porta
`3000`. **Deixe essa janela aberta** — fechá-la derruba o servidor.

## 5. Acessar de outros computadores da rede

Em qualquer computador **da mesma rede interna**, abra o navegador e acesse:

```
http://SEU_IP_INTERNO:3000
```

Por exemplo: `http://192.168.0.25:3000`

Todos que acessarem esse endereço vão ver e editar os **mesmos dados**.

## 6. Liberar no Firewall do Windows (se necessário)

Se outros computadores não conseguirem acessar, o Firewall do Windows pode
estar bloqueando a porta 3000:

1. Painel de Controle → Sistema e Segurança → Firewall do Windows Defender
2. "Configurações avançadas" → "Regras de Entrada" → "Nova Regra..."
3. Tipo: **Porta** → TCP → Porta específica: `3000` → Permitir a conexão
4. Aplique para os perfis de rede relevantes (Privada/Domínio) e salve.

## 7. Manter o servidor sempre ligado (opcional, recomendado)

Do jeito que está, se o computador reiniciar ou a janela do `start.bat` for
fechada, o servidor para. Para manter sempre ativo, duas opções simples:

- **PM2** (gerenciador de processos Node): 
  ```
  npm install -g pm2
  pm2 start server.js --name ops-dashboard
  pm2 save
  pm2 startup
  ```
  (o comando `pm2 startup` mostra um passo extra para registrar como
  serviço do Windows — siga a instrução que ele exibir)

- **NSSM** (https://nssm.cc): transforma o `node server.js` em um serviço
  do Windows que inicia sozinho com o computador, sem precisar deixar
  nenhuma janela aberta.

Se preferir, posso te ajudar a configurar qualquer uma dessas opções.

## Como funciona por baixo dos panos

- O dashboard (`public/index.html`) tenta se conectar ao servidor assim que
  abre. Se conseguir, mostra um indicador **🟢 Sincronizado com o servidor**
  no canto inferior esquerdo, e toda alteração (novo projeto, atualização de
  status, etc.) é gravada em `data.json` no servidor.
- Se o servidor estiver fora do ar, o dashboard mostra **🟡 Servidor
  indisponível — salvando só neste navegador** e continua funcionando
  normalmente, só que sem compartilhar com os outros (modo antigo, local).
  Assim que o servidor voltar, as próximas alterações voltam a sincronizar.
- Os dados ficam guardados em texto simples em `data.json`. Uma cópia de
  segurança automática (`data.backup.json`) é criada a cada gravação, caso
  precise recuperar algo.

## Fazer backup manual

Basta copiar o arquivo `data.json` (ou `data.backup.json`) para outro lugar
periodicamente — é só um arquivo de texto com todos os dados do dashboard.
