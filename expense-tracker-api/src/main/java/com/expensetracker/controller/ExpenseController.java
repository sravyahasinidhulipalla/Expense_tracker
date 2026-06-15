package com.expensetracker.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Expense;
import com.expensetracker.model.Users;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtil;

@RestController
@RequestMapping("/expenses")
@CrossOrigin("*")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Add Expense")
    @PostMapping("/add")
    public ResponseEntity<?> addExpense(

            @Parameter(
                    name = "Authorization",
                    description = "JWT Token. Example: Bearer eyJhbGciOiJIUzI1NiJ9...",
                    required = true
            )
            @RequestHeader(value = "Authorization", required = false)
            String token,

            @RequestBody Expense expense) {
        try {

            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token Missing");
            }

            String actualToken = token.replace("Bearer ", "");
            String email = JwtUtil.extractEmail(actualToken);

            Optional<Users> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not found");
            }

            if (expense.getExpenseName() == null || expense.getExpenseName().isBlank()) {
                expense.setExpenseName(
                        expense.getCategory() != null
                                ? expense.getCategory()
                                : "Unnamed");
            }

            expense.setUser(userOptional.get());

            Expense saved = expenseRepository.save(expense);

            return ResponseEntity.ok(toMap(saved));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error : " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> myExpenses(
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {

            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token Missing");
            }

            String actualToken = token.replace("Bearer ", "");
            String email = JwtUtil.extractEmail(actualToken);

            Optional<Users> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid User");
            }

            List<Map<String, Object>> result = expenseRepository
                    .findByUserId(userOptional.get().getId())
                    .stream()
                    .map(this::toMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error : " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllExpenses(
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {

            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token Missing");
            }

            String actualToken = token.replace("Bearer ", "");

            List<String> roles = JwtUtil.extractRoles(actualToken);

            if (!roles.contains("ROLE_ADMIN")) {

                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access Denied: Admins only");
            }

            List<Map<String, Object>> result = expenseRepository
                    .findAll()
                    .stream()
                    .map(this::toMap)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error : " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {

            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Token Missing");
            }

            String actualToken = token.replace("Bearer ", "");

            String email = JwtUtil.extractEmail(actualToken);

            List<String> roles = JwtUtil.extractRoles(actualToken);

            Optional<Expense> expenseOpt =
                    expenseRepository.findById(id);

            if (expenseOpt.isEmpty()) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Expense not found");
            }

            Expense expense = expenseOpt.get();

            if (roles.contains("ROLE_ADMIN")
                    || expense.getUser().getEmail().equals(email)) {

                expenseRepository.deleteById(id);

                return ResponseEntity.ok("Expense Deleted");
            }

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error : " + e.getMessage());
        }
    }

    private Map<String, Object> toMap(Expense e) {

        Map<String, Object> map = new HashMap<>();

        map.put("id", e.getId());

        map.put("expenseName",
                e.getExpenseName() != null
                        ? e.getExpenseName()
                        : "");

        map.put("description",
                e.getDescription() != null
                        ? e.getDescription()
                        : "");

        map.put("amount", e.getAmount());

        map.put("category",
                e.getCategory() != null
                        ? e.getCategory()
                        : "Other");

        map.put("date",
                e.getDate() != null
                        ? e.getDate()
                        : "");

        if (e.getUser() != null) {

            map.put("userId", e.getUser().getId());

            map.put("userName", e.getUser().getUsername());

            map.put("userEmail", e.getUser().getEmail());
        }

        return map;
    }
}