package com.master.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "db_mst_location")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Location extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.master.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private String tenantId;
    private String name;
    private String logoPath;
    private String hotline;
    @Column(columnDefinition = "LONGTEXT")
    private String settings;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    private Date startDate;
    private Date expiredDate;
    @OneToOne(mappedBy = "location", fetch = FetchType.LAZY)
    private DbConfig dbConfig;
}
