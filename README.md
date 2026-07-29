# DiabetView 2

## Project Overview

**DiabetView 2** is a fully client-side (static) web application designed to improve **treatment adherence for Type 2 Diabetes Mellitus (T2DM)** patients by making the causal relationships behind their condition visible, interactive, and personal.

Instead of generic advice like "eat less sugar, move more," DiabetView 2 turns each patient's data into an interactive **Causal Loop Diagram (CLD)**, lets them run **What-If counterfactual scenarios**, simulate their own **24-hour glucose curve** on a **Digital Twin**, and log daily adherence — all backed by an educational AI assistant chat (running in a local, offline demo mode).

**Core modules:**
| # | Module | What it does |
|---|--------|---------------|
| 1 | **CLD Map** | Interactive Causal Loop Diagram: 11 factors (diet, glucose, HbA1c, activity, motivation, fear, complications, etc.) connected through 5 feedback loops (reinforcing "R" and balancing "B"). Click any node to see its leverage score and a "What-If" hint. |
| 2 | **What-If / Counterfactual Engine** | 4 ready-made scenarios (Minimum Viable Recommendation, Ambitious target, "No change" risk projection, and a behavioral "post-dinner walk" scenario) with projected HbA1c, complication risk change, and an Individual Treatment Effect (ITE) risk/benefit breakdown. |
| 3 | **Digital Twin** | Live simulator of a patient's 24h glucose curve (CGM-style chart) driven by sliders for activity, carb intake, medication adherence, sleep, stress, and a post-meal walk toggle. |
| 4 | **Adherence Dashboard** | Daily self-monitoring log, gamified achievements, and a one-click "doctor visit report" generator (copy/print). |
| 5 | **AI Assistant (offline demo mode)** | Chat with rule-based, structured educational answers generated entirely in the browser from the patient profile and selected scenario — no network calls, no API key, works without a VPN. |

**Tech stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Recharts + Lucide Icons. No backend, no database — 100% static build, deployable to Netlify (or any static host) with zero environment variables.

> The rest of this README (in Russian) goes into more detail on architecture, bug fixes, project structure, usage, and deployment steps.

---

## О проекте
- **Название**: DiabetView 2
- **Цель**: Повышение приверженности лечению сахарного диабета 2 типа (СД2) через наглядное объяснение причинно-следственных связей организма пациента.
- **Ключевые возможности**:
  1. **Карта диабета (CLD)** — интерактивная Causal Loop Diagram с 11 факторами (диета, глюкоза, HbA1c, активность, мотивация и др.) и 5 петлями обратной связи (усиливающими R и балансирующими B).
  2. **What-If / Контрфактическое моделирование** — 4 готовых сценария (минимальный шаг MVR, амбициозная цель, риск без изменений, поведенческий сценарий с прогулкой после еды) с прогнозом HbA1c, риска осложнений и индивидуальным эффектом лечения (ITE).
  3. **Digital Twin** — интерактивный симулятор суточного профиля глюкозы (CGM) с настраиваемыми параметрами: активность, углеводы, приём медикаментов, сон, стресс, прогулка после ужина.
  4. **Дневник приверженности** — трекер ежедневных записей, геймификация (достижения), генератор отчёта для визита к врачу.
  5. **ИИ-консультант (демо-режим)** — чат с заготовленными, структурированными ответами на основе профиля пациента и выбранного сценария (без обращения к внешним ИИ-сервисам).

## Важное изменение архитектуры
Исходная версия приложения (из Google AI Studio) использовала Node.js/Express-сервер с обращением к Gemini API. Для деплоя на **Netlify** (статический хостинг) и по требованию пользователя приложение переведено в **полностью статический режим**:
- Убран backend (Express, `server.ts`, `@google/genai`).
- ИИ-консультант генерирует ответы **локально в браузере** (файл `src/utils/aiAssistant.ts`) — без сети, без API-ключей, работает мгновенно и без VPN.
- Все данные (профили пациентов, сценарии, CLD-граф) хранятся в `src/data/*.ts` и в состоянии React на клиенте (без сервера/базы данных).

## Исправленные баги
- **Нарушение Rules of Hooks** в `CustomPatientModal.tsx`: `useState` вызывались ПОСЛЕ условного `return null`, что могло приводить к рассинхронизации состояния React между рендерами. Хуки перенесены в начало компонента, добавлен `useEffect` для синхронизации формы с выбранным пациентом.
- Убраны все обращения к недоступному без VPN `/api/gemini/*` (Google Gemini API) — приложение больше не зависит от внешних сетевых запросов.
- Исправлена конфигурация Vite (`allowedHosts`) для корректной работы preview за прокси/сатбоксом.

## Структура проекта
```
webapp/
├── src/
│   ├── App.tsx                       # Корневой компонент, роутинг вкладок
│   ├── main.tsx                      # Точка входа React
│   ├── index.css                     # Tailwind CSS
│   ├── types.ts                      # Общие TypeScript типы
│   ├── components/
│   │   ├── Navbar.tsx                # Навигация, выбор пациента
│   │   ├── CldViewer.tsx             # Причинно-следственная карта (CLD)
│   │   ├── CounterfactualEngineView.tsx  # What-If сценарии + ITE
│   │   ├── DigitalTwinView.tsx       # Симулятор CGM (Digital Twin)
│   │   ├── AdherenceDashboard.tsx    # Дневник, достижения, отчет врачу
│   │   ├── AiAssistantDrawer.tsx     # ИИ-чат (демо-режим)
│   │   └── CustomPatientModal.tsx    # Редактор своих клинических данных
│   ├── data/
│   │   ├── cldData.ts                # Узлы/связи/петли CLD
│   │   └── presetProfiles.ts         # Профили пациентов, сценарии, метрики
│   └── utils/
│       ├── counterfactualEngine.ts   # Расчёт CGM-кривой, HbA1c, рисков
│       └── aiAssistant.ts            # Локальная генерация ответов ИИ-чата
├── public/                            # Статические файлы (favicon и др.)
├── index.html
├── vite.config.ts
├── netlify.toml                       # Конфигурация деплоя Netlify
└── package.json
```

## Хранение данных
Приложение полностью **клиентское (client-side)**: данные о пациентах, дневник и достижения хранятся только в состоянии React (`useState`) в рамках текущей сессии браузера и сбрасываются при перезагрузке страницы. Внешние базы данных/API не используются.

## Как пользоваться
1. Выберите пациента в шапке (или введите свои данные через кнопку «Свои данные»).
2. Вкладка **«1. Карта Диабета (CLD)»** — изучите факторы и петли обратной связи, кликните на фактор для деталей.
3. Вкладка **«2. Что если? (What-If)»** — выберите сценарий изменения образа жизни, посмотрите прогноз HbA1c и риска осложнений.
4. Вкладка **«3. Digital Twin»** — подвигайте слайдеры (активность, углеводы, сон, стресс) и увидите изменение суточной кривой глюкозы в реальном времени.
5. Вкладка **«4. Приверженность & Трекер»** — добавляйте ежедневные записи, получайте достижения, сформируйте отчёт для врача.
6. Вкладка **«ИИ-Врач (демо)»** — задайте вопрос и получите структурированный образовательный ответ (генерируется локально, без интернета).

## Локальный запуск
```bash
npm install
npm run dev       # запуск дев-сервера (http://localhost:3000)
npm run build     # сборка в папку dist/
npm run preview   # локальный просмотр собранной версии
```

## Деплой на Netlify
Проект уже содержит `netlify.toml` с настройками сборки:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

**Вариант 1 — через сайт Netlify (проще всего):**
1. Зайдите на [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Подключите GitHub-репозиторий этого проекта.
3. Netlify автоматически определит настройки из `netlify.toml` (команда сборки `npm run build`, папка публикации `dist`).
4. Нажмите **Deploy site** — через 1-2 минуты сайт будет доступен по адресу `https://<random-name>.netlify.app`.
5. При желании подключите свой домен в **Site settings → Domain management**.

**Вариант 2 — через Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify init         # свяжет текущую папку с новым/существующим сайтом Netlify
netlify deploy --prod
```

Никаких переменных окружения или API-ключей для деплоя не требуется — приложение полностью статическое.

## Статус деплоя
- **Платформа**: Netlify (статический хостинг)
- **Технологии**: React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Recharts + Lucide Icons
- **Backend**: отсутствует (полностью клиентское приложение)
- **ИИ**: локальный демо-режим (без внешних API)
- **Дата последнего обновления**: 2026-07-29
