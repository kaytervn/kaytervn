package com.master.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_mst_account")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Account extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.master.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private Integer kind;
    private String username;
    @JsonIgnore
    private String password;
    private String fullName;
    private String avatarPath;
    private String phone;
    private String email;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;
    private Date lastLogin;
    private String resetPwdCode;
    private Date resetPwdTime;
    @Column(name = "attempt_forget_pwd")
    private Integer attemptCode;
    private Integer attemptLogin;
    private Boolean isSuperAdmin = false;
    private String secretKey;
    private Boolean isMfa = false;
}
