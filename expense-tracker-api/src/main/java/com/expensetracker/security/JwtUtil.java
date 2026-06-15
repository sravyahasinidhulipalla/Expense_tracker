package com.expensetracker.security;

import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.expensetracker.model.Roles;

public class JwtUtil {

    public static String generateToken(String email, Set<Roles> roles) {

        String roleNames = roles.stream()
                .map(Roles::getName)
                .collect(Collectors.joining(","));

        String payload = email + "|" + roleNames;

        return Base64.getEncoder().encodeToString(payload.getBytes());
    }

    public static String extractEmail(String token) {

        try {

            if (token == null || token.isBlank()) {
                return null;
            }

            String decoded =
                    new String(Base64.getDecoder().decode(token));

            return decoded.split("\\|")[0];

        } catch (Exception e) {

            return null;
        }
    }

    public static String extractRole(String token) {

        try {

            if (token == null || token.isBlank()) {
                return "ROLE_USER";
            }

            String decoded =
                    new String(Base64.getDecoder().decode(token));

            String[] parts = decoded.split("\\|");

            if (parts.length > 1 && !parts[1].isBlank()) {

                return parts[1].split(",")[0];
            }

            return "ROLE_USER";

        } catch (Exception e) {

            return "ROLE_USER";
        }
    }

    public static List<String> extractRoles(String token) {

        try {

            if (token == null || token.isBlank()) {
                return Collections.singletonList("ROLE_USER");
            }

            String decoded =
                    new String(Base64.getDecoder().decode(token));

            String[] parts = decoded.split("\\|");

            if (parts.length > 1 && !parts[1].isBlank()) {

                return Arrays.asList(parts[1].split(","));
            }

            return Collections.singletonList("ROLE_USER");

        } catch (Exception e) {

            return Collections.singletonList("ROLE_USER");
        }
    }
}