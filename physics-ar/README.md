# PhysicsAR — Физика Зертханасы

Kazakh high school students-ке арналған PWA физика платформасы.

## Орнату

```bash
npm install jose @vercel/kv
vercel dev
```

## Vercel KV баптау

1. Vercel Dashboard → жобаңыз → **Storage** табы.
2. **Create Database** → **KV** таңдаңыз.
3. Жобамен байланыстырыңыз; `KV_REST_API_URL` және `KV_REST_API_TOKEN` env айнымалылары автоматты түрде пайда болады.

## Environment Variables қосу

Vercel Dashboard → **Settings** → **Environment Variables**:

- `OPENAI_API_KEY`
- `JWT_SECRET`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Локалға `.env.example` негізінде `.env.local` жасаңыз.

## Deploy

```bash
vercel --prod
```

## Негізгі мүмкіндіктер

- Email/password auth + JWT + Vercel KV
- 4 сабақ, 4 зертхана (canvas симуляциялар)
- 4 практика (тест + балл сақтау)
- AR режим (`facingMode: environment`)
- AI чат (`/api/chat`, GPT-4o-mini)
- Offline режим (service worker)
