package com.master.model.criteria;

import com.master.constant.MasterConstant;
import com.master.model.ServerProvider;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.criteria.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class ServerProviderCriteria implements Serializable {
    private Long id;
    private String name;
    private String url;
    private Integer maxTenant;
    private Integer currentTenantCount;
    private String mySqlJdbcUrl;
    private String mySqlRootUser;
    private Integer status;
    private Integer sortDate;
    private Integer isPaged = MasterConstant.BOOLEAN_TRUE;

    public Specification<ServerProvider> getCriteria() {
        return new Specification<ServerProvider>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<ServerProvider> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
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
                if (getMaxTenant() != null) {
                    predicates.add(cb.equal(root.get("maxTenant"), getMaxTenant()));
                }
                if (getCurrentTenantCount() != null) {
                    predicates.add(cb.equal(root.get("currentTenantCount"), getCurrentTenantCount()));
                }
                if (StringUtils.isNotBlank(getMySqlJdbcUrl())) {
                    predicates.add(cb.like(cb.lower(root.get("mySqlJdbcUrl")), "%" + getMySqlJdbcUrl().toLowerCase() + "%"));
                }
                if (StringUtils.isNotBlank(getMySqlRootUser())) {
                    predicates.add(cb.like(cb.lower(root.get("mySqlRootUser")), "%" + getMySqlRootUser().toLowerCase() + "%"));
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