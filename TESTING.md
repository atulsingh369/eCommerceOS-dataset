# Testing Guide

This project uses **Jest** for unit testing and **Playwright** for end-to-end (E2E) testing.

## Unit Tests (Jest)

Unit tests are located in the `tests/` directory and alongside components (optional). They typically have the extension `.test.ts` or `.test.tsx`.

### Running Unit Tests

- Run all tests:
  ```bash
  npm test
  ```
- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

## E2E Tests (Playwright)

E2E tests are located in the `tests/` directory with the extension `.spec.ts`.

### Running E2E Tests

1. Install browsers (first time only):
   ```bash
   npx playwright install
   ```
2. Run tests:
   ```bash
   npm run test:e2e
   ```
3. View report:
   ```bash
   npx playwright show-report
   ```

## API Mocks

When testing components that interact with Firebase or external APIs, please use the provided mocks in `tests/mocks` (if available) or Jest mocks.
