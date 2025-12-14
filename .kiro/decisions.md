# Design Decisions

## Why Public APIs Were Chosen

The dashboard fetches data from public APIs instead of using static local files for several reasons:

1. **Real-time Data**: Provides current data without manual updates
2. **No Authentication Required**: Uses public APIs that don't require API keys
3. **Demonstration of API Integration**: Shows how to handle real-world API calls and failures
4. **Fallback Strategy**: Implements mock data generation when APIs fail, ensuring reliability
5. **Educational Value**: Demonstrates error handling, retry logic, and data validation
6. **GitHub Pages Compatibility**: Static hosting can still serve dynamic data fetched from APIs

## Why Datasets Are Unrelated

Coffee prices and developer productivity are intentionally unrelated to demonstrate:

1. **Correlation vs Causation**: The temporal alignment is coincidental, illustrating that similar patterns can emerge independently
2. **Data Mashup Concept**: Combining disparate datasets shows how visualization can reveal unexpected patterns
3. **Educational Value**: Demonstrates the importance of critical thinking when interpreting data visualizations
4. **Temporal Pattern Recognition**: Both datasets happen to follow similar seasonal trends, making for an interesting visual comparison

## Visualization Choices

### Line Charts
- **Rationale**: Line charts effectively show temporal trends and make it easy to compare patterns across time
- **Alternative Considered**: Bar charts would be less effective for showing continuous trends
- **Alternative Considered**: Scatter plots would obscure the temporal sequence

### Aligned Timelines
- **Rationale**: Sharing the same X-axis allows direct visual comparison of temporal patterns
- **Implementation**: Both datasets are merged to use the union of all available dates
- **Benefit**: Viewers can immediately see if peaks and troughs align

### Chart.js Library
- **Rationale**: Chart.js is lightweight, well-documented, and available via CDN
- **Alternative Considered**: D3.js would be more powerful but adds unnecessary complexity
- **Alternative Considered**: Plotly.js would work but adds more overhead
- **Benefit**: Minimal dependencies while providing professional-looking charts

### Static Insight Summary
- **Rationale**: Provides context without requiring user interaction
- **Alternative Considered**: Interactive tooltips would require JavaScript event handling
- **Benefit**: Ensures all users see the same interpretation regardless of interaction

### Responsive Grid Layout
- **Rationale**: CSS Grid provides clean, maintainable responsive behavior
- **Mobile Strategy**: Charts stack vertically on small screens to maintain readability
- **Tablet Strategy**: Charts remain side-by-side but with adjusted spacing
- **Desktop Strategy**: Full 2-column layout maximizes screen real estate

## Technology Stack Rationale

### HTML5
- Semantic markup for accessibility
- Native canvas element support for Chart.js

### CSS3
- Flexbox and Grid for responsive layouts
- Media queries for breakpoint management
- Gradient backgrounds for visual appeal

### Vanilla JavaScript
- No framework overhead
- Direct DOM manipulation
- Fetch API for data loading
- ES6 features for clean, modern code

### Chart.js via CDN
- No build process required
- Instant availability without npm
- Proven library with good browser support
- Minimal configuration needed

## Data Structure Decisions

### JSON Format
- **Rationale**: Universal, human-readable, easy to parse
- **Structure**: Wrapped in `data` array for extensibility
- **Date Format**: YYYY-MM for easy sorting and comparison

### Merged Dataset Internal Structure
- **Rationale**: Separates dates from values for cleaner Chart.js integration
- **Null Handling**: Missing values represented as null for datasets with different date ranges
- **Sorting**: Dates automatically sorted chronologically

## Deployment Strategy

### GitHub Pages
- **Rationale**: Free hosting for static sites
- **Setup**: No configuration needed beyond pushing to repository
- **URL**: Accessible at `https://username.github.io/repository-name/`

### No Build Process
- **Rationale**: Reduces friction for deployment and maintenance
- **Benefit**: Anyone can clone and run locally without npm install
- **Trade-off**: No minification or optimization, but acceptable for demonstration

## API Selection Rationale

### Coffee Prices API
- **API Ninjas Commodities API**: Provides real-time commodity prices including coffee
- **Advantages**: No authentication required, simple REST endpoint, reliable data
- **Fallback**: Generates mock data with realistic seasonal patterns

### Developer Activity API
- **GitHub API**: Provides commit history for public repositories
- **Advantages**: No authentication required for public data, reliable infrastructure
- **Fallback**: Generates mock data with realistic activity patterns

## Testing Strategy

### Unit Tests
- Validate API response handling
- Test data merging logic with various date ranges
- Test chart configuration generation

### Property-Based Tests
- Verify data alignment properties hold for all possible inputs
- Verify data preservation through merging
- Verify chart data consistency

### Integration Tests
- Test end-to-end flow from API calls to chart rendering
- Test error handling and fallback behavior

## Future Considerations

If this project were to evolve:

1. **Caching**: Implement local storage caching to reduce API calls
2. **Interactivity**: Add filters, date range selection, or drill-down capabilities
3. **Additional Datasets**: Add more data sources for comparison
4. **Authentication**: Support authenticated API calls for higher rate limits
5. **Performance**: Implement data aggregation and compression
6. **Monitoring**: Add error tracking and analytics
