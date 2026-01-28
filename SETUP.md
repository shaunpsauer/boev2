# Next.js 16 Project Setup

This project has been scaffolded with Next.js 16 using the App Router, TypeScript, Tailwind CSS, and ESLint.

## Project Structure

```
boeV2/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout with Geist fonts
│       ├── page.tsx          # Home page
│       └── globals.css       # Global styles with Tailwind
├── public/                   # Static assets (SVG icons)
├── Design/                   # Your existing design files
├── .gitignore
├── .env.local.example        # Environment variables template
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack (fast refresh)
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Included

✅ **Next.js 16** - Latest version with App Router
✅ **TypeScript** - Full type safety
✅ **Tailwind CSS** - Utility-first CSS framework
✅ **Turbopack** - Ultra-fast bundler for development
✅ **ESLint** - Code linting with Next.js recommended rules
✅ **Geist Fonts** - Modern font family from Vercel
✅ **Dark Mode Support** - CSS variables for theming

## Getting Started

1. Install dependencies (already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Copy `.env.local.example` to `.env.local` and add your environment variables:

```bash
cp .env.local.example .env.local
```

## Next Steps

- Add your components in `src/components/`
- Create new pages in `src/app/`
- Add API routes in `src/app/api/`
- Configure Tailwind theme in `tailwind.config.ts`
- Add global styles in `src/app/globals.css`

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
