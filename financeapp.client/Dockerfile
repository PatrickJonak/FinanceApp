# Create base image
ARG NODE_VERSION=24
FROM node:$NODE_VERSION
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application and build
COPY . .
RUN npm run build
 
# Expose the correct port
ARG SERVER_URL
ENV ASPNETCORE_URLS="${SERVER_URL};"
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "preview" ]