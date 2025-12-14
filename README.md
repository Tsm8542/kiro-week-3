# Coffee Prices vs Developer Productivity Dashboard

A static data mashup dashboard that visualizes the relationship between global coffee prices and developer productivity signals over time. Data is fetched from public APIs in real-time.

## Project Overview

This dashboard explores temporal patterns in two completely unrelated datasets:

- **Global Coffee Prices**: Real-time global coffee price data via API
- **Developer Productivity**: Real-time developer activity metrics from GitHub via API

The visualization reveals an intriguing coincidence: both datasets follow similar seasonal patterns with peaks in mid-year and troughs at the beginning and end of the year. This serves as a reminder that **correlation does not imply causation**, and that temporal patterns can emerge independently across disparate domains.

## The Two Unrelated Datasets

### Coffee Prices Dataset
- **Source**: API Ninjas Commodities API (real-time global coffee prices)
- **Format**: Monthly data points
- **Fields**: Date (YYYY-MM) and Price (USD)
- **API Endpoint**: `https://api.api-ninjas.com/v1/commodities?name=coffee`

### Developer Activity Dataset
- **Source**: GitHub API (real-time repository commit activity)
- **Format**: Monthly aggregated commit counts
- **Fields**: Date (YYYY-MM) and Activity Count
- **API Endpoint**: `https://api.github.com/repos/github/gitignore/commits`

### Why These Datasets?

These datasets were chosen specifically because they are:
- **Completely unrelated**: No logical causal relationship exists
- **Temporally aligned**: Both span the same time period
- **Coincidentally similar**: Both show similar seasonal patterns
- **Educational**: Demonstrates the importance of critical thinking when interpreting data
- **Real-time**: Fetched from public APIs without authentication

## Features

- **Real-time Data**: Fetches data from public APIs with automatic fallback to mock data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Aligned Timelines**: Both charts share the same X-axis for easy comparison
- **Error Handling**: Graceful error messages and retry logic for failed API calls
- **Chart.js Integration**: Professional-looking line charts with interactive hover effects
- **Insight Summary**: Static text analysis of observed trends
- **Comprehensive Testing**: Unit tests, property-based tests, and integration tests

## Technology Stack

- **HTML5**: Semantic markup and canvas elements
- **CSS3**: Responsive grid layout with mobile-first design
- **Vanilla JavaScript**: ES6 features for clean, modern code
- **Chart.js**: Lightweight charting library via CDN
- **Vitest**: Unit and property-based testing framework
- **fast-check**: Property-based test generation
- **jsdom**: DOM testing environment

## How to Run Locally

### Prerequisites
- Node.js 16+ (for running tests)
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (recommended for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coffee-productivity-dashboard.git
   cd coffee-productivity-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Tests

Run all tests:
```bash
npm run test:run
```

Run tests in watch mode:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

### Running the Dashboard

**Option 1: Using a Local Web Server**

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (with http-server):**
```bash
npx http-server
```

**Ruby:**
```bash
ruby -run -ehttpd . -p8000
```

Then navigate to `http://localhost:8000` in your browser.

**Option 2: Direct File Access (Limited)**
```bash
open index.html
```

Note: Direct file access may have CORS restrictions when fetching from APIs.

## How to Deploy on GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `coffee-productivity-dashboard` (or your preferred name)
3. Do NOT initialize with README (we already have one)

### Step 2: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Coffee Prices vs Developer Productivity Dashboard"
git branch -M main
git remote add origin https://github.com/yourusername/coffee-productivity-dashboard.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**

### Step 4: Access Your Dashboard
Your dashboard will be available at:
```
https://yourusername.github.io/coffee-productivity-dashboard/
```

It may take a few minutes for GitHub Pages to build and deploy.

## Project Structure

```
coffee-productivity-dashboard/
├── .kiro/
│   ├── specs/
│   │   └── coffee-productivity-dashboard/
│   │       ├── requirements.md         # Feature requirements
│   │       ├── design.md               # System design and architecture
│   │       └── tasks.md                # Implementation tasks
│   ├── specs.json                      # Functional and non-functional requirements
│   ├── architecture.json               # System architecture and data flow
│   └── decisions.md                    # Design decision documentation
├── src/
│   ├── api.js                          # API fetching and data validation
│   ├── app.js                          # Data loading and orchestration
│   └── charts.js                       # Chart rendering logic
├── tests/
│   ├── api.test.js                     # API module tests
│   ├── app.test.js                     # App module tests (unit + property-based)
│   └── charts.test.js                  # Chart rendering tests
├── index.html                          # Main HTML file
├── styles.css                          # Responsive styling
├── package.json                        # Project dependencies
├── vitest.config.js                    # Test configuration
└── README.md                           # This file
```

## File Descriptions

### index.html
- Entry point for the application
- Defines page structure with header, charts section, and insights
- Loads Chart.js from CDN
- Includes canvas elements for chart rendering
- Error and loading state containers

### styles.css
- Responsive grid layout for charts
- Mobile-first design approach
- Breakpoints for tablet (768px) and mobile (480px)
- Professional styling with gradients and shadows
- Error and loading state styling

### src/api.js
- Fetches coffee prices from API Ninjas Commodities API
- Fetches developer activity from GitHub API
- Implements retry logic with exponential backoff
- Validates data format and structure
- Provides mock data fallback when APIs fail

### src/app.js
- Loads data from both APIs
- Merges datasets to align common date range
- Initializes dashboard on page load
- Handles data loading errors gracefully
- Manages UI state (loading, error, success)

### src/charts.js
- Generates Chart.js configuration objects
- Renders coffee price line chart
- Renders developer activity line chart
- Handles chart styling, labels, and colors
- Error handling for chart rendering

### tests/api.test.js
- Unit tests for API fetching functions
- Validation tests for data format
- Mock data fallback tests

### tests/app.test.js
- Unit tests for data merging logic
- Property-based tests for data alignment
- Property-based tests for data preservation
- Property-based tests for chart data consistency

### tests/charts.test.js
- Unit tests for chart rendering
- Tests for correct labels and colors
- Tests for error handling

## Responsive Behavior

### Desktop (> 768px)
- Charts displayed side-by-side in 2-column grid
- Full-size canvas elements
- Optimal spacing and typography

### Tablet (481px - 768px)
- Charts stack vertically
- Adjusted padding and margins
- Readable font sizes

### Mobile (≤ 480px)
- Single column layout
- Reduced canvas height for better scrolling
- Optimized font sizes and spacing
- Touch-friendly interactive elements

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Requires ES6 JavaScript support
- Requires Fetch API support

## API Data Format

### Coffee Prices API Response
```json
[
  {
    "date": "2023-01",
    "price_usd": 3.45
  },
  {
    "date": "2023-02",
    "price_usd": 3.52
  }
]
```

### Developer Activity API Response
```json
[
  {
    "date": "2023-01",
    "activity_count": 1250
  },
  {
    "date": "2023-02",
    "activity_count": 1380
  }
]
```

## Testing

The project includes comprehensive test coverage:

### Unit Tests
- API data validation
- Data merging logic
- Chart rendering configuration

### Property-Based Tests
- Data alignment across all possible date ranges
- Data preservation through merging
- Chart data consistency

### Integration Tests
- End-to-end API fetching and chart rendering
- Error handling and fallback behavior

Run tests with:
```bash
npm run test:run
```

## Important Notes

- **Real-time Data**: This dashboard fetches real data from public APIs
- **Fallback Data**: If APIs fail, the dashboard uses mock data to ensure functionality
- **No Causation**: The relationship between coffee prices and developer productivity is purely coincidental
- **No Backend**: This is a fully static application with no backend or database
- **No User Input**: The dashboard displays fixed visualizations without interactive controls
- **Educational Purpose**: Designed to demonstrate data visualization and temporal pattern recognition
- **API Rate Limits**: Be aware of API rate limits when running tests or refreshing frequently
- **CORS**: Some APIs may have CORS restrictions; use a local web server for development

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
- Report issues
- Suggest improvements
- Submit pull requests
- Improve documentation

## Support

For questions or issues, please open an issue on GitHub or contact the project maintainer.

---

**Disclaimer**: This dashboard is for educational and demonstration purposes only. The data is sample data, and any apparent relationship between coffee prices and developer productivity is purely coincidental.
