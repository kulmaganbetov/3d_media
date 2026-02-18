# Күн жүйесі — 3D / Solar System 3D

Интерактивті 3D Күн жүйесі веб-қосымшасы. Қазақ тілінде.

Interactive 3D Solar System web application in Kazakh language.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kulmaganbetov/3d_media)

## Мүмкіндіктер / Features

- 9 планета + Плутон (ергежейлі планета) нақты текстуралармен
- Күн — арнайы glow шейдермен + Bloom эффект
- Астероид белдеуі (800+ бөлшек, instanced mesh)
- Сатурн сақиналары
- Жер серігі (Ай) және Юпитердің 4 галилей серігі
- 4000+ жұлдыз өрісі
- Нақты планета позициялары (astronomy-engine)
- Планета ақпарат панелі (атмосфера диаграммасы, миссиялар, фактілер)
- Планеталарды салыстыру
- Уақыт басқару (жылдамдық, тоқтату, күн таңдау)
- Кинематографиялық камера анимациясы
- Толық қараңғы ғарыш тақырыбы (glassmorphism)
- Адаптивті дизайн (мобильді құрылғыларға қолдау)

## Технологиялар / Tech Stack

- React + Vite
- Three.js + React Three Fiber
- @react-three/drei, @react-three/postprocessing
- Framer Motion
- Zustand
- Tailwind CSS

## Орнату / Setup

```bash
npm install
npm run dev
```

## Пернетақта / Keyboard

- `ESC` — сахнаға қайту
- `Бос орын` — тоқтату/ойнату
- `1-9` — планетаға секіру
- `/` — іздеу
- Екі рет басу — жалпы көрініске қайту

## Құру / Build

```bash
npm run build
npm run preview
```

## Деплой / Deploy

Vercel-ге деплой жасау үшін жоғарыдағы батырманы басыңыз немесе:

```bash
npx vercel
```
