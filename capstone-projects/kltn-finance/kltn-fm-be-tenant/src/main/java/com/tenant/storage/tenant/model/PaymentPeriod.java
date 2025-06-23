package com.tenant.storage.tenant.model;

import com.tenant.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_fn_payment_period")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class PaymentPeriod extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.tenant.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private String name;
    private Integer state; //  1: created, 2: approve, 4: paid
    private Date startDate;
    private Date endDate;
    private String totalIncome;
    private String totalExpenditure;
}
