# Server

## Запуск

Install dependencies
```bash
yarn install
```
Make migrations
```bash
yarn run migrate:dev
```
Generate Prisma Client Types
```bash
yarn run prisma:generate
```
Seed database
```bash
yarn run seed
```
Start server
```bash
# development mode
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

Run Nest Server in Production mode:

```bash
yarn run start:prod
```

GraphQL Playground for the NestJS Server is available here: http://localhost:3000/graphql
