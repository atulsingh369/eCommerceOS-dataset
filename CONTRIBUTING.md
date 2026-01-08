# Contributing to eCommerceOS

Thank you for your interest in contributing! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/eCommerceOS.git
   cd eCommerceOS
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

We use **Jest** for unit tests and **Playwright** for end-to-end tests.

- Run unit tests: `npm test`
- Run E2E tests: `npm run test:e2e`

Please ensure all tests pass before submitting a Pull Request.

## Pull Requests

1. Ensure your code follows the project's style.
2. Link to the issue you are fixing in the PR description (e.g., `Fixes #123`).
3. Include a description of your changes and how you tested them.
4. Verify that CI passes.
