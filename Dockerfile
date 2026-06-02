# Use official lightweight Node.js 20 image
FROM node:20-alpine

# Set the execution environment to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy only package files to leverage Docker caching for dependency layers
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Expose port 3000 to the host machine
EXPOSE 3000

# Run the node server
CMD ["node", "backend/server.js"]
