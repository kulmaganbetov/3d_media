export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY орнатылмаған. Vercel Environment Variables ішінде орнатыңыз.' });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages массиві қажет' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Сен — ғарыш туралы білімді AI көмекші. Қазақ тілінде жауап бер. ' +
              'Планеталар, жұлдыздар, галактикалар, қара тесіктер, ғарыш миссиялары, ' +
              'ғарышкерлер, ракеталар, экзопланеталар, тұмандықтар және басқа ғарыш тақырыптары бойынша сұрақтарға жауап бер. ' +
              'Жауаптарың қысқа, нақты және қызықты болсын. Ғылыми дәл ақпарат бер. ' +
              'Егер сұрақ ғарышқа қатысты болмаса, сыпайы түрде ғарыш тақырыбына бағытта. ' +
              'Қажет болса, қызықты фактілер қос.',
          },
          ...messages.slice(-10),
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: err.error?.message || `OpenAI API қатесі: ${response.status}`,
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Жауап алу мүмкін болмады.';

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: `Серверлік қате: ${err.message}` });
  }
}
