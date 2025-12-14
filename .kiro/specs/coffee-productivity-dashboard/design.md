# Design Document

## Overview

A static single-page application that loads two independent datasets (coffee prices and developer productivity) from local JSON files and renders them as synchronized line charts using Chart.js. The application requires no backend, build process, or user interaction—all rendering is performed client-side in the browser.

## Architecture

```
┌─────────────────────────────────────────┐
│         Browser Environment             │
├─────────────────────────────────────────┤
│  index.html (Entry Point)               │
│  ├── styles.css (Styling)               │
│  ├── app.js (Data Loading & Init)       │
│  └── charts.js (Chart Rendering)        │
├─────────────────────────────────────────┤
│  Chart.js Library (CDN)                 │
├─────────────────────────────────────────┤
│  Local Data Files                       │
│  ├── data/coffee_prices.json            │
│  └── data/developer_activity.json       │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### app.js
- `loadData()`: Fetches both JSON files and returns combined dataset
- `initializeDashboard()`: Orchestrates data loading and chart initialization
- `mergeDatasets()`: Aligns both datasets to common date range

### charts.js
- `renderCoffeeChart(data, container)`: Renders coffee price line chart
- `renderProductivityChart(data, container)`: Renders developer activity line chart
- `getChartConfig(label, color)`: Returns Chart.js configuration object

### index.html
- Two `<canvas>` elements for chart rendering
- Insight summary section with static HTML
- Responsive grid layout

### styles.css
- Mobile-first responsive design
- Flexbox/Grid layout for chart containers
- Typography and spacing for readability

## Data Models

### Coffee Prices API Response
```json
{
  "data": [
    { "date": "2023-01", "price_usd": 3.45 },
    { "date": "2023-02", "price_usd": 3.52 }
  ]
}
```

### Developer Activity API Response
```json
{
  "data": [
    { "date": "2023-01", "activity_count": 1250 },
    { "date": "2023-02", "activity_count": 1380 }
  ]
}
```

### API Endpoints
- **Coffee Prices**: `https://api.example.com/coffee-prices` (or alternative public API)
- **Developer Activity**: `https://api.example.com/developer-activity` (or alternative public API)

### Merged Dataset (Internal)
```javascript
{
  dates: ["2023-01", "2023-02", ...],
  coffee: [3.45, 3.52, ...],
  productivity: [1250, 1380, ...]
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Data Alignment
*For any* two datasets with different date ranges, the merged dataset SHALL contain all unique dates from both sources, sorted chronologically.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 2: Chart Data Consistency
*For any* merged dataset, both charts SHALL display the same number of data points corresponding to the aligned date range.
**Validates: Requirements 1.2, 2.2, 3.1**

### Property 3: Data Preservation
*For any* source dataset, all original data points SHALL be present in the rendered chart without modification or loss.
**Validates: Requirements 1.2, 2.2**

### Property 4: Responsive Layout
*For any* viewport width, the dashboard layout SHALL reflow appropriately without horizontal scrolling or content overflow.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

## Error Handling

- If API calls fail, display user-friendly error message in dashboard
- If data is malformed, skip invalid records and continue with valid data
- If network is unavailable, show offline error message
- Implement retry logic with exponential backoff for failed requests
- Log errors to console for debugging

## Testing Strategy

### Unit Tests
- Test data merging logic with various date ranges
- Test chart configuration generation
- Test responsive breakpoint calculations

### Property-Based Tests
- **Property 1**: Generate random datasets with overlapping/non-overlapping dates, verify merged output contains all unique dates sorted
- **Property 2**: Generate merged datasets, verify both charts have identical point counts
- **Property 3**: Generate source data, verify all points appear in rendered output
- **Property 4**: Test layout at various viewport widths, verify no overflow

### Integration Tests
- Load actual JSON files and verify dashboard renders without errors
- Verify charts display with correct labels and data
- Verify insight summary renders

### Testing Framework
- Vitest for unit and property-based tests
- fast-check for property generation
- jsdom for DOM testing
- Fetch mock for API testing
- Minimum 100 iterations for property-based tests
