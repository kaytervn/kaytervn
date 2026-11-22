FROM eclipse-temurin:11-jdk-alpine-3.22

WORKDIR /app

COPY ./target/msa-0.0.1.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]