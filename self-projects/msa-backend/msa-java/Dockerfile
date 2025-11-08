FROM adoptopenjdk/openjdk11:jdk-11.0.11_9-alpine

COPY ./target/msa-0.0.1.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]