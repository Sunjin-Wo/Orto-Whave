package com.orthowave.service;

import com.orthowave.model.Cita;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    
    private static final String ENCODING = "UTF-8";
    private static final DateTimeFormatter FECHA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public void enviarConfirmacionCita(Cita cita) {
        try {
            Context context = new Context(new Locale("es"));
            context.setVariable("cita", cita);
            context.setVariable("fechaFormateada", cita.getFechaHora().format(FECHA_FORMATTER));
            
            String contenido = templateEngine.process("emails/confirmacion-cita", context);
            
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, ENCODING);
            
            helper.setTo(cita.getPaciente().getEmail());
            helper.setSubject("Confirmación de Cita - OrthoWave");
            helper.setText(contenido, true);
            
            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de confirmación", e);
        }
    }

    public void enviarNotificacionCancelacion(Cita cita) {
        try {
            Context context = new Context(new Locale("es"));
            context.setVariable("cita", cita);
            context.setVariable("fechaFormateada", cita.getFechaHora().format(FECHA_FORMATTER));
            
            String contenido = templateEngine.process("emails/cancelacion-cita", context);
            
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, ENCODING);
            
            helper.setTo(cita.getPaciente().getEmail());
            helper.setSubject("Cancelación de Cita - OrthoWave");
            helper.setText(contenido, true);
            
            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de cancelación", e);
        }
    }

    public void enviarRecordatorioCita(Cita cita) {
        try {
            Context context = new Context(new Locale("es"));
            context.setVariable("cita", cita);
            context.setVariable("fechaFormateada", cita.getFechaHora().format(FECHA_FORMATTER));
            
            String contenido = templateEngine.process("emails/recordatorio-cita", context);
            
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, ENCODING);
            
            helper.setTo(cita.getPaciente().getEmail());
            helper.setSubject("Recordatorio de Cita - OrthoWave");
            helper.setText(contenido, true);
            
            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el recordatorio", e);
        }
    }

    @Async
    public void sendVerificationEmail(String to, String nombre, String token) {
        try {
            Context context = new Context();
            context.setVariable("nombre", nombre);
            context.setVariable("verificationLink", 
                "https://orthowave.co/verify?token=" + token);

            String htmlContent = templateEngine.process("verification-email", context);
            sendHtmlEmail(to, "Verifica tu cuenta en OrthoWave", htmlContent);
            
            log.info("Correo de verificación enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error al enviar correo de verificación a: {}", to, e);
            throw new RuntimeException("Error al enviar correo de verificación", e);
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String nombre, String token) {
        try {
            Context context = new Context();
            context.setVariable("nombre", nombre);
            context.setVariable("resetLink", 
                "https://orthowave.co/reset-password?token=" + token);

            String htmlContent = templateEngine.process("reset-password-email", context);
            sendHtmlEmail(to, "Recuperación de contraseña - OrthoWave", htmlContent);
            
            log.info("Correo de recuperación de contraseña enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error al enviar correo de recuperación de contraseña a: {}", to, e);
            throw new RuntimeException("Error al enviar correo de recuperación", e);
        }
    }

    @Async
    public void sendAppointmentConfirmation(String to, String nombre, String fecha, String especialista) {
        try {
            Context context = new Context();
            context.setVariable("nombre", nombre);
            context.setVariable("fecha", fecha);
            context.setVariable("especialista", especialista);

            String htmlContent = templateEngine.process("appointment-confirmation", context);
            sendHtmlEmail(to, "Confirmación de cita - OrthoWave", htmlContent);
            
            log.info("Correo de confirmación de cita enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error al enviar correo de confirmación de cita a: {}", to, e);
            throw new RuntimeException("Error al enviar correo de confirmación de cita", e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        emailSender.send(message);
    }
} 