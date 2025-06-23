package com.tenant.storage.tenant.model;

import com.tenant.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "db_fn_tag")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Tag extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.tenant.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private Integer kind; // 1: Transaction/Debit, 2: Service, 3: Key Information, 4: Project
    private String name; // unique by kind
    private String colorCode; // HEX String
}
