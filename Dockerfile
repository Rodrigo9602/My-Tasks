FROM node:20.10-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm run build