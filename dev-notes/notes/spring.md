**Build and Deploy with Docker**

1. Build the Spring Boot project: `mvn clean package`

2. Create a Dockerfile

```dockerfile
FROM openjdk:11

COPY ./target/nails-media.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

3. Build the Docker image: `docker build -t <your-username>/<app-name>:<tag> .`

4. Push the image to Docker Hub: `docker push <your-username>/<app-name>:<tag>`

5. Run the container: `docker run -p <exposed-port>:<internal-port> <your-username>/<app-name>:<tag>`

_**Note:** Make sure the WebSocket project has the `PORT` environment variable set._
