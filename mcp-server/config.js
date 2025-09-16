#!/usr/bin/env node

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Centralized configuration for Physics Daily MCP Server
 * Supports environment variables with sensible defaults
 */
export const config = {
  // Server Configuration
  server: {
    name: process.env.MCP_SERVER_NAME || 'Physics Daily MCP Server',
    version: process.env.MCP_SERVER_VERSION || '2.0.0',
    debug: process.env.NODE_ENV === 'development' || process.env.MCP_DEBUG === 'true',
    logLevel: process.env.MCP_LOG_LEVEL || 'info'
  },

  // Project Structure
  paths: {
    projectRoot: process.env.MCP_PROJECT_ROOT || join(__dirname, '..'),
    mcqDataPath: process.env.MCP_MCQ_DATA_PATH || join(__dirname, '..', 'assets', 'js', 'mcq-data'),
    assetsPath: process.env.MCP_ASSETS_PATH || join(__dirname, '..', 'assets'),
    templatesPath: process.env.MCP_TEMPLATES_PATH || join(__dirname, 'templates')
  },

  // Physics Topics Configuration
  physics: {
    topics: [
      { name: 'mechanics', chapters: { start: 1, end: 14 }, displayName: 'Mechanics' },
      { name: 'fluids', chapters: { start: 15, end: 17 }, displayName: 'Fluids' },
      { name: 'waves', chapters: { start: 18, end: 20 }, displayName: 'Waves' },
      { name: 'thermodynamics', chapters: { start: 21, end: 24 }, displayName: 'Thermodynamics' },
      { name: 'electromagnetism', chapters: { start: 25, end: 39 }, displayName: 'Electromagnetism' },
      { name: 'optics', chapters: { start: 40, end: 45 }, displayName: 'Optics' },
      { name: 'modern', chapters: { start: 46, end: 52 }, displayName: 'Modern Physics' }
    ]
  },

  // File Security Configuration
  security: {
    allowedExtensions: ['.html', '.css', '.js', '.json', '.md', '.txt', '.xml', '.svg', '.webmanifest'],
    maxFileSize: parseInt(process.env.MCP_MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    maxQuizQuestions: parseInt(process.env.MCP_MAX_QUIZ_QUESTIONS) || 100,
    maxBulkOperations: parseInt(process.env.MCP_MAX_BULK_OPERATIONS) || 50
  },

  // Quiz Configuration
  quiz: {
    minQuestionsPerQuiz: parseInt(process.env.MCP_MIN_QUIZ_QUESTIONS) || 5,
    maxQuestionsPerQuiz: parseInt(process.env.MCP_MAX_QUIZ_QUESTIONS) || 50,
    optionsPerQuestion: 4,
    difficultyLevels: ['easy', 'medium', 'hard'],
    qualityThresholds: {
      minQuestionLength: 20,
      maxQuestionLength: 250,
      minExplanationLength: 30,
      maxExplanationLength: 500
    }
  },

  // Site Configuration
  site: {
    baseUrl: process.env.MCP_SITE_BASE_URL || 'https://physicsdaily.github.io',
    title: process.env.MCP_SITE_TITLE || 'Physics Daily',
    description: process.env.MCP_SITE_DESCRIPTION || 'Interactive physics education platform',
    mainPages: ['index.html', 'about.html', 'settings.html', 'leaderboard.html', 'resources.html'],
    criticalAssets: [
      'assets/css/global.css',
      'assets/js/firebase-config.js',
      'assets/js/auth-manager.js',
      'service-worker.js',
      'manifest.webmanifest'
    ]
  },

  // Performance Configuration
  performance: {
    cacheEnabled: process.env.MCP_CACHE_ENABLED !== 'false',
    cacheTTL: parseInt(process.env.MCP_CACHE_TTL) || 300000, // 5 minutes
    maxConcurrentOperations: parseInt(process.env.MCP_MAX_CONCURRENT) || 10,
    operationTimeout: parseInt(process.env.MCP_OPERATION_TIMEOUT) || 30000 // 30 seconds
  }
};

/**
 * Get a physics topic configuration by name
 * @param {string} topicName - The name of the topic
 * @returns {object|null} Topic configuration or null if not found
 */
export function getTopicConfig(topicName) {
  return config.physics.topics.find(topic => topic.name === topicName) || null;
}

/**
 * Validate if a topic name is valid
 * @param {string} topicName - The topic name to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidTopic(topicName) {
  return config.physics.topics.some(topic => topic.name === topicName);
}

/**
 * Get all topic names
 * @returns {string[]} Array of topic names
 */
export function getAllTopicNames() {
  return config.physics.topics.map(topic => topic.name);
}

/**
 * Validate file extension
 * @param {string} filename - The filename to check
 * @returns {boolean} True if extension is allowed
 */
export function isAllowedFileType(filename) {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return config.security.allowedExtensions.includes(ext);
}

export default config;