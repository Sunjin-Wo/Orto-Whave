package com.ortowhite.api.service;

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

    public void sendVerificationEmail(String to, String verificationCode, String name) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("verificationCode", verificationCode);
        
        String htmlContent = templateEngine.process("verification-email", context);
        
        helper.setFrom("noreply@ortowhite.com");
        helper.setTo(to);
        helper.setSubject("Verifica tu cuenta en OrthoWhite");
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
} 