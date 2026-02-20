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

## Деплой Через Docker Compose

1. Локально собери фронтенд:

```bash
npm run build
```

2. Создай файл `.env` в папке `frontend` на сервере:

```env
NIGHTGAMES_PORT=8088
```

3. Запусти:

```bash
docker compose up -d --build
```

4. Открой:

```text
http://SERVER_IP:8088
```

Остановить/обновить:

```bash
docker compose down
docker compose up -d --build
```

## Структура

- `index.html` - точка входа HTML (Tailwind CDN + Lucide CDN)
- `src/main.jsx` - bootstrap React
- `src/App.jsx` - основной экран
- `src/components/*` - переиспользуемые компоненты
- `src/style.css` - кастомные стили

## Примечание

В проекте могут оставаться старые файлы из версии без Vite (`App.jsx`, `style.css`, `components/*` в корне). Текущая рабочая версия использует только `src/*`.
