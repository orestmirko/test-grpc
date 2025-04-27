FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp -r src/proto dist/

CMD ["npm", "run", "start:prod"] 