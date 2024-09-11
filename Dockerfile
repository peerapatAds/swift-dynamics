# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files to the working directory
COPY package.json ./
COPY package-lock.json ./
# or for Yarn
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# or for Yarn
# RUN yarn install

# Copy the rest of the project files to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Define the command to start the Next.js app
CMD ["npm", "run", "start"]