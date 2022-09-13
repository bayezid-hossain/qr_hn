FROM node:12.2
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . . 
EXPOSE 8001
CMD npm start