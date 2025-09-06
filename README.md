# FinanceApp
GenAI-native web app for budgeting, tracking, and finance.

## Project Setup

This section explains how to set up and run the application. [Docker Bake and Compose Setup](#docker-bake-and-compose-setup) 
is the preferred method. [Docker Manual Setup](#docker-manual-setup) is intended for reference only. 
Once the setup is complete, the application should be available at http://localhost:3000.

### Prerequisites

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) (If using Windows > 10)
3. [git](https://git-scm.com/downloads)

> ***Note:*** If running on Windows, it is recommended to run all following commands on WSL.

### Download Repository

```bash
git clone https://github.com/PatrickJonak/FinanceApp.git
```

### Docker Bake and Compose Setup

> ***Note:*** Execute the following commands from the project root directory `FinanceApp`.

1. **To build the service ensure that the [docker-bake.hcl](./docker-bake.hcl) container build configuration file 
   is present in the project root directory `Financeapp`, then execute:**

   ```bash
   docker buildx bake financeapp
   ```
   
2. **To run the service, ensure that the [compose.yaml](./compose.yaml) container run configuration file 
   is present in the project root directory `Financeapp`, then execute:**

   ```bash
    docker compose up --detach
   ```

3. **To stop the service, without removing:**

   ```bash
    docker compose stop
   ```
   
4. **To start the service again:**

   ```bash
    docker compose start
   ```

5. **To check the status of the service:**

   ```bash
    docker compose ps
   ```

6. **To monitor the log output:**
   
   ```bash
   docker compose logs
   ```

7. **To stop and remove the service:**

   ```bash
    docker compose down
   ```

#### Docker Bake Setup Sources

[Introduction to Bake](https://docs.docker.com/build/bake/introduction/)

[Bake File Reference](https://docs.docker.com/build/bake/reference/)

[Overriding Configurations](https://docs.docker.com/build/bake/reference/)

#### Docker Compose Setup Sources

[How Docker Compose Works](https://docs.docker.com/compose/intro/compose-application-model/)

[Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/)

[Docker Compose File Reference](https://docs.docker.com/reference/compose-file/)

[Docker CLI Reference | docker compose](https://docs.docker.com/reference/cli/docker/compose/)

### Docker Manual Setup

#### Bridge Network

> ***Note:*** The bridge network allows for containers to communicate locally in an isolated environment. 
It's crucial for enabling container-to-container communication.

1. **Create the network:**

   ```bash
   docker network create -d bridge financeapp_network-frontend
   ```
2. **List all networks to find `NETWORK ID`:**

   ```bash
   docker network ls
   ```
   
3. **Inspect the network:**

   ```bash
   docker network inspect <NETWORK_ID>
   ```
   
4. **To clean up:**

   ```bash
   docker network rm <NETWORK_ID>
   ```
   
##### Bridge Network Setup Sources

[Docker Docs | Network Drivers](https://docs.docker.com/engine/network/drivers/)

[Docker Docs | Bridge Network Driver](https://docs.docker.com/engine/network/drivers/bridge/)

[Docker Docs | User-Defined Networks](https://docs.docker.com/engine/network/#user-defined-networks)

[Docker Communication Between Containers](https://medium.com/rexven/docker-communication-between-containers-bridge-network-driver-bcbce6b3432a)

   
#### Financeapp.Server

1. **Ensure that the [Dockerfile](./FinanceApp.Server/Dockerfile) is present in `Financeapp/Financeapp.Server`, 
   then build the container:**

   ```bash
   docker buildx build \
   --build-arg DOTNET_VERSION=<PROJECT_DOTNET_VERSION> \
   --build-arg PROTOCOL="http" \
   --build-arg PORT="8080" \
   --platform linux/amd64 \
   --tag financeapp.server \
   <PROJECT_DIR_PATH>
   ```
   >***Note 1:*** The `docker buildx` [command](https://docs.docker.com/reference/cli/docker/buildx/) only needs to be 
   used if your local system does not match the specified platform, i.e., `linux/amd64`.
   Otherwise, you can drop the `buildx` command and the `--platform` flag.

   >***Note 2:*** `<PROJECT_DIR_PATH>` is the path to the directory containing the `Dockerfile` and source code,
   i.e., the `context`. If executing the command from that directory, replace it with `.`, i.e., "local directory".

2. **Run the container:**

   ```bash
   docker run \
   --detach \
   --name financeapp-server \
   --network financeapp_network-frontend \
   --platform linux/amd64 \
   --restart always \
   financeapp.server
   ```

   >**Note 1:** In order to send requests to the server from other containers, it's crucial to set the container name.
   This will be the DNS name of your container on the bridge network, otherwise you will have to use `<CONTAINER_ID>`
   or `<IP_ADDRESS>`, which are subject to change with each deployment.

3. **Get the container metadata to confirm if the container launched successfully:**

    ```bash
    docker ps
    ```
   
##### Financeapp.Server Setup Sources

[ASP.NET Sample Docker Image](https://github.com/dotnet/dotnet-docker/blob/main/samples/aspnetapp/Dockerfile)

[Dotnet Docker](https://github.com/dotnet/dotnet-docker/tree/main)

[Overview of SPAs](https://learn.microsoft.com/en-us/aspnet/core/client-side/spa/intro?view=aspnetcore-8.0)

[Create an ASP.NET Core app with React](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react?view=vs-2022)

[NET-8-CLI-Templates-for-React](https://developercommunity.visualstudio.com/t/NET-8-CLI-Templates-for-React-Angular/10523527)

[microsoft.javascript.templates](https://www.nuget.org/packages/microsoft.javascript.templates/)

[.NET With React in Rider](https://rider-support.jetbrains.com/hc/en-us/community/posts/5023374925586--Net-With-React-two-seperate-projects)

#### financeapp.client

1. **Ensure that the [Dockerfile](./financeapp.client/Dockerfile) is present in `Financeapp/financeapp.client`,
   then build the container:**

    ```bash
     docker buildx build \
    --build-arg NODE_VERSION=<PROJECT_NODE_VERSION> \
    --build-arg SERVER_URL="http://financeapp-server:8080" \
    --platform linux/amd64 \               
    --tag financeapp.client \
    <CONTEXT_DIR_PATH> 
    ```
   >***Note 1:*** The `docker buildx` [command](https://docs.docker.com/reference/cli/docker/buildx/) only needs 
   to be used if your local system does not match the specified platform, i.e., `linux/amd64`. 
   Otherwise, you can drop the `buildx` command and the `--platform` flag.

   >***Note 2:*** `<PROJECT_DIR_PATH>` is the path to the directory containing the `Dockerfile` and source code,
   i.e., the `context`. If executing the command from that directory, replace it with `.`, i.e., "local directory".

   >***Note 3:*** `<SERVER_ADDRESS>` build argument needs to be defined. Otherwise, the client will not know 
   the server endpoint.

2. **Run the container:**

    ```bash
    docker run \
    --platform linux/amd64 \
    --restart always \
    --name financeapp-client \
    --network financeapp_network-frontend \
    --publish 127.0.0.1:3000:3000 \
    --detach \
    financeapp.client
    ```

3. **Get the container metadata to confirm if the container launched successfully:**

    ```bash
    docker ps
    ```

##### financeapp.client Setup Sources

[How to Dockerize a React App](https://www.docker.com/blog/how-to-dockerize-react-app/)

[Dockerized React Application Built with Vite](https://thedkpatel.medium.com/dockerizing-react-application-built-with-vite-a-simple-guide-4c41eb09defa)

[Vite | Building for Production](https://vite.dev/guide/build.html)