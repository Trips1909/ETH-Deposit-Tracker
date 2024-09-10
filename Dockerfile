# Use the official Node.js image as the base image
FROM node:18

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your application will run on (optional)
EXPOSE 8080

# Set environment variables (optional)
RUN cp .env.sample .env
# Command to run your application
CMD ["node", "event-listener.js"]
