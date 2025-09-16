#!/usr/bin/env node

import { test, describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { 
  cache, 
  rateLimiter, 
  performanceMonitor, 
  withCache, 
  withPerformanceMonitoring,
  generateCacheKey,
  getSystemStats
} from '../performance.js';

describe('Performance System', () => {
  
  beforeEach(() => {
    // Clear cache and reset rate limiter before each test
    cache.clear();
    rateLimiter.concurrent = 0;
    rateLimiter.requests.clear();
  });

  describe('Cache System', () => {
    it('should store and retrieve values', () => {
      cache.set('test-key', 'test-value', 1000);
      const retrieved = cache.get('test-key');
      assert.strictEqual(retrieved, 'test-value', 'Should retrieve stored value');
    });

    it('should return null for non-existent keys', () => {
      const retrieved = cache.get('non-existent');
      assert.strictEqual(retrieved, null, 'Should return null for non-existent key');
    });

    it('should expire entries after TTL', async () => {
      cache.set('test-key', 'test-value', 50); // 50ms TTL
      
      // Should exist immediately
      assert.strictEqual(cache.get('test-key'), 'test-value');
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should be expired
      assert.strictEqual(cache.get('test-key'), null, 'Should expire after TTL');
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 1000);
      
      cache.clear();
      
      assert.strictEqual(cache.get('key1'), null, 'Should clear key1');
      assert.strictEqual(cache.get('key2'), null, 'Should clear key2');
    });

    it('should provide cache statistics', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 1000);
      
      const stats = cache.getStats();
      assert.strictEqual(stats.size, 2, 'Should report correct size');
      assert(Array.isArray(stats.entries), 'Should provide entries array');
      assert(stats.memoryUsage, 'Should include memory usage');
    });

    it('should generate consistent cache keys', () => {
      const key1 = generateCacheKey('operation', { param1: 'value1', param2: 'value2' });
      const key2 = generateCacheKey('operation', { param2: 'value2', param1: 'value1' });
      
      assert.strictEqual(key1, key2, 'Should generate same key regardless of parameter order');
    });
  });

  describe('Rate Limiter', () => {
    it('should allow requests within limits', () => {
      const result = rateLimiter.checkLimit('client1');
      assert(result.allowed, 'Should allow first request');
      assert.strictEqual(result.current.concurrent, 1, 'Should track concurrent requests');
    });

    it('should enforce concurrent limits', () => {
      // Fill up concurrent slots
      for (let i = 0; i < rateLimiter.limits.concurrent; i++) {
        const result = rateLimiter.checkLimit(`client${i}`);
        assert(result.allowed, `Request ${i} should be allowed`);
      }
      
      // Next request should be denied
      const result = rateLimiter.checkLimit('client-overflow');
      assert(!result.allowed, 'Should deny request when concurrent limit reached');
    });

    it('should release concurrent slots', () => {
      rateLimiter.checkLimit('client1');
      assert.strictEqual(rateLimiter.concurrent, 1, 'Should increment concurrent count');
      
      rateLimiter.release();
      assert.strictEqual(rateLimiter.concurrent, 0, 'Should decrement concurrent count');
    });

    it('should provide rate limiter statistics', () => {
      rateLimiter.checkLimit('client1');
      rateLimiter.checkLimit('client2');
      
      const stats = rateLimiter.getStats();
      assert.strictEqual(stats.concurrent, 2, 'Should report current concurrent requests');
      assert(stats.maxConcurrent > 0, 'Should report max concurrent limit');
      assert(stats.clients >= 0, 'Should report client count');
    });
  });

  describe('Performance Monitor', () => {
    it('should track operation timing', () => {
      const operationId = 'test-op-1';
      
      performanceMonitor.start(operationId, 'test-operation');
      
      // Simulate work
      const start = Date.now();
      while (Date.now() - start < 10) {} // Busy wait for 10ms
      
      const metrics = performanceMonitor.end(operationId, { testData: 'value' });
      
      assert(metrics, 'Should return metrics');
      assert(metrics.duration >= 10, 'Should track duration accurately');
      assert.strictEqual(metrics.type, 'test-operation', 'Should track operation type');
      assert(metrics.memoryUsage, 'Should include memory usage');
    });

    it('should handle missing start time gracefully', () => {
      const metrics = performanceMonitor.end('non-existent-op');
      assert.strictEqual(metrics, null, 'Should return null for non-existent operation');
    });

    it('should provide operation statistics', () => {
      // Record some operations
      for (let i = 0; i < 3; i++) {
        const opId = `test-op-${i}`;
        performanceMonitor.start(opId, 'test-operation');
        performanceMonitor.end(opId);
      }
      
      const stats = performanceMonitor.getStats('test-operation');
      assert.strictEqual(stats.count, 3, 'Should count operations');
      assert(stats.avgDuration >= 0, 'Should calculate average duration');
      assert(Array.isArray(stats.recent), 'Should provide recent operations');
    });

    it('should provide performance summary', () => {
      performanceMonitor.start('op1', 'type1');
      performanceMonitor.end('op1');
      
      performanceMonitor.start('op2', 'type2');
      performanceMonitor.end('op2');
      
      const summary = performanceMonitor.getSummary();
      assert(Array.isArray(summary.operationTypes), 'Should list operation types');
      assert(summary.totalOperations >= 2, 'Should count total operations');
      assert(summary.currentMemory, 'Should include current memory usage');
      assert(typeof summary.uptime === 'number', 'Should include uptime');
    });
  });

  describe('Middleware Functions', () => {
    it('should cache function results', async () => {
      let callCount = 0;
      const testFunction = async (args) => {
        callCount++;
        return { result: 'test', input: args };
      };
      
      const cachedFunction = withCache(testFunction, 'test-op', 1000);
      
      // First call should execute function
      const result1 = await cachedFunction({ param: 'value' });
      assert.strictEqual(callCount, 1, 'Should call function on first invocation');
      
      // Second call should use cache
      const result2 = await cachedFunction({ param: 'value' });
      assert.strictEqual(callCount, 1, 'Should not call function on second invocation');
      assert.deepStrictEqual(result1, result2, 'Should return same result from cache');
    });

    it('should monitor function performance', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return { success: true };
      };
      
      const monitoredFunction = withPerformanceMonitoring(testFunction, 'test-op');
      
      const result = await monitoredFunction();
      assert(result.success, 'Should return function result');
      
      // Check that performance was monitored
      const stats = performanceMonitor.getStats('test-op');
      assert(stats.count > 0, 'Should record performance metrics');
    });

    it('should enforce rate limits in monitored functions', async () => {
      const testFunction = async () => ({ success: true });
      const monitoredFunction = withPerformanceMonitoring(testFunction, 'test-op');
      
      // Fill up concurrent slots
      const promises = [];
      for (let i = 0; i < rateLimiter.limits.concurrent + 1; i++) {
        promises.push(monitoredFunction().catch(err => err));
      }
      
      const results = await Promise.all(promises);
      
      // At least one should be rate limited
      const rateLimitedResults = results.filter(r => r.code === 'RATE_LIMIT_EXCEEDED');
      assert(rateLimitedResults.length > 0, 'Should enforce rate limits');
    });
  });

  describe('System Statistics', () => {
    it('should provide comprehensive system stats', () => {
      cache.set('test-key', 'test-value', 1000);
      rateLimiter.checkLimit('test-client');
      
      const stats = getSystemStats();
      
      assert(stats.cache, 'Should include cache stats');
      assert(stats.rateLimiter, 'Should include rate limiter stats');
      assert(stats.performance, 'Should include performance stats');
      assert(stats.memory, 'Should include memory usage');
      assert(typeof stats.uptime === 'number', 'Should include uptime');
      assert(typeof stats.timestamp === 'number', 'Should include timestamp');
    });
  });
});