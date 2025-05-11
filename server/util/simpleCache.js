// utils/simpleCache.js

export class SimpleCache {
    constructor(ttlMs = 1000 * 60 * 5) { // ברירת מחדל: 5 דקות
        this.cache = {};
        this.cacheTime = {};
        this.ttlMs = ttlMs;
    }

    get(key) {
        const now = Date.now();
        if (this.cache[key] && (now - this.cacheTime[key] < this.ttlMs)) {
            return this.cache[key];
        }
        return null;
    }

    set(key, value) {
        this.cache[key] = value;
        this.cacheTime[key] = Date.now();
    }

    clear(key) {
        delete this.cache[key];
        delete this.cacheTime[key];
    }

    clearAll() {
        this.cache = {};
        this.cacheTime = {};
    }
}
