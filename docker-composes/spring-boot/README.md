## 1️⃣ Build Spring Boot app

```cmd
mvn clean package
```

## 2️⃣ Create Dockerfile

```dockerfile
FROM openjdk:11

COPY ./target/nails-media.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 3️⃣ Build Docker image

```cmd
docker build -t <docker-username>/<app-name>:<tag> .
```

## 4️⃣ Push to Docker Hub

```cmd
docker push <docker-username>/<app-name>:<tag>
```

## 5️⃣ Run container

```cmd
docker run -p <exposed-port>:<port> <docker-username>/<app-name>:<tag>
```
