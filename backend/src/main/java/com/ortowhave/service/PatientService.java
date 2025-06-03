package com.ortowhave.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ortowhave.dto.response.UserResponse;
import com.ortowhave.exception.ResourceNotFoundException;
import com.ortowhave.model.Patient;
import com.ortowhave.model.User;
import com.ortowhave.repository.PatientRepository;
import com.ortowhave.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<UserResponse> getAllPatients() {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> "ROLE_USER".equals(user.getRole()))
                .collect(Collectors.toList());
        
        return users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
    }
    
    public UserResponse getPatientById(Long id) {
        User user = userRepository.findById(id)
                .filter(u -> "ROLE_USER".equals(u.getRole()))
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));
        
        return mapToUserResponse(user);
    }
    
    public Patient getPatientDetailsByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Detalles de paciente no encontrados para el usuario con id: " + userId));
    }
    
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setActive(user.getActive());
        response.setRegistrationDate(user.getRegistrationDate());
        return response;
    }
}
