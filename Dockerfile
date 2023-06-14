FROM node:16

# Create app directory
WORKDIR /app

COPY project_runner.sh .
COPY entrypoint.sh .

EXPOSE 3001
ENTRYPOINT [ "/bin/bash", "-c", "bash entrypoint.sh" ]