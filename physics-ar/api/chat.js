import { jwtVerify } from 'jose';

const enc = new TextEncoder();

async function verifyToken(authHeader = '') {
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) throw new Error('Токен жоқ');
  const { payload } = await jwtVerify(token, enc.encode(process.env.JWT_SECRET));
  return payload;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Тек POST қолдайды' });

  try {
    await verifyToken(req.headers.authorization || '');
    const { message, history = [] } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Сұрақ бос' });

    const messages = [
      { role: 'system', content: 'Сен физика пәнінің AI көмекшісісің. Қазақ тілінде жауап бер. Формулаларды LaTeX емес, қарапайым мәтінде жаз.' },
      ...history.filter((m) => m?.role && m?.content).slice(-10),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature: 0.3 })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'Кешіріңіз, жауап алу мүмкін болмады.';
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(401).json({ error: 'Рұқсат жоқ немесе чат қатесі', detail: error.message });
  }
}
