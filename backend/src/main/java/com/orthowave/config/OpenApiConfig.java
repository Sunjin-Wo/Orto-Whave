package com.orthowave.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("OrthoWave API")
                        .version("1.0")
                        .description("API REST para la gestión de OrthoWave Colombia. Esta API proporciona endpoints para:\n\n" +
                                "* Gestión de usuarios y autenticación\n" +
                                "* Administración de pacientes\n" +
                                "* Gestión de citas médicas\n" +
                                "* Control de historias clínicas\n" +
                                "* Manejo de inventario de productos\n" +
                                "* Gestión de servicios médicos")
                        .contact(new Contact()
                                .name("OrthoWave Colombia")
                                .email("contacto@orthowave.co")
                                .url("https://orthowave.co"))
                        .license(new License()
                                .name("Privada")
                                .url("https://orthowave.co/terms")))
                .addSecurityItem(new SecurityRequirement().addList("JWT"))
                .components(new Components()
                        .addSecuritySchemes("JWT",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingrese el token JWT")))
                .addServersItem(new Server().url("http://localhost:8080").description("Servidor de desarrollo"))
                .addServersItem(new Server().url("https://api.orthowave.co").description("Servidor de producción"))
                .tags(Arrays.asList(
                        new Tag().name("Autenticación").description("Endpoints de autenticación y gestión de usuarios"),
                        new Tag().name("Pacientes").description("Gestión de pacientes y sus datos"),
                        new Tag().name("Citas").description("Administración de citas médicas"),
                        new Tag().name("Historia Clínica").description("Gestión de historias clínicas y registros médicos"),
                        new Tag().name("Productos").description("Control de inventario y productos"),
                        new Tag().name("Servicios").description("Gestión de servicios médicos ofrecidos")
                ));
    }
} 