FROM openjdk:11

COPY ./socket/target/noti.socket-1.0-SNAPSHOT-jar-with-dependencies.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]