package com.expensetracker.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Roles;
import com.expensetracker.model.Users;
import com.expensetracker.repository.RoleRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(
            @RequestBody Map<String, String> request) {

        String email    = request.get("email");
        String username = request.get("username");
        String password = request.get("password");

        String rawRole  = request.getOrDefault("role", "user").toUpperCase();
        String fullRole = rawRole.startsWith("ROLE_") ? rawRole : "ROLE_" + rawRole;

        Map<String, Object> err = new HashMap<>();

        if (email == null || email.isBlank()) {
            err.put("message", "Email is required");
            return ResponseEntity.status(400).body(err);
        }
        if (username == null || username.isBlank()) {
            err.put("message", "Username is required");
            return ResponseEntity.status(400).body(err);
        }
        if (password == null || password.isBlank()) {
            err.put("message", "Password is required");
            return ResponseEntity.status(400).body(err);
        }
        if (userRepository.findByEmail(email).isPresent()) {
            err.put("message", "Email already registered");
            return ResponseEntity.status(400).body(err);
        }

        Roles role = roleRepository.findByName(fullRole)
                .orElseGet(() -> roleRepository.save(new Roles(fullRole)));

        Set<Roles> roles = new HashSet<>();
        roles.add(role);

        Users user = new Users();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);
        user.setRoles(roles);
        userRepository.save(user);

        String token = JwtUtil.generateToken(email, roles);

        Map<String, Object> response = new HashMap<>();
        response.put("message",  "Signup successful");
        response.put("token",    token);
        response.put("username", username);
        response.put("role",     fullRole);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/login", "/signin"})
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> request) {

        String email    = request.get("email");
        String password = request.get("password");

        Map<String, Object> err = new HashMap<>();

        if (email == null || email.isBlank()) {
            err.put("message", "Email is required");
            return ResponseEntity.status(400).body(err);
        }
        if (password == null || password.isBlank()) {
            err.put("message", "Password is required");
            return ResponseEntity.status(400).body(err);
        }

        Optional<Users> existing = userRepository.findByEmail(email);
        if (existing.isEmpty()) {
            err.put("message", "No account found with that email");
            return ResponseEntity.status(401).body(err);
        }

        Users dbUser = existing.get();

        if (!dbUser.getPassword().equals(password)) {
            err.put("message", "Incorrect password");
            return ResponseEntity.status(401).body(err);
        }

        String token = JwtUtil.generateToken(dbUser.getEmail(), dbUser.getRoles());

        String role = dbUser.getRoles().stream()
                .map(Roles::getName)
                .findFirst()
                .orElse("ROLE_USER");

        Map<String, Object> response = new HashMap<>();
        response.put("message",  "Login successful");
        response.put("token",    token);
        response.put("username", dbUser.getUsername());
        response.put("role",     role);
        return ResponseEntity.ok(response);
    }
}