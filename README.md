# FlavorAI Backend

Backend API for FlavorAI - a recipe management platform built with NestJS, Prisma, and PostgreSQL.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database running

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Configuration

Create a `.env` file in the root of the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/flavorai?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Replace the database credentials with your PostgreSQL connection details:

- `username` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `localhost:5432` - Your PostgreSQL host and port
- `flavorai` - Database name (will be created if doesn't exist)

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Database Migrations

This will create all necessary tables in your database:

```bash
npm run db:migrate
```

### 5. Start the Development Server

```bash
npm run start:dev
```

The API will start at `http://localhost:3000` (or the PORT specified in your `.env`).

## Available Scripts

### Development

- **`npm run start:dev`** - Start development server with hot reload
- **`npm run start:debug`** - Start development server in debug mode
- **`npm run start`** - Start production server (requires build first)

### Database

- **`npm run db:generate`** - Generate Prisma Client from schema
- **`npm run db:migrate`** - Run database migrations
- **`npm run db:studio`** - Open Prisma Studio (database GUI)

### Build & Production

- **`npm run build`** - Build the application for production
- **`npm run start:prod`** - Run production build

### Testing

- **`npm run test`** - Run unit tests
- **`npm run test:watch`** - Run tests in watch mode
- **`npm run test:cov`** - Run tests with coverage
- **`npm run test:e2e`** - Run end-to-end tests

### Code Quality

- **`npm run lint`** - Run ESLint and auto-fix issues
- **`npm run format`** - Format code with Prettier

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── recipes/           # Recipes module
│   ├── dto/          # Data transfer objects
│   ├── recipe.controller.ts
│   └── recipe.service.ts
├── database/          # Database module (Prisma)
│   ├── database.module.ts
│   └── database.service.ts
├── common/            # Shared utilities
│   ├── filters/      # Exception filters
│   ├── pipes/        # Validation pipes
│   └── validators/   # Zod validation schemas
├── app.module.ts      # Root application module
└── main.ts            # Application entry point

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migration files
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/profile` - Get current user profile (protected)

### Recipes

- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get a specific recipe
- `POST /recipes` - Create a new recipe (protected)
- `PUT /recipes/:id` - Update a recipe (protected)
- `DELETE /recipes/:id` - Delete a recipe (protected)
- `POST /recipes/:id/rate` - Rate a recipe (protected)

## Database Management

### View Database with Prisma Studio

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your database.

### Create New Migration

After modifying `prisma/schema.prisma`, run:

```bash
npm run db:migrate
```

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Set production environment variables in `.env`

3. Run the production server:

```bash
npm run start:prod
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify PostgreSQL is running
2. Check your `DATABASE_URL` in `.env`
3. Ensure the database exists (or Prisma will try to create it)
4. Verify your PostgreSQL user has proper permissions

### Port Already in Use

If port 3000 is already in use, change the `PORT` in your `.env` file.

### Prisma Client Not Generated

If you get Prisma client errors, run:

```bash
npm run db:generate
```

## License

UNLICENSED
