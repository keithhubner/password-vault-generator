# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm cache clean --force && npm install --omit=dev --legacy-peer-deps --verbose

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller base image for the production environment
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm cache clean --force && npm install --omit=dev --legacy-peer-deps --verbose

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"] 