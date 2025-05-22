package com.base.auth.model.criteria;

import com.base.auth.model.Address;
import com.base.auth.model.Nation;
import com.base.auth.model.User;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Data
public class AddressCriteria {
    private Long id;
    private Long wardId;
    private Long districtId;
    private Long provinceId;
    private String name;
    private String phone;
    private Integer status;
    private Long userId;

    public Specification<Address> getSpecification(){
        return new Specification<Address>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Predicate toPredicate(Root<Address> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicateList = new ArrayList<>();
                if (getId() != null){
                    predicateList.add(criteriaBuilder.equal(root.get("id"), getId()));
                }
                if (getWardId() != null){
                    Join<Address, Nation> join = root.join("ward", JoinType.INNER);
                    predicateList.add(criteriaBuilder.equal(join.get("id"), getWardId()));
                }
                if (getDistrictId() != null){
                    Join<Address, Nation> join = root.join("district", JoinType.INNER);
                    predicateList.add(criteriaBuilder.equal(join.get("id"), getDistrictId()));
                }
                if (getProvinceId() != null){
                    Join<Address, Nation> join = root.join("province", JoinType.INNER);
                    predicateList.add(criteriaBuilder.equal(join.get("id"), getProvinceId()));
                }
                if (!StringUtils.isEmpty(getName())){
                    predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),"%"+getName()+"%"));
                }
                if (!StringUtils.isEmpty(getPhone())){
                    predicateList.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")),"%"+getPhone()+"%"));
                }
                if (getStatus() != null){
                    predicateList.add(criteriaBuilder.equal(root.get("status"), getStatus()));
                }
                if (getUserId() != null){
                    Join<Address, User> join = root.join("user", JoinType.INNER);
                    predicateList.add(criteriaBuilder.equal(join.get("id"), getUserId()));
                }
                return criteriaBuilder.and(predicateList.toArray(new Predicate[predicateList.size()]));
            }
        };
    }
}
