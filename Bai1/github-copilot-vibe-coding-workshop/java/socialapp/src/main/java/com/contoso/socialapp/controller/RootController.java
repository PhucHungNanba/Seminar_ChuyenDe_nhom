package com.contoso.socialapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "Social Media API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("posts", "/posts");
        endpoints.put("health", "/actuator/health");
        endpoints.put("swagger", "/swagger-ui.html");
        endpoints.put("api-docs", "/api-docs");
        
        response.put("endpoints", endpoints);
        
        return response;
    }
}