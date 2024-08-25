FROM node:20

WORKDIR /app

COPY . . 

RUN npm install
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]
