FROM node:20-slim

WORKDIR /app

# Copy package.json first (without lock file)
COPY package.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "dev", "--host"] 