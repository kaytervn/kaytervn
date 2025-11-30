package com.msa.component;

import com.msa.dto.auditLog.AuditLogDto;
import com.msa.storage.master.model.AuditLog;
import com.msa.storage.master.repository.AuditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Aspect
@Component
@Slf4j
public class AuditLogAspect {
    private static final ThreadLocal<AuditLogDto> contextHolder = new ThreadLocal<>();
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Around("@annotation(auditLogAnnotation)")
    public Object logAround(ProceedingJoinPoint joinPoint, AuditLogAnnotation auditLogAnnotation) throws Throwable {
        AuditLogDto ctx = new AuditLogDto();
        contextHolder.set(ctx);
        long start = System.currentTimeMillis();
        try {
            extractRequestInfo(ctx);
            Object result = joinPoint.proceed();
            ctx.setStatusCode(getStatusCode(result));
            return result;
        } catch (Exception ex) {
            ctx.setStatusCode(500);
            throw ex;
        } finally {
            ctx.setDurationMs(System.currentTimeMillis() - start);
            saveAuditLog(ctx);
            contextHolder.remove();
        }
    }

    private void extractRequestInfo(AuditLogDto ctx) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) return;
        HttpServletRequest request = attributes.getRequest();
        String fullEndpoint = request.getMethod() + " " +
                Optional.ofNullable(request.getQueryString())
                        .filter(s -> !s.isBlank())
                        .map(q -> request.getRequestURI() + "?" + q)
                        .orElse(request.getRequestURI());
        ctx.setEndpoint(fullEndpoint);
        ctx.setIpAddress(getClientIp(request));
        ctx.setUserAgent(request.getHeader("User-Agent"));
    }

    @Async
    private void saveAuditLog(AuditLogDto ctx) {
        AuditLog log = new AuditLog();
        log.setEndpoint(ctx.getEndpoint());
        log.setIpAddress(ctx.getIpAddress());
        log.setUserAgent(ctx.getUserAgent());
        log.setStatusCode(ctx.getStatusCode());
        log.setDurationMs(ctx.getDurationMs());
        auditLogRepository.save(log);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip.split(",")[0].trim();
        }
        ip = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(ip)) return ip;
        return request.getRemoteAddr();
    }

    private int getStatusCode(Object result) {
        if (result instanceof ResponseEntity) {
            ResponseEntity<?> re = (ResponseEntity<?>) result;
            return re.getStatusCode().value();
        }
        return 200;
    }
}