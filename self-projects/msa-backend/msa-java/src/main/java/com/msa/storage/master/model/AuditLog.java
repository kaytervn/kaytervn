package com.msa.storage.master.model;

import com.msa.constant.AppConstant;
import com.msa.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "db_audit_log")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class AuditLog extends Auditable<String> {
    @Id
    @GenericGenerator(name = AppConstant.ID_GENERATOR_NAME, strategy = AppConstant.ID_GENERATOR_STRATEGY)
    @GeneratedValue(generator = AppConstant.ID_GENERATOR_NAME)
    private Long id;
    private String endpoint;
    private String ipAddress;
    private String userAgent;
    private Integer statusCode;
    private Long durationMs;
}
