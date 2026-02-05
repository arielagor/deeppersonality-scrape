# Rebuilding DeepPersonality.app

This guide explains how to recreate the website from the scraped content.

## Technology Stack

The original site uses:

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Vercel
- **Analytics**: PostHog

## Quick Start (Static View)

For a quick static view of the scraped pages:

1. Open `scraped-content/pages/index.html` in a browser
2. Note: External assets and dynamic features won't work

## Full Rebuild

### 1. Create New Next.js Project

```bash
npx create-next-app@latest deeppersonality-rebuild --typescript --tailwind --app
cd deeppersonality-rebuild
```

### 2. Install Dependencies

```bash
npm install lucide-react
```

### 3. Extract Content

From the scraped HTML files, extract:

- Text content for each section
- CSS classes (Tailwind utilities)
- Component structure

### 4. Recreate Components

Key components to rebuild:

- Navigation header
- Hero section
- Features/benefits sections
- Call-to-action buttons
- Footer

### 5. Styling

The site uses Tailwind CSS with custom configuration for:

- Dark theme colors
- Custom gradients
- Animation effects

### 6. Deploy

```bash
# Deploy to Vercel
npx vercel
```

## Notes

- The scraped HTML contains rendered React components as static HTML
- JavaScript bundles in `assets/js/` contain obfuscated code
- For full functionality, you'll need to rebuild the React components
- Authentication requires implementing NextAuth.js or similar
