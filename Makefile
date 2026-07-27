# Load environment variables from .env file if it exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

.DEFAULT_GOAL := help

.PHONY: help dev start up stop down image rebuild shell

help:
	@echo "Available commands:"
	@echo "  make dev     - Run React web client dev server locally (npm start)"
	@echo "  make start   - Start local container environment (docker-compose up -d)"
	@echo "  make stop    - Stop local container environment (docker-compose down)"
	@echo "  make image   - Build the Docker image and clean up dangling images"
	@echo "  make rebuild - Stop/remove the container, rebuild the image, and start it again"
	@echo "  make shell   - Open an interactive shell inside the running container"

# Run React dev server locally without Docker
dev:
	cd frontend && npm start

# Start local environment using docker-compose
start: up

up:
	docker-compose up -d

# Stop local environment
stop: down

down:
	docker-compose down

# Build the docker image and clean up orphaned images
image:
	docker build -t $(CLIENT_APP):latest .
	@imageid=$$(docker images $(CLIENT_APP) | grep '<none>' | tail -n 1 | awk '{print $$3}'); \
	if [ ! -z "$$imageid" ]; then \
		docker rmi $$imageid; \
	fi
	@imageid=$$(docker images | grep '<none>' | tail -n 1 | awk '{print $$3}'); \
	if [ ! -z "$$imageid" ]; then \
		docker rmi $$imageid; \
	fi

# Rebuild the docker setup: stop container, build image, and restart
rebuild:
	docker rm -f $(CLIENT_APP) || true
	$(MAKE) image
	docker-compose up -d

# Open an interactive shell inside the running app container
shell:
	docker exec -it $(CLIENT_APP) /bin/sh
