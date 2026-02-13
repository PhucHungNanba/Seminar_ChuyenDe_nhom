package com.contoso.socialapp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Simple Social Media API")
                        .version("1.0.0")
                        .description("A basic Social Networking Service (SNS) API that allows users to create, retrieve, update, and delete posts; add comments; and like/unlike posts.")
                        .contact(new Contact()
                                .name("Contoso Product Team")
                                .email("support@contoso.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080/api")
                                .description("Development server")
                ))
                .tags(List.of(
                        new Tag().name("Posts").description("Post management endpoints"),
                        new Tag().name("Comments").description("Comment management endpoints"),
                        new Tag().name("Likes").description("Like management endpoints")
                ));
    }
}
