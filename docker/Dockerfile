FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install dotenv
RUN npm install -g nodemon

COPY build ./build
COPY public ./public
COPY prisma ./prisma
COPY server.js .
COPY .env .

RUN npx prisma generate

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080
CMD [ "nodemon", "-r", "dotenv/config", "server.js" ]
