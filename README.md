# Stone Eng Test

## 📌 Project Description
- This project is a simple backend with register/login feature and a private product list route.
- API documentation available at `/docs`

## 🤔 Considerations
- There's no CRUD for products, so the table is being filled by a `seed.ts` script by Prisma when running the first migrations.
- THere are schema `zod` schema validations that ensure some minimum requirements for the password:
  - Minimum of 8 characters
  - Maximum of 20 characters
  - At least one uppercase letter
  - At least one number
  - At least one special charactes

## 🚀 Requirements
- Node.js v22
- Docker + Docker Compose
- Prisma CLI (`npx prisma`)
- `.env` file (see `.env.example` for reference)

## 📦 Setup Instructions

- Install Node.js.
- If you already have `nvm` installed, just run `nvm use` to use the correct version.
- Clone the project.
- Install project dependencies running `npm install`.
- Add environment variables - `cp .env.example .env`
- Run `docker compose up -d`.
- Run `npx prisma migrate dev` to run the database migrations and seed the DB with sample products.
- Start the service running `npm run start`. The service will run on port 3333 by default.
- You can also run the server using `npm run dev`. Running that way will watch changes and automatically restart the server.
- You can run `npx prisma studio` to see the database records directly through your browser at `http://localhost:5555`

## 📖 API Usage
- Example for creating a product
```bash
curl --request POST \
  --url http://localhost:3333/register \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.1' \
  --data '{
	"name": "Stone User",
	"password": "Stone@123",
	"passwordConfirmation": "Stone@123",
	"email": "stone@putsbox.com"
}'
```
- Expected response:
```
{
	"message": "User created successfully"
}
```
- For full documentation, visit: http://localhost:3333/docs
- An exported Insomnia collection (`http-requests.yaml`) is available in the project root. It can also be imported into Postman or other HTTP clients.

## 🧪 Running Tests
- This project has 100% test coverage using Jest, including unit and integration tests.
- The test suite is ran by `npm test` or `npm run test`.

## 📁 File Tree Structure

```bash
  └── 📁__tests__  # Unit Tests
  └── 📁.vscode # Suggested extensions and editor settings
  └── 📁prisma # ORM migrations, schema and seed script
  └── 📁src # Source code
  └── .env # Environment Variables
  └── .env.example # Environment Variables example
  └── .gitignore # File/folders to be ignored by git
  └── .nvmrc # Node version
  └── biome.json # Biome JS Linter configuration
  └── docker-compose.yml # Docker compose file with PostgreSQL setup
  └── http-requests # Sample Insomnia file for http requests
  └── jest.config.js # Configuration file for unit tests using Jest
  └── package-lock.json # Locked version of all dependencies
  └── package.json # Project metadata and dependencies
  └── README.md # Project overview
  └── tsconfig.json # TypeScript configuration
  └── tsup.config.ts # TSUp configuration file for building the app
```
