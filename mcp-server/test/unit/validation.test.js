#!/usr/bin/env node

import { test, describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { validate, validateQuizQuestion, validateToolArgs, schemas } from '../validation.js';

describe('Validation System', () => {
  
  describe('Basic Validators', () => {
    it('should validate required fields', () => {
      const validator = validate('testField', '');
      validator.required();
      assert(!validator.isValid(), 'Empty string should fail required validation');
      
      const validator2 = validate('testField', 'value');
      validator2.required();
      assert(validator2.isValid(), 'Non-empty string should pass required validation');
    });

    it('should validate string types', () => {
      const validator = validate('testField', 'test');
      validator.isString();
      assert(validator.isValid(), 'String should pass string validation');
      
      const validator2 = validate('testField', 123);
      validator2.isString();
      assert(!validator2.isValid(), 'Number should fail string validation');
    });

    it('should validate number types', () => {
      const validator = validate('testField', 123);
      validator.isNumber();
      assert(validator.isValid(), 'Number should pass number validation');
      
      const validator2 = validate('testField', 'test');
      validator2.isNumber();
      assert(!validator2.isValid(), 'String should fail number validation');
    });

    it('should validate array types', () => {
      const validator = validate('testField', [1, 2, 3]);
      validator.isArray();
      assert(validator.isValid(), 'Array should pass array validation');
      
      const validator2 = validate('testField', 'test');
      validator2.isArray();
      assert(!validator2.isValid(), 'String should fail array validation');
    });

    it('should validate minimum and maximum lengths', () => {
      const validator = validate('testField', 'test');
      validator.minLength(2).maxLength(10);
      assert(validator.isValid(), 'String within bounds should pass');
      
      const validator2 = validate('testField', 'a');
      validator2.minLength(2);
      assert(!validator2.isValid(), 'String too short should fail');
      
      const validator3 = validate('testField', 'very long string');
      validator3.maxLength(5);
      assert(!validator3.isValid(), 'String too long should fail');
    });

    it('should validate minimum and maximum values', () => {
      const validator = validate('testField', 5);
      validator.min(1).max(10);
      assert(validator.isValid(), 'Number within bounds should pass');
      
      const validator2 = validate('testField', 0);
      validator2.min(1);
      assert(!validator2.isValid(), 'Number too small should fail');
      
      const validator3 = validate('testField', 15);
      validator3.max(10);
      assert(!validator3.isValid(), 'Number too large should fail');
    });

    it('should validate oneOf constraints', () => {
      const validator = validate('testField', 'mechanics');
      validator.oneOf(['mechanics', 'thermodynamics', 'optics']);
      assert(validator.isValid(), 'Valid option should pass');
      
      const validator2 = validate('testField', 'invalid');
      validator2.oneOf(['mechanics', 'thermodynamics', 'optics']);
      assert(!validator2.isValid(), 'Invalid option should fail');
    });

    it('should validate regex patterns', () => {
      const validator = validate('testField', '123');
      validator.matches(/^\\d+$/, 'Must be numeric');
      assert(validator.isValid(), 'Numeric string should pass regex');
      
      const validator2 = validate('testField', 'abc123');
      validator2.matches(/^\\d+$/, 'Must be numeric');
      assert(!validator2.isValid(), 'Non-numeric string should fail regex');
    });

    it('should support custom validation', () => {
      const validator = validate('testField', 'test@example.com');
      validator.custom(val => val.includes('@'), 'Must be a valid email');
      assert(validator.isValid(), 'Email with @ should pass custom validation');
      
      const validator2 = validate('testField', 'notanemail');
      validator2.custom(val => val.includes('@'), 'Must be a valid email');
      assert(!validator2.isValid(), 'String without @ should fail custom validation');
    });
  });

  describe('Quiz Question Validation', () => {
    const validQuestion = {
      question: 'What is the acceleration due to gravity?',
      options: ['9.8 m/s²', '8.9 m/s²', '10 m/s²', '9.5 m/s²'],
      correct: 0,
      explanation: 'The standard acceleration due to gravity is approximately 9.8 m/s² at sea level.'
    };

    it('should validate correct quiz questions', () => {
      const errors = validateQuizQuestion(validQuestion);
      assert.strictEqual(errors.length, 0, 'Valid question should have no errors');
    });

    it('should reject questions with missing fields', () => {
      const invalidQuestion = { ...validQuestion };
      delete invalidQuestion.question;
      
      const errors = validateQuizQuestion(invalidQuestion);
      assert(errors.length > 0, 'Question without text should have errors');
      assert(errors.some(e => e.includes('text')), 'Should have error about missing question text');
    });

    it('should reject questions with wrong number of options', () => {
      const invalidQuestion = {
        ...validQuestion,
        options: ['A', 'B', 'C'] // Only 3 options instead of 4
      };
      
      const errors = validateQuizQuestion(invalidQuestion);
      assert(errors.length > 0, 'Question with wrong option count should have errors');
    });

    it('should reject questions with invalid correct answer index', () => {
      const invalidQuestion = {
        ...validQuestion,
        correct: 5 // Index out of bounds
      };
      
      const errors = validateQuizQuestion(invalidQuestion);
      assert(errors.length > 0, 'Question with invalid correct index should have errors');
    });

    it('should reject questions with short explanations', () => {
      const invalidQuestion = {
        ...validQuestion,
        explanation: 'Short' // Too short
      };
      
      const errors = validateQuizQuestion(invalidQuestion);
      assert(errors.length > 0, 'Question with short explanation should have errors');
    });
  });

  describe('Tool Argument Validation', () => {
    it('should validate createQuizJson arguments', () => {
      const validArgs = {
        topic: 'mechanics',
        chapter: '1',
        questions: [{
          question: 'What is the acceleration due to gravity?',
          options: ['9.8 m/s²', '8.9 m/s²', '10 m/s²', '9.5 m/s²'],
          correct: 0,
          explanation: 'The standard acceleration due to gravity is approximately 9.8 m/s² at sea level.'
        }]
      };

      const validation = validateToolArgs('createQuizJson', validArgs);
      assert(validation.valid, 'Valid createQuizJson args should pass validation');
      assert.strictEqual(validation.errors.length, 0, 'Should have no errors');
    });

    it('should reject invalid topic in createQuizJson', () => {
      const invalidArgs = {
        topic: 'invalid-topic',
        chapter: '1',
        questions: []
      };

      const validation = validateToolArgs('createQuizJson', invalidArgs);
      assert(!validation.valid, 'Invalid topic should fail validation');
      assert(validation.errors.some(e => e.includes('valid physics topic')), 'Should have topic error');
    });

    it('should validate generateChapterScaffold arguments', () => {
      const validArgs = {
        topic: 'mechanics',
        chapter: '15',
        title: 'Advanced Dynamics'
      };

      const validation = validateToolArgs('generateChapterScaffold', validArgs);
      assert(validation.valid, 'Valid generateChapterScaffold args should pass validation');
    });

    it('should reject invalid chapter numbers', () => {
      const invalidArgs = {
        topic: 'mechanics',
        chapter: 'abc', // Non-numeric
        title: 'Test Chapter'
      };

      const validation = validateToolArgs('generateChapterScaffold', invalidArgs);
      assert(!validation.valid, 'Non-numeric chapter should fail validation');
    });

    it('should validate file paths', () => {
      const validArgs = {
        path: 'mechanics/chapter1/index.html'
      };

      const validation = validateToolArgs('readFileRestricted', validArgs);
      assert(validation.valid, 'Valid file path should pass validation');
    });

    it('should reject dangerous file paths', () => {
      const dangerousArgs = {
        path: '../../../etc/passwd'
      };

      const validation = validateToolArgs('readFileRestricted', dangerousArgs);
      assert(!validation.valid, 'Directory traversal path should fail validation');
    });

    it('should handle missing validation schema gracefully', () => {
      const validation = validateToolArgs('nonExistentTool', {});
      assert(validation.valid, 'Unknown tool should pass validation by default');
      assert.strictEqual(validation.errors.length, 0, 'Should have no errors for unknown tools');
    });
  });

  describe('Error Handling', () => {
    it('should accumulate multiple validation errors', () => {
      const validator = validate('testField', '');
      validator.required().isString().minLength(5);
      
      const errors = validator.getErrors();
      assert(errors.length > 0, 'Should have validation errors');
      assert(errors.some(e => e.includes('required')), 'Should have required error');
    });

    it('should provide descriptive error messages', () => {
      const validator = validate('testField', 'test');
      validator.minLength(10);
      
      const errors = validator.getErrors();
      assert(errors.length > 0, 'Should have validation errors');
      assert(errors[0].includes('testField'), 'Error should mention field name');
      assert(errors[0].includes('10'), 'Error should mention required length');
    });
  });
});