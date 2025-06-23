package com.tenant.multitenancy.tenant;

import com.tenant.multitenancy.constant.TenantConstant;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {

    private String defaultTenant = TenantConstant.DEFAULT_TENANT_ID;

    @Override
    public String resolveCurrentTenantIdentifier() {
        String t = TenantDBContext.getCurrentTenant();
        if (t != null) {
            return t;
        } else {
            return defaultTenant;
        }
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
