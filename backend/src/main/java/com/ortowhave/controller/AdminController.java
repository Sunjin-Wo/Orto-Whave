package com.ortowhave.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ortowhave.dto.request.CreateUserRequest;
import com.ortowhave.dto.request.UpdateRoleRequest;
import com.ortowhave.dto.request.UpdateUserRequest;
import com.ortowhave.dto.response.MessageResponse;
import com.ortowhave.dto.response.UserResponse;
import com.ortowhave.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
        UserResponse user = userService.createUser(
            createUserRequest.getFirstName(),
            createUserRequest.getLastName(),
            createUserRequest.getEmail(),
            createUserRequest.getPassword(),
            createUserRequest.getPhoneNumber(),
            createUserRequest.getRole()
        );
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        UserResponse user = userService.updateUser(
            id,
            updateUserRequest.getFirstName(),
            updateUserRequest.getLastName(),
            updateUserRequest.getPhoneNumber(),
            updateUserRequest.getActive()
        );
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("Usuario eliminado exitosamente."));
    }
    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest updateRoleRequest) {
        UserResponse user = userService.updateUserRole(id, updateRoleRequest.getRole());
        return ResponseEntity.ok(user);
    }
}
