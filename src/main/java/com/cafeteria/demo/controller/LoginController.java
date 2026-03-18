package com.cafeteria.demo.controller;

import com.cafeteria.demo.model.User;
import com.cafeteria.demo.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class LoginController {

    private final UserRepository repo;

    public LoginController(UserRepository repo) {
        this.repo = repo;
    }

    // Show login page from static folder
    @GetMapping("/")
    public String showLoginPage() {
        return "forward:/index.html";   // IMPORTANT FIX
    }

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        User user = repo.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            return "redirect:/home.html";  // SUCCESS
        }

        return "redirect:/index.html?error=true"; // FAILED LOGIN
    }

    @GetMapping("/home")
    public String home() {
        return "forward:/home.html";   // IMPORTANT FIX
    }
} 










