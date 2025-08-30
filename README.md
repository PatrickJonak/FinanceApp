# FinanceApp
GenAI-native web app for budgeting, tracking, and finance.

## Project Setup

This section explains how to set up and run the application. [Docker Compose Setup](#docker-compose-setup) 
is the preferred method. [Docker Manual Setup](#docker-manual-setup) is intended for reference only. 


### Prerequisites

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) (If using Windows > 10)
3. [git](https://git-scm.com/downloads)

> ***Note:*** If running on Windows it is recommended to run all following commands on WSL.

### Download Repository

```bash
git clone https://github.com/PatrickJonak/FinanceApp.git
```

### Docker Compose Setup {docker-compose-setup}

1. Create the `compose.yaml` file in the project root directory `Financeapp`with the following contents, 
   if it doesn't exist:

   ```yaml
   services:
      financeapp-server:
        image: financeapp.server
        platform: linux/amd64
        build:
          context: FinanceApp.Server/
          dockerfile: FinanceApp.Server/Dockerfile
        restart: always
        networks:
          - network-frontend
      financeapp-client:
        image: financeapp.client
        platform: linux/amd64
        build:
          context: financeapp.client/
          dockerfile: financeapp.client/Dockerfile
          args:
            - SERVER_ADDRESS="http://financeapp-server:8080"
        restart: always
        ports:
        - "127.0.0.1:3000:3000"
        networks:
        - network-frontend
      
      networks:
        network-frontend:
          driver: bridge
   ```
   
2. To run the service:

   ```bash
    docker compose up --detach
   ```

3. To stop the service, without removing:

   ```bash
    docker compose stop
   ```
   
4. To start the service again:

   ```bash
    docker compose start
   ```
   
5. To check the status of the service:

   ```bash
    docker compose ps
   ```
   
6. To monitor the log output:
   
   ```bash
   docker compose logs
   ```

7. To stop and remove the service:

   ```bash
    docker compose down
   ```

#### Docker Compose Setup Sources

[How Docker Compose Works](https://docs.docker.com/compose/intro/compose-application-model/)

[Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/)

[Docker Compose File Reference](https://docs.docker.com/reference/compose-file/)

[Docker CLI Reference | docker compose](https://docs.docker.com/reference/cli/docker/compose/)

### Docker Manual Setup {docker-manual-setup}

#### Bridge Network

The bridge network allows for containers to communicate locally in an isolated environment. 
It's crucial for enabling container-to-container communication.

1. Create the network:

   ```bash
   docker network create -d bridge financeapp-network-frontend
   ```
2. List all networks to find `NETWORK ID`:

   ```bash
   docker network ls
   ```
   
3. Inspect the network:

   ```bash
   docker network inspect <NETWORK_ID>
   ```
   
##### Bridge Network Setup Sources

[Docker Docs | Network Drivers](https://docs.docker.com/engine/network/drivers/)

[Docker Docs | Bridge Network Driver](https://docs.docker.com/engine/network/drivers/bridge/)

[Docker Docs | User-Defined Networks](https://docs.docker.com/engine/network/#user-defined-networks)

[Docker Communication Between Containers](https://medium.com/rexven/docker-communication-between-containers-bridge-network-driver-bcbce6b3432a)

   
#### Financeapp.Server

1. Create the `Dockerfile` in `Financeapp\Financeapp.Server` with the following contents, if it doesn't exist
   ([source](https://github.com/dotnet/dotnet-docker/blob/main/samples/aspnetapp/Dockerfile)):

   ```dockerfile
   FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
   ARG TARGETARCH
   WORKDIR /source
   
   # Copy project file and restore as distinct layers
   COPY --link *.csproj .
   RUN dotnet restore -a $TARGETARCH
   
   # Copy source code and publish app
   # Removed `--no-restore` flag from `dotnet publish`
   # Ensures the dependencies are built correctly when using an alternative platform with buildx.
   COPY --link . .
   RUN dotnet publish -a $TARGETARCH -o /app
   
   # Runtime stage
   # Use the smaller ASP.NET runtime image for the final stage.
   FROM mcr.microsoft.com/dotnet/aspnet:8.0
   EXPOSE 8080
   WORKDIR /app
   COPY --link --from=build /app .
   USER $APP_UID
   ENTRYPOINT ["./FinanceApp.Server"]
   ```
   
2. **Build the container:**

   ```bash
   docker buildx build \
   --platform linux/amd64 \
   --tag financeapp.server \
   <PROJECT_DIR_PATH>
   ```
   >***Note 1:*** The `docker buildx` [command](https://docs.docker.com/reference/cli/docker/buildx/) only needs to be 
   used if your local system does not match the specified platform, i.e., `linux/amd64`. 
   Otherwise, just run `docker build`.

   >***Note 2:*** `<PROJECT_DIR_PATH>` is the path to the directory containing the `Dockerfile` and source code,
   i.e., the `context`. If executing the command from that directory, replace it with `.`, i.e., "local directory".

3. **Run the container:**

   ```bash
   docker run \
   --platform linux/amd64 \
   --restart always \
   --name financeapp-server \
   --network financeapp-network-frontend \
   --detach \
   financeapp.server
   ```

   >**Note 1:** In order to send requests to the server from other containers, it's crucial to set the container name.
   This will be the DNS name of your container on the bridge network, otherwise you will have to use `<CONTAINER_ID>`
   or `<IP_ADDRESS>`, which are subject to change with each deployment.

4. **Get the container metadata to confirm if the container launched successfully:**

    ```bash
    docker ps
    ```
   
##### Financeapp.Server Setup Sources

[Overview of SPAs](https://learn.microsoft.com/en-us/aspnet/core/client-side/spa/intro?view=aspnetcore-8.0)

[Create an ASP.NET Core app with React](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react?view=vs-2022)

[NET-8-CLI-Templates-for-React](https://developercommunity.visualstudio.com/t/NET-8-CLI-Templates-for-React-Angular/10523527)

[microsoft.javascript.templates](https://www.nuget.org/packages/microsoft.javascript.templates/)

[.NET With React in Rider](https://rider-support.jetbrains.com/hc/en-us/community/posts/5023374925586--Net-With-React-two-seperate-projects)

[Dotnet Docker](https://github.com/dotnet/dotnet-docker/tree/main)

#### financeapp.client

1. Create the `Dockerfile` in `Financeapp\financeapp.client` with the following contents, if it doesn't exist:

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
   >**Note:** The `docker buildx` [command](https://docs.docker.com/reference/cli/docker/buildx/) only needs to be used
   if your local system does not match the specified platform, i.e., `linux/amd64`.

   >***Note 2:*** `<PROJECT_DIR_PATH>` is the path to the directory containing the `Dockerfile` and source code,
   i.e., the `context`. If executing the command from that directory, replace it with `.`, i.e., "local directory".

   >***Note 3:*** `<SERVER_ADDRESS>` build argument needs to be defined. Otherwise, the client will not know the endpoint
   of the server.

3. Run the container:

    ```bash
    docker run \
    --platform linux/amd64 \
    --restart always \
    --name financeapp-client \
    --network financeapp-network-frontend \
    --publish 127.0.0.1:3000:3000 \
    --detach \
    financeapp.client
    ```

4. Get the container metadata to confirm if the container launched successfully:

    ```bash
    docker ps
    ```

##### financeapp.client Setup Sources

[How to Dockerize a React App](https://www.docker.com/blog/how-to-dockerize-react-app/)

[Dockerized React Application Built with Vite](https://thedkpatel.medium.com/dockerizing-react-application-built-with-vite-a-simple-guide-4c41eb09defa)

[Vite | Building for Production](https://vite.dev/guide/build.html)