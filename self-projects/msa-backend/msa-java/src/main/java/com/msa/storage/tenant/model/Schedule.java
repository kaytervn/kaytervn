package com.msa.storage.tenant.model;

import com.msa.constant.AppConstant;
import com.msa.storage.Auditable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_schedule")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Schedule extends Auditable<String> {
    @Id
    @GenericGenerator(name = AppConstant.ID_GENERATOR_NAME, strategy = AppConstant.ID_GENERATOR_STRATEGY)
    @GeneratedValue(generator = AppConstant.ID_GENERATOR_NAME)
    private Long id;
    private String name;
    private String sender;
    @Column(columnDefinition = "TEXT")
    private String emails;
    private String imagePath;
    @Column(columnDefinition = "TEXT")
    private String content;
    private Integer kind; // 1: days, 2: months, 3: day_month, 4: exact_date
    private Integer amount;
    private String time;
    private String checkedDate;
    private Date dueDate;
    private Integer type; // 1: auto_renew, 2: manual_renew, 3: suspended
    private Boolean isSent = false;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
