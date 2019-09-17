FROM node:10

WORKDIR /usr/src/app
#copies package.json
COPY package*.json ./
#install dependencies
RUN npm install

COPY . .
EXPOSE 3000

CMD ["node", "app.js"]