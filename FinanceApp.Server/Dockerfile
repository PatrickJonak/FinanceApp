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
