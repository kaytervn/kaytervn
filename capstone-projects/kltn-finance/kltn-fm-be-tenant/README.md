# Tenant API

## Description
The Tenant API handles tenant-specific operations, including user authentication, transaction management, and data isolation for the multi-tenancy system. Built with Spring Boot, it integrates with the Master API for dynamic datasource management.

## Installation
1. **Prerequisites**:
   - Java 11 (JDK 11.0.25)
   - IntelliJ IDEA
   - MySQL Server
   - RabbitMQ

2. **Setup**:
   - Clone the repository:  
     ```bash
     git clone https://github.com/ITZ-Developers/kltn-fm-be-tenant
     ```
   - Open the project in IntelliJ IDEA.
   - Configure `application-dev.properties`:
     - Master API URL and API key.
     - RabbitMQ settings.
     - Generate RSA keys using `initSystemKey()` in `Application.java`.
   - Run `mvn clean install`.
   - Start the application:  
     ```bash
     mvn spring-boot:run
     ```
   - Access Swagger UI at `http://localhost:7979/swagger-ui.html`.