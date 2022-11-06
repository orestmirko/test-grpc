# Test List App

## Pre-requirements
Following tools should be installed:
- PostgreSQL
- NodeJS

## Installation

Go to root folder of the app.
1) Install all required packages
```
yarn
```
2) Build app:
```
yarn build
```
3) Run database migrations:
```
yarn migration:run
```
4) Start nodejs app in dev mode:
```
yarn start:dev
```

## Usage

1. To test functionality you can use Swagger API located here:
```
http://localhost:8000/api
```
When Swagger window is opened, change base url to ```http://localhost:8000/api``` and click "Explore" button.
After this, you can test APIs in Swagger.
2. However you can use other tools for testing(for example Postman). It's up to you.