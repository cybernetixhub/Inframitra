FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./

# Use clean install (faster + reliable)
RUN npm ci

# Copy rest of code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app
RUN npm run build

# Create non-root user (VERY IMPORTANT)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"]
