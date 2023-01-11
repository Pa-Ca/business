#!/bin/bash

# Install dependencies
npm install 

# Install PA-CA ui module
PACA_UI=paca-ui*.tgz
npm install ./${PACA_UI}

# If you are building your code for production
# RUN npm ci --only=production

# Run
npm run dev