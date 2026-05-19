FROM node:22-alpine
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
