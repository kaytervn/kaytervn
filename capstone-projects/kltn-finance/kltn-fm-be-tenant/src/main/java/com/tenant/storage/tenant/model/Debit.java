package com.tenant.storage.tenant.model;

import com.tenant.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_fn_debit")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Debit extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.tenant.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private String name;
    private Integer kind; // 1: income, 2: expenditure
    private Integer state; //  1: created, 2: approve, 3: reject, 4: paid
    private String money;
    private Date transactionDate;
    @Column(columnDefinition = "text")
    private String note;
    @Column(columnDefinition = "text")
    private String document;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @ManyToOne
    @JoinColumn(name = "transaction_group_id")
    private TransactionGroup transactionGroup;
    @ManyToOne
    @JoinColumn(name = "added_by")
    private Account addedBy;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;
    @ManyToOne
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
