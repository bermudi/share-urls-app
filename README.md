# UrlList - Bundle and Share Multiple URLs

A modern, elegant web application for creating and sharing collections of URLs through a single shareable link. Perfect for curating resources, sharing reading lists, or organizing links for projects and presentations.

## ✨ Features

- **No Sign-up Required** - Create and share bundles instantly without registration
- **Custom Vanity URLs** - Create memorable, branded links (e.g., `urllist.app/my-resources`)
- **Rich Link Previews** - Automatically fetches titles, descriptions, and favicons
- **Drag & Drop Reordering** - Easily organize your links in the perfect order
- **Dark/Light Theme** - Beautiful interface that adapts to your preference
- **Mobile Responsive** - Works seamlessly on all devices
- **Instant Publishing** - Share your bundles with a single click
- **Public Access** - Published bundles are accessible to anyone with the link

## 🚀 Live Demo

Visit [UrlList](https://urllist.app) to try it out!

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Backend**: Supabase Edge Functions
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd urllist
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard:
- Go to Settings → API
- Copy the Project URL and anon/public key

### 3. Database Setup

The project includes Supabase migrations that will automatically create the required database schema:

- `bundles` table - Stores bundle metadata
- `bundle_links` table - Stores individual links within bundles
- Row Level Security (RLS) policies for public access
- Indexes for optimal performance

### 4. Edge Functions (Optional)

For enhanced link metadata fetching, deploy the included Supabase Edge Function:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy fetch-metadata
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

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