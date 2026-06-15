package com.expensetracker.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Users;
import com.expensetracker.model.Roles;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.security.JwtUtil;

@RestController
@RequestMapping("/profile")
@CrossOrigin("*")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String token) {

        String email = JwtUtil.extractEmail(token.replace("Bearer ", ""));
        Optional<Users> opt = userRepository.findByEmail(email);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found"));
        }

        Users user = opt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id",       user.getId());
        response.put("username", user.getUsername());
        response.put("email",    user.getEmail());
        response.put("role",     user.getRoles().stream()
                .map(Roles::getName).findFirst().orElse("ROLE_USER"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(
            @RequestHeader("Authorization") String token) {

        String actualToken = token.replace("Bearer ", "");
        List<String> roles = JwtUtil.extractRoles(actualToken);

        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Admins only"));
        }

        List<Users> allUsers = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Users user : allUsers) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("userId",    user.getId());
            userMap.put("userName",  user.getUsername());
            userMap.put("userEmail", user.getEmail());
            userMap.put("role",      user.getRoles().stream()
                    .map(Roles::getName).findFirst().orElse("ROLE_USER"));

            List<Map<String, Object>> expList = new ArrayList<>();
            expenseRepository.findByUserId(user.getId()).forEach(exp -> {
                Map<String, Object> expMap = new HashMap<>();
                expMap.put("id",          exp.getId());
                expMap.put("expenseName", exp.getExpenseName() != null ? exp.getExpenseName() : "");
                expMap.put("description", exp.getDescription() != null ? exp.getDescription() : "");
                expMap.put("amount",      exp.getAmount());
                expMap.put("category",    exp.getCategory() != null ? exp.getCategory() : "Other");
                expMap.put("date",        exp.getDate() != null ? exp.getDate() : "");
                expMap.put("userId",      user.getId());
                expMap.put("userName",    user.getUsername());
                expMap.put("userEmail",   user.getEmail());
                expList.add(expMap);
            });

            userMap.put("expenses", expList);
            result.add(userMap);
        }

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {

        List<String> roles = JwtUtil.extractRoles(token.replace("Bearer ", ""));

        if (!roles.contains("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Admins only"));
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        expenseRepository.findByUserId(id).forEach(exp ->
            expenseRepository.deleteById(exp.getId())
        );
        userRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}