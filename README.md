# Nilayam — Full-Stack Rental Platform

A production-deployed, full-stack accommodation marketplace built with **Next.js, TypeScript, React, Node.js, PostgreSQL, Prisma, Docker, AWS, Terraform, GitHub Actions, and Kubernetes**.

Nilayam demonstrates the complete software delivery lifecycle — from application development and database design through containerisation, Infrastructure as Code, automated testing, CI/CD, cloud deployment, and container orchestration.

## 🚀 Live Application

**Production:**  
http://nilayam-alb-1594002907.ap-southeast-2.elb.amazonaws.com

### Production Environment

- Amazon ECS
- AWS Fargate
- Application Load Balancer
- Amazon ECR
- Neon PostgreSQL

> **Note:** The current production endpoint uses HTTP. HTTPS and a custom domain are planned improvements.

---

## 📌 What Nilayam Does

Nilayam is an Airbnb-style accommodation marketplace where users can:

- Create accounts and authenticate
- Browse and search property listings
- View detailed property information
- Create and manage reservations
- Cancel reservations
- Manage property listings
- View images, locations, pricing and accommodation details
- Use a responsive web interface

### Authentication

- Email/password authentication is functional.
- Google Sign-In is implemented but is currently unavailable in the deployed AWS environment because the Application Load Balancer hostname is not configured as an authorised Google OAuth redirect domain.

---

## 🛠️ Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- Next.js Server Actions
- Node.js
- NextAuth
- Prisma ORM

### Database

- PostgreSQL
- Neon PostgreSQL
- Prisma migrations
- Relational data modelling

### Cloud & Infrastructure

- AWS VPC
- Amazon ECS
- AWS Fargate
- Amazon ECR
- Application Load Balancer
- Security Groups
- IAM
- Terraform

### DevOps & Containers

- Docker
- GitHub Actions
- GitHub Actions CI/CD
- Vitest
- Playwright
- Testing Library
- Kubernetes
- Kubernetes Secrets

---

## 🏗️ Architecture

### Production Architecture

```text
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
Next.js Container :3000
   │
   ▼
Neon PostgreSQL
```

The Application Load Balancer provides the public entry point, while ECS/Fargate runs the containerised application.

### AWS Infrastructure

```text
AWS
├── VPC
│   └── Subnets
├── Security Groups
├── Amazon ECR
├── ECS Cluster
│   └── ECS Service
│       └── Fargate Task
├── Application Load Balancer
│   ├── Listener
│   └── Target Group
└── IAM Execution Role
```

Infrastructure is defined and managed with Terraform rather than relying solely on manual AWS Console configuration.

---

## 🔄 CI/CD Pipeline

Nilayam uses **GitHub Actions to automate testing and deployment**. The workflow is defined in `.github/workflows/deploy.yml`.

Automated tests run on pushes to `main` and pull requests. The deployment job is configured to run on pushes to `main` and depends on the test job succeeding.

### Pipeline Workflow

```text
Code Changes
     │
     ▼
Git Push / Pull Request
     │
     ▼
GitHub Actions
     │
     ▼
Install Dependencies
     │
     ▼
Generate Prisma Client
     │
     ▼
Run Vitest Tests
     │
     ▼
Install Playwright Chromium
     │
     ▼
Run End-to-End Tests
     │
     ▼
Tests Pass?
     │
     ├── No ──► Deployment Blocked
     │
     └── Yes
           │
           ▼
      Main Branch Push?
           │
           ▼
      Build Docker Image
           │
           ▼
      Authenticate with AWS
           │
           ▼
      Push Image to Amazon ECR
           │
           ▼
      Update ECS Task Definition
           │
           ▼
      Deploy to ECS / Fargate
           │
           ▼
      Application Load Balancer
           │
           ▼
      Live Nilayam Application
```

### Automated Testing

**Unit and integration tests**

Vitest is used to test application logic, including booking rules, date utilities and integration-related logic.

**End-to-end testing**

Playwright with Chromium is used to test the application through a browser. The current end-to-end suite includes a homepage smoke test.

**Prisma Client generation**

Prisma Client is generated during dependency installation using the `postinstall` script in `package.json`. The Docker build also explicitly generates Prisma Client before building the production application.

**Deployment gate**

The deployment job depends on the automated test job. If the test job fails, the deployment job does not proceed.

### Run Tests Locally

Run the Vitest suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run the Playwright end-to-end suite:

```bash
npm run test:e2e
```

### Build the Docker Image

```bash
docker build -t nilayam:latest .
```

### CI/CD Verification

The GitHub Actions workflow completed successfully for commit `fc3842d`, including the automated test and deployment jobs. The deployed application was subsequently checked and confirmed to be working.

Docker images are tagged using the GitHub commit SHA, allowing deployments to be traced back to the source commit that produced them.

AWS credentials are stored as GitHub repository secrets rather than committed to the repository.

---

## 🐳 Docker

Nilayam is packaged as a production Docker image containing:

- Node.js
- Next.js application
- Prisma Client
- Application dependencies
- Production build

The Docker image does not contain database credentials.

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

The Prisma schema and configuration are copied before `npm ci` because the installation process runs Prisma Client generation through the `postinstall` script.

### Run Locally

Build the image:

```bash
docker build -t nilayam:latest .
```

Run the container with local environment variables configured in `.env`:

```bash
docker run --env-file .env -p 3000:3000 nilayam:latest
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🗄️ Database

Nilayam uses **PostgreSQL hosted on Neon**, with Prisma providing the application data layer.

Prisma is used for:

- Database access
- Schema definition
- Client generation
- Migrations
- Relational data modelling

### Core Relationships

```text
User
├── Account
├── Session
├── Listing
└── Reservation

Listing
└── Reservation
```

Reservations connect users with listings and store booking dates, pricing and creation information.

---

## 🔐 Security & Configuration

Sensitive configuration is kept outside the application source code.

Implemented practices include:

- `.env` excluded from Git
- Runtime environment variables
- Kubernetes Secrets for local Kubernetes deployment
- Database credentials excluded from Docker images
- AWS credentials stored as GitHub Actions secrets
- ECS Security Groups controlling application traffic
- Public access routed through the Application Load Balancer rather than directly exposing the application container port

### Runtime Configuration

```text
Application Code
      │
      ▼
Docker Image
      │
      ▼
Runtime Environment
      │
      ├── AWS ECS / Fargate
      └── Kubernetes Secret
```

### Environment Variables

Create a local `.env` file containing the required configuration. For example:

```env
DATABASE_URL=your_database_connection_string
```

Use the environment variables required by the application's authentication and database configuration.

**Never commit `.env` files, database credentials, OAuth secrets or AWS credentials to Git.**

---

## ☸️ Kubernetes

Kubernetes is used locally for container orchestration practice and development.

### Local Architecture

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
      │
      ▼
Kubernetes Service
```

The local deployment uses:

- Deployment
- Pod
- Service
- Secret

The Kubernetes environment is intentionally local and cost-conscious. Production remains on AWS ECS/Fargate.

### Useful Commands

Check cluster nodes:

```bash
kubectl get nodes
```

Check pods:

```bash
kubectl get pods
```

Check services:

```bash
kubectl get services
```

Check deployments:

```bash
kubectl get deployments
```

View application logs:

```bash
kubectl logs deployment/nilayam
```

Check rollout status:

```bash
kubectl rollout status deployment/nilayam
```

Forward the service port to your local machine:

```bash
kubectl port-forward service/nilayam-service 3000:3000
```

---

## 🏗️ Infrastructure as Code

Terraform manages the AWS infrastructure, including:

- VPC
- Subnets
- Security Groups
- Amazon ECR
- ECS Cluster
- ECS Service
- ECS Task Definition
- AWS Fargate
- Application Load Balancer
- Target Group
- ALB Listener
- IAM configuration

### Terraform Workflow

Initialise Terraform:

```bash
terraform init
```

Review the proposed infrastructure changes:

```bash
terraform plan
```

Apply the changes:

```bash
terraform apply
```

Terraform state files are excluded from Git. Terraform commands should be run from the appropriate infrastructure directory, with AWS credentials and configuration set up correctly.

---

## 📁 Project Structure

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
├── src/
│   ├── app/
│   ├── components/
│   ├── generated/
│   └── lib/
│
├── terraform/
│   └── *.tf
│
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── lib/
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── playwright.config.ts
├── prisma.config.ts
├── vitest.config.ts
└── README.md
```

---

## 💻 Local Development

### Requirements

- Node.js
- npm
- Git
- Docker Desktop (for Docker builds)
- kubectl (for local Kubernetes work)

### Clone the Repository

```bash
git clone https://github.com/sai02-creator/nilayam-nextjs-aws-docker-kubernetes.git
cd nilayam-nextjs-aws-docker-kubernetes
```

### Install Dependencies

```bash
npm ci
```

The `postinstall` script generates Prisma Client as part of dependency installation.

### Configure Environment Variables

Create a `.env` file with the required runtime configuration.

Example:

```env
DATABASE_URL=your_database_connection_string
```

Configure any additional variables required by your local database and authentication setup. Never commit `.env` to Git.

### Generate Prisma Client

```bash
npx prisma generate
```

### Database Migrations

For local development, after configuring the database connection:

```bash
npx prisma migrate dev
```

Use migrations according to the project's existing database setup and environment.

### Start the Application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Run Automated Tests

```bash
npm test
```

For browser-based end-to-end tests:

```bash
npm run test:e2e
```

---

## 🎯 Engineering Highlights

Nilayam demonstrates practical experience across:

- Full-stack application development
- React and Next.js
- TypeScript
- Node.js backend development
- Application actions and API integration
- PostgreSQL and Prisma
- Authentication
- Docker containerisation
- Automated unit, integration and end-to-end testing
- GitHub Actions CI/CD
- CI test gates
- Prisma Client generation during installation and Docker builds
- AWS ECS/Fargate
- Amazon ECR
- Application Load Balancing
- VPC networking and Security Groups
- Infrastructure as Code with Terraform
- Kubernetes fundamentals
- Runtime secrets management
- Cloud deployment and operational practices

The project demonstrates the progression:

```text
Application Development
        ↓
Database Engineering
        ↓
Automated Testing
        ↓
Containerisation
        ↓
Infrastructure as Code
        ↓
Cloud Deployment
        ↓
CI/CD
        ↓
Container Orchestration
```

---

## 🔮 Planned Improvements

### AWS

- HTTPS with AWS Certificate Manager
- Custom domain with Route 53
- Private ECS subnets
- NAT Gateway architecture
- CloudWatch monitoring
- Centralised application logging
- ECS autoscaling

### Kubernetes

- Readiness probes
- Liveness probes
- Resource requests and limits
- Horizontal Pod Autoscaling
- Kubernetes Ingress
- Production deployment using Amazon EKS

### CI/CD & Observability

- Automated database migration strategy
- Application metrics
- Infrastructure monitoring
- Centralised logs
- Health monitoring
- Expanded automated test coverage

---

## 👨‍💻 Author

**Sai Chaitanya Gaddam**

Full-Stack Developer | Cloud & DevOps Enthusiast

### Technologies

JavaScript · TypeScript · React · Next.js · Node.js · PostgreSQL · Prisma · Docker · AWS · Terraform · GitHub Actions · Kubernetes

---

## ⭐ Project Goal

Nilayam was built to demonstrate more than application development. It shows how a modern full-stack application can be **developed, tested, containerised, provisioned, deployed, automated and operated** using modern software engineering, cloud and DevOps practices.

**Built with ❤️ by Sai Chaitanya Gaddam**
