package com.msa.cache;

import java.util.*;
import java.util.concurrent.*;

public class LRUCache<K, V> {
    private final long ttlMillis;
    private final Map<K, CacheItem<V>> cache;

    private static class CacheItem<V> {
        final V value;
        final long expireAt;

        CacheItem(V value, long ttlMillis) {
            this.value = value;
            this.expireAt = System.currentTimeMillis() + ttlMillis;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expireAt;
        }
    }

    public LRUCache(int maxSize, long ttlMillis) {
        this.ttlMillis = ttlMillis;
        this.cache = new LinkedHashMap<K, CacheItem<V>>(16, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<K, CacheItem<V>> eldest) {
                return size() > maxSize;
            }
        };
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(
                this::purgeExpiredItems, 10, 10, TimeUnit.SECONDS
        );
    }

    public synchronized void put(K key, V value) {
        cache.put(key, new CacheItem<>(value, ttlMillis));
    }

    public synchronized V get(K key) {
        CacheItem<V> item = cache.get(key);
        if (item == null || item.isExpired()) {
            cache.remove(key);
            return null;
        }
        return item.value;
    }

    public synchronized void remove(K key) {
        cache.remove(key);
    }

    private synchronized void purgeExpiredItems() {
        cache.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    public synchronized void putWithoutTTLUpdate(K key, V value) {
        CacheItem<V> existing = cache.get(key);
        if (existing != null && !existing.isExpired()) {
            cache.put(key, new CacheItem<>(value, existing.expireAt - System.currentTimeMillis()));
        } else {
            put(key, value);
        }
    }
}

