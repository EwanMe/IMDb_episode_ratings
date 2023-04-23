FROM node:10

WORKDIR /frontend

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]