# How to Run Tests

Complete instructions for running and verifying the test suite.

## Prerequisites

```bash
node --version  # Should be 16 or higher
npm --version   # Should be 8 or higher
```

## Installation

```bash
npm install
```

This installs:
- `vitest` - Test runner
- `fast-check` - Property-based testing
- `jsdom` - DOM testing environment
- `@vitest/ui` - Visual test interface

## Running Tests

### Option 1: Run All Tests Once (Recommended for CI/CD)

```bash
npm run test:run
```

**Output:**
```
✓ tests/api.test.js (12 tests)
✓ tests/app.test.js (8 unit tests + 4 property-based tests)
✓ tests/charts.test.js (8 unit tests + 1 property-based test)

Test Files  3 passed (3)
     Tests  33 passed (33)
  Start at  XX:XX:XX
  Duration  XXXms
```

### Option 2: Run Tests in Watch Mode (Development)

```bash
npm run test
```

Tests automatically re-run when files change. Press:
- `q` to quit
- `a` to run all tests
- `p` to filter by filename
- `t` to filter by test name

### Option 3: Run Tests with Visual UI

```bash
npm run test:ui
```

Opens a browser-based test interface at `http://localhost:51204/__vitest__/`

## Test Files and Coverage

### tests/api.test.js (12 tests)

Tests API data fetching and validation.

```bash
npm run test:run -- tests/api.test.js
```

**Tests:**
1. validateCoffeePriceData - accepts valid data
2. validateCoffeePriceData - rejects non-array
3. validateCoffeePriceData - rejects invalid dates
4. validateCoffeePriceData - rejects negative prices
5. validateCoffeePriceData - rejects missing fields
6. validateCoffeePriceData - accepts zero price
7. validateDeveloperActivityData - accepts valid data
8. validateDeveloperActivityData - rejects non-array
9. validateDeveloperActivityData - rejects invalid dates
10. validateDeveloperActivityData - rejects negative counts
11. validateDeveloperActivityData - rejects missing fields
12. validateDeveloperActivityData - accepts zero count

### tests/app.test.js (8 unit + 4 property-based tests)

Tests data merging logic and universal properties.

```bash
npm run test:run -- tests/app.test.js
```

**Unit Tests:**
1. mergeDatasets - overlapping dates
2. mergeDatasets - non-overlapping dates
3. mergeDatasets - sorts chronologically
4. mergeDatasets - empty datasets
5. mergeDatasets - single dataset

**Property-Based Tests (100 iterations each):**
1. Property 1: Data Alignment - contains all unique dates
2. Property 1: Data Alignment - sorts chronologically
3. Property 2: Data Preservation - preserves coffee prices
4. Property 2: Data Preservation - preserves activity counts
5. Property 3: Chart Data Consistency - equal length arrays

### tests/charts.test.js (8 unit + 1 property-based test)

Tests chart rendering functionality.

```bash
npm run test:run -- tests/charts.test.js
```

**Unit Tests:**
1. renderCoffeeChart - renders with valid data
2. renderCoffeeChart - handles null canvas
3. renderCoffeeChart - correct label
4. renderCoffeeChart - correct color
5. renderProductivityChart - renders with valid data
6. renderProductivityChart - handles null canvas
7. renderProductivityChart - correct label
8. renderProductivityChart - correct color

**Property-Based Tests (100 iterations):**
1. Property 4: Chart Data Consistency - matching date arrays

## Running Specific Tests

### Run tests matching a pattern

```bash
npm run test:run -- --grep "mergeDatasets"
```

### Run a specific test file

```bash
npm run test:run -- tests/api.test.js
```

### Run tests with verbose output

```bash
npm run test:run -- --reporter=verbose
```

## Test Output Interpretation

### Successful Test Run

```
✓ tests/api.test.js (12 tests) 123ms
  ✓ validateCoffeePriceData (6 tests)
    ✓ should validate correct coffee price data
    ✓ should reject non-array data
    ...
  ✓ validateDeveloperActivityData (6 tests)
    ...

✓ tests/app.test.js (12 tests) 456ms
  ✓ mergeDatasets (5 tests)
    ...
  ✓ Property: Data Alignment (2 tests)
    ✓ should contain all unique dates from both datasets
    ✓ should sort dates chronologically
  ...

✓ tests/charts.test.js (9 tests) 234ms
  ...

Test Files  3 passed (3)
     Tests  33 passed (33)
  Start at  14:30:45
  Duration  813ms
```

### Failed Test Run

```
✗ tests/app.test.js > mergeDatasets > should sort dates chronologically
  AssertionError: expected ['2023-03', '2023-01', '2023-02'] to equal ['2023-01', '2023-02', '2023-03']
```

## Property-Based Test Details

Property-based tests use `fast-check` to generate random inputs.

### How They Work

1. **Generator**: Creates random valid inputs
   ```javascript
   fc.array(fc.record({
     date: fc.stringMatching(/^\d{4}-(0[1-9]|1[0-2])$/),
     price_usd: fc.float({ min: 0, max: 100 })
   }), { minLength: 1, maxLength: 50 })
   ```

2. **Property**: Defines what should be true
   ```javascript
   (coffeeData) => {
     const merged = mergeDatasets(coffeeData, []);
     expect(merged.dates.length).toBe(merged.coffee.length);
   }
   ```

3. **Verification**: Runs 100 times with different inputs
   ```javascript
   { numRuns: 100 }
   ```

### Example Property Test Output

```
✓ Property: Data Alignment > should contain all unique dates from both datasets
  Ran 100 iterations with random inputs
  Smallest failing example (if any): N/A
```

## Debugging Failed Tests

### 1. Read the Error Message

```
✗ tests/app.test.js > mergeDatasets > should sort dates chronologically
  AssertionError: expected ['2023-03', '2023-01'] to equal ['2023-01', '2023-03']
```

The error shows:
- Which test failed
- What was expected vs actual
- Line number in test file

### 2. Run with Verbose Output

```bash
npm run test:run -- --reporter=verbose
```

### 3. Check the Source Code

Look at the function being tested:
```bash
cat src/app.js | grep -A 20 "mergeDatasets"
```

### 4. Add Console Logs

Edit the test file to add debugging:
```javascript
it('should sort dates chronologically', () => {
    const coffeeData = [
        { date: '2023-03', price_usd: 3.60 },
        { date: '2023-01', price_usd: 3.45 }
    ];
    const merged = mergeDatasets(coffeeData, []);
    console.log('Merged dates:', merged.dates);  // Add this
    expect(merged.dates).toEqual(['2023-01', '2023-03']);
});
```

Then run:
```bash
npm run test:run -- tests/app.test.js
```

## Continuous Integration

For CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```bash
npm run test:run
```

This command:
- Runs all tests once
- Exits with code 0 if all pass
- Exits with code 1 if any fail
- Produces machine-readable output

## Performance

Typical test execution times:
- Unit tests: ~100-200ms
- Property-based tests: ~300-500ms (100 iterations each)
- Total: ~800-1000ms

## Troubleshooting

### "Cannot find module" error

```bash
npm install
```

### Tests timeout

Increase timeout in `vitest.config.js`:
```javascript
test: {
  testTimeout: 10000  // 10 seconds
}
```

### Property-based test fails

Check the shrunk example in the error message. This is the smallest input that causes the failure.

Example:
```
Counterexample: [{ date: '2023-01', price_usd: -5 }]
```

This tells you the test failed with negative prices.

### Tests pass locally but fail in CI

Common causes:
- Different Node.js version
- Missing dependencies
- Environment variables
- Timing issues

Solution:
```bash
npm ci  # Use package-lock.json
npm run test:run
```

## Test Coverage Report

Generate coverage report:

```bash
npm run test:run -- --coverage
```

This creates a coverage report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run test:run`
3. ✅ Verify all 33+ tests pass
4. ✅ Start development with `npm run test` (watch mode)
5. ✅ Deploy with confidence!

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [fast-check Documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://hypothesis.works/articles/what-is-property-based-testing/)
