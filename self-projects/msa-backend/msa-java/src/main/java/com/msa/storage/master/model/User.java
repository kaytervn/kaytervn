package com.msa.storage.master.model;

import com.msa.constant.AppConstant;
import com.msa.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_user")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class User extends Auditable<String> {
    @Id
    @GenericGenerator(name = AppConstant.ID_GENERATOR_NAME, strategy = AppConstant.ID_GENERATOR_STRATEGY)
    @GeneratedValue(generator = AppConstant.ID_GENERATOR_NAME)
    private Long id;
    private Integer kind; // 1: Admin, 2: User
    private String username;
    private String password;
    private String fullName;
    private String avatarPath;
    private String email;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;
    private Date lastLogin;
    private String resetPwdCode;
    private Date resetPwdTime;
    private String secretKey;
    private Boolean isMfa = false;
    private Boolean isSuperAdmin = false;
}

