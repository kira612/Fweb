FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching)
COPY package*.json ./
RUN npm install
# We will run npm install in the container if node_modules is not mounted or empty, 
# but usually we mount it or install it in the entrypoint.
# For dev, we often just rely on the volume mount, but having it here is good practice.

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "dev"]
