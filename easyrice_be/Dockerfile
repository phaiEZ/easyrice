# Step 1: Set the base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json from the host to the container
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the backend code
COPY . .

# Step 6: Expose the backend port
EXPOSE 5000

# Step 7: Set the command to start the backend
CMD ["npm", "start"]
