FROM node:16

# Create app directory
WORKDIR /app

COPY project_runner.sh .

EXPOSE 3001
ENTRYPOINT [ "/bin/bash", "project_runner.sh" ]