variable "DOTNET_VERSION" {
  type = string
  default = "8.0"
}

variable "NODE_VERSION" {
  type = string
  default = "24"
}

variable "SERVER_PROTOCOL" {
  type = string
  default = "http"
}

variable "SERVER_PORT" {
  type = string 
  default = "8080"
}

variable "SERVER_URL" {
  type = string
  default = "${SERVER_PROTOCOL}://financeapp-server:${SERVER_PORT}"
}

group "financeapp" {
  targets = ["financeapp-server", "financeapp-client"]
}

target "financeapp-server"  {
  args = {
    DOTNET_VERSION=DOTNET_VERSION
    PROTOCOL=SERVER_PROTOCOL
    PORT=SERVER_PORT
  }
  context = "./FinanceApp.Server"
  dockerfile = "Dockerfile"
  platforms = [
    "linux/amd64"
  ]
  tags = [
    "financeapp.server:latest"
  ]
}

target "financeapp-client"  {
  args = {
    NODE_VERSION=NODE_VERSION
    SERVER_URL=SERVER_URL
  }
  context = "./financeapp.client"
  dockerfile = "Dockerfile"
  platforms = [
    "linux/amd64"
  ]
  tags = [
    "financeapp.client:latest"
  ]
}
