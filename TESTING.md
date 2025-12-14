# Testing Guide

This document describes how to run and understand the test suite for the Coffee Prices vs Developer Productivity Dashboard.

## Test Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation
```bash
npm install
```

## Running Tests

### Run all tests once
```bash
npm run test:run
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test
```

### Run tests with UI
```bash
npm run test:ui
```

## Test Structure

The test suite is organized into three main files:

### 1. tests/api.test.js
Tests for API data fetching and validation.

**Unit Tests:**
- `validateCoffeePriceData()`: Validates coffee price data format
  - Accepts valid data with correct date format (YYYY-MM) and positive prices
  - Rejects non-array data
  - Rejects invalid date formats
  - Rejects negative prices
  - Rejects missing fields
  - Accepts zero prices

- `validateDeveloperActivityData()`: Validates developer activity data format
  - Accepts valid data with correct date format and positive counts
  - Rejects non-array data
  - Rejects invalid date formats
  - Rejects negative activity counts
  - Rejects missing fields
  - Accepts zero activity counts

- `fetchCoffeePrices()`: Fetches coffee price data
  - Returns mock data when API fails
  - Returns data with correct structure
  - All data points have valid date and price fields

- `fetchDeveloperActivity()`: Fetches developer activity data
  - Returns mock data when API fails
  - Returns data with correct structure
  - All data points have valid date and activity_count fields

### 2. tests/app.test.js
Tests for data merging logic and property-based tests.

**Unit Tests:**
- `mergeDatasets()`: Merges two datasets
  - Merges datasets with overlapping dates
  - Merges datasets with non-overlapping dates
  - Sorts dates chronologically
  - Handles empty datasets
  - Handles single dataset

**Property-Based Tests (100 iterations each):**

- **Property 1: Data Alignment**
  - Validates: Requirements 3.1, 3.2, 3.3
  - Property: Merged dataset contains all unique dates from both sources
  - Property: All dates are sorted chronologically

- **Property 2: Data Preservation**
  - Validates: Requirements 1.2, 2.2
  - Property: All coffee price values are preserved in merged dataset
  - Property: All developer activity values are preserved in merged dataset

- **Property 3: Chart Data Consistency**
  - Validates: Requirements 1.2, 2.2, 3.1
  - Property: Coffee, productivity, and dates arrays have equal length

### 3. tests/charts.test.js
Tests for chart rendering functionality.

**Unit Tests:**
- `renderCoffeeChart()`: Renders coffee price chart
  - Renders chart with valid data
  - Handles null canvas gracefully
  - Creates chart with correct label
  - Uses correct color (#8B4513)

- `renderProductivityChart()`: Renders developer activity chart
  - Renders chart with valid data
  - Handles null canvas gracefully
  - Creates chart with correct label
  - Uses correct color (#2E86AB)

**Property-Based Tests:**
- **Property 4: Chart Data Consistency**
  - Validates: Requirements 1.2, 2.2, 3.1
  - Property: Both charts use identical date arrays

## Test Coverage

The test suite covers:

1. **Data Validation**: Ensures API responses are in correct format
2. **Data Merging**: Verifies datasets are correctly aligned and merged
3. **Chart Rendering**: Confirms charts are created with correct configuration
4. **Error Handling**: Tests graceful handling of invalid data and missing elements
5. **Universal Properties**: Property-based tests verify correctness across all inputs

## Expected Test Results

When running `npm run test:run`, you should see:

```
✓ tests/api.test.js (12 tests)
✓ tests/app.test.js (8 tests + 4 property-based tests)
✓ tests/charts.test.js (8 tests + 1 property-based test)

Total: 33 tests passed
```

## Debugging Tests

### Run specific test file
```bash
npm run test:run -- tests/api.test.js
```

### Run tests matching a pattern
```bash
npm run test:run -- --grep "mergeDatasets"
```

### Run with verbose output
```bash
npm run test:run -- --reporter=verbose
```

## Property-Based Testing

Property-based tests use `fast-check` to generate random inputs and verify that properties hold across all cases.

### How Property-Based Tests Work

1. **Generator**: Creates random valid inputs (e.g., arrays of dates and prices)
2. **Property**: Defines what should be true about the output
3. **Verification**: Runs the property 100 times with different inputs
4. **Shrinking**: If a property fails, finds the smallest failing example

### Example Property Test

```javascript
it('should contain all unique dates from both datasets', () => {
    fc.assert(
        fc.property(
            fc.array(fc.record({
                date: fc.stringMatching(/^\d{4}-(0[1-9]|1[0-2])$/),
                price_usd: fc.float({ min: 0, max: 100 })
            }), { minLength: 1, maxLength: 50 }),
            (coffeeData) => {
                const merged = mergeDatasets(coffeeData, []);
                // Property: all coffee data is preserved
                coffeeData.forEach(item => {
                    const index = merged.dates.indexOf(item.date);
                    expect(merged.coffee[index]).toBe(item.price_usd);
                });
            }
        ),
        { numRuns: 100 }
    );
});
```

## Continuous Integration

To run tests in CI/CD pipeline:

```bash
npm run test:run
```

This command:
- Runs all tests once
- Exits with code 0 if all tests pass
- Exits with code 1 if any test fails
- Produces machine-readable output

## Troubleshooting

### Tests fail with "Cannot find module"
```bash
npm install
```

### Tests timeout
Increase timeout in vitest.config.js:
```javascript
test: {
  testTimeout: 10000
}
```

### Property-based tests fail
Check the shrunk example in the error message. This is the smallest input that causes the failure.

## Test Maintenance

When adding new features:

1. Write unit tests for specific examples
2. Write property-based tests for universal properties
3. Ensure all tests pass before committing
4. Update this document if test structure changes

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [fast-check Documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://hypothesis.works/articles/what-is-property-based-testing/)
