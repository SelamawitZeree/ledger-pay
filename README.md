# LedgerPay - Modern Accounting System

> A comprehensive, cloud-native accounting platform built with microservices architecture for CS489 Software Engineering Course Project.

## 🌟 Overview

LedgerPay is a modern, full-stack accounting system designed to handle complex financial operations with enterprise-grade reliability. Built using microservices architecture, it provides scalable, secure, and maintainable solutions for accounting needs.

### 🎯 Key Highlights
- **Modern Architecture**: Microservices with Spring Boot and React
- **Cloud-Ready**: Deployable on AWS ECS Fargate with full cloud integration
- **Multi-Tenant**: Support for multiple organizations
- **Real-Time**: Live balance tracking and transaction processing
- **Secure**: JWT-based authentication with role-based access control

## 🏗️ System Architecture

### Microservices Design
Our system is built around five core microservices, each handling specific business domains:

| Service | Port | Responsibility |
|---------|------|----------------|
| **Auth Service** | 8080 | User authentication, JWT token management, role-based access |
| **Accounts Service** | 8081 | Account management, chart of accounts, balance calculations |
| **Posting Service** | 8082 | Transaction processing, journal entries, double-entry bookkeeping |
| **Query Service** | 8083 | Data retrieval, reporting, analytics, and business intelligence |
| **Audit Service** | 8084 | Audit logging, compliance tracking, security monitoring |

### Technology Stack

**Backend Technologies:**
- **Framework**: Spring Boot 3.x with Java 21
- **Build Tool**: Maven 3.6+
- **Database**: PostgreSQL 16 with Flyway migrations
- **Security**: JWT authentication with Spring Security
- **Documentation**: Swagger/OpenAPI 3.0

**Frontend Technologies:**
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern UI
- **State Management**: React Query for server state
- **Icons**: Lucide React for consistent iconography

**DevOps & Deployment:**
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for local development
- **Cloud Platform**: AWS ECS Fargate with Application Load Balancer
- **CI/CD**: Automated AWS deployment scripts

## 📁 Project Structure

```
ledgerpay/
├── services/                          # Backend microservices
│   ├── auth-service/                 # Authentication & authorization
│   │   ├── src/main/java/            # Java source code
│   │   ├── src/main/resources/       # Configuration & migrations
│   │   └── Dockerfile               # Container definition
│   ├── accounts-service/             # Account management
│   ├── posting-service/              # Transaction processing
│   ├── query-service/               # Data querying & reporting
│   └── audit-service/               # Audit logging
├── web/                              # Frontend application
│   ├── app/                          # Next.js app directory
│   ├── components/                   # Reusable React components
│   ├── lib/                          # Utility functions & API clients
│   └── Dockerfile                   # Frontend container
├── docker-compose.micro.yml          # Local development setup
├── deploy-to-aws.sh                 # AWS deployment script
├── API-TESTING-GUIDE.md             # Comprehensive API documentation
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

Before running LedgerPay, ensure you have the following installed:

- **Java 21+** - For backend services
- **Node.js 18+** - For frontend development
- **Docker & Docker Compose** - For containerized deployment
- **Maven 3.6+** - For Java dependency management
- **Git** - For version control

### Quick Start with Docker

The easiest way to get LedgerPay running is with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/SelamawitZeree/ledger-pay.git
cd ledger-pay

# Start all services
docker-compose -f docker-compose.micro.yml up --build

# Wait for services to initialize (about 2-3 minutes)
# Then access the application at http://localhost:3000
```

### Manual Development Setup

For development purposes, you can run services individually:

#### 1. Start Databases
```bash
# Start PostgreSQL databases for each service
docker-compose -f docker-compose.micro.yml up -d accountsdb postingdb querydb auditdb authdb
```

#### 2. Build Backend Services
```bash
# Build all microservices
mvn clean package -DskipTests

# Run services individually (in separate terminals)
cd services/auth-service && java -jar target/auth-service-0.0.1-SNAPSHOT.jar
cd services/accounts-service && java -jar target/accounts-service-0.0.1-SNAPSHOT.jar
cd services/posting-service && java -jar target/posting-service-0.0.1-SNAPSHOT.jar
cd services/query-service && java -jar target/query-service-0.0.1-SNAPSHOT.jar
cd services/audit-service && java -jar target/audit-service-0.0.1-SNAPSHOT.jar
```

#### 3. Start Frontend
```bash
cd web
npm install
npm run dev
```

## 🌐 API Documentation

### Interactive Documentation
Each microservice provides Swagger UI for interactive API exploration:

- **Auth Service**: http://localhost:8080/swagger-ui.html
- **Accounts Service**: http://localhost:8081/swagger-ui.html
- **Posting Service**: http://localhost:8082/swagger-ui.html
- **Query Service**: http://localhost:8083/swagger-ui.html
- **Audit Service**: http://localhost:8084/swagger-ui.html

### API Testing
We provide a comprehensive Postman collection for API testing:
- Import `LedgerPay-Complete-API-Collection.json` into Postman
- Use the collection variables to configure endpoints
- Test all endpoints with pre-configured requests

### Sample API Calls

```bash
# Health check
curl http://localhost:8080/actuator/health

# User authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Get account balance
curl -X GET http://localhost:8081/api/accounts/1/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Design

### Multi-Tenant Architecture
LedgerPay implements a sophisticated multi-tenant design:

- **Tenant Isolation**: Each organization's data is completely isolated
- **Shared Authentication**: Users can access multiple tenants with proper permissions
- **Multi-Currency Support**: Handle transactions in different currencies
- **Audit Trail**: Complete audit logging for compliance requirements

### Core Database Schema

```sql
-- Users and Authentication
users (id, username, email, password_hash, created_at)
tenants (id, name, currency, created_at)
user_tenants (user_id, tenant_id, role)

-- Chart of Accounts
accounts (id, tenant_id, account_code, name, type, balance)
account_types (id, name, normal_balance)

-- Transaction Processing
transactions (id, tenant_id, reference, description, date, amount)
journal_entries (id, transaction_id, account_id, debit_amount, credit_amount)

-- Audit and Compliance
audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, timestamp)
```

## ☁️ AWS Cloud Deployment

### AWS ECS Fargate Deployment

Deploy LedgerPay to AWS with a single command:

```bash
# Configure AWS CLI and run deployment
./deploy-to-aws.sh
```

This comprehensive deployment script will:

**Infrastructure Setup:**
- Create ECR repositories for all microservices
- Set up VPC with public and private subnets
- Configure Application Load Balancer
- Set up API Gateway for external access
- Create RDS PostgreSQL instances for each service

**Service Deployment:**
- Build Docker images for linux/amd64 platform
- Push images to ECR repositories
- Deploy microservices to ECS Fargate
- Configure service discovery and load balancing
- Set up CloudWatch logging and monitoring

**Security & Networking:**
- Configure security groups for secure communication
- Set up IAM roles and policies
- Enable HTTPS with SSL certificates
- Configure CORS for frontend integration

**Monitoring & Scaling:**
- Set up CloudWatch dashboards
- Configure auto-scaling policies
- Enable health checks and monitoring
- Set up log aggregation

## 🧪 Testing

### Backend Testing
```bash
# Run all service tests
mvn test

# Run tests for specific service
cd services/auth-service
mvn test

# Run integration tests
mvn test -Dtest="*IT"
```

### Frontend Testing
```bash
cd web
npm test                    # Run unit tests
npm run test:coverage       # Run with coverage
npm run test:e2e           # Run end-to-end tests
```

### API Testing
```bash
# Test service health
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

## 📊 Features

### Core Business Features
- **🔐 Secure Authentication**: JWT-based with role-based access control
- **🏢 Multi-Tenant Support**: Isolated data per organization
- **💰 Account Management**: Complete chart of accounts with real-time balances
- **📝 Transaction Processing**: Double-entry bookkeeping with journal entries
- **📊 Reporting & Analytics**: Comprehensive financial reporting
- **🔍 Audit Trail**: Complete audit logging for compliance
- **💱 Multi-Currency**: Support for multiple currencies and exchange rates

### Technical Features
- **🏗️ Microservices Architecture**: Scalable, maintainable service design
- **🐳 Containerized**: Docker containers for consistent deployment
- **☁️ AWS Cloud-Ready**: Deployed on AWS ECS Fargate with full cloud integration
- **📚 API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **🔄 Database Migrations**: Flyway for version-controlled schema changes
- **🧪 Testing**: Unit tests, integration tests, and API testing
- **📱 Responsive UI**: Modern, mobile-friendly web interface

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ledgerpay
DB_USER=ledgeradmin
DB_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=86400

# Application Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=development

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_ENVIRONMENT=development
```

### Service Configuration
Each service can be configured independently through `application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/authdb
    username: ledgeradmin
    password: password

logging:
  level:
    com.ledgerpay: DEBUG
```

## 📚 Documentation

- **[API Testing Guide](API-TESTING-GUIDE.md)** - Comprehensive API documentation and testing instructions
- **[AWS Deployment Guide](deploy-to-aws.sh)** - Step-by-step AWS deployment instructions
- **[Database Schema](services/*/src/main/resources/db/migration/)** - Database migration scripts and schema documentation

## 🎓 CS489 Course Project

This project demonstrates comprehensive software engineering practices:

### ✅ Requirements Analysis
- Detailed functional and non-functional requirements
- Use case diagrams and user stories
- System requirements specification

### ✅ System Design
- Microservices architecture design
- Database schema design
- API design with OpenAPI specification
- Security and authentication design

### ✅ Implementation
- Complete backend microservices implementation
- Modern frontend application
- Database implementation with migrations
- Comprehensive testing suite

### ✅ Deployment
- Containerized deployment with Docker
- AWS cloud deployment on ECS Fargate
- CI/CD pipeline implementation
- Production-ready configuration

## 🤝 Contributing

This is a course project, but contributions and suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Selamawit Zere** - CS489 Software Engineering Course Project
- **Course**: CS489 - Software Engineering
- **Institution**: [Your University]
- **GitHub**: [SelamawitZeree](https://github.com/SelamawitZeree)
- **Email**: [Your Email]

## 📄 License

This project is created for educational purposes as part of CS489 coursework. All rights reserved.

---

## 🔗 Links

- **Live Demo**: [Your deployed application URL]
- **GitHub Repository**: https://github.com/SelamawitZeree/ledger-pay
- **API Documentation**: [Swagger UI URL]
- **Postman Collection**: [Postman Collection URL]

---

*Built with ❤️ for CS489 Software Engineering Course*