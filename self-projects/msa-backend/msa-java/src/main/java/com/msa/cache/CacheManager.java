package com.msa.cache;

import com.msa.cache.dto.SessionDto;
import com.msa.constant.SecurityConstant;
import lombok.Getter;

public class CacheManager {
    @Getter
    private static final LRUCache<String, SessionDto> cache = new LRUCache<>(SecurityConstant.CACHE_MAX_SIZE, SecurityConstant.CACHE_TTL);
}

