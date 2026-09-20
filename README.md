# 📚 INFOTECH — Тестовое задание

> Каталог книг с авторами, отчётом по количеству выпущенных книг за год и разграничением прав доступа.

<p align="left">
  <img alt="Vue" src="https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white">
  <img alt="Vuetify" src="https://img.shields.io/badge/Vuetify-3-1867C0?logo=vuetify&logoColor=white">
  <img alt="Pinia" src="https://img.shields.io/badge/Pinia-store-ffd859?logo=pinia&logoColor=black">
  <img alt="Vue Router" src="https://img.shields.io/badge/Vue_Router-4-42b883?logo=vue.js&logoColor=white">
  <img alt="Axios" src="https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white">
</p>

---

## 📖 О проекте

**Каталог книг** — SPA-приложение с тремя основными разделами:

| Раздел | Описание |
|---|---|
| 📕 **Книги** | Список книг с обложкой, названием, годом, ISBN, описанием и автором. Пагинация по 12 книг на страницу. |
| ✍️ **Авторы** | Список авторов с фото и ФИО. |
| 📊 **Отчёт** | ТОП-10 авторов по количеству выпущенных книг за выбранный год (2018, 2019, 2020). |

В приложении реализовано **две роли**:

| Роль | Права |
|---|---|
| 👤 **Гость** | Только просмотр книг, авторов и отчётов |
| 🛡️ **Администратор** | Полный CRUD: создание, редактирование и удаление книг и авторов |

---

## 🛠️ Инструменты

- **Vue 3** — Composition API (`<script setup>`)
- **Vuetify 3** — UI-компоненты, темы, адаптивная сетка
- **Pinia** — управление состоянием
- **Vue Router 4** — маршрутизация с глобальными guard-ами
- **Axios** — HTTP-клиент с interceptors
- **Vite** — сборка и dev-сервер

---

## 🔐 Тестовые аккаунты

> Пока приложение работает на тестовых данных, авторизация проходит через заранее заданные учётные записи.

| Роль | Email | Пароль |
|---|---|---|
| 👤 Гость | `guest@demo.com` | `guest123` |
| 🛡️ Администратор | `admin@demo.com` | `admin123` |

---

## 📁 Структура проекта

```
src/
├── components/         # Переиспользуемые компоненты
├── data/               # Моковые данные 
├── directives/         # Кастомные директивы 
├── pages/              # Страницы приложения
│   ├── LoginPage.vue
│   ├── MainPage.vue        # Книги (главная)
│   ├── AuthorsPage.vue     # Авторы
│   └── ReportPage.vue      # Отчёт по годам
├── router/             # Маршрутизация + guards
├── services/           # API-слой (axios)
│   ├── api.js              # axios instance + interceptors
│   ├── auth.api.js
│   ├── books.api.js
│   ├── authors.api.js
│   └── reports.api.js
├── stores/             # Pinia-сторы
│   ├── auth.js
│   ├── books.js
│   └── authors.js
├── App.vue
└── main.js
```

---

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Dev-сервер с hot-reload
npm run dev

# Production-сборка
npm run build

# Предпросмотр production-сборки
npm run preview
```

Приложение откроется на [http://localhost:5173](http://localhost:5173).

---