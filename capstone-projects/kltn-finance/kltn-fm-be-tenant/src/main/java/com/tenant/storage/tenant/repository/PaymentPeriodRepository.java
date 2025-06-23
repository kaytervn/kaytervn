package com.tenant.storage.tenant.repository;

import com.tenant.storage.tenant.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PaymentPeriodRepository extends JpaRepository<PaymentPeriod, Long>, JpaSpecificationExecutor<PaymentPeriod> {
}