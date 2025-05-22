package com.base.auth.model.criteria;

import com.base.auth.model.Account;
import com.base.auth.model.Service;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class ServiceCriteria {

    private Long id;
    private Long accountId;
    private String serviceName;
    private Integer status;

    public static Specification<Service> findServiceByCriteria(final ServiceCriteria serviceCriteria) {
        return new Specification<Service>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<Service> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (serviceCriteria.getAccountId() != null) {
                    Join<Service, Account> account = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(account.get("id"), serviceCriteria.getAccountId()));
                }
                if (serviceCriteria.getId() != null) {
                    predicates.add(cb.equal(root.get("id"), serviceCriteria.getId()));
                }
                if (!StringUtils.isEmpty(serviceCriteria.getServiceName())) {
                    predicates.add(cb.like(cb.lower(root.get("serviceName")), "%" + serviceCriteria.getServiceName().toLowerCase() + "%"));
                }
                if (serviceCriteria.getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), serviceCriteria.getStatus()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
