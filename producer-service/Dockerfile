FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && \
    cp -r src/proto dist/ && \
    mkdir -p dist/data && \
    cp src/data/users.json dist/data/

EXPOSE 5001

CMD ["npm", "run", "start:prod"] 