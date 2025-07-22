package com.msa.storage.tenant.model.criteria;

import com.msa.constant.AppConstant;
import com.msa.storage.tenant.model.Account;
import com.msa.storage.tenant.model.Platform;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AccountCriteria {
    private Long id;
    private Integer kind;
    private String username;
    private String keyword;
    private Long platformId;
    private Long parentId;
    private Integer status;
    private Integer sortOption;

    public Specification<Account> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Account, Platform> platformJoin = root.join("platform", JoinType.LEFT);
            Join<Account, Account> parentJoin = root.join("parent", JoinType.LEFT);
            Join<Account, Platform> parentPlatformJoin = parentJoin.join("platform", JoinType.LEFT);
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (getKind() != null) {
                predicates.add(cb.equal(root.get("kind"), getKind()));
            }
            if (StringUtils.isNotBlank(getUsername())) {
                predicates.add(cb.like(cb.lower(root.get("username")), "%" + getUsername().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getKeyword())) {
                String keywordLower = "%" + getKeyword().toLowerCase() + "%";

                Predicate p1 = cb.like(cb.lower(root.get("username")), keywordLower);
                Predicate p2 = cb.like(cb.lower(root.get("note")), keywordLower);
                Predicate p3 = cb.like(cb.lower(platformJoin.get("name")), keywordLower);
                Predicate p4 = cb.like(cb.lower(platformJoin.get("url")), keywordLower);

                Predicate p5 = cb.like(cb.lower(parentJoin.get("username")), keywordLower);
                Predicate p6 = cb.like(cb.lower(parentJoin.get("note")), keywordLower);
                Predicate p7 = cb.like(cb.lower(parentPlatformJoin.get("name")), keywordLower);
                Predicate p8 = cb.like(cb.lower(parentPlatformJoin.get("url")), keywordLower);

                predicates.add(cb.or(p1, p2, p3, p4, p5, p6, p7, p8));
            }
            if (getPlatformId() != null) {
                Join<Account, Platform> join = root.join("platform", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getPlatformId()));
            }
            if (getParentId() != null) {
                Join<Account, Account> join = root.join("parent", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getParentId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            List<Order> orderList = new ArrayList<>();
            if (getSortOption() != null) {
                switch (getSortOption()) {
                    case AppConstant.ACCOUNT_SORT_CREATED_DATE_DESC:
                        orderList.add(cb.desc(root.get("createdDate")));
                        break;
                    case AppConstant.ACCOUNT_SORT_CHILDREN_DESC:
                        orderList.add(cb.desc(root.get("totalChildren")));
                        break;
                    case AppConstant.ACCOUNT_SORT_BACKUP_CODES_DESC:
                        orderList.add(cb.desc(root.get("totalBackupCodes")));
                        break;
                }
            }
            orderList.add(cb.asc(platformJoin.get("name")));
            orderList.add(cb.asc(root.get("username")));
            orderList.add(cb.asc(parentPlatformJoin.get("name")));
            orderList.add(cb.asc(parentJoin.get("username")));
            query.orderBy(orderList);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}