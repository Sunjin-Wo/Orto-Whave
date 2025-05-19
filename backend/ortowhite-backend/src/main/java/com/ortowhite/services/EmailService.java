package com.ortowhite.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom("samuelmiguelmedranoosorio@gmail.com");
        message.setSubject("Bienvenido a OWC Ortowhave");
        message.setText("Bienvenido a OWC Ortowhave\n\n" +
                "tu codigo es : " + verificationCode);
        
        mailSender.send(message);
    }
} 