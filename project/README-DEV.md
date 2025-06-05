# 🚧 Development Branch - The Animal Side

> **Active Development Branch** for The Animal Side wildlife volunteer platform

## 🌟 Quick Start for Dev Branch

### Prerequisites
- Node.js 18+ and npm
- Git configured with your GitHub account
- VS Code (recommended with suggested extensions)

### Setup Development Environment

1. **Clone and switch to dev branch:**
   ```bash
   git clone [your-repo-url]
   cd theanimalside_v0.1/project
   git checkout dev
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your development settings
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `dev` - Active development (this branch)
- `feature/*` - Individual features (branch from dev)
- `hotfix/*` - Critical fixes (branch from main)

### Making Changes
1. Create feature branch from dev:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push and create PR to dev:
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub targeting dev branch
   ```

## 🎯 Development Priorities

### Current Sprint Focus
- [ ] Enhanced animal opportunity filtering system
- [ ] Map-based discovery interface
- [ ] Organization profile system
- [ ] Mobile responsiveness improvements
- [ ] SEO optimization

### Code Quality Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Auto-fix on save
- **Prettier**: Format on save
- **Testing**: Components should be testable
- **Accessibility**: WCAG 2.1 AA compliance

## 🧪 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

## 📁 Key Development Files

```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── data/          # Mock data & types
│   ├── lib/           # Utilities & helpers
│   └── types/         # TypeScript definitions
├── .vscode/           # VS Code configuration
├── .env.example       # Environment template
└── README-DEV.md      # This file
```

## 🎨 Design System Integration

Follow the established design system:
- **Colors**: Forest, Rich Earth, Sunset, Olive, Beige
- **Typography**: Playfair Display (headings), Inter (body)
- **Components**: Located in `/src/ui/` directory
- **Spacing**: 4px grid system

## 🔍 Debugging Tips

### Common Issues
1. **Port conflicts**: Change port in vite.config.ts
2. **Type errors**: Check imports and TypeScript configuration
3. **Style issues**: Verify Tailwind classes and CSS imports

### Development Tools
- React DevTools browser extension
- Tailwind CSS IntelliSense (VS Code)
- ESLint extension for real-time linting

## 🚀 Deployment to Dev Environment

The dev branch auto-deploys to staging when pushed to GitHub.

```bash
# Deploy latest dev changes
git checkout dev
git pull origin dev
git push origin dev
# Automatic deployment will start
```

## 📞 Need Help?

- **Design Questions**: Check DESIGN_SYSTEM.md
- **Component Usage**: See COMPONENTS.md  
- **Architecture**: Review ROADMAP.md
- **Issues**: Create GitHub issue with dev branch label

---

**Happy coding! 🦁💻** 

*Remember: Every line of code helps connect volunteers with wildlife conservation efforts worldwide.*
