
FROM node:20-bookworm-slim AS build-stage
WORKDIR /client
COPY ./client/package*.json ./
RUN npm install
COPY ./client ./
RUN npm run build


# Use a lightweight Node.js image
FROM node:20-bookworm-slim


# We update the package list, install ffmpeg, and clear the apt cache to keep the image size tiny.
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first


COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY . .

# Create directories for uploads and processed videos so they exist when the app starts
RUN mkdir -p uploads processed

COPY --from=build-stage /client/dist ./dist

# Expose the port your backend runs on
EXPOSE 8000

# Command to run your app
CMD ["npm", "start"]