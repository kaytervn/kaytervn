package com.master.model.criteria;

import com.master.constant.MasterConstant;
import com.master.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.criteria.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class DbConfigCriteria implements Serializable {
    private Long id;
    private String name;
    private String url;
    private String username;
    private Integer maxConnection;
    private String driverClassName;
    private Boolean initialize;
    private Long serverProviderId;
    private Integer status;
    private Integer sortDate;
    private Integer isPaged = MasterConstant.BOOLEAN_TRUE;

    public Specification<DbConfig> getCriteria() {
        return new Specification<DbConfig>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<DbConfig> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if (getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (StringUtils.isNotBlank(getName())) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + getName().toLowerCase() + "%"));
                }
                if (StringUtils.isNotBlank(getUrl())) {
                    predicates.add(cb.like(cb.lower(root.get("url")), "%" + getUrl().toLowerCase() + "%"));
                }
                if (StringUtils.isNotBlank(getUsername())) {
                    predicates.add(cb.like(cb.lower(root.get("username")), "%" + getUsername().toLowerCase() + "%"));
                }
                if (getMaxConnection() != null) {
                    predicates.add(cb.equal(root.get("maxConnection"), getMaxConnection()));
                }
                if (StringUtils.isNotBlank(getDriverClassName())) {
                    predicates.add(cb.like(cb.lower(root.get("driverClassName")), "%" + getDriverClassName().toLowerCase() + "%"));
                }
                if (getInitialize() != null) {
                    predicates.add(cb.equal(root.get("initialize"), getInitialize()));
                }
                if (getServerProviderId() != null) {
                    Join<DbConfig, ServerProvider> joinServerProvider = root.join("serverProvider", JoinType.INNER);
                    predicates.add(cb.equal(joinServerProvider.get("id"), getServerProviderId()));
                }
                if (getSortDate() != null) {
                    if (getSortDate().equals(MasterConstant.SORT_DATE_ASC)) {
                        query.orderBy(cb.asc(root.get("createdDate")));
                    } else {
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
                return cb.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}
