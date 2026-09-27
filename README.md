# 🏡 Nilayam — Full-Stack Airbnb-Style Rental Platform

**Nilayam** is a full-stack accommodation marketplace inspired by platforms such as Airbnb. Users can discover properties, view detailed listings, authenticate securely, create reservations, and manage their bookings.

The project goes beyond application development by covering the complete delivery lifecycle:

**Full-Stack Development → PostgreSQL → Docker → AWS → Terraform → CI/CD → Kubernetes**

Built with **Next.js, TypeScript, PostgreSQL, Prisma, Docker, AWS, Terraform, GitHub Actions, and Kubernetes**, Nilayam demonstrates modern full-stack development together with cloud deployment, Infrastructure as Code, containerisation, automated deployment, and container orchestration.

---

## 🚀 Live Application

**Production:**
http://nilayam-alb-1594002907.ap-southeast-2.elb.amazonaws.com

The production application is deployed on:

- Amazon ECS
- AWS Fargate
- Application Load Balancer
- Amazon ECR
- Neon PostgreSQL

> **Note:** The current production URL uses HTTP. HTTPS and a custom domain are planned future improvements.

---

# 📸 Application Preview

![Nilayam – Full-Stack Airbnb-Style Rental Platform](./screenshots/nilayam-home.png)

# 📌 Project Overview

Nilayam provides a complete accommodation-booking experience.

### Core Features

- User registration
- User authentication
- User login and logout
- Property listing creation
- Property discovery
- Property categories
- Property detail pages
- Image galleries
- Location information
- Guest information
- Room information
- Bathroom information
- Price-per-night information
- Reservation creation
- Reservation management
- Reservation cancellation
- Responsive user interface
- PostgreSQL persistence

### Google Sign-In

Google Sign-In is currently unavailable on the deployed AWS version because the application uses an AWS Application Load Balancer URL instead of a custom domain. Google does not accept the AWS ALB hostname as an authorised OAuth redirect domain, resulting in a `redirect_uri_mismatch` error.

Email/password sign-in is fully functional.

### Engineering Features

- Docker containerisation
- AWS cloud deployment
- Infrastructure as Code with Terraform
- Automated CI/CD with GitHub Actions
- Amazon ECR image registry
- Amazon ECS/Fargate deployment
- Application Load Balancer
- AWS VPC networking
- Security Groups
- IAM
- Local Kubernetes deployment
- Kubernetes Deployments
- Kubernetes Services
- Kubernetes Secrets

---

# 🛠️ Technology Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **date-fns**

## Backend

- **Next.js Server Actions**
- **NextAuth**
- **Prisma ORM**
- **Node.js**

## Database

- **PostgreSQL**
- **Neon PostgreSQL**

## Containerisation

- **Docker**
- **Docker Desktop**

## AWS

- **Amazon ECR**
- **Amazon ECS**
- **AWS Fargate**
- **Application Load Balancer**
- **Amazon VPC**
- **Security Groups**
- **IAM**

## Infrastructure as Code

- **Terraform**

## CI/CD

- **GitHub Actions**

## Kubernetes

- **Kubernetes**
- **Docker Desktop Kubernetes**
- **kind-based local cluster**
- **Deployments**
- **Pods**
- **Services**
- **Secrets**

---

# 🏗️ Architecture

## Production Architecture

```text
                         Internet
                            │
                            ▼
                 ┌─────────────────────┐
                 │   AWS ALB           │
                 │   HTTP :80          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   ECS Service       │
                 │   AWS Fargate       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Nilayam Container │
                 │   Next.js :3000     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Neon PostgreSQL   │
                 └─────────────────────┘
```

### Production Request Flow

```text
User
 │
 ▼
Internet
 │
 ▼
Application Load Balancer
 │
 ▼
ECS Service
 │
 ▼
AWS Fargate Task
 │
 ▼
Nilayam Next.js Container
 │
 ▼
Neon PostgreSQL
```

The Application Load Balancer provides the public entry point while the ECS service runs the containerised application on AWS Fargate.

---

# ☁️ AWS Infrastructure

Nilayam's AWS infrastructure is managed using **Terraform**.

### AWS Resources

```text
AWS
 │
 ├── VPC
 │
 ├── Subnets
 │
 ├── Security Groups
 │
 ├── Amazon ECR
 │
 ├── ECS Cluster
 │
 ├── ECS Service
 │
 ├── ECS Task Definition
 │
 ├── AWS Fargate
 │
 ├── Application Load Balancer
 │
 ├── Target Group
 │
 ├── ALB Listener
 │
 └── IAM Execution Role
```

### AWS Architecture

```text
                         AWS
                          │
          ┌───────────────┴───────────────┐
          │                               │
         VPC                             ECR
          │                               │
     ┌────┴────┐                          │
     │         │                          │
 Subnet     Subnet                        │
     │         │                          │
     └────┬────┘                          │
          │                               │
          ▼                               │
     ECS Cluster ◄────────────────────────┘
          │
          ▼
     ECS Service
          │
          ▼
      Fargate Task
          │
          ▼
     Nilayam :3000
          ▲
          │
   Target Group
          ▲
          │
         ALB
          ▲
          │
       Internet
```

---

# 🔄 CI/CD Pipeline

Every push to the `main` branch triggers the GitHub Actions deployment workflow.

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Checkout repository
    │
    ├── Configure AWS credentials
    │
    ├── Login to Amazon ECR
    │
    ├── Build Docker image
    │
    ├── Push image to ECR
    │
    ├── Download current ECS task definition
    │
    ├── Update container image
    │
    └── Deploy new task definition
            │
            ▼
      ECS / Fargate
            │
            ▼
   Application Load Balancer
            │
            ▼
         Nilayam
```

Docker images are tagged using the **GitHub commit SHA**.

This means each deployment can be traced back to the exact source commit that produced the image.

### Deployment Pipeline

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ▼
Docker Build
   │
   ▼
Amazon ECR
   │
   ▼
ECS Task Definition
   │
   ▼
ECS / Fargate
   │
   ▼
Application Load Balancer
   │
   ▼
Production
```

---

# 🐳 Docker

Nilayam is containerised using Docker.

The Docker image contains:

- Node.js
- Next.js application
- Prisma Client
- Application dependencies
- Production build

The Dockerfile does **not** contain database credentials.

## Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Build Locally

```bash
docker build -t nilayam:latest .
```

## Run Locally

```bash
docker run --env-file .env -p 3000:3000 nilayam:latest
```

Open:

```text
http://localhost:3000
```

---

# 🗄️ Database

Nilayam uses **PostgreSQL hosted by Neon**.

**Prisma ORM** is used for:

- Database access
- Schema definition
- Prisma Client generation
- Database migrations
- Relational data modelling

## Main Data Model

```text
User
 │
 ├── Account
 │
 ├── Session
 │
 ├── Listing
 │
 └── Reservation
```

```text
Listing
 │
 └── Reservation
```

## Main Entities

### User

Stores user accounts and authentication-related information.

### Listing

Stores accommodation information including:

- Title
- Description
- Images
- Category
- Guest count
- Room count
- Bathroom count
- Location
- Price per night
- Host

### Reservation

Stores:

- User
- Listing
- Start date
- End date
- Total price
- Creation date

---

# 🔐 Environment Variables

Sensitive configuration is kept outside the application source code.

Example:

```env
DATABASE_URL=your_database_connection_string
```

Authentication-related environment variables may also be required depending on the configured authentication providers.

> **Important:** Never commit `.env` to Git.

Environment-specific credentials are supplied at runtime rather than being stored in the application source code or the cleaned Docker image.

---

# 🔑 Kubernetes Secrets

The local Kubernetes deployment uses a **Kubernetes Secret** for sensitive environment variables.

Create the Secret from the local `.env` file:

```bash
kubectl create secret generic nilayam-secrets \
  --from-env-file=.env
```

The Secret is intentionally **not committed to GitHub**.

The Kubernetes Deployment references the Secret:

```yaml
envFrom:
  - secretRef:
      name: nilayam-secrets
```

This separates:

```text
Application Code
       │
       ▼
Docker Image
       │
       ▼
Kubernetes Deployment
       │
       ├──────────────► Application
       │
       └──────────────► Kubernetes Secret
                              │
                              ▼
                       Runtime Variables
```

Sensitive runtime configuration is therefore kept outside the Docker image and Kubernetes YAML manifests.

---

# ☸️ Kubernetes

Nilayam can also be deployed locally using Kubernetes through Docker Desktop.

The current Kubernetes environment is intentionally **local and cost-conscious**.

```text
Docker Desktop
      │
      ▼
Kubernetes Cluster
      │
      ▼
Deployment
      │
      ▼
Pod
      │
      ▼
Nilayam Container
```

The local cluster uses a single-node **kind-based Kubernetes cluster** provided through Docker Desktop.

Kubernetes is currently used for **learning, development and container-orchestration practice**, rather than production.

Production remains on AWS ECS/Fargate.

---

# 📦 Kubernetes Deployment

The Kubernetes Deployment manages the Nilayam application Pod.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nilayam
spec:
  replicas: 1
```

The Deployment maintains the desired number of running Pods.

### Deployment responsibilities

- Manages Pods
- Maintains desired replicas
- Recreates failed Pods
- Provides declarative workload management
- Supports rolling updates

---

# 🌐 Kubernetes Service

The Nilayam Service provides Kubernetes networking for the application.

```text
Kubernetes Service
        │
        ▼
Nilayam Pod :3000
```

The project currently uses a **NodePort Service** for local Kubernetes development.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nilayam-service
spec:
  selector:
    app: nilayam
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: NodePort
```

---

# 📁 Kubernetes Files

```text
k8s/
├── deployment.yaml
└── service.yaml
```

---

# ▶️ Running Nilayam on Kubernetes

## 1. Start Docker Desktop Kubernetes

Make sure Docker Desktop Kubernetes is running.

Check the cluster:

```bash
kubectl get nodes
```

Expected:

```text
NAME                    STATUS   ROLES
desktop-control-plane   Ready    control-plane
```

---

## 2. Create the Kubernetes Secret

```bash
kubectl create secret generic nilayam-secrets \
  --from-env-file=.env
```

> Do not commit the generated Secret to Git.

---

## 3. Deploy Nilayam

Apply the Deployment:

```bash
kubectl apply -f k8s/deployment.yaml
```

Apply the Service:

```bash
kubectl apply -f k8s/service.yaml
```

---

## 4. Check Pods

```bash
kubectl get pods
```

Expected:

```text
NAME                       READY   STATUS
nilayam-xxxxxxxxxx-xxxxx   1/1     Running
```

---

## 5. Check the Service

```bash
kubectl get services
```

Expected:

```text
NAME              TYPE       PORT(S)
nilayam-service   NodePort   3000:xxxxx/TCP
```

> The NodePort number may vary between environments.

---

## 6. Access Nilayam

Use Kubernetes port forwarding:

```bash
kubectl port-forward service/nilayam-service 3000:3000
```

Then open:

```text
http://localhost:3000
```

---

# 🔄 Kubernetes Application Flow

```text
Docker Image
     │
     ▼
Kubernetes Deployment
     │
     ▼
Nilayam Pod
     │
     ▼
Nilayam Container
     │
     ▼
Kubernetes Service
     │
     ▼
localhost:3000
```

Runtime secrets are supplied separately:

```text
Kubernetes Secret
       │
       ▼
   Nilayam Pod
       │
       ▼
DATABASE_URL
       │
       ▼
Neon PostgreSQL
```

---

# 🏗️ Terraform

Terraform is used to manage the AWS infrastructure as code.

Instead of manually creating AWS resources through the AWS Console, infrastructure is defined in Terraform configuration files.

Terraform manages resources including:

- VPC
- Subnets
- Security Groups
- Amazon ECR
- ECS Cluster
- ECS Service
- ECS Task Definition
- Application Load Balancer
- Target Group
- ALB Listener
- IAM configuration

## Terraform Workflow

```bash
terraform init
```

```bash
terraform plan
```

```bash
terraform apply
```

Terraform state files are excluded from Git.

```gitignore
terraform/.terraform/
terraform/*.tfstate
terraform/*.tfstate.*
```

---

# 🔁 GitHub Actions CI/CD

The project includes an automated deployment workflow:

```text
.github/workflows/deploy.yml
```

A push to `main` automatically:

1. Checks out the repository
2. Configures AWS credentials
3. Logs into Amazon ECR
4. Builds the Docker image
5. Pushes the image to ECR
6. Downloads the current ECS task definition
7. Updates the container image
8. Deploys the new task definition to ECS
9. Waits for ECS service stability

### Complete CI/CD Flow

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Checkout
   │
   ├── AWS Authentication
   │
   ├── ECR Login
   │
   ├── Docker Build
   │
   └── Docker Push
          │
          ▼
       Amazon ECR
          │
          ▼
   ECS Task Definition
          │
          ▼
     ECS / Fargate
          │
          ▼
 Application Load Balancer
          │
          ▼
       Nilayam
```

AWS credentials used by GitHub Actions are stored as **GitHub repository secrets** rather than committed to the repository.

---

# 🛡️ Security

Security considerations implemented in the project include:

- Environment variables are kept outside source code
- `.env` is excluded from Git
- Kubernetes Secrets are used for sensitive local runtime configuration
- Database credentials are not stored in Kubernetes YAML
- Database credentials are not baked into the cleaned Docker image
- AWS credentials are stored as GitHub Actions secrets
- ECS security groups restrict application traffic
- Direct public access to the ECS application port was removed
- Application traffic enters through the Application Load Balancer

### Traffic Security Model

```text
Internet
   │
   ▼
ALB :80
   │
   │ Allowed
   ▼
ECS Security Group
   │
   ▼
Fargate Task :3000
```

The application container is not intended to be directly exposed to the internet on port `3000`.

---

# 📁 Project Structure

```text
Nilayam-FullStack-NextJS-AWS/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── generated/
│   └── lib/
│
├── terraform/
│   └── *.tf
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
```

---

# 💻 Local Development

## Requirements

Install:

- Node.js
- npm
- Docker Desktop
- kubectl
- Git

For Kubernetes development:

- Docker Desktop Kubernetes

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create:

```text
.env
```

Add the required environment variables.

Example:

```env
DATABASE_URL=your_database_connection_string
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migrations

```bash
npx prisma migrate dev
```

---

## Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Useful Commands

## Next.js

Start development server:

```bash
npm run dev
```

Build application:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## Docker

List images:

```bash
docker images
```

List running containers:

```bash
docker ps
```

Build application:

```bash
docker build -t nilayam:latest .
```

Run application:

```bash
docker run --env-file .env -p 3000:3000 nilayam:latest
```

---

## Kubernetes

Check cluster:

```bash
kubectl cluster-info
```

Check nodes:

```bash
kubectl get nodes
```

Check Pods:

```bash
kubectl get pods
```

Check Services:

```bash
kubectl get services
```

Check Deployments:

```bash
kubectl get deployments
```

Check Pod logs:

```bash
kubectl logs deployment/nilayam
```

Check Deployment status:

```bash
kubectl rollout status deployment/nilayam
```

Restart a Deployment:

```bash
kubectl rollout restart deployment/nilayam
```

Describe a Pod:

```bash
kubectl describe pod <pod-name>
```

Forward the Service to localhost:

```bash
kubectl port-forward service/nilayam-service 3000:3000
```

---

# 📊 Deployment Environments

| Environment | Platform                  | Purpose                         |
| ----------- | ------------------------- | ------------------------------- |
| Local       | Next.js                   | Application development         |
| Local       | Docker                    | Container testing               |
| Local       | Kubernetes                | Kubernetes learning and testing |
| AWS         | Amazon ECR                | Container image registry        |
| AWS         | ECS/Fargate               | Production application          |
| AWS         | Application Load Balancer | Public traffic routing          |
| AWS         | Terraform                 | Infrastructure as Code          |
| GitHub      | GitHub Actions            | CI/CD                           |

---

# 🎯 What This Project Demonstrates

Nilayam demonstrates practical experience across the complete software delivery lifecycle.

## Application Development

- React
- Next.js
- TypeScript
- Server-side functionality
- Authentication
- Database integration
- Responsive UI

## Backend & Data

- PostgreSQL
- Prisma ORM
- Database migrations
- Relational data modelling
- User/listing/reservation relationships

## DevOps

- Docker
- Containerisation
- Amazon ECR
- Amazon ECS
- AWS Fargate
- Application Load Balancer
- Terraform
- GitHub Actions
- CI/CD

## Cloud-Native Development

- Kubernetes
- Pods
- Deployments
- Services
- Secrets
- Container orchestration
- Local Kubernetes development

---

# 🧠 Kubernetes Concepts Practised

The project provides hands-on experience with the fundamental Kubernetes building blocks used by the application.

```text
Kubernetes Cluster
        │
        ▼
       Node
        │
        ├── Deployment
        │       │
        │       ▼
        │      Pod
        │       │
        │       ▼
        │    Container
        │
        ├── Service
        │
        └── Secret
```

The project demonstrates the separation between:

- Application code
- Container images
- Runtime configuration
- Secrets
- Networking
- Workload management

---

# 💰 Cost-Conscious Kubernetes Architecture

Kubernetes is intentionally running **locally** rather than using a paid EKS cluster.

```text
Kubernetes Learning
        │
        ▼
Docker Desktop
        │
        ▼
Local Kubernetes
        │
        ▼
No EKS infrastructure required
```

This provides hands-on Kubernetes experience without creating an Amazon EKS cluster.

### Current Architecture

```text
                    Production
                        │
                        ▼
                 AWS ECS/Fargate
                        │
                        ▼
                 Nilayam Application


                     Learning
                        │
                        ▼
                 Docker Desktop
                        │
                        ▼
                Local Kubernetes
```

**AWS ECS/Fargate remains the production deployment environment.**

---

# 🔮 Future Improvements

Potential future improvements include:

### AWS / Production

- HTTPS with AWS Certificate Manager
- Custom domain with Route 53
- Private ECS subnets
- NAT Gateway architecture
- CloudWatch monitoring
- Centralised application logging
- ECS autoscaling

### Kubernetes

- Kubernetes readiness probes
- Kubernetes liveness probes
- Resource requests and limits
- Horizontal Pod Autoscaling
- Kubernetes Ingress
- Production Kubernetes deployment with Amazon EKS

### CI/CD

- Automated testing in CI/CD
- Automated database migration strategy

### Observability

- Application metrics
- Infrastructure monitoring
- Centralised logs
- Health monitoring

---

# 🧭 Project Journey

Nilayam was developed progressively through the following engineering stages:

```text
1. Full-Stack Application
          │
          ▼
2. PostgreSQL + Prisma
          │
          ▼
3. Docker
          │
          ▼
4. Amazon ECR
          │
          ▼
5. Amazon ECS / Fargate
          │
          ▼
6. Application Load Balancer
          │
          ▼
7. Terraform
          │
          ▼
8. GitHub Actions CI/CD
          │
          ▼
9. Kubernetes
          │
          ▼
10. Kubernetes Secrets
```

This progression demonstrates how a modern full-stack application can move from local development to:

**Application Development → Containerisation → Infrastructure as Code → Cloud Deployment → CI/CD → Container Orchestration**

---

# 🏆 Engineering Outcomes

By completing Nilayam, the project demonstrates practical experience with:

### Full-Stack Engineering

```text
Next.js
   +
React
   +
TypeScript
   +
PostgreSQL
   +
Prisma
```

### Containerisation

```text
Application
    │
    ▼
Docker Image
    │
    ▼
Container
```

### AWS Deployment

```text
Docker Image
     │
     ▼
Amazon ECR
     │
     ▼
ECS
     │
     ▼
Fargate
     │
     ▼
Application Load Balancer
     │
     ▼
Internet
```

### Infrastructure as Code

```text
Terraform
    │
    ├── VPC
    ├── Subnets
    ├── Security Groups
    ├── ECR
    ├── ECS
    ├── Fargate
    ├── ALB
    └── IAM
```

### CI/CD

```text
Git Push
    │
    ▼
GitHub Actions
    │
    ▼
Docker Build
    │
    ▼
Amazon ECR
    │
    ▼
ECS Deployment
```

### Kubernetes

```text
Cluster
   │
   ▼
Node
   │
   ├── Deployment
   │      │
   │      ▼
   │     Pod
   │      │
   │      ▼
   │   Container
   │
   ├── Service
   │
   └── Secret
```

---

# 👨‍💻 Author

## Sai Chaitanya Gaddam

**Full-Stack Developer | Cloud & DevOps Enthusiast**

### Technologies

- JavaScript
- TypeScript
- React
- Next.js
- Python
- Django
- Node.js
- PostgreSQL
- Prisma
- Docker
- AWS
- Terraform
- GitHub Actions
- Kubernetes

---

# ⭐ Project Goal

Nilayam was built not only as a full-stack application, but as an **end-to-end engineering project** covering the complete path from development to cloud deployment.

```text
Build
  │
  ▼
Containerise
  │
  ▼
Infrastructure as Code
  │
  ▼
Cloud Deployment
  │
  ▼
CI/CD
  │
  ▼
Container Orchestration
  │
  ▼
Production Architecture
```

The goal is to demonstrate how a modern full-stack application can be:

- Developed
- Containerised
- Connected to a production database
- Provisioned using Infrastructure as Code
- Deployed to AWS
- Automated through CI/CD
- Exposed through an Application Load Balancer
- Orchestrated locally using Kubernetes

---

# 🚀 Final Architecture

```text
                         USER
                          │
                          ▼
                     INTERNET
                          │
                          ▼
              ┌──────────────────────┐
              │ Application Load     │
              │ Balancer             │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ ECS Service          │
              │ AWS Fargate          │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Nilayam              │
              │ Next.js Container    │
              │ Port 3000            │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Neon PostgreSQL      │
              └──────────────────────┘


     Infrastructure
          │
          ▼
       Terraform
          │
          ▼
       AWS Resources


     Deployment
          │
          ▼
    GitHub Actions
          │
          ▼
       Docker
          │
          ▼
     Amazon ECR
          │
          ▼
     ECS / Fargate


     Kubernetes Learning
          │
          ▼
    Docker Desktop
          │
          ▼
   Local Kubernetes
          │
          ├── Deployment
          ├── Pod
          ├── Service
          └── Secret
```

---

## 📌 What Nilayam Represents

Nilayam represents the progression from a **full-stack web application** into a **cloud-deployed, containerised and automated engineering project**.

The project combines:

**Software Development + Database Engineering + Docker + AWS + Infrastructure as Code + CI/CD + Kubernetes**

It demonstrates not just how to build an application, but how to **package, provision, deploy, automate and operate it across modern development and cloud environments.**

---

**Built with ❤️ by Sai Chaitanya Gaddam**
