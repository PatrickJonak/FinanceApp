# FinanceApp
GenAI-native web app for budgeting, tracking, and finance.

## Project Setup

### Docker Manual Setup

#### Bridge Network

The bridge network allows for containers to communicate locally in an isolated environment. 
It's crucial for enabling container-to-container communication.

1. Create the network:

   ```bash
   docker network create -d bridge financeapp-network
   ```
2. List all networks to find `NETWORK ID`:

   ```bash
   docker network ls
   ```
   
3. Inspect the network:

   ```bash
   docker network inspect <NETWORK_ID>
   ```
   
#### Bridge Network Setup Sources

[Docker Docs | Network Drivers](https://docs.docker.com/engine/network/drivers/)

[Docker Docs | Bridge Network Driver](https://docs.docker.com/engine/network/drivers/bridge/)

[Docker Docs | User-Defined Networks](https://docs.docker.com/engine/network/#user-defined-networks)

[Docker Communication Between Containers](https://medium.com/rexven/docker-communication-between-containers-bridge-network-driver-bcbce6b3432a)

   
#### Financeapp.Server

1. Create a Dockerfile with the following contents
   ([source](https://github.com/dotnet/dotnet-docker/blob/main/samples/aspnetapp/Dockerfile)):

    ```dockerfile
   FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
   ARG TARGETARCH
   WORKDIR /source
   
   # ORIGINAL CODE:
   # Copy project file and restore as distinct layers
   # COPY --link *.csproj .
   # RUN dotnet restore -a $TARGETARCH
   #
   # Copy source code and publish app
   #COPY --link . .
   #RUN dotnet publish -a $TARGETARCH -o /app # --no-restore
   
   # UPDATED CODE:
   # NOTE: The ORIGINAL CODE breaks when defining an alternative platform using buildx.
   # To solve this, copy the entire source directory and publish the application in a single step.
   # This ensures a clean restore and publish that's correctly targeted.
   # The `dotnet publish` command automatically performs a restore if it's needed.
   # The `dotnet restore` command automatically downloads and rebuilds declared dependencies from the `.csproj` file."
   COPY --link . .
   RUN dotnet publish -a $TARGETARCH -o /app # --no-restore
   
   # Runtime stage
   # Use the smaller ASP.NET runtime image for the final stage.
   FROM mcr.microsoft.com/dotnet/aspnet:8.0
   EXPOSE 8080
   WORKDIR /app
   COPY --link --from=build /app .
   USER $APP_UID
   ENTRYPOINT ["./FinanceApp.Server"]
    ```

   ***Note 1:*** The Dockerfile was modified to make it compatible with `docker buildx` (See Step 2, Note 1).
   Otherwise, uncomment the section `ORIGINAL CODE` and remove `UPDATED CODE`.
   
2. **Build the container:**

   ```bash
   docker buildx build \
   --platform linux/amd64 \
   --tag financeapp.server \
   <PROJECT_DIR_PATH>
   ```
   ***Note 1:*** The `docker buildx` [command](https://docs.docker.com/reference/cli/docker/buildx/) only needs to be used
   if your local system does not match the specified platform, i.e., `linux/amd64`. Otherwise, just run `docker build`.

   ***Note 2:*** `<PROJECT_DIR_PATH>` is the path to the directory containing the `Dockerfile` and source code.
   If executing the command from that directory, replace it with `.`, i.e., "local directory".

3. **Run the container:**

   ```bash
   docker run \
   --platform linux/amd64 \
   --restart always \
   --name financeapp-server \
   --network financeapp-network \
   --detach \
   financeapp.server
   ```

   **Note 1:** In order to send requests to the server from other containers, it's crucial to set the container name.
   This will be the DNS name of your container on the bridge network, otherwise you will have to use `<CONTAINER_ID>`
   or `<IP_ADDRESS>`, which are subject to change with each deployment.

4. **Get the container metadata to confirm if the container launched successfully:**

    ```bash
    docker ps
    ```
   
#### Financeapp.Server Setup Sources

[Overview of SPAs](https://learn.microsoft.com/en-us/aspnet/core/client-side/spa/intro?view=aspnetcore-8.0)

[Create an ASP.NET Core app with React](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react?view=vs-2022)

[NET-8-CLI-Templates-for-React](https://developercommunity.visualstudio.com/t/NET-8-CLI-Templates-for-React-Angular/10523527)

[microsoft.javascript.templates](https://www.nuget.org/packages/microsoft.javascript.templates/)

[.NET With React in Rider](https://rider-support.jetbrains.com/hc/en-us/community/posts/5023374925586--Net-With-React-two-seperate-projects)

[Dotnet Docker](https://github.com/dotnet/dotnet-docker/tree/main)

#### financeapp.client

1. Create a Dockerfile with the following contents:

    ```dockerfile
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
    ```

2. Build the container:

    ```bash
    docker buildx build \
    --platform linux/amd64 \
    --build-arg SERVER_ADDRESS="http://financeapp-server:8080" \
    --tag financeapp.client \
    <PROJECT_DIR_PATH> 
    ```
   **Note:** The `docker buildx` [command](https://docs.docker.com/reference/cli/docker/buildx/) only needs to be used
   if your local system does not match the specified platform, i.e., `linux/amd64`.

   **Note:** `<PROJECT_DIR_PATH>` is the path to the directory containing the `Dockerfile` and source code. 
   If executing the command from said directory, replace it with `.`, i.e., "this directory".

3. Run the container:

    ```bash
    docker run \
    --platform linux/amd64 \
    --restart always \
    --name financeapp-client \
    --network financeapp-network \
    --publish 127.0.0.1:3000:3000 \
    --detach \
    financeapp.client
    ```

4. Get the container metadata to confirm if the container launched successfully:

    ```bash
    docker ps
    ```

#### financeapp.client Setup Sources

[How to Dockerize a React App](https://www.docker.com/blog/how-to-dockerize-react-app/)

[Dockerized React Application Built with Vite](https://thedkpatel.medium.com/dockerizing-react-application-built-with-vite-a-simple-guide-4c41eb09defa)

[Vite | Building for Production](https://vite.dev/guide/build.html)