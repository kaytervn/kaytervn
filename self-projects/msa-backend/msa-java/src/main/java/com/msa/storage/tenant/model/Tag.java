package com.msa.storage.tenant.model;

import com.msa.constant.AppConstant;
import com.msa.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "db_tag")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Tag extends Auditable<String> {
    @Id
    @GenericGenerator(name = AppConstant.ID_GENERATOR_NAME, strategy = AppConstant.ID_GENERATOR_STRATEGY)
    @GeneratedValue(generator = AppConstant.ID_GENERATOR_NAME)
    private Long id;
    @Column(unique = true)
    private String name;
    private String color;
    private Integer kind; // 1: account, 2: bank, 3: contact, 4: id_number, 5: link, 6: note, 7: schedule, 8: software
}
