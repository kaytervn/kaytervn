package com.msa.multitenancy;

import com.msa.constant.SecurityConstant;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {
    @Override
    public String resolveCurrentTenantIdentifier() {
        return StringUtils.isNotBlank(TenantDBContext.getCurrentTenant()) ? TenantDBContext.getCurrentTenant() : SecurityConstant.DEFAULT_TENANT_ID;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}