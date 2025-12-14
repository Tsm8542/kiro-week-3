# Quick Start Guide

Get the Coffee Prices vs Developer Productivity Dashboard running in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- Git installed
- A code editor (VS Code recommended)

## Step 1: Clone and Install (1 minute)

```bash
git clone https://github.com/yourusername/coffee-productivity-dashboard.git
cd coffee-productivity-dashboard
npm install
```

## Step 2: Run Tests (1 minute)

Verify everything works:

```bash
npm run test:run
```

Expected output:
```
✓ tests/api.test.js (12 tests)
✓ tests/app.test.js (8 unit tests + 4 property-based tests)
✓ tests/charts.test.js (8 unit tests + 1 property-based test)

Total: 33+ tests passed
```

## Step 3: Start Local Server (1 minute)

```bash
python -m http.server 8000
```

Or if you prefer Node.js:
```bash
npx http-server
```

## Step 4: Open Dashboard (1 minute)

Open your browser and navigate to:
```
http://localhost:8000
```

You should see:
- Loading message while fetching data
- Two line charts (coffee prices and developer activity)
- Insight summary section
- Responsive layout that adapts to your screen size

## Step 5: Deploy to GitHub Pages (1 minute)

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/coffee-productivity-dashboard.git
   git branch -M main
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose "main" branch
5. Your dashboard is now live at: `https://yourusername.github.io/coffee-productivity-dashboard/`

## What You're Looking At

### The Dashboard Shows:

1. **Coffee Prices Chart** (left/top)
   - Real-time global coffee prices
   - Fetched from API Ninjas Commodities API
   - Shows price trends over time

2. **Developer Activity Chart** (right/bottom)
   - Real-time GitHub repository activity
   - Fetched from GitHub API
   - Shows commit activity over time

3. **Insight Summary**
   - Analysis of temporal patterns
   - Explanation of the coincidental correlation
   - Reminder that correlation ≠ causation

### Key Features:

- ✅ Real-time data from public APIs
- ✅ Automatic fallback to mock data if APIs fail
- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ No backend required
- ✅ Fully tested with 33+ tests
- ✅ Property-based tests verify correctness

## Common Tasks

### Run tests in watch mode (auto-rerun on changes)
```bash
npm run test
```

### Run tests with visual UI
```bash
npm run test:ui
```

### View test coverage
```bash
npm run test:run -- --coverage
```

### Build for production
```bash
npm run build
```

## Troubleshooting

### Tests fail with "Cannot find module"
```bash
npm install
```

### Dashboard shows error message
- Check browser console (F12) for details
- Verify internet connection (APIs need to be accessible)
- Try refreshing the page
- Mock data will be used if APIs fail

### Charts not displaying
- Wait a few seconds for data to load
- Check browser console for errors
- Verify Chart.js CDN is accessible
- Try a different browser

### Port 8000 already in use
```bash
python -m http.server 8001
# Then open http://localhost:8001
```

## File Structure Quick Reference

```
src/              → Application code
├── api.js        → API fetching and validation
├── app.js        → Data loading and orchestration
└── charts.js     → Chart rendering

tests/            → Test suite
├── api.test.js   → API tests
├── app.test.js   → Data merging tests + properties
└── charts.test.js → Chart rendering tests

.kiro/            → Specification documents
├── specs.json    → Requirements summary
├── architecture.json → System design
└── decisions.md  → Design decisions

index.html        → Main page
styles.css        → Styling
package.json      → Dependencies
```

## Next Steps

1. **Explore the code**: Check out `src/api.js` to see how APIs are called
2. **Run tests**: `npm run test:run` to see all tests pass
3. **Modify data**: Edit API endpoints in `src/api.js` to use different data sources
4. **Customize styling**: Edit `styles.css` to change colors and layout
5. **Deploy**: Push to GitHub and enable Pages for live hosting

## Documentation

- **README.md**: Full project documentation
- **TESTING.md**: Comprehensive testing guide
- **PROJECT_SUMMARY.md**: Detailed project overview
- **.kiro/specs/**: Specification documents

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review TESTING.md for test-related issues
3. Check browser console (F12) for error messages
4. Open an issue on GitHub

## Success Checklist

- [ ] `npm install` completed successfully
- [ ] `npm run test:run` shows all tests passing
- [ ] Local server started on port 8000
- [ ] Dashboard loads at http://localhost:8000
- [ ] Charts display with real data
- [ ] Responsive design works on mobile
- [ ] Ready to deploy to GitHub Pages

Congratulations! Your dashboard is ready to use! 🎉
