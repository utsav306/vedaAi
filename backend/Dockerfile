FROM node:22-bookworm

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Install all Playwright browsers + required system dependencies
RUN npx playwright install --with-deps

# Copy source and build
COPY . .
RUN npm run build

# Keep only production deps for runtime
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# MVP: run API + worker in one container
CMD ["npm", "run", "start:all"]
