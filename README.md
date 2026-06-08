# Eredivisie Kampioenen Overhoringsplatform

Een interactief overhoringsplatform en overzicht voor alle kampioenen van de Nederlandse Eredivisie vanaf 1889.

## Functies

- 📚 **Overzicht**: Compleet overzicht van alle Eredivisie-kampioenen sinds 1889
- 🎓 **Oefenmodus**: Test je kennis met quizzen over de kampioenen
- 📊 **Statistieken**: Interessante data en feiten over de champions
- 🏆 **Interactief**: Leer en test jezelf op een leuke manier

## Structuur

```
eredivisie/
├── data/
│   ├── champions.json          # Alle kampioenen met details
│   └── README.md               # Data documentatie
├── src/
│   ├── components/             # React componenten
│   ├── pages/                  # Pagina's
│   ├── api/                    # API routes
│   └── styles/                 # CSS/styling
├── public/                     # Statische files
├── package.json
├── index.html
└── README.md
```

## Technologie Stack

- **Frontend**: React, TypeScript, CSS3
- **Backend**: Node.js/Express (optioneel voor API)
- **Data**: JSON (alle kampioenen gegevens)
- **Build**: Vite/Webpack

## Installatie

```bash
# Clone de repository
git clone https://github.com/cjjdogterom/eredivisie.git
cd eredivisie

# Installeer dependencies
npm install

# Start development server
npm run dev
```

## Licentie

MIT
