# eCommerceOS-dataset

A modular, AI-powered e-commerce platform built for modern retail.

![CI](https://github.com/atulsingh369/eCommerceOS/actions/workflows/test.yml/badge.svg)

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Hosting**: Vercel

## 🛠 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file. Use `env.example` as a reference.

1. Copy the example file:
   ```bash
   cp env.example .env.local
   ```
2. Fill in the values from your Firebase Console and other service providers.

### Installation

```bash
git clone https://github.com/atulsingh369/eCommerceOS.git
cd eCommerceOS
npm install
```

### Running Locally

```bash
npm run dev
```

## 🧪 Testing

We use a comprehensive testing strategy involving unit and end-to-end tests.

- **Unit Tests**: `npm test` (Jest + React Testing Library)
- **E2E Tests**: `npm run test:e2e` (Playwright)

See [TESTING.md](./TESTING.md) for more details.

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License.
