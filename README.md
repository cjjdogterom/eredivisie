# Voetbalwinnaars — Overhoringsplatform

Een interactief overhoringsplatform en overzicht voor alle winnaars van het Nederlandse en Europese voetbal. Kies op de startpagina een **trainer** en leer of overhoor jezelf.

## Trainers

- 🏆 **Eredivisie** — alle Nederlandse landskampioenen sinds 1889
- 🏆 **KNVB Beker** — alle bekerwinnaars sinds 1899
- ⭐ **Europacup I / Champions League** — alle Europese topclub-winnaars sinds 1956
- 🌍 **WK Voetbal** — alle wereldkampioenen (mannen) sinds 1930
- 🇪🇺 **EK Voetbal** — alle Europees kampioenen (mannen) sinds 1960

## Functies (per trainer)

- 📋 **Overzicht** — doorzoekbaar en filterbaar overzicht van alle edities
- 🎓 **Overhoren** — quizzen (jaar → winnaar, winnaar → jaar, gemengd) met spelfout-tolerantie en ezelsbruggetjes
- ⚽ **Per club / land** — alle titels per winnaar, met geheugensteuntjes
- 📊 **Statistieken** — ranglijst van meeste titels, records en wist-je-datjes

## Technologie

- React 18 + TypeScript + React Router
- Vite als build-tool
- Data per trainer in `src/data/datasets/`

## Lokaal draaien

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structuur

```
src/
├── components/        # Layout, Quiz, EntityLogo
├── data/
│   ├── datasets/      # één bestand per trainer (eredivisie, knvb-beker, …)
│   └── DatasetContext.tsx
├── pages/             # Home, Overview, QuizPage, Stats, Clubs, ClubDetail, TrainerPicker
├── styles/
└── utils/
```

## Licentie

MIT
