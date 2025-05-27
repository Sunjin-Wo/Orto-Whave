package com.orthowave.service;

import com.orthowave.model.Cita;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
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
} 