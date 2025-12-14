<div align="center">

# 🚀 Siddharth Roy Portfolio

### Software Engineer & ECE Student | NIT Jamshedpur

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**A modern, responsive portfolio website showcasing projects, skills, and competitive programming achievements**

[🌐 Live Demo](https://portfolio-801.pages.dev/) • [📖 Documentation](#-features) • [🛠️ Setup](#-getting-started)

</div>

---

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🌓 **Dark/Light Theme** - Seamless theme switching
- 📊 **Live Stats** - Real-time competitive programming statistics from LeetCode & Codeforces
- 🎯 **Dual Domain** - Toggle between Software Engineering and ECE projects
- 🎭 **Animations** - Framer Motion powered interactive elements
- 📱 **Fully Responsive** - Optimized for all devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast load times
- 🎵 **Background Music** - Optional ambient music player

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **shadcn-ui** - Component library
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - Edge Functions for API integrations
  - Real-time data fetching
  - Database management

### APIs Integrated
- **LeetCode GraphQL API** - Competitive programming stats
- **Codeforces API** - Contest ratings and rankings

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/siddharth-roy27/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see your portfolio! 🎉

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**Get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Navigate to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── sections/        # Section components
│   │   └── ui/              # shadcn-ui components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── contexts/            # React contexts
│   └── integrations/         # Third-party integrations
│       └── supabase/        # Supabase client & types
├── public/                  # Static assets
│   └── resumes/            # Resume PDFs
├── supabase/               # Supabase configuration
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
└── package.json            # Dependencies
```

## 🎯 Key Sections

- **Hero** - Introduction with animated background
- **About** - Personal background and education
- **Projects** - Showcase of software & ECE projects
- **Experience** - Work experience and internships
- **Skills** - Technical skills and proficiencies
- **Coding Stats** - Live competitive programming statistics
- **Certificates** - Achievements and certifications
- **Hobbies** - Personal interests
- **Resume** - Downloadable resume PDFs
- **Contact** - Get in touch form

## 🚢 Deployment

### Deploy to Cloudflare Pages

The portfolio is currently deployed on Cloudflare Pages:
- **Live URL**: [https://portfolio-801.pages.dev/](https://portfolio-801.pages.dev/)

Cloudflare Pages automatically deploys from the `main` branch on every push.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔧 Configuration

### Custom Domain

The portfolio is configured to work with custom domains. Update the domain in:
- `index.html` - Meta tags and SEO
- Deployment platform settings

**Note:** Domain names cannot contain underscores. Use hyphens instead:
- ✅ `siddharth-roy-portfolio.com`
- ❌ `siddharth_roy_portfolio.com`

### Supabase Edge Functions

The portfolio uses Supabase Edge Functions to fetch competitive programming stats:

```bash
# Deploy edge function
supabase functions deploy coding-stats
```

## 📊 Competitive Programming Integration

The portfolio automatically fetches and displays:
- **LeetCode** - Problems solved, difficulty breakdown, ranking
- **Codeforces** - Current rating, max rating, rank

Stats are fetched in real-time via Supabase Edge Functions.

## 🎨 Customization

### Colors & Themes

Edit `tailwind.config.ts` to customize:
- Primary colors
- Accent colors
- Theme variants

### Content

Update project data in:
- `src/components/sections/ProjectsSection.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/ExperienceSection.tsx`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/siddharth-roy27/Portfolio/issues).

## 📧 Contact

**Siddharth Roy**

- 🌐 Portfolio: [portfolio-801.pages.dev](https://portfolio-801.pages.dev/)
- 📧 Email: [Your Email]
- 💼 LinkedIn: [Your LinkedIn]
- 🐙 GitHub: [@siddharth-roy27](https://github.com/siddharth-roy27)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Siddharth Roy](https://github.com/siddharth-roy27)

</div>
