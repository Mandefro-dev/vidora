
FROM node:20-bookworm-slim AS build-stage
WORKDIR /app/client

COPY ./client/package*.json ./
RUN npm install
COPY ./client ./
RUN npm run build


# Use a lightweight Node.js image
FROM node:20-bookworm-slim


# We update the package list, install ffmpeg, and clear the apt cache to keep the image size tiny.
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json first
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend ./



# Create directories for uploads and processed videos so they exist when the app starts
COPY --from=build-stage /app/client/dist ./dist
RUN mkdir -p uploads processed



# Expose the port your backend runs on
EXPOSE 8000

# Command to run your app
CMD ["npm", "start"]