package com.tenant.storage.tenant.model.criteria;

import com.tenant.constant.FinanceConstant;
import com.tenant.storage.tenant.model.*;
import lombok.Data;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class KeyInformationCriteria {
    private Long id;
    private Integer kind; // 1: Server, 2: Google
    private Long accountId;
    private Long keyInformationGroupId;
    private Long organizationId;
    private Integer status;
    private Integer sortDate; // 1: asc, 2: desc
    private Integer isPaged = FinanceConstant.IS_PAGED_TRUE; // 0: false, 1: true
    private List<Long> keyInformationIds;
    private Long permissionAccountId;
    private Long tagId;

    public Specification<KeyInformation> getCriteria() {
        return new Specification<KeyInformation>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<KeyInformation> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (getPermissionAccountId() != null) {
                    Subquery<KeyInformationPermission> subquery = query.subquery(KeyInformationPermission.class);
                    Root<KeyInformationPermission> subRoot = subquery.from(KeyInformationPermission.class);
                    subquery.select(subRoot.get("id"))
                            .where(cb.and(
                                    cb.equal(subRoot.get("account").get("id"), getPermissionAccountId()),
                                    cb.or(
                                            cb.and(cb.equal(subRoot.get("keyInformation"), root), cb.equal(subRoot.get("permissionKind"), 1)),
                                            cb.and(cb.equal(subRoot.get("keyInformationGroup"), root.get("keyInformationGroup")), cb.equal(subRoot.get("permissionKind"), 2))
                                    )
                            ));
                    predicates.add(cb.exists(subquery));
                }
                if (getId() != null) {
                    predicates.add(cb.equal(root.get("id"), getId()));
                }
                if (getKind() != null) {
                    predicates.add(cb.equal(root.get("kind"), getKind()));
                }
                if (getAccountId() != null) {
                    Join<KeyInformation, Account> joinAccount = root.join("account", JoinType.INNER);
                    predicates.add(cb.equal(joinAccount.get("id"), getAccountId()));
                }
                if (getKeyInformationGroupId() != null) {
                    Join<KeyInformation, KeyInformationGroup> joinKeyInformationGroup = root.join("keyInformationGroup", JoinType.INNER);
                    predicates.add(cb.equal(joinKeyInformationGroup.get("id"), getKeyInformationGroupId()));
                }
                if (getOrganizationId() != null) {
                    Join<KeyInformation, Organization> joinOrganization = root.join("organization", JoinType.INNER);
                    predicates.add(cb.equal(joinOrganization.get("id"), getOrganizationId()));
                }
                if(getStatus() != null){
                    predicates.add(cb.equal(root.get("status"), getStatus()));
                }
                if(getSortDate() != null){
                    if(getSortDate().equals(FinanceConstant.SORT_DATE_ASC)){
                        query.orderBy(cb.asc(root.get("createdDate")));
                    }else{
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
                if (getKeyInformationIds() != null && !getKeyInformationIds().isEmpty()) {
                    predicates.add(root.get("id").in(getKeyInformationIds()));
                }
                if (getTagId() != null) {
                    Join<KeyInformation, Tag> joinTag = root.join("tag", JoinType.INNER);
                    predicates.add(cb.equal(joinTag.get("id"), getTagId()));
                }
                query.distinct(true);
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}