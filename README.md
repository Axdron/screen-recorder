# Gravador de tela (screen-recorder)

Arquivo JavaScript único, sem dependências de build, que abre uma janela de gravação de tela e microfone direto no navegador. A gravação é salva no computador do usuário (arquivo `.webm`); **nada é enviado a servidor**.

## Requisitos

- Navegador com `getDisplayMedia` e `MediaRecorder` (Chrome, Edge e Firefox atuais).
- Página em **HTTPS** (ou `localhost`), exigência do navegador para capturar tela e microfone.
- Permitir pop-ups para o site (o gravador abre numa janela própria).
- Os ícones usam o Font Awesome 6.4.0, carregado do `cdnjs.cloudflare.com` pela janela do gravador. Se sua política de segurança (CSP) bloquear esse endereço, libere-o ou troque a URL no arquivo.

## Instalação

1. Copie `screen-recorder-popup.js` para a pasta de scripts do seu projeto (exemplo: `app/resources/js/`).

2. Carregue o arquivo uma vez na página, antes do fim do `<body>` (ou no arquivo de bibliotecas do seu template):

   ```html
   <script src="app/resources/js/screen-recorder-popup.js" defer></script>
   ```

3. Crie o item ou botão que abre o gravador. Basta dar a ele o `id` abaixo; o próprio script cuida do clique:

   ```html
   <a href="#" id="screen-recorder-toggle-btn">Gravar vídeo de suporte</a>
   ```

   Se preferir chamar por código, use `window.screenRecorderPopup.abrir();`.

4. Atualize o cache do navegador (por exemplo, acrescentando `?v=2` no `src`) quando trocar o arquivo.

## Uso

1. Clique no item de menu: abre a janela do gravador.
2. Clique em **Iniciar Gravação**, escolha **Tela Inteira** e autorize o microfone.
3. Ao terminar, pare a gravação e baixe o arquivo `gravacao_AAAAMMDD_HHMMSS.webm`.

## Segurança: instale por cópia, não por link

Este script roda dentro do seu sistema, com os mesmos poderes do usuário logado, e grava a tela. Por isso:

- **Copie o arquivo para o seu projeto** e versione-o junto com o código. Não carregue o script direto do GitHub, de CDN que aponte para o GitHub ou de qualquer endereço externo.
- Antes de atualizar a cópia, leia a diferença (`git diff`) do que mudou.
- Prefira instalar a partir de uma **tag** (`vX.Y.Z`) e anote qual foi usada.
- Se o seu site usa CSP, o script não precisa de nenhuma origem além do `cdnjs.cloudflare.com` (ícones).
