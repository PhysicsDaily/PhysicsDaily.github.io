#!/usr/bin/env node

import { config } from './config.js';
import { logger } from './logger.js';

/**
 * Performance monitoring and caching system for MCP server
 * Provides execution timing, rate limiting, and intelligent caching
 */

/**
 * Simple in-memory cache with TTL support
 */
class Cache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  /**
   * Set a cache entry with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = config.performance.cacheTTL) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store the value
    this.store.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
    
    logger.debug('Cache entry set', { key, ttl, size: this.store.size });
  }

  /**
   * Get a cache entry
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }

    logger.debug('Cache hit', { key });
    return entry.value;
  }

  /**
   * Delete a cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.store.delete(key);
    
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
    
    logger.debug('Cache entry deleted', { key, size: this.store.size });
  }

  /**
   * Clear all cache entries
   */
  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    
    this.store.clear();
    this.timers.clear();
    
    logger.info('Cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getStats() {
    return {
      size: this.store.size,
      entries: Array.from(this.store.keys()),
      memoryUsage: process.memoryUsage()
    };
  }
}

/**
 * Rate limiter to prevent abuse
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      perMinute: 60,
      perHour: 1000,
      concurrent: config.performance.maxConcurrentOperations
    };
    this.concurrent = 0;
  }

  /**
   * Check if request is allowed
   * @param {string} clientId - Client identifier
   * @returns {object} Rate limit result
   */
  checkLimit(clientId = 'default') {
    const now = Date.now();
    const clientData = this.requests.get(clientId) || {
      minute: { count: 0, reset: now + 60000 },
      hour: { count: 0, reset: now + 3600000 }
    };

    // Reset counters if time windows expired
    if (now >= clientData.minute.reset) {
      clientData.minute = { count: 0, reset: now + 60000 };
    }
    if (now >= clientData.hour.reset) {
      clientData.hour = { count: 0, reset: now + 3600000 };
    }

    // Check limits
    const allowed = 
      clientData.minute.count < this.limits.perMinute &&
      clientData.hour.count < this.limits.perHour &&
      this.concurrent < this.limits.concurrent;

    if (allowed) {
      clientData.minute.count++;
      clientData.hour.count++;
      this.concurrent++;
      this.requests.set(clientId, clientData);
    }

    return {
      allowed,
      limits: this.limits,
      current: {
        perMinute: clientData.minute.count,
        perHour: clientData.hour.count,
        concurrent: this.concurrent
      },
      resetTime: {
        minute: clientData.minute.reset,
        hour: clientData.hour.reset
      }
    };
  }

  /**
   * Release a concurrent slot
   */
  release() {
    if (this.concurrent > 0) {
      this.concurrent--;
    }
  }

  /**
   * Get rate limiter statistics
   * @returns {object} Rate limiter statistics
   */
  getStats() {
    return {
      concurrent: this.concurrent,
      maxConcurrent: this.limits.concurrent,
      clients: this.requests.size,
      limits: this.limits
    };
  }
}

/**
 * Performance monitor for tracking execution metrics
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTimes = new Map();
  }

  /**
   * Start timing an operation
   * @param {string} operationId - Unique operation identifier
   * @param {string} operationType - Type of operation
   */
  start(operationId, operationType) {
    this.startTimes.set(operationId, {
      startTime: Date.now(),
      startHrTime: process.hrtime(),
      type: operationType
    });
  }

  /**
   * End timing an operation and record metrics
   * @param {string} operationId - Operation identifier
   * @param {object} metadata - Additional metadata
   * @returns {object} Performance metrics
   */
  end(operationId, metadata = {}) {
    const startData = this.startTimes.get(operationId);
    if (!startData) {
      logger.warn('Performance monitor: No start time found', { operationId });
      return null;
    }

    const endTime = Date.now();
    const endHrTime = process.hrtime(startData.startHrTime);
    const duration = endTime - startData.startTime;
    const preciseMs = (endHrTime[0] * 1000) + (endHrTime[1] / 1000000);

    const metrics = {
      operationId,
      type: startData.type,
      duration,
      preciseDuration: preciseMs,
      startTime: startData.startTime,
      endTime,
      memoryUsage: process.memoryUsage(),
      ...metadata
    };

    // Store metrics
    if (!this.metrics.has(startData.type)) {
      this.metrics.set(startData.type, []);
    }
    
    const typeMetrics = this.metrics.get(startData.type);
    typeMetrics.push(metrics);
    
    // Keep only recent metrics (last 100 per type)
    if (typeMetrics.length > 100) {
      typeMetrics.shift();
    }

    // Clean up
    this.startTimes.delete(operationId);

    // Log performance if slow
    if (duration > 5000) {
      logger.warn('Slow operation detected', {
        operationId,
        type: startData.type,
        duration: `${duration}ms`,
        ...metadata
      });
    }

    return metrics;
  }

  /**
   * Get performance statistics for an operation type
   * @param {string} operationType - Type of operation
   * @returns {object} Statistics
   */
  getStats(operationType) {
    const typeMetrics = this.metrics.get(operationType) || [];
    
    if (typeMetrics.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        recent: []
      };
    }

    const durations = typeMetrics.map(m => m.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const recent = typeMetrics.slice(-10); // Last 10 operations

    return {
      count: typeMetrics.length,
      avgDuration: Math.round(avgDuration),
      minDuration,
      maxDuration,
      recent: recent.map(m => ({
        operationId: m.operationId,
        duration: m.duration,
        timestamp: m.startTime
      }))
    };
  }

  /**
   * Get overall performance summary
   * @returns {object} Performance summary
   */
  getSummary() {
    const summary = {};
    
    for (const [type, metrics] of this.metrics.entries()) {
      summary[type] = this.getStats(type);
    }

    return {
      operationTypes: Object.keys(summary),
      totalOperations: Object.values(summary).reduce((sum, s) => sum + s.count, 0),
      currentMemory: process.memoryUsage(),
      uptime: process.uptime(),
      operationStats: summary
    };
  }
}

// Create singleton instances
export const cache = new Cache();
export const rateLimiter = new RateLimiter();
export const performanceMonitor = new PerformanceMonitor();

/**
 * Generate a cache key for operations
 * @param {string} operation - Operation name
 * @param {object} params - Operation parameters
 * @returns {string} Cache key
 */
export function generateCacheKey(operation, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  
  return `${operation}:${JSON.stringify(sortedParams)}`;
}

/**
 * Middleware to add caching to expensive operations
 * @param {Function} fn - Function to cache
 * @param {string} operationName - Name of the operation
 * @param {number} ttl - Cache TTL in milliseconds
 * @returns {Function} Cached function
 */
export function withCache(fn, operationName, ttl = config.performance.cacheTTL) {
  return async function(...args) {
    if (!config.performance.cacheEnabled) {
      return await fn.apply(this, args);
    }

    const cacheKey = generateCacheKey(operationName, args[0] || {});
    
    // Try to get from cache first
    const cached = cache.get(cacheKey);
    if (cached !== null) {
      logger.debug('Returning cached result', { operation: operationName, cacheKey });
      return cached;
    }

    // Execute function and cache result
    const result = await fn.apply(this, args);
    cache.set(cacheKey, result, ttl);
    
    return result;
  };
}

/**
 * Middleware to add performance monitoring and rate limiting
 * @param {Function} fn - Function to monitor
 * @param {string} operationName - Name of the operation
 * @returns {Function} Monitored function
 */
export function withPerformanceMonitoring(fn, operationName) {
  return async function(...args) {
    const operationId = `${operationName}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Check rate limit
    const rateLimitResult = rateLimiter.checkLimit();
    if (!rateLimitResult.allowed) {
      const error = new Error('Rate limit exceeded');
      error.code = 'RATE_LIMIT_EXCEEDED';
      error.rateLimitInfo = rateLimitResult;
      throw error;
    }

    try {
      // Start performance monitoring
      performanceMonitor.start(operationId, operationName);
      
      // Execute function
      const result = await fn.apply(this, args);
      
      // End monitoring
      const metrics = performanceMonitor.end(operationId, {
        success: true,
        resultSize: JSON.stringify(result).length
      });
      
      logger.performance(operationName, metrics);
      
      return result;
      
    } catch (error) {
      // End monitoring with error
      performanceMonitor.end(operationId, {
        success: false,
        error: error.message
      });
      
      throw error;
      
    } finally {
      // Release rate limit slot
      rateLimiter.release();
    }
  };
}

/**
 * Combined middleware for logging, validation, caching, and performance monitoring
 * @param {Function} fn - Function to wrap
 * @param {string} toolName - Name of the tool
 * @param {object} options - Options for middleware
 * @returns {Function} Fully wrapped function
 */
export function withMiddleware(fn, toolName, options = {}) {
  const {
    cache: enableCache = false,
    cacheTTL = config.performance.cacheTTL,
    monitor = true
  } = options;

  let wrappedFn = fn;

  // Add caching if enabled
  if (enableCache) {
    wrappedFn = withCache(wrappedFn, toolName, cacheTTL);
  }

  // Add performance monitoring
  if (monitor) {
    wrappedFn = withPerformanceMonitoring(wrappedFn, toolName);
  }

  return wrappedFn;
}

/**
 * Get comprehensive system statistics
 * @returns {object} System statistics
 */
export function getSystemStats() {
  return {
    cache: cache.getStats(),
    rateLimiter: rateLimiter.getStats(),
    performance: performanceMonitor.getSummary(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: Date.now()
  };
}

export default {
  cache,
  rateLimiter,
  performanceMonitor,
  withCache,
  withPerformanceMonitoring,
  withMiddleware,
  getSystemStats,
  generateCacheKey
};