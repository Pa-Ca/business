FROM node:16

# Create app directory
WORKDIR /app

COPY package*.json .
RUN npm install

COPY . /app

# Building app
RUN npm run build
EXPOSE 3001

# Running the app
CMD "npm" "run" "start"