# Socket Service

## Description
The Socket Service enables real-time communication features, such as internal chat and video calls, for the information management system. It uses WebSocket for seamless data exchange.

## Installation
1. **Prerequisites**:
   - Java 11 (JDK 11.0.25)
   - IntelliJ IDEA

2. **Setup**:
   - Clone the repository:  
     ```bash
     git clone https://github.com/ITZ-Developers/kltn-fm-be-socket
     ```
   - Open the project in IntelliJ IDEA.
   - Configure `configuration.properties`:
     - RabbitMQ settings.
   - Run `mvn clean install`.
   - Start the service:  
     ```bash
     mvn spring-boot:run
     ```