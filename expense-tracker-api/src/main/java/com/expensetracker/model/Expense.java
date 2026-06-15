package com.expensetracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String expenseName;

    private String description;

    private Double amount;

    private String category;

    private String date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    // GETTERS

    public Long getId() {
        return id;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public String getDescription() {
        return description;
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

    public Users getUser() {
        return user;
    }

    // SETTERS

    public void setId(Long id) {
        this.id = id;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setUser(Users user) {
        this.user = user;
    }
}