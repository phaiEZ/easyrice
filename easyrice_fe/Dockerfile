# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock files to install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of your frontend files
COPY . .

# Expose the port the frontend will run on
EXPOSE 3000

# Command to run the frontend
CMD ["yarn", "start"]
