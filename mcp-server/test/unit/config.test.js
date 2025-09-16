#!/usr/bin/env node

import { test, describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { config, getTopicConfig, isValidTopic, getAllTopicNames, isAllowedFileType } from '../config.js';

describe('Configuration System', () => {
  
  it('should have all required configuration sections', () => {
    assert(config.server, 'Server configuration missing');
    assert(config.paths, 'Paths configuration missing');
    assert(config.physics, 'Physics configuration missing');
    assert(config.security, 'Security configuration missing');
    assert(config.quiz, 'Quiz configuration missing');
    assert(config.site, 'Site configuration missing');
    assert(config.performance, 'Performance configuration missing');
  });

  it('should have valid physics topics', () => {
    const topics = config.physics.topics;
    assert(Array.isArray(topics), 'Topics should be an array');
    assert(topics.length > 0, 'Should have at least one topic');
    
    topics.forEach(topic => {
      assert(topic.name, 'Topic should have a name');
      assert(topic.displayName, 'Topic should have a display name');
      assert(topic.chapters, 'Topic should have chapters config');
      assert(typeof topic.chapters.start === 'number', 'Topic should have start chapter number');
      assert(typeof topic.chapters.end === 'number', 'Topic should have end chapter number');
      assert(topic.chapters.start <= topic.chapters.end, 'Start chapter should be <= end chapter');
    });
  });

  it('should validate topic names correctly', () => {
    assert(isValidTopic('mechanics'), 'Should validate known topic');
    assert(isValidTopic('electromagnetism'), 'Should validate known topic');
    assert(!isValidTopic('invalid-topic'), 'Should reject invalid topic');
    assert(!isValidTopic(''), 'Should reject empty topic');
    assert(!isValidTopic(null), 'Should reject null topic');
  });

  it('should return topic configuration', () => {
    const mechanics = getTopicConfig('mechanics');
    assert(mechanics, 'Should return mechanics config');
    assert.strictEqual(mechanics.name, 'mechanics');
    assert.strictEqual(mechanics.displayName, 'Mechanics');
    
    const invalid = getTopicConfig('invalid');
    assert.strictEqual(invalid, null, 'Should return null for invalid topic');
  });

  it('should return all topic names', () => {
    const topics = getAllTopicNames();
    assert(Array.isArray(topics), 'Should return array');
    assert(topics.includes('mechanics'), 'Should include mechanics');
    assert(topics.includes('electromagnetism'), 'Should include electromagnetism');
  });

  it('should validate file types correctly', () => {
    assert(isAllowedFileType('test.html'), 'Should allow HTML files');
    assert(isAllowedFileType('test.json'), 'Should allow JSON files');
    assert(isAllowedFileType('test.js'), 'Should allow JS files');
    assert(!isAllowedFileType('test.exe'), 'Should reject executable files');
    assert(!isAllowedFileType('test'), 'Should reject files without extension');
  });

  it('should have valid security settings', () => {
    assert(Array.isArray(config.security.allowedExtensions), 'Allowed extensions should be array');
    assert(config.security.allowedExtensions.length > 0, 'Should have allowed extensions');
    assert(typeof config.security.maxFileSize === 'number', 'Max file size should be number');
    assert(config.security.maxFileSize > 0, 'Max file size should be positive');
  });

  it('should have valid quiz settings', () => {
    assert(typeof config.quiz.minQuestionsPerQuiz === 'number', 'Min questions should be number');
    assert(typeof config.quiz.maxQuestionsPerQuiz === 'number', 'Max questions should be number');
    assert(config.quiz.minQuestionsPerQuiz <= config.quiz.maxQuestionsPerQuiz, 'Min should be <= max');
    assert(config.quiz.optionsPerQuestion === 4, 'Should have 4 options per question');
    assert(Array.isArray(config.quiz.difficultyLevels), 'Difficulty levels should be array');
  });

  it('should have valid performance settings', () => {
    assert(typeof config.performance.cacheEnabled === 'boolean', 'Cache enabled should be boolean');
    assert(typeof config.performance.cacheTTL === 'number', 'Cache TTL should be number');
    assert(typeof config.performance.maxConcurrentOperations === 'number', 'Max concurrent should be number');
    assert(config.performance.maxConcurrentOperations > 0, 'Max concurrent should be positive');
  });
});