package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.ChatHistory;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ChatHistoryCriteria {
    private Long id;
    private String role;
    private String message;
    private Long accountId;
    private Integer status;
    private Integer isPaged = FinanceConstant.BOOLEAN_TRUE;

    public Specification<ChatHistory> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (StringUtils.isNotBlank(getRole())) {
                predicates.add(cb.like(cb.lower(root.get("role")), "%" + getRole().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getMessage())) {
                predicates.add(cb.like(cb.lower(root.get("message")), "%" + getMessage().toLowerCase() + "%"));
            }
            if (getAccountId() != null) {
                Join<ChatHistory, Account> join = root.join("account", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getAccountId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(cb.desc(root.get("createdDate")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
