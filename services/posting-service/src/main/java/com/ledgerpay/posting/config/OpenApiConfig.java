package com.ledgerpay.posting.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("Posting Service API").description("LedgerPay Posting Service").version("v1"))
                .externalDocs(new ExternalDocumentation().description("LedgerPay Docs").url("https://example.com/docs"));
    }
}
