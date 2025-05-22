package com.base.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "db_user_base_service")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Service extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "account_id")
    private Account account;
    private String tenantId;
    @Column(name = "service_name")
    private String serviceName;
    @Column(name = "logo_path")
    private String logoPath;
    @Column(name = "banner_path")
    private String bannerPath;
    @Column(name = "hotline")
    private String hotline;
    @Column(name = "settings" ,  columnDefinition = "TEXT")
    private String settings;
    @Column(name = "lang")
    private String lang;
}
