[![Linting Check](https://github.com/Souvik606/Google-sheets/actions/workflows/lint.yml/badge.svg)](https://github.com/Souvik606/Google-sheets/actions/workflows/lint.yml)

# Google Sheets Clone Project

This project is a monorepo structured application that replicates the functionalities of Google Sheets. It consists of
two main components:

- **Frontend**: Built with Next.js, providing the user interface.
- **Backend**: Developed using Express.js, handling server-side operations.

The project utilizes [pnpm](https://pnpm.io/) as the package manager to efficiently manage dependencies across the
monorepo.

## Prerequisites

Before setting up and running the project locally, ensure you have the following installed:

- **Node.js**: Version 20.0.0 or higher. You can download it from the [official Node.js website](https://nodejs.org/).
- **pnpm**: Version 10.6.2. Install it globally using npm:

  ```bash
  npm install -g pnpm@10.6.2
  ```

  Alternatively, refer to the [pnpm installation guide](https://pnpm.io/installation) for more details.

## Project Structure

The monorepo is organized as follows:

```
google-sheets/
├── apps/
│   ├── frontend/   # Next.js application
│   └── backend/    # Express.js application
├── package.json    # Root package.json with workspace scripts
└── pnpm-workspace.yaml # Defines the workspace structure
```

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/google-sheets.git
   cd google-sheets
   ```

2. **Install Dependencies**:

   Run the following command at the root of the monorepo to install all dependencies for both frontend and backend:

   ```bash
   pnpm install
   ```

   This command leverages pnpm's workspace feature to install dependencies efficiently across all packages.

## Available Scripts

The root `package.json` is configured with scripts to manage both the frontend and backend applications. Below are the
available scripts and their descriptions:

- **Development**:
    - `dev:frontend`: Starts the Next.js development server.

      ```bash
      pnpm run dev:frontend
      ```

    - `dev:backend`: Starts the Express.js server.

      ```bash
      pnpm run dev:backend
      ```

- **Build**:
    - `build:frontend`: Builds the Next.js application for production.

      ```bash
      pnpm run build:frontend
      ```

    - `build:backend`: Builds the backend application.

      ```bash
      pnpm run build:backend
      ```

- **Linting**:
    - `lint:frontend`: Runs ESLint on the frontend codebase.

      ```bash
      pnpm run lint:frontend
      ```

    - `lint:backend`: Runs ESLint on the backend codebase.

      ```bash
      pnpm run lint:backend
      ```

- **Formatting**:
    - `format:frontend`: Formats the frontend codebase using Prettier.

      ```bash
      pnpm run format:frontend
      ```

    - `format:backend`: Formats the backend codebase using Prettier.

      ```bash
      pnpm run format:backend
      ```

- **Starting**:
    - `start:frontend`: Starts the Next.js application in production mode.

      ```bash
      pnpm run start:frontend
      ```

    - `start:backend`: Starts the Express.js server in production mode.

      ```bash
      pnpm run start:backend
      ```

## Running the Applications

To run the applications locally:

1. **Frontend**:

   Navigate to the root directory and execute:

   ```bash
   pnpm run dev:frontend
   ```

   This command starts the Next.js development server, typically accessible at `http://localhost:3000`.

2. **Backend**:

   In a separate terminal, from the root directory, execute:

   ```bash
   pnpm run dev:backend
   ```

   This command starts the Express.js server, typically accessible at `http://localhost:5000`.

Ensure both servers are running concurrently to have the full functionality of the application.

## Additional Resources

- [pnpm Workspaces](https://pnpm.io/workspaces): Learn more about managing monorepos with pnpm.
- [Next.js Documentation](https://nextjs.org/docs): Official Next.js documentation.
- [Express.js Documentation](https://expressjs.com/): Official Express.js documentation.

For any issues or contributions, please refer to the project's repository on GitHub. 