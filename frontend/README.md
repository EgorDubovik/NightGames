# NightGames (React + Vite)

Проект переведен в структуру React + Vite на основе исходных файлов интерфейса.

## Запуск

```bash
npm install
npm run dev
```

Открой адрес, который покажет Vite (обычно `http://localhost:5173`).

## Сборка

```bash
npm run build
npm run preview
```

## Структура

- `index.html` - точка входа HTML (Tailwind CDN + Lucide CDN)
- `src/main.jsx` - bootstrap React
- `src/App.jsx` - основной экран
- `src/components/*` - переиспользуемые компоненты
- `src/style.css` - кастомные стили

## Примечание

В проекте могут оставаться старые файлы из версии без Vite (`App.jsx`, `style.css`, `components/*` в корне). Текущая рабочая версия использует только `src/*`.
