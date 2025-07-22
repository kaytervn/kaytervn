package com.msa.cache;

import com.msa.cache.dto.SessionDto;
import lombok.Getter;

public class CacheManager {
    @Getter
    private static final LRUCache<String, SessionDto> cache = new LRUCache<>(1000, 2_592_000_000L);
}

