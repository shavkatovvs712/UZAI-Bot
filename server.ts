import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleBotIncoming } from './src/bot/handlers/dispatcher.ts';
import { dbService } from './src/bot/services/dbService.ts';
import { telegramRunner } from './src/bot/botRunner.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Endpoints for the Telegram Bot Engine & Web Studio

  // 1. Send message to bot (Simulator & Web App)
  app.post('/api/bot/message', async (req: Request, res: Response) => {
    try {
      const { telegramId, username, firstName, text, callbackData, photoBase64, photoMimeType } = req.body;
      const tid = Number(telegramId) || 541021808;

      const botResponse = await handleBotIncoming({
        telegramId: tid,
        username: username || 'web_user',
        firstName: firstName || 'Foydalanuvchi',
        text,
        callbackData,
        photoBase64,
        photoMimeType,
      });

      const user = dbService.getUser(tid);
      const todayUsage = user ? dbService.getUserTodayUsage(user.id) : 0;

      res.json({
        success: true,
        response: botResponse,
        user: user || null,
        todayUsage,
      });
    } catch (err: any) {
      console.error('Error in /api/bot/message:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Server error',
      });
    }
  });

  // 2. Get current user profile & quota
  app.get('/api/bot/user/:telegramId', (req: Request, res: Response) => {
    const tid = Number(req.params.telegramId) || 541021808;
    const user = dbService.getOrCreateUser(tid);
    const todayUsage = dbService.getUserTodayUsage(user.id);
    const totalUsage = dbService.getUserTotalUsage(user.id);

    res.json({
      user,
      todayUsage,
      totalUsage,
    });
  });

  // 3. System stats for Admin Panel
  app.get('/api/bot/stats', (req: Request, res: Response) => {
    const stats = dbService.getSystemStats();
    const users = dbService.getAllUsers();
    res.json({
      stats,
      users,
      botStatus: telegramRunner.getStatus(),
    });
  });

  // 4. Update bot configuration & start telegram polling
  app.post('/api/bot/config', async (req: Request, res: Response) => {
    const { botToken } = req.body;
    if (botToken) {
      process.env.BOT_TOKEN = botToken;
      await telegramRunner.initBot(botToken);
      const started = await telegramRunner.start();
      res.json({ success: true, started, status: telegramRunner.getStatus() });
    } else {
      res.json({ success: false, message: 'Bot token kiritilmadi' });
    }
  });

  // 5. Admin broadcast message to all users
  app.post('/api/bot/admin/broadcast', (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Xabar matni bo\'sh' });
    }
    const users = dbService.getAllUsers();
    // Record broadcast delivery for each user's conversation
    for (const u of users) {
      const conv = dbService.getOrCreateConversation(u.id, 'Ommaviy Xabar', 'broadcast');
      dbService.addMessage(conv.id, 'assistant', `📢 <b>UZAI Rasmiy Xabarnomasi:</b>\n\n${text}`);
    }
    res.json({ success: true, count: users.length });
  });

  // 6. Admin change user plan
  app.post('/api/bot/admin/set-plan', (req: Request, res: Response) => {
    const { telegramId, plan } = req.body;
    const updated = dbService.updateUserPlan(Number(telegramId), plan);
    res.json({ success: Boolean(updated), user: updated });
  });

  // 7. Telegram Webhook handler
  app.post('/api/telegram/webhook', async (req: Request, res: Response) => {
    try {
      const update = req.body;
      const message = update.message;
      const callbackQuery = update.callback_query;

      if (message) {
        const from = message.from;
        const text = message.text;
        const resp = await handleBotIncoming({
          telegramId: from.id,
          username: from.username,
          firstName: from.first_name,
          text,
        });

        // Webhook reply payload directly in HTTP response
        return res.json({
          method: 'sendMessage',
          chat_id: from.id,
          text: resp.text,
          parse_mode: resp.parse_mode,
          reply_markup: resp.reply_markup,
        });
      } else if (callbackQuery) {
        const from = callbackQuery.from;
        const resp = await handleBotIncoming({
          telegramId: from.id,
          username: from.username,
          firstName: from.first_name,
          callbackData: callbackQuery.data,
        });
        return res.json({
          method: 'sendMessage',
          chat_id: from.id,
          text: resp.text,
          parse_mode: resp.parse_mode,
          reply_markup: resp.reply_markup,
        });
      }
      res.json({ ok: true });
    } catch (e: any) {
      console.error('Webhook error:', e);
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Mount Vite or static server
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  // Attempt to start telegram bot if token exists in env
  if (process.env.BOT_TOKEN) {
    telegramRunner.start().catch((err) => {
      console.warn('Telegram bot auto-start note:', err.message);
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ UZAI Telegram Bot Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
});
