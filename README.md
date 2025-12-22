# Agrofy Frontend Template

Bu minimal React + TypeScript + Vite shablon. Yangi loyiha boshlash uchun tayyor.

## ✨ Xususiyatlar

- ✅ **React 19** + **TypeScript** - Zamonaviy stack
- ✅ **Vite** - Tez build va HMR
- ✅ **Mantine UI** - Komponent kutubxonasi
- ✅ **Dark Mode / Light Mode** - Tugma bilan o'zgartirish
- ✅ **React Router** - Routing
- ✅ **Zustand** - State management
- ✅ **React Query** - Data fetching
- ✅ **i18next** - Ko'p tillilik (UZ, RU, EN)
- ✅ **Axios** - HTTP client
- ✅ **ESLint + Prettier** - Code quality

## 🚀 O'rnatish

```bash
npm install
# yoki
yarn install
```

## 🏃 Ishga tushirish

```bash
npm run dev
# yoki
yarn dev
```

Loyiha `http://localhost:3000` da ochiladi.

## 📦 Build

```bash
npm run build
# yoki
yarn build
```

## 📁 Struktura

```
src/
├── app/              # Asosiy app struktura
│   ├── layout/       # Layout komponentlar (Header, Footer)
│   ├── providers/    # Global providers (Mantine, Router, Query)
│   └── routers/       # Routing konfiguratsiyasi
├── pages/            # Sahifalar
│   └── home/         # Home sahifa (misol)
├── shared/           # Umumiy fayllar
│   ├── api/          # API konfiguratsiyasi
│   ├── lib/          # Utility funksiyalar
│   ├── store/        # Zustand store'lar (auth, theme)
│   ├── ui/           # UI komponentlar (Button, Container)
│   └── theme.ts      # Mantine theme
└── assets/           # Static fayllar
```

## 🎨 Dark Mode

Dark mode funksiyasi qo'shilgan. Header'da toggle tugmasi mavjud.

```tsx
import { useThemeStore } from '@/shared/store/themeStore';

const { colorScheme, toggleColorScheme } = useThemeStore();
```

## 🔐 Authentication

Minimal auth store mavjud. Loyihaga moslashtirish kerak:

```tsx
import { useAuthStore } from '@/shared/store/authStore';

const { isAuthenticated, user, login, logout } = useAuthStore();
```

## 🌐 API

API konfiguratsiyasi `src/shared/api/api.interface.ts` faylida.

`.env` faylini yarating:

```env
VITE_API_URL=http://localhost:8000/api
```

Yangi API servis yaratish:

```tsx
// src/shared/api/services/example/example.api.ts
import api from '@/shared/api/api.interface';

export const getExample = () => {
  return api.get('/example');
};
```

## 🌍 i18n (Ko'p tillilik)

Tarjimalar `locales/` papkasida. Foydalanish:

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<h1>{t('common.welcome')}</h1>;
```

## 📝 Yangi loyiha boshlash

1. Bu papkani copy qiling
2. `package.json` da nom va ma'lumotlarni o'zgartiring
3. `.env` faylini yarating va API URL'ni o'rnating
4. `src/pages` da yangi sahifalar yarating
5. `src/shared/api/services` da API servislarni yarating
6. `locales/` da tarjimalarni to'ldiring

## 🛠️ Foydali komandalar

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Preview build
npm run preview
```

## 📄 License

ISC

---

**Eslatma:** Bu minimal shablon. Yangi loyiha boshlash uchun tayyor. Barcha keraksiz kodlar tozalanagan.
