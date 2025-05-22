package com.base.auth.model.criteria;

import com.base.auth.model.Account;
import com.base.auth.model.User;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class UserCriteria {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private Integer status;
    public Specification<User> getSpecification() {
        return new Specification<User>() {
            private static final long serialVersionUID = 1L;

            @Override
            public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();

                if(getId()!=null)
                {
                    predicates.add(cb.equal(root.get("id"),getId()));
                }
                if(getStatus()!=null)
                {
                    predicates.add(cb.equal(root.get("status"),getStatus()));
                }
                if (!StringUtils.isBlank(getPhone()))
                {
                    Join<User, Account> joinAccount = root.join("account",JoinType.INNER);
                    predicates.add(cb.like(cb.lower(joinAccount.get("phone")),"%"+ getPhone()+"%"));
                }
                if (!StringUtils.isBlank(getEmail()))
                {
                    Join<User, Account> joinAccount = root.join("account",JoinType.INNER);
                    predicates.add(cb.like(cb.lower(joinAccount.get("email")),"%"+ getEmail()+"%"));
                }
                if (!StringUtils.isBlank(getFullName()))
                {
                    Join<User, Account> joinAccount = root.join("account",JoinType.INNER);
                    predicates.add(cb.like(cb.lower(joinAccount.get("fullName")),"%"+ getFullName()+"%"));
                }

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
    }
}
