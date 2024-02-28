const redis = require("../redis");

const MemoryCache = {
  set: (key, value, expiration) => redis.saveKey(key, value, expiration),
  get: (key) => redis.getKey(key),
  del: (key) => redis.deleteKey(key),
};

const preprocessKey = (key, cacheType) => {
  const CACHE_COLLECTION = ["taxonomy", "tokenTemplate"];
  return (
    (CACHE_COLLECTION.includes(cacheType) ? cacheType : "") +
    "-" +
    key.toLowerCase()
  );
};

class TaxonomyCache {
  constructor() {
    this.cache = MemoryCache;
  }

  async saveToCache(cacheKey, taxonomy, absoluteExpiration) {
    await this.cache.set(
      preprocessKey(cacheKey, "taxonomy"),
      taxonomy,
      absoluteExpiration
    );
  }

  async getFromCache(cacheKey) {
    return await this.cache.get(preprocessKey(cacheKey, "taxonomy"));
  }

  async removeFromCache(cacheKey) {
    await this.cache.del(preprocessKey(cacheKey, "taxonomy"));
  }

  async isInCache(cacheKey) {
    return (await this.cache.get(preprocessKey(cacheKey, "taxonomy"))) !== null;
  }

  async removeFromCache(cacheKey) {
    await this.cache.del(preprocessKey(cacheKey, "taxonomy"));
  }
}

class TokenTemplateCache {
  constructor() {
    this.cache = MemoryCache;
  }

  async loadTemplates(templates) {
    templates.Template.forEach(async (t) => {
      await this.saveToCache(t.key, t.Value);
    });
  }

  async saveToCache(cacheKey, template, absoluteExpiration) {
    await this.cache.set(
      preprocessKey(cacheKey, "tokenTemplate"),
      template,
      absoluteExpiration
    );
  }

  async getFromCache(cacheKey) {
    return await this.cache.get(preprocessKey(cacheKey, "tokenTemplate"));
  }

  async removeFromCache(cacheKey) {
    await this.cache.del(preprocessKey(cacheKey, "tokenTemplate"));
  }

  async isInCache(cacheKey) {
    return (
      (await this.cache.get(preprocessKey(cacheKey, "tokenTemplate"))) !== null
    );
  }
}

const tom = new TaxonomyCache();
const templateCache = new TokenTemplateCache();
module.exports = { tom, templateCache };
