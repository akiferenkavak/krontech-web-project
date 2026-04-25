FROM node:20-alpine

WORKDIR /app

# Dependency cache
COPY package.json package-lock.json* ./
RUN npm ci

# Kaynak kodu kopyala
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
