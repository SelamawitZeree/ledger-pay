package com.ledgerpay.accounts.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationConverter jwtAuthConverter = jwtAuthenticationConverter();
        http
          .csrf(csrf -> csrf.disable())
          .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .authorizeHttpRequests(auth -> auth
                  .requestMatchers("/api/v1/auth/**", "/swagger**", "/v3/api-docs/**", "/api/docs/**").permitAll()
                  .requestMatchers("/actuator/**").permitAll()
                  .requestMatchers("/api/v1/accounts/**").hasAnyRole("ADMIN","USER","AUDITOR")
                  .anyRequest().authenticated()
          )
          .oauth2ResourceServer(oauth2 -> oauth2.jwt(j -> j.jwtAuthenticationConverter(jwtAuthConverter)))
          .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${APP_SECURITY_JWT_SECRET:this_is_a_development_jwt_secret_that_is_long_enough_please_change_in_prod_1234567890}") String secret){
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            java.util.List<org.springframework.security.core.GrantedAuthority> out = new java.util.ArrayList<>();
            Object roleClaim = jwt.getClaim("role");
            if (roleClaim instanceof String s) {
                if (!s.isBlank()) out.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + s));
            } else if (roleClaim instanceof java.util.Collection<?> col) {
                for (Object o : col) {
                    if (o != null) out.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + o.toString()));
                }
            }
            return out;
        });
        return converter;
    }
}
