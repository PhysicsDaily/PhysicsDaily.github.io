#!/usr/bin/env node

import { config } from './config.js';

/**
 * Professional logging system for Physics Daily MCP Server
 * Supports multiple log levels with structured output
 */
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
    
    this.currentLevel = this.levels[config.server.logLevel] || this.levels.info;
    this.colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m',  // Yellow
      info: '\x1b[36m',  // Cyan
      debug: '\x1b[35m', // Magenta
      trace: '\x1b[37m', // White
      reset: '\x1b[0m'
    };
  }

  /**
   * Format log message with timestamp and metadata
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {object} meta - Additional metadata
   * @returns {string} Formatted log string
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const color = this.colors[level] || '';
    const reset = this.colors.reset;
    
    let logEntry = {
      timestamp,
      level: level.toUpperCase(),
      service: config.server.name,
      message,
      ...meta
    };

    if (config.server.debug) {
      // Pretty format for development
      return `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${reset}${
        Object.keys(meta).length > 0 ? '\n  ' + JSON.stringify(meta, null, 2) : ''
      }`;
    } else {
      // JSON format for production
      return JSON.stringify(logEntry);
    }
  }

  /**
   * Log at specific level
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {object} meta - Additional metadata
   */
  log(level, message, meta = {}) {
    if (this.levels[level] <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, meta);
      
      if (level === 'error') {
        console.error(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  /**
   * Error level logging
   * @param {string} message - Error message
   * @param {Error|object} error - Error object or metadata
   */
  error(message, error = {}) {
    const meta = error instanceof Error ? {
      error: error.message,
      stack: error.stack,
      name: error.name
    } : error;
    
    this.log('error', message, meta);
  }

  /**
   * Warning level logging
   * @param {string} message - Warning message
   * @param {object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  /**
   * Info level logging
   * @param {string} message - Info message
   * @param {object} meta - Additional metadata
   */
  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  /**
   * Debug level logging
   * @param {string} message - Debug message
   * @param {object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  /**
   * Trace level logging
   * @param {string} message - Trace message
   * @param {object} meta - Additional metadata
   */
  trace(message, meta = {}) {
    this.log('trace', message, meta);
  }

  /**
   * Log tool execution start
   * @param {string} toolName - Name of the tool
   * @param {object} args - Tool arguments
   * @param {string} requestId - Unique request ID
   */
  toolStart(toolName, args = {}, requestId = null) {
    this.info('Tool execution started', {
      tool: toolName,
      args: config.server.debug ? args : '[hidden]',
      requestId,
      timestamp: Date.now()
    });
  }

  /**
   * Log tool execution completion
   * @param {string} toolName - Name of the tool
   * @param {number} duration - Execution duration in ms
   * @param {string} requestId - Unique request ID
   * @param {object} result - Tool result (optional)
   */
  toolComplete(toolName, duration, requestId = null, result = null) {
    this.info('Tool execution completed', {
      tool: toolName,
      duration: `${duration}ms`,
      requestId,
      success: true,
      resultSummary: result?.summary || 'completed'
    });
  }

  /**
   * Log tool execution error
   * @param {string} toolName - Name of the tool
   * @param {Error} error - Error that occurred
   * @param {number} duration - Execution duration in ms
   * @param {string} requestId - Unique request ID
   */
  toolError(toolName, error, duration, requestId = null) {
    this.error('Tool execution failed', {
      tool: toolName,
      duration: `${duration}ms`,
      requestId,
      success: false,
      error: error.message,
      stack: config.server.debug ? error.stack : undefined
    });
  }

  /**
   * Log performance metrics
   * @param {string} operation - Operation name
   * @param {object} metrics - Performance metrics
   */
  performance(operation, metrics) {
    this.debug('Performance metrics', {
      operation,
      ...metrics
    });
  }

  /**
   * Log security events
   * @param {string} event - Security event type
   * @param {object} details - Event details
   */
  security(event, details = {}) {
    this.warn('Security event', {
      event,
      ...details,
      timestamp: Date.now()
    });
  }
}

// Create singleton logger instance
export const logger = new Logger();

/**
 * Middleware function to add request tracking
 * @param {Function} fn - Function to wrap
 * @param {string} toolName - Name of the tool
 * @returns {Function} Wrapped function with logging
 */
export function withLogging(fn, toolName) {
  return async function(...args) {
    const requestId = Math.random().toString(36).substring(2, 15);
    const startTime = Date.now();
    
    try {
      logger.toolStart(toolName, args[0], requestId);
      const result = await fn.apply(this, args);
      const duration = Date.now() - startTime;
      logger.toolComplete(toolName, duration, requestId, result);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.toolError(toolName, error, duration, requestId);
      throw error;
    }
  };
}

export default logger;