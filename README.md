# Test List App

## Pre-requirements

Following tools should be installed:

- PostgreSQL
- NodeJS

## Installation

Go to root folder of the app.

1. Install all required packages

```
npm install
```

2. Build app:

```
npm run build
```

3. Run database migrations:

```
npm run migration:run
```

4. Start nodejs app in dev mode:

```
npm run start:dev
```

## Usage

1. To test functionality you can use Swagger API located here:

```
http://localhost:8000/api
```

## Generate migration

```
npm run migration:gen -- -n <migration-name>
```

## Create migration

```
npm run migration:create -n <migration-name>
```
