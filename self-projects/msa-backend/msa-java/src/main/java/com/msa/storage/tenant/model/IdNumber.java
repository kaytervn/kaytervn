package com.msa.storage.tenant.model;

import com.msa.constant.AppConstant;
import com.msa.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "db_id_number")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class IdNumber extends Auditable<String> {
    @Id
    @GenericGenerator(name = AppConstant.ID_GENERATOR_NAME, strategy = AppConstant.ID_GENERATOR_STRATEGY)
    @GeneratedValue(generator = AppConstant.ID_GENERATOR_NAME)
    private Long id;
    private String name;
    private String code;
    @Column(columnDefinition = "TEXT")
    private String note;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
