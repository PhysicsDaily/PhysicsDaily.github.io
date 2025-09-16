#!/usr/bin/env node

import { config, isValidTopic, isAllowedFileType } from './config.js';
import { logger } from './logger.js';

/**
 * Comprehensive input validation system for MCP tools
 * Provides type checking, range validation, and security checks
 */

/**
 * Base validator class
 */
class Validator {
  constructor(fieldName, value) {
    this.fieldName = fieldName;
    this.value = value;
    this.errors = [];
  }

  /**
   * Check if value is required
   * @returns {Validator} This validator for chaining
   */
  required() {
    if (this.value === undefined || this.value === null || this.value === '') {
      this.errors.push(`${this.fieldName} is required`);
    }
    return this;
  }

  /**
   * Check if value is a string
   * @returns {Validator} This validator for chaining
   */
  isString() {
    if (this.value !== undefined && typeof this.value !== 'string') {
      this.errors.push(`${this.fieldName} must be a string`);
    }
    return this;
  }

  /**
   * Check if value is a number
   * @returns {Validator} This validator for chaining
   */
  isNumber() {
    if (this.value !== undefined && typeof this.value !== 'number') {
      this.errors.push(`${this.fieldName} must be a number`);
    }
    return this;
  }

  /**
   * Check if value is an array
   * @returns {Validator} This validator for chaining
   */
  isArray() {
    if (this.value !== undefined && !Array.isArray(this.value)) {
      this.errors.push(`${this.fieldName} must be an array`);
    }
    return this;
  }

  /**
   * Check if value is an object
   * @returns {Validator} This validator for chaining
   */
  isObject() {
    if (this.value !== undefined && (typeof this.value !== 'object' || Array.isArray(this.value) || this.value === null)) {
      this.errors.push(`${this.fieldName} must be an object`);
    }
    return this;
  }

  /**
   * Check minimum length
   * @param {number} min - Minimum length
   * @returns {Validator} This validator for chaining
   */
  minLength(min) {
    if (this.value && (this.value.length < min)) {
      this.errors.push(`${this.fieldName} must be at least ${min} characters/items long`);
    }
    return this;
  }

  /**
   * Check maximum length
   * @param {number} max - Maximum length
   * @returns {Validator} This validator for chaining
   */
  maxLength(max) {
    if (this.value && (this.value.length > max)) {
      this.errors.push(`${this.fieldName} must be at most ${max} characters/items long`);
    }
    return this;
  }

  /**
   * Check minimum value
   * @param {number} min - Minimum value
   * @returns {Validator} This validator for chaining
   */
  min(min) {
    if (this.value !== undefined && this.value < min) {
      this.errors.push(`${this.fieldName} must be at least ${min}`);
    }
    return this;
  }

  /**
   * Check maximum value
   * @param {number} max - Maximum value
   * @returns {Validator} This validator for chaining
   */
  max(max) {
    if (this.value !== undefined && this.value > max) {
      this.errors.push(`${this.fieldName} must be at most ${max}`);
    }
    return this;
  }

  /**
   * Check if value is in allowed list
   * @param {Array} allowed - Array of allowed values
   * @returns {Validator} This validator for chaining
   */
  oneOf(allowed) {
    if (this.value !== undefined && !allowed.includes(this.value)) {
      this.errors.push(`${this.fieldName} must be one of: ${allowed.join(', ')}`);
    }
    return this;
  }

  /**
   * Check if value matches regex pattern
   * @param {RegExp} pattern - Regular expression pattern
   * @param {string} message - Custom error message
   * @returns {Validator} This validator for chaining
   */
  matches(pattern, message = null) {
    if (this.value !== undefined && !pattern.test(this.value)) {
      this.errors.push(message || `${this.fieldName} format is invalid`);
    }
    return this;
  }

  /**
   * Custom validation function
   * @param {Function} fn - Validation function that returns boolean
   * @param {string} message - Error message if validation fails
   * @returns {Validator} This validator for chaining
   */
  custom(fn, message) {
    if (this.value !== undefined && !fn(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  /**
   * Get validation errors
   * @returns {Array} Array of error messages
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Check if validation passed
   * @returns {boolean} True if no errors
   */
  isValid() {
    return this.errors.length === 0;
  }
}

/**
 * Create a validator for a field
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @returns {Validator} Validator instance
 */
export function validate(fieldName, value) {
  return new Validator(fieldName, value);
}

/**
 * Validation schemas for different tool types
 */
export const schemas = {
  // Quiz-related validations
  createQuizJson: {
    topic: (value) => validate('topic', value)
      .required()
      .isString()
      .custom(isValidTopic, 'Topic must be a valid physics topic'),
    
    chapter: (value) => validate('chapter', value)
      .required()
      .isString()
      .matches(/^\d+$/, 'Chapter must be a numeric string'),
    
    questions: (value) => validate('questions', value)
      .required()
      .isArray()
      .minLength(config.quiz.minQuestionsPerQuiz)
      .maxLength(config.quiz.maxQuestionsPerQuiz)
  },

  // Content-related validations  
  generateChapterScaffold: {
    topic: (value) => validate('topic', value)
      .required()
      .isString()
      .custom(isValidTopic, 'Topic must be a valid physics topic'),
    
    chapter: (value) => validate('chapter', value)
      .required()
      .isString()
      .matches(/^\d+$/, 'Chapter must be a numeric string')
      .custom((val) => {
        const num = parseInt(val);
        return num >= 1 && num <= 100;
      }, 'Chapter number must be between 1 and 100'),
    
    title: (value) => validate('title', value)
      .isString()
      .maxLength(200)
  },

  // File operations
  readFileRestricted: {
    path: (value) => validate('path', value)
      .required()
      .isString()
      .custom((val) => !val.includes('..'), 'Path cannot contain directory traversal sequences')
      .custom((val) => !val.startsWith('/'), 'Path cannot be absolute')
      .custom(isAllowedFileType, 'File type not allowed')
  },

  // Bulk operations
  generateBulkQuizzes: {
    topic: (value) => validate('topic', value)
      .required()
      .isString()
      .custom(isValidTopic, 'Topic must be a valid physics topic'),
    
    chapters: (value) => validate('chapters', value)
      .required()
      .isArray()
      .minLength(1)
      .maxLength(config.security.maxBulkOperations),
    
    templateQuestions: (value) => validate('templateQuestions', value)
      .required()
      .isArray()
      .minLength(1)
      .maxLength(config.quiz.maxQuestionsPerQuiz)
  },

  // Quiz optimization
  optimizeQuizDifficulty: {
    quizData: (value) => validate('quizData', value)
      .required()
      .isObject(),
    
    targetDifficulty: (value) => validate('targetDifficulty', value)
      .oneOf(config.quiz.difficultyLevels)
  },

  // Site generation
  generateRobotsTxt: {
    baseUrl: (value) => validate('baseUrl', value)
      .isString()
      .matches(/^https?:\/\//, 'Base URL must be a valid HTTP/HTTPS URL'),
    
    allowAll: (value) => validate('allowAll', value)
      .custom((val) => typeof val === 'boolean', 'allowAll must be a boolean'),
    
    includeSitemap: (value) => validate('includeSitemap', value)
      .custom((val) => typeof val === 'boolean', 'includeSitemap must be a boolean')
  }
};

/**
 * Validate quiz question structure
 * @param {object} question - Question object to validate
 * @param {number} index - Question index for error reporting
 * @returns {Array} Array of validation errors
 */
export function validateQuizQuestion(question, index = 0) {
  const errors = [];
  const prefix = `Question ${index + 1}`;

  // Validate question text
  const questionErrors = validate(`${prefix} text`, question.question)
    .required()
    .isString()
    .minLength(config.quiz.qualityThresholds.minQuestionLength)
    .maxLength(config.quiz.qualityThresholds.maxQuestionLength)
    .getErrors();
  errors.push(...questionErrors);

  // Validate options
  const optionsErrors = validate(`${prefix} options`, question.options)
    .required()
    .isArray()
    .custom((opts) => opts.length === config.quiz.optionsPerQuestion, 
      `${prefix} must have exactly ${config.quiz.optionsPerQuestion} options`)
    .getErrors();
  errors.push(...optionsErrors);

  if (question.options && Array.isArray(question.options)) {
    question.options.forEach((option, i) => {
      const optionErrors = validate(`${prefix} option ${i + 1}`, option)
        .required()
        .isString()
        .minLength(1)
        .maxLength(200)
        .getErrors();
      errors.push(...optionErrors);
    });
  }

  // Validate correct answer
  const correctErrors = validate(`${prefix} correct answer`, question.correct)
    .required()
    .isNumber()
    .min(0)
    .max(config.quiz.optionsPerQuestion - 1)
    .getErrors();
  errors.push(...correctErrors);

  // Validate explanation
  const explanationErrors = validate(`${prefix} explanation`, question.explanation)
    .required()
    .isString()
    .minLength(config.quiz.qualityThresholds.minExplanationLength)
    .maxLength(config.quiz.qualityThresholds.maxExplanationLength)
    .getErrors();
  errors.push(...explanationErrors);

  return errors;
}

/**
 * Middleware function to validate tool arguments
 * @param {string} toolName - Name of the tool
 * @param {object} args - Arguments to validate
 * @returns {object} Validation result with errors
 */
export function validateToolArgs(toolName, args = {}) {
  const schema = schemas[toolName];
  if (!schema) {
    logger.debug('No validation schema found for tool', { tool: toolName });
    return { valid: true, errors: [] };
  }

  const allErrors = [];

  // Validate each field in the schema
  for (const [fieldName, validatorFn] of Object.entries(schema)) {
    const fieldValue = args[fieldName];
    const validator = validatorFn(fieldValue);
    const errors = validator.getErrors();
    allErrors.push(...errors);
  }

  // Special validation for questions array in quiz tools
  if (args.questions && Array.isArray(args.questions)) {
    args.questions.forEach((question, index) => {
      const questionErrors = validateQuizQuestion(question, index);
      allErrors.push(...questionErrors);
    });
  }

  // Special validation for templateQuestions
  if (args.templateQuestions && Array.isArray(args.templateQuestions)) {
    args.templateQuestions.forEach((question, index) => {
      const questionErrors = validateQuizQuestion(question, index);
      allErrors.push(...questionErrors);
    });
  }

  const valid = allErrors.length === 0;
  
  if (!valid) {
    logger.security('Input validation failed', {
      tool: toolName,
      errors: allErrors,
      argsKeys: Object.keys(args)
    });
  }

  return {
    valid,
    errors: allErrors
  };
}

/**
 * Middleware wrapper to add validation to tool functions
 * @param {Function} toolFn - Tool function to wrap
 * @param {string} toolName - Name of the tool
 * @returns {Function} Wrapped function with validation
 */
export function withValidation(toolFn, toolName) {
  return async function(args, ...otherArgs) {
    const validation = validateToolArgs(toolName, args);
    
    if (!validation.valid) {
      const error = new Error(`Validation failed: ${validation.errors.join(', ')}`);
      error.validationErrors = validation.errors;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    return await toolFn.call(this, args, ...otherArgs);
  };
}

export default {
  validate,
  schemas,
  validateQuizQuestion,
  validateToolArgs,
  withValidation
};