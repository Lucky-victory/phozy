import NodeCache from "node-cache";

export default class CacheManager {
  cache!: NodeCache;
  constructor() {
    this.cache = new NodeCache();
  }
  get<T>(key: string) {
    return this.cache.get<T>(key);
  }
  set<T>(key: string, value: T, ttl: number = 30) {
    return this.cache.set<T>(key, value, ttl);
  }
}
