package com.msa.dto.auditLog;

import com.msa.dto.ABasicAdminDto;
import lombok.Data;

@Data
public class AuditLogDto extends ABasicAdminDto {
    private String endpoint;
    private String ipAddress;
    private String userAgent;
    private Integer statusCode = 200;
    private Long durationMs;
}
