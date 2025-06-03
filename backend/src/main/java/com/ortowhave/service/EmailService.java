package com.ortowhave.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verificación de cuenta - Orto Whave");
            
            String htmlContent = 
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                "<h2 style='color: #4a5568;'>Verificación de cuenta - Orto Whave</h2>" +
                "<p>Gracias por registrarte en Orto Whave. Para completar tu registro, por favor utiliza el siguiente código de verificación:</p>" +
                "<div style='background-color: #f7fafc; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;'>" +
                "<h1 style='color: #4299e1; letter-spacing: 5px; font-size: 32px;'>" + verificationCode + "</h1>" +
                "</div>" +
                "<p>Este código expirará en 24 horas.</p>" +
                "<p>Si no has solicitado esta verificación, por favor ignora este correo.</p>" +
                "<p>Saludos,<br>El equipo de Orto Whave</p>" +
                "</div>";
            
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo de verificación", e);
        }
    }
}
