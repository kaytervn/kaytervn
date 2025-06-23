package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;

import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class UserGroupNotificationCriteria {
    private Long id;
    private Integer status;
    private Long accountId;
    private Long notificationGroupId;
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true

    public Specification<UserGroupNotification> getCriteria() {
        return new Specification<UserGroupNotification>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<UserGroupNotification> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if(getId() != null){
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if (getAccountId() != null){
                    Join<UserGroupNotification, Account> joinAccount = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(joinAccount.get("id"), getAccountId()));
                }
                if (getNotificationGroupId() != null){
                    Join<UserGroupNotification, NotificationGroup> joinNotificationGroup = root.join("notificationGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinNotificationGroup.get("id"), getNotificationGroupId()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
