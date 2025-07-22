package com.msa.storage.master.model.criteria;

import com.msa.storage.master.model.Group;
import com.msa.storage.master.model.User;
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
public class UserCriteria {
    private Long id;
    private Integer kind;
    private String username;
    private String fullName;
    private String email;
    private Long groupId;
    private Integer status;
    private String keyword;

    public Specification<User> getCriteria() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (getId() != null) {
                predicates.add(cb.equal(root.get("id"), getId()));
            }
            if (getKind() != null) {
                predicates.add(cb.equal(root.get("kind"), getKind()));
            }
            if (StringUtils.isNotBlank(getUsername())) {
                predicates.add(cb.like(cb.lower(root.get("username")), "%" + getUsername().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getFullName())) {
                predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + getFullName().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getEmail())) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + getEmail().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(getKeyword())) {
                String keywordLower = "%" + getKeyword().toLowerCase() + "%";
                Join<User, Group> groupJoin = root.join("group", JoinType.LEFT);
                Predicate p1 = cb.like(cb.lower(root.get("username")), keywordLower);
                Predicate p2 = cb.like(cb.lower(root.get("fullName")), keywordLower);
                Predicate p3 = cb.like(cb.lower(root.get("email")), keywordLower);
                Predicate p4 = cb.like(cb.lower(groupJoin.get("name")), keywordLower);
                predicates.add(cb.or(p1, p2, p3, p4));
            }
            if (getGroupId() != null) {
                Join<User, Group> join = root.join("group", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), getGroupId()));
            }
            if (getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), getStatus()));
            }
            query.orderBy(
                    cb.desc(root.get("isSuperAdmin")),
                    cb.asc(root.get("kind")),
                    cb.asc(root.get("username"))
            );
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}