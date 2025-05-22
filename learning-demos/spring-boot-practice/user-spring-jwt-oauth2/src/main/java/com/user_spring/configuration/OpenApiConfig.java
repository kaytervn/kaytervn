package com.user_spring.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    public final Contact DEFAULT_CONTACT = new Contact()
            .name("Kayter")
            .email("kienductrong@gmail.com")
            .url("github.com/kaytervn");
    public final Info DEFAULT_INFO = new Info()
            .title("Spring Boot API Demo Documentation")
            .version("v1.0.0")
            .contact(DEFAULT_CONTACT);

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .info(DEFAULT_INFO)
                .servers(List.of(new Server().url("http://localhost:8080/").description("Server Test")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
