package com.expensetracker.dto;

public class ExpenseDTO {

    private Long id;
    private Double amount;
    private String category;
    private String date;
    private String description;

    // ✅ REQUIRED CONSTRUCTOR (THIS FIXES YOUR ERROR)
    public ExpenseDTO(Long id, Double amount, String category, String date, String description) {
        this.id = id;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.description = description;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public String getCategory() {
        return category;
    }

    public String getDate() {
        return date;
    }

    public String getDescription() {
        return description;
    }
}