const { useMultiFileAuthState, makeWASocket } = require('@whiskeysockets/baileys');

async function startBot() {
  // Configuração de autenticação
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  // Criação do socket
  const socket = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Exibe o QR code no terminal
  });

  // Evento para salvar as credenciais
  socket.ev.on('creds.update', saveCreds);

  // Evento para receber mensagens
  socket.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0]; // Pegando a primeira mensagem recebida

    // Verifica se a mensagem não foi enviada pelo próprio bot
    if (!message.key.fromMe) {
      const sender = message.key.remoteJid; // ID do remetente
      const text = message.message?.conversation || ''; // Texto da mensagem

      console.log(`Mensagem recebida de ${sender}: ${text}`);

      // Resposta simples com base no conteúdo da mensagem
      let responseText = '';

      // Condicionais para responder com base no texto recebido
      if (text.toLowerCase().includes('oi') || text.toLowerCase().includes('olá')) {
        responseText = 'Olá! Como posso te ajudar?';
      } else if (text.toLowerCase().includes('como você está')) {
        responseText = 'Estou bem, obrigado por perguntar! E você?';
      } else if (text.toLowerCase().includes('tchau')) {
        responseText = 'Tchau! Até mais!';
      } else {
        responseText = 'Desculpe, não entendi. Você pode reformular?';
      }

      // Enviar a resposta para o usuário
      await socket.sendMessage(sender, { text: responseText });
    }
  });

  console.log('Bot iniciado! Aguardando mensagens...');
}

startBot().catch(err => console.error('Erro ao iniciar o bot:', err));
