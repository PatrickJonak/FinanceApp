FROM node:24
ARG SERVER_ADDRESS
ENV ASPNETCORE_URLS="${SERVER_ADDRESS};"
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application and build
COPY . .
RUN npm run build
 
# Expose the correct port
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "preview" ]