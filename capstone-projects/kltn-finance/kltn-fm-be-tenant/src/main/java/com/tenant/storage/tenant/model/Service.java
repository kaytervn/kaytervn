package com.tenant.storage.tenant.model;

import com.tenant.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_fn_service")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Service extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.tenant.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private String name;
    private Integer kind; // 1: income, 2: expenditure
    @Column(columnDefinition = "text")
    private String description;
    private String money;
    private Date startDate;
    private Integer periodKind;
    private Date expirationDate;
    private Integer isPaid; // Only with period kind = 1
    @ManyToOne
    @JoinColumn(name = "service_group_id")
    private ServiceGroup serviceGroup;
    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
