# User-service
This is a service reserved for authentication and authorization based on Oauth2 protocol.

## Tech stack
- Spring-boot 2.3
- Postgresql
- Redis
- Swagger
- Docker

## Service configuration
- Database config
    ```
    spring.datasource.url=jdbc:postgresql://<db host>:<db port>/<db name>
    spring.datasource.username=<username>
    spring.datasource.password=<password>
    ```

- Redis config
    ```
    redis.host=<redis host>
    redis.port=<redis port>
    redis.password=<redis password>
    ```
- Rabbitmq config
    ```
    spring.rabbitmq.host=<host rabbitmq>
    spring.rabbitmq.port=<port rabbitmq>
    spring.rabbitmq.username=<user rabbitmq>
    spring.rabbitmq.password=<password>

    app.rabbitmq.exchange.topic.userEvent=User_Event
    app.rabbitmq.queue.new.user=new_user
    ```

- Initial data
    Currently all initial data will define on `/resource/data.sql`


## BUILD
-  Jar file
```mvn clean package```

- Docker images
``` docker build . --tag [image-tag-name]```
    Ex: ```docker build . --tag user-service-be-v1.0```

## LAUNCH APPLICATION
- From Jar
```java -jar [app jar file] [-Dspring.profiles.active=test]```

-  From docker images
```docker run -it -p 8080:8080 -e "SPRING_PROFILES_ACTIVE=[profile-name]" [image-tag-version]```

    Ex: ```docker run -it -p 8080:8080 -e "SPRING_PROFILES_ACTIVE=dev" user-service-be-v1.0```


## Contact point
If you have any problem when rebuild application feel free to contact persons in below:

| Contact name | Email | Position |
| ---         | ---   | ---      |
| Ky Nguyen    | luongky06@gmail.com  | Senior software engineer |