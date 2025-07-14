# 🔗 thesharing.link - Bundle and Share Multiple URLs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.5-green.svg)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.3-ff69b4.svg)](https://www.framer.com/motion/)


A modern, elegant web application for creating and sharing collections of URLs through a single shareable link. Perfect for curating resources, sharing reading lists, or organizing links for projects and presentations.

## ✨ Features

- **No Sign-up Required** - Create and share bundles instantly without registration
- **Custom Vanity URLs** - Create memorable, branded links (e.g., `yourdomain.com/my-resources`)
- **Rich Link Previews** - Automatically fetches titles, descriptions, favicons, and OG images
- **Drag & Drop Reordering** - Easily organize your links with smooth animations
- **Dark/Light/System Theme** - Beautiful interface that adapts to your preference
- **Mobile Responsive** - Works seamlessly on all devices
- **Instant Publishing** - Share your bundles with a single click
- **Public Access** - Published bundles are accessible to anyone with the link
- **Multi-language Support** - Built-in internationalization with 8 languages (English, Spanish, French, German, Portuguese, Japanese, Korean, Chinese)
- **Remix Functionality** - Easily remix existing bundles to create new ones
- **Local Storage Persistence** - Save your work-in-progress bundles locally

## 🚀 Live Demo

Visit [thesharing.link](https://thesharing.link) to try it out! (Replace with actual deployment URL if available)

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── BundleSettings.tsx  # Bundle configuration (vanity URL, description)
│   ├── BundleViewer.tsx    # View-only mode for shared bundles
│   ├── Footer.tsx          # Application footer
│   ├── Header.tsx          # Main navigation header with theme/language selectors
│   ├── LanguageSelector.tsx # Language switcher component
│   ├── LinkList.tsx        # Draggable list of links with animations
│   ├── PublishButton.tsx   # Publishing functionality with animations
│   └── UrlInput.tsx        # URL input with validation and metadata fetching
├── contexts/           # React contexts
│   └── LanguageContext.tsx # Manages application language state
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts  # Persist data in localStorage
│   ├── useTheme.ts         # Theme management (light/dark/system)
│   └── useTranslation.ts   # i18n hook for translations
├── i18n/               # Internationalization
│   └── translations.ts     # Translation strings for all supported languages
├── lib/                # Third-party library configurations
│   ├── database.types.ts   # Supabase database types
│   └── supabase.ts         # Supabase client configuration
├── types/              # TypeScript type definitions
│   └── index.ts            # Shared types (LinkItem, Bundle, Theme)
├── utils/              # Utility functions
│   ├── htmlUtils.ts        # HTML entity decoding
│   └── urlUtils.ts         # URL validation, normalization, metadata fetching, ID generation
├── App.tsx             # Main application component and state management
├── index.css           # Global CSS with Tailwind
├── main.tsx            # Application entry point
└── vite-env.d.ts       # Vite environment types

supabase/
├── functions/          # Edge functions
│   └── fetch-metadata/     # Serverless function for URL metadata extraction
└── ...                 # (Migrations and other Supabase configs not included in concat)

Other files:
├── index.html          # HTML entry with meta tags and theme/language scripts
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── README.md           # This file
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.app.json   # TypeScript config for app
├── tsconfig.json       # Main TypeScript config
└── tsconfig.node.json  # TypeScript config for Node/Vite
```

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 with TypeScript
  - Vite 5.x (Build Tool)
  - Tailwind CSS 3.x (Styling)
  - Framer Motion (Animations and transitions)
  - Lucide React (Icons)
  - React Toastify (Notifications)

- **Backend**:
  - Supabase (Database, Edge Functions)
  - PostgreSQL (Database via Supabase)
  - Deno (For edge functions)

- **Development Tools**:
  - ESLint (Code Linting)
  - TypeScript (Type Checking)
  - NPM (Package Manager)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Supabase account (for backend services)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thesharing-link.git
   cd thesharing-link
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Lint the code**
   ```bash
   npm run lint
   ```

## Database Schema

The application uses Supabase with the following tables:

### `bundles` table
- `id` (uuid): Primary key
- `user_id` (uuid, nullable): For future auth
- `vanity_url` (text, unique): Custom URL slug
- `description` (text): Bundle description
- `published` (boolean): Publication status
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### `bundle_links` table
- `id` (uuid): Primary key
- `bundle_id` (uuid): Foreign key to bundles
- `url` (text): Link URL
- `title` (text)
- `description` (text)
- `favicon` (text)
- `og_image` (text, nullable)
- `position` (integer): Order in bundle
- `created_at` (timestamptz)

## Key Components

- **App.tsx**: Core logic for bundle management, viewing, and publishing
- **BundleViewer.tsx**: Renders public bundles with rich previews
- **PublishButton.tsx**: Handles publishing with animations and feedback
- **UrlInput.tsx**: Adds links with metadata fetching and validation
- **LinkList.tsx**: Draggable list with Framer Motion animations
- **LanguageContext.tsx**: Manages multi-language support

## Internationalization

Supports 8 languages. Translations are in `src/i18n/translations.ts`. Browser language is auto-detected with localStorage persistence.

## Deployment

### Vercel/Netlify (Recommended for Frontend)

1. Push to GitHub
2. Import to Vercel/Netlify
3. Set env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Supabase Setup

1. Create Supabase project
2. Deploy edge function from `supabase/functions/fetch-metadata`
3. Set up tables matching the schema above
4. Enable Row Level Security (RLS) for public reads on published bundles

## 🔒 Security Notes

- Anonymous publishing (user_id nullable)
- Vanity URL validation and availability checks
- RLS for database security
- CORS headers in edge functions
- Input sanitization for URLs

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and open PR

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with ❤️ using React, TypeScript, Tailwind, Supabase, and Framer Motion. Special thanks to open-source contributors.