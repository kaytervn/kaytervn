package com.msa.storage.master.model;

import com.msa.constant.AppConstant;
import com.msa.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "db_group")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Group extends Auditable<String> {
    @Id
    @GenericGenerator(name = AppConstant.ID_GENERATOR_NAME, strategy = AppConstant.ID_GENERATOR_STRATEGY)
    @GeneratedValue(generator = AppConstant.ID_GENERATOR_NAME)
    private Long id;
    @Column(unique = true)
    private String name;
    private Integer kind;  // 1: Admin, 2: User
    private Boolean isSystem = false;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinTable(name = "db_permission_group",
            joinColumns = @JoinColumn(name = "group_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id",
                    referencedColumnName = "id"))
    private List<Permission> permissions = new ArrayList<>();
}
