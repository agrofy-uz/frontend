# Agrofy Frontend

Bu loyiha React + TypeScript + Vite stack'ida yaratilgan. Dark mode va light mode'ni qo'llab-quvvatlaydi.

## O'rnatish

```bash
npm install
# yoki
yarn install
```

## Ishga tushirish

```bash
npm run dev
# yoki
yarn dev
```

## Dark Mode

Dark mode funksiyasi qo'shilgan. Foydalanish uchun `ThemeToggle` komponentidan foydalaning:

```tsx
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

<ThemeToggle />
```

Dark mode holati `useThemeStore` hook orqali boshqariladi va localStorage'da saqlanadi.

## Build

```bash
npm run build
# yoki
yarn build
```

