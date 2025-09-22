#!/usr/bin/env node

import { validate, schemas } from './validation.js';
import { config, getTopicConfig } from './config.js';
import { logger } from './logger.js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

/**
 * Enhanced validation for Physics Daily content structure
 * Validates front matter, chapter numbering, and content consistency
 */

/**
 * Validate Markdown front matter structure
 * @param {object} frontMatter - Parsed front matter object
 * @param {string} filePath - File path for error reporting
 * @returns {object} Validation result with errors
 */
export function validateFrontMatter(frontMatter, filePath = '') {
  const errors = [];
  const prefix = filePath ? `${filePath}: ` : '';

  // Required fields validation
  const layoutErrors = validate('layout', frontMatter.layout)
    .required()
    .isString()
    .oneOf(['chapter.njk', 'quiz.njk', 'topic.njk'])
    .getErrors();
  errors.push(...layoutErrors.map(err => `${prefix}${err}`));

  const titleErrors = validate('title', frontMatter.title)
    .required()
    .isString()
    .minLength(5)
    .maxLength(100)
    .getErrors();
  errors.push(...titleErrors.map(err => `${prefix}${err}`));

  const topicErrors = validate('topic', frontMatter.topic)
    .required()
    .isString()
    .custom((topic) => getTopicConfig(topic) !== null, 'Topic must be a valid physics topic')
    .getErrors();
  errors.push(...topicErrors.map(err => `${prefix}${err}`));

  // Chapter validation (if present)
  if (frontMatter.chapter !== undefined) {
    const chapterErrors = validate('chapter', frontMatter.chapter)
      .isString()
      .matches(/^\d{2}$/, 'Chapter must be a zero-padded two-digit string (e.g., "01", "15")')
      .custom((chapter) => {
        if (!frontMatter.topic) return true; // Skip if topic is invalid
        const topicConfig = getTopicConfig(frontMatter.topic);
        if (!topicConfig) return true; // Skip if topic is invalid
        
        const chapterNum = parseInt(chapter);
        return chapterNum >= topicConfig.chapters.start && chapterNum <= topicConfig.chapters.end;
      }, `Chapter number must be within valid range for topic "${frontMatter.topic}"`)
      .getErrors();
    errors.push(...chapterErrors.map(err => `${prefix}${err}`));
  }

  // Description validation (if present)
  if (frontMatter.description !== undefined) {
    const descErrors = validate('description', frontMatter.description)
      .isString()
      .minLength(10)
      .maxLength(300)
      .getErrors();
    errors.push(...descErrors.map(err => `${prefix}${err}`));
  }

  // Breadcrumbs validation (if present)
  if (frontMatter.breadcrumbs !== undefined) {
    const breadcrumbsErrors = validate('breadcrumbs', frontMatter.breadcrumbs)
      .isArray()
      .minLength(1)
      .maxLength(5)
      .getErrors();
    errors.push(...breadcrumbsErrors.map(err => `${prefix}${err}`));

    if (Array.isArray(frontMatter.breadcrumbs)) {
      frontMatter.breadcrumbs.forEach((breadcrumb, index) => {
        const nameErrors = validate(`breadcrumb[${index}].name`, breadcrumb.name)
          .required()
          .isString()
          .minLength(1)
          .maxLength(50)
          .getErrors();
        errors.push(...nameErrors.map(err => `${prefix}${err}`));

        const urlErrors = validate(`breadcrumb[${index}].url`, breadcrumb.url)
          .required()
          .isString()
          .matches(/^\//, 'Breadcrumb URLs must start with "/"')
          .getErrors();
        errors.push(...urlErrors.map(err => `${prefix}${err}`));
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate chapter directory structure and numbering
 * @param {string} topicName - Name of the physics topic
 * @param {string[]} chapterDirs - Array of chapter directory names
 * @returns {object} Validation result with errors
 */
export function validateChapterStructure(topicName, chapterDirs) {
  const errors = [];
  const topicConfig = getTopicConfig(topicName);
  
  if (!topicConfig) {
    errors.push(`Invalid topic: ${topicName}`);
    return { valid: false, errors };
  }

  // Validate chapter directory naming convention
  const chapterPattern = /^chapter\d{2}$/;
  const invalidDirs = chapterDirs.filter(dir => !chapterPattern.test(dir));
  
  if (invalidDirs.length > 0) {
    errors.push(`Invalid chapter directory names: ${invalidDirs.join(', ')}. Must be format "chapter01", "chapter02", etc.`);
  }

  // Extract chapter numbers and validate range
  const chapterNumbers = chapterDirs
    .filter(dir => chapterPattern.test(dir))
    .map(dir => parseInt(dir.replace('chapter', '')))
    .sort((a, b) => a - b);

  // Check for gaps in chapter sequence
  for (let i = 1; i < chapterNumbers.length; i++) {
    if (chapterNumbers[i] !== chapterNumbers[i-1] + 1) {
      errors.push(`Gap in chapter sequence: missing chapter${String(chapterNumbers[i-1] + 1).padStart(2, '0')}`);
    }
  }

  // Check if chapters are within valid range for topic
  const invalidChapters = chapterNumbers.filter(num => 
    num < topicConfig.chapters.start || num > topicConfig.chapters.end
  );
  
  if (invalidChapters.length > 0) {
    errors.push(`Chapters outside valid range for ${topicName} (${topicConfig.chapters.start}-${topicConfig.chapters.end}): ${invalidChapters.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    chapterNumbers
  };
}

/**
 * Validate that required files exist in chapter directory
 * @param {string} chapterPath - Path to chapter directory
 * @param {string[]} files - Array of files in the directory
 * @returns {object} Validation result with errors
 */
export function validateChapterFiles(chapterPath, files) {
  const errors = [];
  const requiredFiles = ['index.md'];
  const optionalFiles = ['mcq.md', 'images/', 'assets/'];
  
  // Check for required files
  const missingRequired = requiredFiles.filter(file => !files.includes(file));
  if (missingRequired.length > 0) {
    errors.push(`Missing required files in ${chapterPath}: ${missingRequired.join(', ')}`);
  }

  // Check for unexpected files
  const allowedFiles = [...requiredFiles, ...optionalFiles];
  const unexpectedFiles = files.filter(file => 
    !allowedFiles.includes(file) && 
    !file.endsWith('.md') && 
    !file.endsWith('/')
  );
  
  if (unexpectedFiles.length > 0) {
    logger.warn(`Unexpected files in ${chapterPath}`, { files: unexpectedFiles });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Markdown content structure
 * @param {string} content - Markdown content
 * @param {string} filePath - File path for error reporting
 * @returns {object} Validation result with errors
 */
export function validateMarkdownContent(content, filePath = '') {
  const errors = [];
  const prefix = filePath ? `${filePath}: ` : '';

  // Parse front matter
  let parsed;
  try {
    parsed = matter(content);
  } catch (error) {
    errors.push(`${prefix}Failed to parse front matter: ${error.message}`);
    return { valid: false, errors };
  }

  // Validate front matter
  const frontMatterValidation = validateFrontMatter(parsed.data, filePath);
  errors.push(...frontMatterValidation.errors);

  // Validate content length
  const contentBody = parsed.content.trim();
  if (contentBody.length < 100) {
    errors.push(`${prefix}Content body too short (minimum 100 characters)`);
  }

  if (contentBody.length > 50000) {
    errors.push(`${prefix}Content body too long (maximum 50,000 characters)`);
  }

  // Check for common Markdown issues
  const lines = contentBody.split('\n');
  
  // Check for multiple consecutive blank lines
  for (let i = 0; i < lines.length - 2; i++) {
    if (lines[i].trim() === '' && lines[i+1].trim() === '' && lines[i+2].trim() === '') {
      errors.push(`${prefix}Too many consecutive blank lines at line ${i + 1}`);
      break;
    }
  }

  // Check for unclosed LaTeX expressions
  const latexMatches = contentBody.match(/\$[^$]*\$/g) || [];
  const unclosedLatex = contentBody.match(/\$[^$]*$/g) || [];
  if (unclosedLatex.length > 0) {
    errors.push(`${prefix}Unclosed LaTeX expressions found`);
  }

  return {
    valid: errors.length === 0,
    errors,
    frontMatter: parsed.data,
    content: parsed.content,
    stats: {
      contentLength: contentBody.length,
      lineCount: lines.length,
      latexExpressions: latexMatches.length
    }
  };
}

/**
 * Add content validation schemas to existing validation system
 */
schemas.validateChapterContent = {
  filePath: (value) => validate('filePath', value)
    .required()
    .isString()
    .custom((path) => path.endsWith('.md'), 'File must be a Markdown file')
    .custom((path) => !path.includes('..'), 'Path cannot contain directory traversal'),
    
  topic: (value) => validate('topic', value)
    .required()
    .isString()
    .custom((topic) => getTopicConfig(topic) !== null, 'Topic must be a valid physics topic')
};

schemas.validateTopicStructure = {
  topic: (value) => validate('topic', value)
    .required()
    .isString()
    .custom((topic) => getTopicConfig(topic) !== null, 'Topic must be a valid physics topic'),
    
  basePath: (value) => validate('basePath', value)
    .required()
    .isString()
    .custom((path) => !path.includes('..'), 'Path cannot contain directory traversal')
};

export default {
  validateFrontMatter,
  validateChapterStructure,
  validateChapterFiles,
  validateMarkdownContent,
  schemas
};