# Stage 1: Build Vite frontend
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Run Express Backend
FROM node:22-alpine AS production

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend server script
COPY server.js ./

# Copy built frontend assets from stage 1
COPY --from=build /app/dist ./dist

# The express server runs on process.env.PORT or 3001
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

# Start the Node.js API which also serves the frontend
CMD ["node", "server.js"]
