# Master API

## Description

The Master API is the central component of the internal information management system, responsible for managing tenant configurations, role-based access control, and dynamic datasource setup for multi-tenancy. Built with Spring Boot, it ensures secure and scalable tenant management.

## Installation

1. **Prerequisites**:

   - Java 11 (JDK 11.0.25)
   - IntelliJ IDEA
   - MySQL Server
   - RabbitMQ

2. **Setup**:
   - Clone the repository:
     ```bash
     git clone https://github.com/ITZ-Developers/kltn-fm-be-master
     ```
   - Open the project in IntelliJ IDEA.
   - Configure environment variables in `application-dev.properties`:
     - Database connection (MySQL master database).
     - RabbitMQ credentials.
   - Run `mvn clean install` to install dependencies.
   - Start the application:
     ```bash
     mvn spring-boot:run
     ```
   - Access Swagger UI at `http://localhost:7980/swagger-ui.html` for API documentation.
