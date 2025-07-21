# 🌐 FuseFoundry - AI-Powered Business Transformation

A blazing-fast, mobile-first marketing website for **FuseFoundry** — a next-generation business consulting and media company that fuses AI innovation, creator-powered content, and strategic growth systems.

![FuseFoundry Banner](https://via.placeholder.com/1200x400/FF6A2C/FFFFFF?text=FuseFoundry)

## ✨ Features

### 🎯 Core Functionality
- **Mobile-First PWA** - Installable web app with offline capabilities
- **AI-Powered Strategy** - Showcase of AI consulting services
- **Creator Engine** - Network of content creators and influencers  
- **Growth Systems** - Scalable business automation solutions
- **Dark Mode Support** - Seamless theme switching
- **Responsive Design** - Optimized for all devices (320px+)

### ⚡ Performance
- **Lighthouse Score 95+** - Optimized for speed and accessibility
- **Bundle Size < 160KB JS** - Minimal JavaScript footprint
- **CSS < 75KB** - Purged and optimized stylesheets
- **AVIF/WebP Images** - Modern image formats with fallbacks
- **Service Worker** - Offline-first architecture

### 🎨 Design System
- **Brand Gradient**: Linear gradient from Molten Orange (#FF6A2C) → Spark Gold (#FFC84A) → Catalyst Teal (#18E0DF)
- **Typography**: Inter font family for optimal readability
- **Animations**: Subtle micro-interactions with reduced motion support
- **Accessibility**: WCAG 2.1 AA compliant with 4.5:1 contrast ratios

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 3** - Utility-first styling
- **Lucide React** - Modern icon library
- **Framer Motion** - Smooth animations

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation
- **Resend** - Email service integration

### PWA & Performance
- **Next PWA** - Service worker and offline support
- **Sharp** - Image optimization
- **Bundle Analyzer** - Performance monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fusefoundry.git
   cd fusefoundry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run dev:turbo    # Start with Turbopack (experimental)

# Building
npm run build        # Create production build
npm run start        # Start production server
npm run build:analyze # Analyze bundle size

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📁 Project Structure

```
fusefoundry/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── globals.css         # Global styles and Tailwind imports
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx           # Homepage
│   │   ├── services/          # Services page
│   │   ├── contact/           # Contact page with form
│   │   └── ...               # Additional routes
│   ├── components/            # Reusable React components
│   │   ├── GradientLogo.tsx   # SVG brand logo
│   │   ├── Navbar.tsx         # Navigation with mobile menu
│   │   ├── HeroSection.tsx    # Homepage hero
│   │   ├── FeatureGrid.tsx    # Service features
│   │   ├── ContactForm.tsx    # Contact form with validation
│   │   └── Footer.tsx         # Site footer
│   ├── lib/                   # Utility functions
│   │   └── utils.ts          # Common utilities (cn, formatters)
│   └── data/                  # Static data and content
│       └── case-studies.json  # Client success stories
├── public/                    # Static assets
│   ├── icons/                # PWA icons (72px - 512px)
│   ├── manifest.json         # PWA manifest
│   └── ...                   # Images, favicon, etc.
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts           # Next.js configuration  
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Brand Guidelines

### Colors
```scss
// Primary Brand Colors
--molten: #FF6A2C;      // Hero CTA, hover states
--spark: #FFC84A;       // Micro animations, success states  
--catalyst: #18E0DF;    // Links, icons, accents
--forge: #202326;       // Light mode text
--white-hot: #F5F5F5;   // Light backgrounds

// Brand Gradient
background: linear-gradient(45deg, #FF6A2C 0%, #FFC84A 50%, #18E0DF 100%);
```

### Typography Scale
```css
/* Headings */
.text-4xl  /* 36px - Mobile H1 */
.text-6xl  /* 60px - Desktop H1 */
.text-3xl  /* 30px - H2 */
.text-2xl  /* 24px - H3 */
.text-xl   /* 20px - H4 */

/* Body Text */
.text-lg   /* 18px - Lead text */
.text-base /* 16px - Body text */
.text-sm   /* 14px - Small text */
.text-xs   /* 12px - Captions */
```

### Component Classes
```css
.btn-primary    /* Gradient button with hover effects */
.btn-secondary  /* Outline button with brand colors */
.text-gradient  /* Brand gradient text effect */
.card           /* Elevated content containers */
.section-padding /* Consistent vertical spacing */
.container-custom /* Max-width container with padding */
```

## 📱 PWA Configuration

### Manifest Features
- **Standalone Display** - Runs like a native app
- **Theme Color** - Matches brand (Molten Orange)
- **Icon Sizes** - Complete set from 72px to 512px
- **Shortcuts** - Quick access to Contact and Services
- **Categories** - Business, Productivity, Consulting

### Service Worker
- **Offline Support** - Cached static assets
- **Background Sync** - Form submissions when offline
- **Install Prompt** - Custom install banner
- **Update Notifications** - Seamless updates

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```bash
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# API Endpoints
NEXT_PUBLIC_API_URL=https://api.fusefoundry.com
```

### Tailwind Customization
The `tailwind.config.ts` includes:
- Custom brand colors
- Animation keyframes
- Extended spacing scale
- Typography customizations
- Dark mode support

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Setup
1. Set environment variables
2. Configure domain and SSL
3. Enable analytics (optional)
4. Set up monitoring

## 📊 Performance Budgets

### Bundle Sizes
- **JavaScript**: < 160KB gzipped
- **CSS**: < 75KB gzipped  
- **Images**: Optimized with modern formats
- **Fonts**: Subset and preloaded

### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **FCP**: < 1.8s (First Contentful Paint)

## 🧪 Testing

### Unit Tests
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

### E2E Tests
```bash
npm run test:e2e       # Playwright tests
npm run test:e2e:ui    # Interactive mode
```

### Accessibility
```bash
npm run test:a11y      # Accessibility audit
npm run lighthouse     # Performance audit
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional Commits** for commit messages

## 📝 Todo & Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js 15
- [x] Tailwind CSS configuration
- [x] Core components (Navbar, Hero, Footer)
- [x] Mobile-first responsive design
- [x] PWA manifest and service worker

### Phase 2: Content & Forms 🚧
- [x] Contact form with validation
- [x] Services page
- [ ] Case studies page with ISR
- [ ] About page with team section
- [ ] Blog/resources section

### Phase 3: Advanced Features 📋
- [ ] AI Athena product page
- [ ] Foundry Method process page
- [ ] Email automation (Resend integration)
- [ ] Analytics and tracking
- [ ] A/B testing framework

### Phase 4: Optimization 📋
- [ ] Image optimization and CDN
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Accessibility audit and fixes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind Labs** - Utility-first CSS framework  
- **Vercel** - Deployment and hosting platform
- **Lucide** - Beautiful icon library
- **Open Source Community** - For all the tools and libraries

---

**Built with ❤️ by the FuseFoundry Team**

For questions or support, reach out to us at [hello@fusefoundry.com](mailto:hello@fusefoundry.com)
