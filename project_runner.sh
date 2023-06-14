#!/bin/bash

# Install dependencies
npm install 

# Build app
npm run build

# Run production app
npm run start

# Run development app
#npm run dev

# Redirect both standard output and error output to a log file
exec &> /app/project_runner.log

# Check the exit status and exit with the same status code
if [ $? -ne 0 ]; then
  exit $?
fi