![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)

# Social-app-web

this website have real data with posts and comments with choose language for what you suitable and see who folow you like other social app

---

## 📄 License

**Copyright (c) 2026 Yehia Mohamed — All rights reserved.**

This project is shared for course-review / portfolio purposes only.

Copying, redistribution or reuse without written permission is prohibited.

---

## 👨‍💻 Author

**Yehia Mohamed**

- GitHub: [@yehia3-arc](https://github.com/yehia3-arc)
- Live Demo: [https://social-app-web-yehia-blush.vercel.app](https://social-app-web-yehia-blush.vercel.app)

# Social App (React + TS + Tailwind + React Query)

Frontend built 100% by me: yehia mohamed — Route Academy project.
Backend: Route Academy public Posts API (https://route-posts.routemisr.com) — not my work.
Features: posts CRUD, comments/replies/mentions, likes, bookmarks, shares,
follow system, notifications, profile tabs, image lightbox, mobile-responsive UI.
© 2026 yehia mohamed. Submitted for course review only.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
