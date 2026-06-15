package com.expensetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository repo;

    public Expense saveExpense(Expense expense) {

        return repo.save(expense);
    }

    public List<Expense> getAllExpenses() {

        return repo.findAll();
    }

    public Expense updateExpense(Long id, Expense expense) {

        Expense oldExpense =
                repo.findById(id).orElse(null);

        if(oldExpense != null) {

            oldExpense.setDescription(
                    expense.getDescription());

            oldExpense.setAmount(
                    expense.getAmount());

            oldExpense.setCategory(
                    expense.getCategory());

            oldExpense.setDate(
                    expense.getDate());

            return repo.save(oldExpense);
        }

        return null;
    }

    public void deleteExpense(Long id) {

        repo.deleteById(id);
    }
}