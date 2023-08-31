FROM node:16

# Create app directory
WORKDIR /app

COPY . .

EXPOSE 3001
ENTRYPOINT [ "/bin/bash", "/app/project_runner.sh" ]