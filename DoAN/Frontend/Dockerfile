FROM node:22-alpine
WORKDIR /app
ENV CHOKIDAR_USEPOLLING=true
ENV NODE_ENV=development

# Chỉ copy package.json để cài dependencies
# Code thực tế được mount vào /app qua volume trong docker-compose
COPY package*.json ./
RUN npm install

# Không COPY . . ở đây vì volume sẽ override toàn bộ /app
# CMD đã có --host trong vite.config.ts nên không cần truyền lại
CMD ["npm", "run", "dev"]
