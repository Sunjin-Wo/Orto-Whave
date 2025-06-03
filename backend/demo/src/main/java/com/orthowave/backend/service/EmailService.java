package com.orthowave.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        Context context = new Context();
        context.setVariable("token", token);
        String emailContent = templateEngine.process("verification-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom("noresetowc@hotmail.com");
        helper.setTo(to);
        helper.setSubject("Verifica tu cuenta - OrthoWave");
        helper.setText(emailContent, true);

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String token) throws MessagingException {
        Context context = new Context();
        context.setVariable("token", token);
        String emailContent = templateEngine.process("password-reset-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom("noresetowc@hotmail.com");
        helper.setTo(to);
        helper.setSubject("Restablece tu contraseña - OrthoWave");
        helper.setText(emailContent, true);

        mailSender.send(message);
    }
} 