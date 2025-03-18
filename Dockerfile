# Use Node.js 18 as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (to leverage Docker caching)
COPY package.json package-lock.json ./

# Copy the full application BEFORE npm install
COPY . .  

# Install dependencies
RUN npm cache clean --force && npm install --legacy-peer-deps --verbose

# Build the Next.js application
RUN npm run build

# Use a smaller base image for the production environment
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.ts ./next.config.ts  # Keep TS version

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
