# Consumer Service

GRPC service for consuming filtered user data.

## Description

The service receives filtered user data (age > 18) from the Producer Service through gRPC API and logs the results.

## Installation

```bash
npm install
```

## Running the app

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Docker

```bash
docker-compose up --build
```

## API

gRPC service consumes the following method from Producer Service:
- `GetFilteredUsers` - receives a list of users whose age is greater than 18
