/**
 * Popup para gravação de tela
 * Contém toda a lógica de gravação para funcionar independentemente
 */
class ScreenRecorderPopup {
    constructor() {
        this.popupWindow = null;
        this.popupDocument = null;
    }

    /**
     * Abrir o popup
     */
    abrir() {
        // Verificar se popup já está aberto
        if (this.popupWindow && !this.popupWindow.closed) {
            this.popupWindow.focus();
            return;
        }

        // Abrir popup (800x600, centrado)
        const width = 800;
        const height = 700;
        const left = (window.screenX || window.screen.left) + (window.outerWidth - width) / 2;
        const top = (window.screenY || window.screen.top) + (window.outerHeight - height) / 2;

        this.popupWindow = window.open(
            '',
            'ScreenRecorderPopup',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (!this.popupWindow) {
            alert('Não foi possível abrir o popup. Verifique se popups estão bloqueados.');
            return;
        }

        // Criar conteúdo do popup
        this.criarConteudoPopup();
    }

    /**
     * Criar conteúdo do popup
     */
    criarConteudoPopup() {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Gravar Vídeo para Suporte</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                html, body {
                    height: 100%;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .popup-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 20px;
                }

                .popup-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    padding: 32px;
                    max-width: 100%;
                    width: 100%;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .popup-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .popup-title i {
                    color: #f44336;
                    font-size: 28px;
                }

                .popup-subtitle {
                    font-size: 13px;
                    color: #999;
                    margin-bottom: 32px;
                }

                .recorder-content {
                    text-align: center;
                }

                .state-icon {
                    font-size: 64px;
                    margin-bottom: 24px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .state-icon i {
                    color: #f44336;
                }

                .ready-state .state-icon {
                    cursor: pointer;
                    transition: transform 0.2s ease, filter 0.2s ease;
                }

                .ready-state .state-icon:hover {
                    transform: scale(1.1);
                    filter: drop-shadow(0 0 8px rgba(244, 67, 54, 0.5));
                }

                .ready-state .state-icon:active {
                    transform: scale(0.95);
                }

                .state-icon.recording i {
                    animation: pulse-record 1s infinite;
                }

                @keyframes pulse-record {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.9); }
                }

                .state-icon.success i {
                    color: #4CAF50;
                }

                .state-icon.error i {
                    color: #f44336;
                }

                .state-text {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 12px;
                }

                .state-desc {
                    font-size: 13px;
                    color: #999;
                    margin-bottom: 24px;
                    line-height: 1.6;
                }

                .timer-display {
                    background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
                    border-radius: 12px;
                    padding: 32px;
                    margin: 24px 0;
                    color: white;
                }

                .timer-value {
                    font-size: 56px;
                    font-weight: 700;
                    font-family: 'Monaco', 'Courier New', monospace;
                    letter-spacing: 4px;
                }

                .file-info {
                    background: #f5f5f5;
                    border-radius: 12px;
                    padding: 16px;
                    margin: 16px 0 24px 0;
                    text-align: left;
                }

                .file-info p {
                    margin: 8px 0;
                    font-size: 13px;
                    color: #666;
                }

                .file-info strong {
                    color: #333;
                    font-family: 'Monaco', 'Courier New', monospace;
                }

                .error-message {
                    background: #ffebee;
                    border-left: 4px solid #f44336;
                    padding: 12px;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #c62828;
                    margin-bottom: 24px;
                    text-align: left;
                }

                .highlight-message {
                    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
                    border-left: 4px solid #ff9800;
                    padding: 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #e65100;
                    margin-bottom: 24px;
                    text-align: left;
                    line-height: 1.6;
                }

                .highlight-message strong {
                    font-weight: 700;
                    display: block;
                    margin-bottom: 8px;
                    color: #d84315;
                }

                .highlight-message i {
                    margin-right: 6px;
                    color: #ff9800;
                }

                .tutorial-container {
                    margin-bottom: 24px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }



                .instructions-box {
                    background: #e3f2fd;
                    border-left: 4px solid #2196F3;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    text-align: left;
                }

                .instructions-box strong {
                    font-weight: 700;
                    display: block;
                    margin-bottom: 8px;
                    color: #1565c0;
                }

                .instructions-box p {
                    margin: 8px 0;
                    font-size: 13px;
                    color: #0d47a1;
                    line-height: 1.6;
                }

                .instructions-box ol, .instructions-box ul {
                    margin: 8px 0 8px 20px;
                    font-size: 13px;
                    color: #0d47a1;
                }

                .instructions-box li {
                    margin: 4px 0;
                }

                .btn-group {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .btn-action {
                    flex: 1;
                    min-width: 150px;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                    color: white;
                }

                .btn-primary:hover {
                    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
                    color: white;
                }

                .btn-danger:hover {
                    background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
                }

                .btn-secondary {
                    background: #e0e0e0;
                    color: #333;
                }

                .btn-secondary:hover {
                    background: #d0d0d0;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .recorder-state.hidden {
                    display: none;
                }

                @media (max-width: 600px) {
                    .popup-card {
                        padding: 20px;
                    }

                    .state-icon {
                        font-size: 48px;
                        height: 60px;
                    }

                    .timer-value {
                        font-size: 42px;
                    }

                    .btn-action {
                        min-width: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="popup-container">
                <div class="popup-card">
                    <h1 class="popup-title">
                        <i class="fas fa-video"></i>
                        Gravar Vídeo
                    </h1>
                    <p class="popup-subtitle">Suporte a Erros</p>

                    <div class="recorder-content">
                        <!-- Estado: Pronto para gravar -->
                        <div class="recorder-state ready-state">
                            <div class="state-icon">
                                <i class="fas fa-circle-play"></i>
                            </div>
                            <p class="state-text">Pronto para Gravar</p>
                            <p class="state-desc">
                                Você será solicitado a selecionar a tela/janela.<br>
                                Também será capturado áudio do microfone.
                            </p>
                            <div class="highlight-message">
                                <strong><i class="fas fa-lightbulb"></i>Dica Importante</strong>
                                Ao clicar em "Iniciar Gravação", selecione a opção <strong>"Tela Inteira"</strong> para garantir que todo o conteúdo seja gravado corretamente.
                            </div>
                            <div class="btn-group">
                                <button class="btn-action btn-primary" id="btn-start-recording">
                                    <i class="fas fa-circle-play"></i>
                                    Iniciar Gravação
                                </button>
                            </div>
                        </div>

                        <!-- Estado: Gravando -->
                        <div class="recorder-state recording-state hidden">
                            <div class="state-icon recording">
                                <i class="fas fa-circle"></i>
                            </div>
                            <p class="state-text">Gravação em Andamento</p>
                            <div class="timer-display">
                                <div class="timer-value">00:00</div>
                            </div>
                            <p class="state-desc">
                                Realize as ações que deseja gravar.<br>
                                Clique em "Parar" quando terminar.
                            </p>
                            <div class="btn-group">
                                <button class="btn-action btn-danger" id="btn-stop-recording">
                                    <i class="fas fa-stop-circle"></i>
                                    Parar Gravação
                                </button>
                            </div>
                        </div>

                        <!-- Estado: Concluído -->
                        <div class="recorder-state completed-state hidden">
                            <div class="state-icon success">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <p class="state-text">Gravação Concluída!</p>
                            <div class="file-info">
                                <p>Tamanho: <strong class="size-value">0 MB</strong></p>
                                <p>Arquivo: <strong class="name-value">gravacao.webm</strong></p>
                            </div>
                            <div class="instructions-box">
                                <strong><i class="fas fa-envelope"></i>Próximos Passos:</strong>
                                <ol>
                                    <li>Abra a pasta <strong>Downloads</strong> no seu computador</li>
                                    <li>Localize o arquivo acima</li>
                                    <li>Envie para <strong>Ricardo</strong> via e-mail ou Whatsapp</li>
                                </ol>
                                <p style="margin-top: 12px; font-size: 12px;">
                                    <i class="fas fa-info-circle"></i> O arquivo será utilizado para análise do erro relatado.
                                </p>
                            </div>
                            <div class="btn-group">
                                <button class="btn-action btn-secondary" id="btn-new-recording">
                                    <i class="fas fa-redo"></i>
                                    Gravar Novamente
                                </button>
                                <button class="btn-action btn-primary" id="btn-close-popup">
                                    <i class="fas fa-check"></i>
                                    Fechar
                                </button>
                            </div>
                        </div>

                        <!-- Estado: Erro -->
                        <div class="recorder-state error-state hidden">
                            <div class="state-icon error">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <p class="state-text">Erro na Gravação</p>
                            <div class="error-message" id="error-message">Ocorreu um erro desconhecido</div>
                            <div class="btn-group">
                                <button class="btn-action btn-primary" id="btn-retry-recording">
                                    <i class="fas fa-redo"></i>
                                    Tentar Novamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                // ============================================
                // CLASSE DE GRAVAÇÃO (copiada para o popup)
                // ============================================
                class PopupScreenRecorder {
                    constructor() {
                        this.mediaRecorder = null;
                        this.stream = null;
                        this.chunks = [];
                        this.isRecording = false;
                        this.recordingStartTime = null;
                    }

                    async iniciar() {
                        try {
                            this.chunks = [];
                            this.recordingStartTime = new Date();
                            
                            let audioStream = null;
                            try {
                                audioStream = await navigator.mediaDevices.getUserMedia({
                                    audio: {
                                        echoCancellation: true,
                                        noiseSuppression: true,
                                        autoGainControl: true
                                    }
                                });
                            } catch (audioError) {
                                console.warn('Microfone não disponível:', audioError.message);
                            }
                            
                            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                                video: {
                                    cursor: 'always',
                                    displaySurface: 'monitor'
                                },
                                audio: false
                            });

                            this.stream = new MediaStream();
                            
                            displayStream.getVideoTracks().forEach(track => {
                                this.stream.addTrack(track);
                            });
                            
                            if (audioStream) {
                                audioStream.getAudioTracks().forEach(track => {
                                    this.stream.addTrack(track);
                                });
                            }

                            this.mediaRecorder = new MediaRecorder(this.stream, {
                                mimeType: this.obterMimeType()
                            });

                            this.displayStream = displayStream;
                            this.audioStream = audioStream;

                            this.mediaRecorder.ondataavailable = (event) => {
                                if (event.data.size > 0) {
                                    this.chunks.push(event.data);
                                }
                            };

                            this.mediaRecorder.onstop = () => {
                                if (this.audioStream) {
                                    this.audioStream.getTracks().forEach(track => track.stop());
                                }
                                if (this.displayStream) {
                                    this.displayStream.getTracks().forEach(track => track.stop());
                                }
                                
                                this.processarGravacaoFinalizada();
                            };

                            this.mediaRecorder.start();
                            this.isRecording = true;

                            return {
                                sucesso: true,
                                mensagem: 'Gravação iniciada'
                            };

                        } catch (erro) {
                            if (erro.name === 'NotAllowedError') {
                                return {
                                    sucesso: false,
                                    mensagem: 'Você cancelou a permissão de gravação de tela'
                                };
                            } else if (erro.name === 'NotFoundError') {
                                return {
                                    sucesso: false,
                                    mensagem: 'Nenhuma tela disponível para gravar'
                                };
                            }
                            
                            return {
                                sucesso: false,
                                mensagem: 'Erro ao iniciar gravação: ' + erro.message
                            };
                        }
                    }

                    parar() {
                        if (!this.isRecording || !this.mediaRecorder) {
                            return;
                        }

                        this.mediaRecorder.stop();
                        this.isRecording = false;

                        this.stream.getTracks().forEach(track => track.stop());
                    }

                    processarGravacaoFinalizada() {
                        if (this.chunks.length === 0) {
                            console.error('Nenhum dado de gravação coletado');
                            return;
                        }

                        const blob = new Blob(this.chunks, { type: this.obterMimeType() });
                        const dataGravacao = this.recordingStartTime || new Date();
                        const nomeArquivo = this.gerarNomeArquivo(dataGravacao);
                        
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = nomeArquivo;
                        
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        URL.revokeObjectURL(url);

                        // Notificar sucesso
                        const tamanhoMB = (blob.size / 1024 / 1024).toFixed(2);
                        const mensagem = 'Gravação salva: ' + nomeArquivo + ' (' + tamanhoMB + 'MB)';
                        console.log('✓ ' + mensagem);
                    }

                    obterMimeType() {
                        const tipos = [
                            'video/webm;codecs=vp9',
                            'video/webm;codecs=vp8',
                            'video/webm'
                        ];

                        for (const tipo of tipos) {
                            if (MediaRecorder.isTypeSupported(tipo)) {
                                return tipo;
                            }
                        }

                        return 'video/webm';
                    }

                    gerarNomeArquivo(data) {
                        const ano = data.getFullYear();
                        const mes = String(data.getMonth() + 1).padStart(2, '0');
                        const dia = String(data.getDate()).padStart(2, '0');
                        const hora = String(data.getHours()).padStart(2, '0');
                        const minuto = String(data.getMinutes()).padStart(2, '0');
                        const segundo = String(data.getSeconds()).padStart(2, '0');

                        return 'gravacao_' + ano + mes + dia + '_' + hora + minuto + segundo + '.webm';
                    }

                    estaGravando() {
                        return this.isRecording;
                    }

                    obterDuracaoGravacao() {
                        if (!this.recordingStartTime) {
                            return 0;
                        }
                        return Math.floor((new Date() - this.recordingStartTime) / 1000);
                    }
                }

                // ============================================
                // LÓGICA DO POPUP
                // ============================================
                
                const recorder = new PopupScreenRecorder();

                function mudarEstado(estado) {
                    document.querySelectorAll('.recorder-state').forEach(el => {
                        el.classList.add('hidden');
                    });
                    document.querySelector('.' + estado + '-state').classList.remove('hidden');
                }

                function atualizarTimer() {
                    const duracao = recorder.obterDuracaoGravacao();
                    const minutos = Math.floor(duracao / 60);
                    const segundos = duracao % 60;
                    const tempo = String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
                    document.querySelector('.timer-value').textContent = tempo;
                }

                function processarGravacaoFinalizada() {
                    const tamanhoTotal = recorder.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
                    const tamanhoMB = (tamanhoTotal / 1024 / 1024).toFixed(2);
                    const nomeArquivo = recorder.gerarNomeArquivo(recorder.recordingStartTime);

                    document.querySelector('.size-value').textContent = tamanhoMB + ' MB';
                    document.querySelector('.name-value').textContent = nomeArquivo;
                    
                    mudarEstado('completed');
                }

                // Função para iniciar gravação
                async function iniciarGravacao() {
                    const resultado = await recorder.iniciar();
                    if (resultado.sucesso) {
                        mudarEstado('recording');
                    } else {
                        document.getElementById('error-message').textContent = resultado.mensagem;
                        mudarEstado('error');
                    }
                }

                // Event listeners
                document.getElementById('btn-start-recording').addEventListener('click', iniciarGravacao);

                // Clique no ícone da seta vermelha também inicia a gravação
                document.querySelector('.ready-state .state-icon').addEventListener('click', iniciarGravacao);

                document.getElementById('btn-stop-recording').addEventListener('click', () => {
                    recorder.parar();
                });

                document.getElementById('btn-new-recording').addEventListener('click', () => {
                    mudarEstado('ready');
                });

                document.getElementById('btn-close-popup').addEventListener('click', () => {
                    window.close();
                });

                document.getElementById('btn-retry-recording').addEventListener('click', () => {
                    mudarEstado('ready');
                });

                // Monitorar gravação
                setInterval(() => {
                    if (recorder.estaGravando()) {
                        atualizarTimer();
                    } else if (!document.querySelector('.recording-state').classList.contains('hidden') && 
                              !document.querySelector('.completed-state').classList.contains('hidden') === false) {
                        processarGravacaoFinalizada();
                    }
                }, 100);
            </script>
        </body>
        </html>
        `;

        this.popupWindow.document.open();
        this.popupWindow.document.write(html);
        this.popupWindow.document.close();
    }
}

// Inicializar
window.screenRecorderPopup = new ScreenRecorderPopup();

// Liga o item de menu "Gravar Vídeo Suporte" (#screen-recorder-toggle-btn) sem script inline no layout.
// Delegação de evento: funciona mesmo que o menu seja recarregado.
document.addEventListener('click', (e) => {
    const botao = e.target.closest('#screen-recorder-toggle-btn');
    if (botao) {
        e.preventDefault();
        window.screenRecorderPopup.abrir();
    }
});
