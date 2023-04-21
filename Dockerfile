FROM node:19.3.0-bullseye-slim

WORKDIR /app

COPY /app/package*.json /app

RUN npm install

COPY /app /app

# Compile TypeScript to JavaScript
RUN npm run build

# Set the command to run the compiled JavaScript code
CMD [ "node","--require ./opentelemetry-tracing.js" "dist/index.js" ]

