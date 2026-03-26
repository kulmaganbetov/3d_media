import crypto from 'node:crypto';
import { kv } from '@vercel/kv';
import { SignJWT } from 'jose';

const enc = new TextEncoder();

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Тек POST қолдайды' });

  try {
    const { action, email, password, passwordHash, name } = req.body || {};
    if (!action || !email) return res.status(400).json({ error: 'Мәлімет толық емес' });

    if (action === 'register') {
      const existing = await kv.get(`user:${email}`);
      if (existing) return res.status(409).json({ error: 'Пайдаланушы бар' });

      const storedHash = passwordHash || (password ? hashPassword(password) : null);
      if (!storedHash) return res.status(400).json({ error: 'Құпия сөз қажет' });

      await kv.set(`user:${email}`, {
        email,
        passwordHash: storedHash,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString()
      });

      return res.status(200).json({ success: true });
    }

    if (action === 'login') {
      const user = await kv.get(`user:${email}`);
      if (!user) return res.status(404).json({ error: 'Пайдаланушы табылмады' });

      const incomingHash = passwordHash || (password ? hashPassword(password) : null);
      if (!incomingHash || incomingHash !== user.passwordHash) {
        return res.status(401).json({ error: 'Email немесе құпия сөз қате' });
      }

      const token = await new SignJWT({ sub: user.email, name: user.name, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(enc.encode(process.env.JWT_SECRET));

      return res.status(200).json({ token, user: { email: user.email, name: user.name } });
    }

    return res.status(400).json({ error: 'action дұрыс емес' });
  } catch (error) {
    return res.status(500).json({ error: 'Сервер қатесі', detail: error.message });
  }
}
