# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port from environment variable with fallback to 8080
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
