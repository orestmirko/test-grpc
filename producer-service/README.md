# Producer Service

GRPC service for filtering users by age.

## Description

The service reads user data from a JSON file, filters it by age (> 18) and provides filtered data through gRPC API.

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

gRPC service provides the following method:
- `GetFilteredUsers` - returns a list of users whose age is greater than 18
