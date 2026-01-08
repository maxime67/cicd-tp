FROM node:22.21.1-trixie-slim
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start"]