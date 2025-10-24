package com.ledgerpay.query.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService {
    private final String issuer;
    private final Key key;
    private final long accessTtlSeconds;

    public JwtService(@Value("${app.security.jwt.issuer}") String issuer,
                      @Value("${app.security.jwt.secret}") String secret,
                      @Value("${app.security.jwt.access-token-ttl}") String accessTtl) {
        this.issuer = issuer;
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(secret.getBytes())));
        this.accessTtlSeconds = java.time.Duration.parse(accessTtl).toSeconds();
    }

    public String generateAccessToken(String subject, String tenantId, String role){
        Instant now = Instant.now();
        return Jwts.builder().setSubject(subject).setIssuer(issuer)
                .addClaims(Map.of("tenantId", tenantId, "role", role))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(accessTtlSeconds, ChronoUnit.SECONDS)))
                .signWith(key, SignatureAlgorithm.HS256).compact();
    }

    public io.jsonwebtoken.Claims parse(String token){
        return Jwts.parserBuilder().setSigningKey(key).requireIssuer(issuer).build().parseClaimsJws(token).getBody();
    }
}
