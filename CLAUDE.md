# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React single-page application built with Vite as the build tool and development server. The project uses modern JavaScript (ES modules) with JSX for React components.

## Network Proxy Configuration

**IMPORTANT**: All network operations (npm install, git push, vercel deploy, etc.) require proxy settings due to network restrictions.

Before running any network-related commands, set the proxy environment variables:

```bash
export https_proxy=http://127.0.0.1:6152
export http_proxy=http://127.0.0.1:6152
export all_proxy=socks5://127.0.0.1:6153
```

### Common Network Operations with Proxy

**Install dependencies:**
```bash
export https_proxy=http://127.0.0.1:6152 && export http_proxy=http://127.0.0.1:6152 && export all_proxy=socks5://127.0.0.1:6153 && npm install
```

**Push to GitHub:**
```bash
export https_proxy=http://127.0.0.1:6152 && export http_proxy=http://127.0.0.1:6152 && export all_proxy=socks5://127.0.0.1:6153 && git push
```

**Deploy to Vercel:**
```bash
export https_proxy=http://127.0.0.1:6152 && export http_proxy=http://127.0.0.1:6152 && export all_proxy=socks5://127.0.0.1:6153 && vercel --prod
```

**Tip**: You can add these exports to your `~/.zshrc` or `~/.bashrc` to make them persistent across terminal sessions.

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR). Default port is 5173.

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing before deployment.

### Linting
```bash
npm run lint
```
Runs ESLint on all JavaScript/JSX files. Configuration uses the modern flat config format in `eslint.config.js`.

### Testing
```bash
npm test
```
Runs all tests using Vitest with jsdom environment for React component testing.

To run tests in watch mode:
```bash
npm test -- --watch
```

To run a single test file:
```bash
npm test src/App.test.jsx
```

## Architecture

### Entry Point
- `index.html` - Root HTML file that loads the React application
- `src/main.jsx` - JavaScript entry point that mounts the React app to the DOM

### Application Structure
- `src/App.jsx` - Main application component
- `src/App.css` - Component-specific styles
- `src/index.css` - Global styles and CSS variables

### Build Configuration
- `vite.config.js` - Vite configuration with React plugin and Vitest setup
- `eslint.config.js` - ESLint flat config with React-specific rules
- `package.json` - Dependencies and scripts

### Key Technologies
- **Vite**: Fast build tool with native ES modules and HMR
- **React 18**: UI library with concurrent features
- **Vitest**: Unit testing framework that shares Vite config
- **ESLint**: Linting with React hooks and React Refresh plugins

### Development Features
- Hot Module Replacement (HMR) enabled by default
- Fast refresh for React components
- Source maps for debugging
- Modern ESM-based development

### File Organization
- `src/` - All application source code
- `public/` - Static assets served as-is (icons, images)
- `dist/` - Production build output (git-ignored)

### Testing Setup
- Test files use `.test.jsx` or `.spec.jsx` suffix
- Vitest configured with globals and jsdom environment in `vite.config.js`
- Use `@testing-library/react` for component testing (add as dependency if needed)
