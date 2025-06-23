package com.master.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "db_mst_db_config")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class DbConfig extends Auditable<String> {
    @Id
    @GenericGenerator(name = "idGenerator", strategy = "com.master.service.id.IdGenerator")
    @GeneratedValue(generator = "idGenerator")
    private Long id;
    private String name;
    private String url;
    private String username;
    private String password;
    private Integer maxConnection;
    private String driverClassName;
    private Boolean initialize;
    @ManyToOne
    @JoinColumn(name = "server_provider_id")
    private ServerProvider serverProvider;
    @OneToOne
    @JoinColumn(name = "location_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Location location;
}
