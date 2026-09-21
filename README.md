# FindAFriend API

REST API for FindAFriend, a pet adoption platform that connects animal shelters (ORGs) to potential adopters. This is the "API SOLID" challenge from Rocketseat's Node.js track, built from scratch with TypeScript, Fastify and Prisma, following Clean Architecture and SOLID principles.

## About the project

Organizations (ORGs) sign up on the platform and list the pets available for adoption. Anyone looking for a new friend can browse pets in a city, filter them by characteristics such as size and energy level, and view the details of a specific pet — including the WhatsApp number of the responsible organization, so contact can continue outside the application.

## Tech stack

- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://fastify.dev/) — HTTP server
- [Prisma](https://www.prisma.io/) + PostgreSQL — persistence
- [Zod](https://zod.dev/) — input validation
- [@fastify/jwt](https://github.com/fastify/fastify-jwt) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — authentication
- [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest) — unit and e2e tests
- Docker Compose — local database for development

## Architecture

The project follows Clean Architecture with dependency inversion: every business rule lives in a *use case*, which depends only on repository interfaces (`OrgsRepository`, `PetsRepository`). Each interface has two implementations — an in-memory one, used in unit tests, and a Prisma-backed one, used in production — which makes it possible to test all business logic without a database.

```
src/
├── env/                  # environment variable validation with Zod
├── http/
│   ├── controllers/      # HTTP routes, grouped by resource (orgs, pets)
│   └── middlewares/      # verifyJwt, applied to authenticated routes
├── lib/                  # single Prisma Client instance
├── repositories/
│   ├── in-memory/        # implementations used in unit tests
│   └── prisma/           # implementations used in production
└── use-cases/
    ├── errors/           # domain errors (InvalidCredentialsError, etc.)
    └── factories/        # wire up each use case with its Prisma implementation
```

Every route follows the same flow: validate the input with Zod, build the use case through a factory, execute the business rule, and translate the result (or the domain error it throws) into an HTTP response.

## Business rules

- An ORG must provide an address and a WhatsApp number to sign up.
- The ORG's password is stored as a hash (bcrypt), never in plain text.
- Registering a pet requires authentication — the pet is always linked to the ORG from the token, and inherits its city.
- Listing pets requires a city; the remaining filters (age, size and energy level) are optional.
- Pet details include the WhatsApp number of the responsible organization, so interested adopters can reach out.

## API endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/orgs` | — | Registers a new ORG |
| `POST` | `/sessions` | — | Authenticates an ORG and returns a JWT token |
| `POST` | `/pets` | Bearer token | Registers a pet linked to the authenticated ORG |
| `GET` | `/pets?city=` | — | Lists pets in a city, with optional filters `age`, `size` and `energyLevel` |
| `GET` | `/pets/:id` | — | Returns the details of a pet and the WhatsApp number of the responsible ORG |

The accepted values for `age`, `size` and `energyLevel` come straight from the Prisma enums and are kept in Portuguese, matching the platform's target audience: `age` — `FILHOTE`, `ADULTO`, `IDOSO`; `size` — `PEQUENO`, `MEDIO`, `GRANDE`; `energyLevel` — `BAIXA`, `MEDIA`, `ALTA`.

## Running locally

Prerequisites: Node.js 20+ and Docker.

```bash
# install dependencies
npm install

# copy the environment variables file
cp .env.example .env

# start the local database
docker compose up -d

# run Prisma migrations
npm run prisma:migrate

# start the API in development mode
npm run dev
```

The API listens on `http://localhost:3333` by default.

## Testing

```bash
# unit tests (use cases, with in-memory repositories)
npm run test

# e2e tests (HTTP routes, require the database to be running)
npm run test:e2e
```

## License

This project is under the MIT license.
