FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/

RUN yarn install

COPY . /app/

RUN rm -rf dist && yarn build

EXPOSE 3001

CMD ["yarn", "start:dev"]
