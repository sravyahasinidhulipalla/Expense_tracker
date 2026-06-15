package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Users;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public Users signup(Users user) {

        return repo.save(user);
    }
}