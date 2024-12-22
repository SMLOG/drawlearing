#!/bin/bash

# Start Docker Desktop (make sure Docker is installed and running)
open -a Docker

# Wait for Docker to start
waitForDocker() {
    while ! docker ps > /dev/null 2>&1; do
        sleep 2
    done
}

waitForDocker

# Stop and remove the running container if it exists
docker stop app > /dev/null 2>&1
docker rm app > /dev/null 2>&1

# Build the Docker image
docker build -t app .

# Run the Docker container
docker run --rm -d -v "$(pwd):/app" -v "$(pwd)/..:/src" -p 3000:3000 --name app app
