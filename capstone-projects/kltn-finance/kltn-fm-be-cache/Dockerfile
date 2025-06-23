FROM node:22-slim

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7009

CMD ["npm", "start"]
