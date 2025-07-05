w# 🔗 URL Bundler - Share Multiple Links with One URL

A modern, elegant web application for creating and sharing collections of URLs through a single shareable link. Perfect for curating resources, sharing reading lists, or organizing links for projects and presentations.

## ✨ Features

- **No Sign-up Required** - Create and share bundles instantly without registration
- **Custom Vanity URLs** - Create memorable, branded links (e.g., `yourdomain.com/my-resources`)
- **Rich Link Previews** - Automatically fetches titles, descriptions, and favicons
- **Drag & Drop Reordering** - Easily organize your links in the perfect order
- **Dark/Light Theme** - Beautiful interface that adapts to your preference
- **Mobile Responsive** - Works seamlessly on all devices
- **Instant Publishing** - Share your bundles with a single click
- **Public Access** - Published bundles are accessible to anyone with the link
- **Multi-language Support** - Built-in internationalization support

## 🚀 Live Demo

Visit [URL Bundler](https://your-app-url.vercel.app) to try it out!

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── BundleSettings.tsx  # Bundle configuration options
│   ├── BundleViewer.tsx    # View-only mode for shared bundles
│   ├── Header.tsx          # Main navigation header
│   ├── LanguageSelector.tsx # Language switcher
│   ├── LinkList.tsx        # Displays and manages the list of links
│   ├── PublishButton.tsx   # Handles bundle publishing
│   └── UrlInput.tsx        # URL input with validation and preview
├── contexts/          # React contexts
│   └── LanguageContext.tsx # Manages application language
├── hooks/             # Custom React hooks
│   ├── useLocalStorage.ts  # Persist data in localStorage
│   ├── useTheme.ts         # Theme management
│   └── useTranslation.ts   # i18n implementation
├── i18n/              # Internationalization
│   └── translations.ts     # Translation strings
├── lib/               # Third-party library configurations
│   ├── database.types.ts   # Supabase database types
│   └── supabase.ts         # Supabase client configuration
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   ├── htmlUtils.ts   # HTML manipulation utilities
│   └── urlUtils.ts    # URL validation and processing
├── App.tsx            # Main application component
└── main.tsx           # Application entry point

supabase/
├── functions/         # Edge functions
│   └── fetch-metadata/    # Fetches link metadata
└── migrations/        # Database migrations
    ├── 20250630155413_dusty_fog.sql  # Initial schema
    └── 20250630172208_delicate_reef.sql  # Schema updates
```

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 with TypeScript
  - Vite 5.x (Build Tool)
  - TailwindCSS 3.x (Styling)
  - React DnD (Drag and Drop)
  - Lucide Icons

- **Backend**:
  - Supabase (Authentication, Database, Edge Functions)
  - PostgreSQL (Database)
  - Node.js (Edge Functions)

- **Development Tools**:
  - ESLint (Code Linting)
  - TypeScript (Type Checking)
  - PNPM (Package Manager)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PNPM 8.x
- Supabase account (for backend services)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/url-bundler.git
   cd url-bundler
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:5173`

## Database Schema

The application uses the following database structure:

### `bundles` table
- `id` (uuid): Primary key
- `user_id` (uuid): References auth.users
- `vanity_url` (text, unique): Custom URL path
- `title` (text): Bundle title
- `description` (text): Bundle description
- `published` (boolean): Whether the bundle is public
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `bundle_links` table
- `id` (uuid): Primary key
- `bundle_id` (uuid): References bundles.id
- `url` (text): The shared URL
- `title` (text): Link title
- `description` (text): Link description
- `favicon` (text): URL to favicon
- `og_image` (text): Open Graph image URL
- `position` (integer): Sort order
- `created_at` (timestamp)

## Key Components

### `App.tsx`
The main application component that manages the application state and routing. It handles:
- Bundle creation and management
- View mode toggling (editor/viewer)
- Loading and saving bundles
- Theme management

### `UrlInput.tsx`
Handles URL input with validation and preview generation:
- Validates URL format
- Fetches metadata (title, description, favicon)
- Provides visual feedback during loading

### `LinkList.tsx`
Manages the list of links in a bundle:
- Drag and drop reordering
- Link removal
- Visual feedback for empty states

### `BundleSettings.tsx`
Allows users to configure bundle settings:
- Vanity URL customization
- Title and description editing
- Bundle publishing controls

### `BundleViewer.tsx`
Displays a published bundle in view-only mode:
- Shows bundle metadata
- Renders links with previews
- Handles 404 states

## Internationalization

The application supports multiple languages through the `i18n` system. To add a new language:

1. Add a new language code to the `Language` type in `types/index.ts`
2. Add translations in `i18n/translations.ts`
3. The language selector will automatically update to include the new language

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Run the SQL migrations from `supabase/migrations`
3. Configure Row Level Security (RLS) as per the migration files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
├── components/          # React components
│   ├── Header.tsx      # Navigation and theme switcher
│   ├── UrlInput.tsx    # URL input with metadata fetching
│   ├── LinkList.tsx    # Draggable list of links
│   ├── BundleSettings.tsx  # Vanity URL and description
│   ├── PublishButton.tsx   # Publishing functionality
│   └── BundleViewer.tsx    # Public bundle display
├── hooks/              # Custom React hooks
│   ├── useTheme.ts     # Theme management
│   └── useLocalStorage.ts  # Local storage utilities
├── lib/                # External service configurations
│   ├── supabase.ts     # Supabase client setup
│   └── database.types.ts   # TypeScript database types
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── urlUtils.ts     # URL validation and metadata
└── App.tsx             # Main application component

supabase/
├── migrations/         # Database schema migrations
└── functions/          # Edge functions
    └── fetch-metadata/ # URL metadata fetching service
```

## 🚀 Deployment

### Netlify Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Configure redirects:**
   The project includes a `_redirects` file for proper SPA routing.

### Environment Variables for Production

Set these in your deployment platform:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🗄️ Database Schema

### Bundles Table
```sql
CREATE TABLE bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,  -- Nullable for anonymous users
  vanity_url text UNIQUE,
  title text,
  description text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Bundle Links Table
```sql
CREATE TABLE bundle_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid REFERENCES bundles(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  favicon text DEFAULT '',
  og_image text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

## 🔒 Security & Privacy

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** only for published bundles
- **No personal data collection** - anonymous usage supported
- **CORS protection** on API endpoints
- **Input validation** for URLs and vanity names

## 🎨 Design Philosophy

- **Apple-level aesthetics** with attention to detail
- **Micro-interactions** and smooth transitions
- **Consistent 8px spacing system**
- **Comprehensive color system** with proper contrast ratios
- **Progressive disclosure** to manage complexity
- **Mobile-first responsive design**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check this README for setup and usage
- **Community**: Join discussions in GitHub Discussions

## 🔮 Roadmap

- [ ] User accounts and private bundles
- [ ] Bundle analytics and view tracking
- [ ] Custom themes and branding
- [ ] API for programmatic bundle creation
- [ ] Browser extension for quick link adding
- [ ] Bulk import from bookmarks
- [ ] QR code generation for bundles
- [ ] Social media preview optimization

---

Built with ❤️ using React, TypeScript, and Supabase