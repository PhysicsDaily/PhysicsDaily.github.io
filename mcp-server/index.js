#!/usr/bin/env node

import { readFile, readdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

// Import new infrastructure
import { config } from './config.js';
import { logger, withLogging } from './logger.js';
import { withValidation } from './validation.js';
import { withMiddleware, getSystemStats } from './performance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = config.paths.projectRoot;

// Log server startup
logger.info('Starting Physics Daily MCP Server', {
  version: config.server.version,
  nodeVersion: process.version,
  projectRoot: PROJECT_ROOT,
  debug: config.server.debug
});

// Quiz schema for validation
const quizSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
            minItems: 4,
            maxItems: 4
          },
          correct: { type: "integer", minimum: 0, maximum: 3 },
          explanation: { type: "string" }
        },
        required: ["question", "options", "correct", "explanation"]
      }
    }
  },
  required: ["questions"]
};

const ajv = new Ajv();
const validateQuiz = ajv.compile(quizSchema);

class PhysicsDailyMCP {
  constructor() {
    logger.info('Initializing MCP Server', { tools: Object.keys(this.getToolMethods()).length });
    
    // Initialize tools with middleware wrapping
    this.tools = this.initializeTools();
    
    logger.info('MCP Server initialized successfully', {
      availableTools: Object.keys(this.tools).length,
      cacheEnabled: config.performance.cacheEnabled,
      logLevel: config.server.logLevel
    });
  }

  /**
   * Get raw tool methods without middleware
   * @returns {object} Raw tool methods
   */
  getToolMethods() {
    return {
      validateQuizJson: this.validateQuizJson.bind(this),
      createQuizJson: this.createQuizJson.bind(this),
      listChapters: this.listChapters.bind(this),
      generateChapterScaffold: this.generateChapterScaffold.bind(this),
      readFileRestricted: this.readFileRestricted.bind(this),
      styleRewrite: this.styleRewrite.bind(this),
      analyzeContentGaps: this.analyzeContentGaps.bind(this),
      validateSiteStructure: this.validateSiteStructure.bind(this),
      analyzeQuizQuality: this.analyzeQuizQuality.bind(this),
      generateContentReport: this.generateContentReport.bind(this),
      bulkValidateQuizzes: this.bulkValidateQuizzes.bind(this),
      generateBulkQuizzes: this.generateBulkQuizzes.bind(this),
      optimizeQuizDifficulty: this.optimizeQuizDifficulty.bind(this),
      generateSitemap: this.generateSitemap.bind(this),
      validateDeployment: this.validateDeployment.bind(this),
      generateRobotsTxt: this.generateRobotsTxt.bind(this),
      getSystemStats: this.getSystemStats.bind(this)
    };
  }

  /**
   * Initialize tools with appropriate middleware
   * @returns {object} Tools wrapped with middleware
   */
  initializeTools() {
    const rawTools = this.getToolMethods();
    const wrappedTools = {};

    // Tool-specific middleware configuration
    const toolConfigs = {
      // Expensive operations that benefit from caching
      listChapters: { cache: true, cacheTTL: 60000 }, // 1 minute
      analyzeContentGaps: { cache: true, cacheTTL: 300000 }, // 5 minutes
      validateSiteStructure: { cache: true, cacheTTL: 300000 }, // 5 minutes
      analyzeQuizQuality: { cache: true, cacheTTL: 180000 }, // 3 minutes
      generateContentReport: { cache: true, cacheTTL: 300000 }, // 5 minutes
      
      // Quick operations without caching
      validateQuizJson: { cache: false },
      readFileRestricted: { cache: false },
      styleRewrite: { cache: false },
      
      // Operations that should always be fresh
      getSystemStats: { cache: false }
    };

    for (const [toolName, toolFn] of Object.entries(rawTools)) {
      const toolConfig = toolConfigs[toolName] || { cache: false };
      
      // Wrap with validation and logging
      let wrappedTool = withValidation(toolFn, toolName);
      wrappedTool = withLogging(wrappedTool, toolName);
      
      // Add performance monitoring and optional caching
      wrappedTool = withMiddleware(wrappedTool, toolName, toolConfig);
      
      wrappedTools[toolName] = wrappedTool;
    }

    return wrappedTools;
  }

  // Tool: Validate quiz JSON structure
  async validateQuizJson(args) {
    try {
      const { content } = args;
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      
      const isValid = validateQuiz(data);
      
      return {
        valid: isValid,
        errors: isValid ? [] : validateQuiz.errors,
        summary: isValid 
          ? `Valid quiz with ${data.questions?.length || 0} questions`
          : `Invalid quiz structure: ${validateQuiz.errors?.[0]?.message || 'Unknown error'}`
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{ message: `JSON parsing error: ${error.message}` }],
        summary: 'Invalid JSON format'
      };
    }
  }

  // Tool: Create quiz JSON from topic and questions
  async createQuizJson(args) {
    const { topic, chapter, questions } = args;
    
    // Enhanced validation with descriptive errors
    if (!questions || !Array.isArray(questions)) {
      throw new Error('Questions array is required and must be a valid array');
    }
    
    if (questions.length === 0) {
      throw new Error('At least one question is required for quiz creation');
    }
    
    if (questions.length > 50) {
      throw new Error('Maximum 50 questions allowed per quiz for optimal performance');
    }
    
    // Validate each question structure
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Question ${i + 1}: Question text is required and must be a string`);
      }
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${i + 1}: Exactly 4 options are required`);
      }
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
        throw new Error(`Question ${i + 1}: Correct answer must be a number between 0 and 3`);
      }
      if (!q.explanation || typeof q.explanation !== 'string') {
        throw new Error(`Question ${i + 1}: Explanation is required and must be a string`);
      }
    }

    const quizData = {
      questions: questions.map(q => ({
        question: q.question || '',
        options: q.options || ['', '', '', ''],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        explanation: q.explanation || ''
      }))
    };

    const validation = await this.validateQuizJson({ content: quizData });
    
    return {
      quiz: quizData,
      validation,
      filename: `${topic || 'topic'}-chapter${chapter || 'X'}-quiz.json`,
      summary: `Created quiz with ${questions.length} questions for ${topic} Chapter ${chapter}`
    };
  }

  // Tool: List all chapters in the project
  async listChapters() {
    try {
      const topics = ['mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'modern', 'waves', 'fluids'];
      const chapters = [];
      const errors = [];

      for (const topic of topics) {
        try {
          const topicPath = join(PROJECT_ROOT, topic);
          const entries = await readdir(topicPath, { withFileTypes: true });
          
          let topicChapterCount = 0;
          for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('chapter')) {
              const chapterNum = entry.name.replace('chapter', '');
              
              // Validate chapter number format
              if (!/^\d+$/.test(chapterNum)) {
                errors.push(`Invalid chapter number format in ${topic}/${entry.name} - expected numeric`);
                continue;
              }
              
              chapters.push({
                topic,
                chapter: chapterNum,
                path: join(topic, entry.name),
                hasIndex: false,
                hasMcq: false
              });
              topicChapterCount++;
            }
          }
          
          if (topicChapterCount === 0) {
            errors.push(`No chapters found in ${topic} directory`);
          }
          
        } catch (e) {
          errors.push(`Cannot access ${topic} directory: ${e.message}`);
        }
      }

      // Check for index.html and mcq.html in each chapter
      for (const chapter of chapters) {
        try {
          const chapterPath = join(PROJECT_ROOT, chapter.path);
          const files = await readdir(chapterPath);
          chapter.hasIndex = files.includes('index.html');
          chapter.hasMcq = files.includes('mcq.html');
        } catch (e) {
          // Cannot read chapter directory
        }
      }

      return {
        chapters,
        summary: `Found ${chapters.length} chapters across ${topics.length} topics`,
        topics: topics.map(topic => ({
          name: topic,
          chapterCount: chapters.filter(c => c.topic === topic).length
        }))
      };
    } catch (error) {
      throw new Error(`Failed to list chapters: ${error.message}`);
    }
  }

  // Tool: Generate chapter scaffold
  async generateChapterScaffold(args) {
    const { topic, chapter, title } = args;
    
    // Enhanced validation
    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      throw new Error('Topic is required and must be a non-empty string');
    }
    
    if (!chapter || typeof chapter !== 'string' || chapter.trim() === '') {
      throw new Error('Chapter number is required and must be a non-empty string');
    }
    
    // Validate topic against known topics
    const validTopics = ['mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'modern', 'waves', 'fluids'];
    if (!validTopics.includes(topic.toLowerCase())) {
      throw new Error(`Invalid topic '${topic}'. Valid topics are: ${validTopics.join(', ')}`);
    }
    
    // Validate chapter number format
    if (!/^\d+$/.test(chapter)) {
      throw new Error('Chapter number must contain only digits');
    }
    
    const chapterNum = parseInt(chapter);
    if (chapterNum < 1 || chapterNum > 100) {
      throw new Error('Chapter number must be between 1 and 100');
    }

    const chapterTitle = title || `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Chapter ${chapter}`;
    
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chapterTitle} - Physics Daily</title>
    <meta name="description" content="Learn ${topic} concepts in Chapter ${chapter}. Comprehensive physics education with interactive examples.">
    
    <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../../assets/css/global.css">
    <link rel="stylesheet" href="../../assets/css/header-fixed.css">
    
    <!-- Math rendering -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body class="has-fixed-header">
    <div id="global-header"></div>
    
    <nav class="breadcrumb">
        <a href="../../">Home</a>
        <span>›</span>
        <a href="../${topic}.html">${topic.charAt(0).toUpperCase() + topic.slice(1)}</a>
        <span>›</span>
        <span>Chapter ${chapter}</span>
    </nav>

    <main class="chapter-content">
        <div class="chapter-header">
            <h1>${chapterTitle}</h1>
            <div class="chapter-meta">
                <span class="chapter-number">Chapter ${chapter}</span>
                <a href="mcq.html" class="quiz-link">📝 Take Quiz</a>
            </div>
        </div>

        <div class="content-grid">
            <article class="theory-content">
                <section>
                    <h2>Introduction</h2>
                    <p>Welcome to Chapter ${chapter} of ${topic}. In this chapter, we will explore...</p>
                </section>

                <section>
                    <h2>Key Concepts</h2>
                    <ul>
                        <li>Concept 1</li>
                        <li>Concept 2</li>
                        <li>Concept 3</li>
                    </ul>
                </section>

                <section>
                    <h2>Mathematical Framework</h2>
                    <p>The fundamental equation for this topic is:</p>
                    <div class="equation-block">
                        $$E = mc^2$$
                    </div>
                </section>

                <section>
                    <h2>Examples</h2>
                    <div class="example-box">
                        <h3>Example 1</h3>
                        <p>Problem statement...</p>
                        <div class="solution">
                            <h4>Solution:</h4>
                            <p>Step-by-step solution...</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Summary</h2>
                    <p>In this chapter, we learned...</p>
                </section>
            </article>

            <aside class="chapter-nav">
                <div class="nav-section">
                    <h3>Chapter Navigation</h3>
                    <a href="mcq.html" class="nav-link primary">Take Quiz</a>
                    <a href="../" class="nav-link">Back to ${topic.charAt(0).toUpperCase() + topic.slice(1)}</a>
                </div>
            </aside>
        </div>
    </main>

    <script src="../../assets/js/firebase-config.js"></script>
    <script src="../../assets/js/auth-manager.js"></script>
    <script src="../../assets/js/header-loader.js"></script>
    <script src="../../assets/js/global.js"></script>
</body>
</html>`;

    const mcqHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chapterTitle} Quiz - Physics Daily</title>
    <meta name="description" content="Test your understanding of ${topic} Chapter ${chapter} with our interactive quiz.">
    
    <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../../assets/css/global.css">
    <link rel="stylesheet" href="../../assets/css/mcq-styles.css">
    <link rel="stylesheet" href="../../assets/css/header-fixed.css">
    
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body class="has-fixed-header">
    <div id="global-header"></div>
    
    <nav class="breadcrumb">
        <a href="../../">Home</a>
        <span>›</span>
        <a href="../${topic}.html">${topic.charAt(0).toUpperCase() + topic.slice(1)}</a>
        <span>›</span>
        <a href="index.html">Chapter ${chapter}</a>
        <span>›</span>
        <span>Quiz</span>
    </nav>

    <main class="quiz-container">
        <div class="quiz-header">
            <h1>${chapterTitle} - Quiz</h1>
            <p>Test your understanding of the concepts covered in this chapter.</p>
        </div>

        <div id="quiz-interface">
            <!-- Quiz will be loaded dynamically -->
        </div>
    </main>

    <script src="../../assets/js/firebase-config.js"></script>
    <script src="../../assets/js/auth-manager.js"></script>
    <script src="../../assets/js/enhanced-xp.js"></script>
    <script src="../../assets/js/quiz-manager.js"></script>
    <script src="../../assets/js/header-loader.js"></script>
    <script src="../../assets/js/global.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            await authManager.init();
            
            const quiz = new QuizManager({
                containerId: 'quiz-interface',
                dataUrl: '../../assets/js/mcq-data/${topic}-chapter${chapter}-quiz.json',
                maxQuestions: 10,
                timeLimit: 600,
                chapter: 'Chapter ${chapter}',
                topic: '${topic.charAt(0).toUpperCase() + topic.slice(1)}'
            });
        });
    </script>
</body>
</html>`;

    return {
      files: {
        'index.html': indexHtml,
        'mcq.html': mcqHtml
      },
      directory: `${topic}/chapter${chapter}/`,
      summary: `Generated scaffold for ${topic} Chapter ${chapter}`,
      nextSteps: [
        `Create directory: ${topic}/chapter${chapter}/`,
        'Save index.html with theory content',
        'Save mcq.html for quiz interface',
        `Create quiz data: assets/js/mcq-data/${topic}-chapter${chapter}-quiz.json`
      ]
    };
  }

  // Tool: Read project files (restricted to safe paths)
  async readFileRestricted(args) {
    const { path } = args;
    
    // Enhanced validation
    if (!path || typeof path !== 'string' || path.trim() === '') {
      throw new Error('File path is required and must be a non-empty string');
    }
    
    // Security: Prevent directory traversal
    if (path.includes('..') || path.includes('~') || path.startsWith('/')) {
      throw new Error('Invalid path: Directory traversal attempts not allowed');
    }
    
    // Security: Only allow reading from project directory and safe file types
    const safePath = join(PROJECT_ROOT, path);
    const lastDotIndex = path.toLowerCase().lastIndexOf('.');
    
    if (lastDotIndex === -1) {
      throw new Error('File must have an extension');
    }
    
    const ext = path.toLowerCase().substring(lastDotIndex);
    const allowedExtensions = ['.html', '.css', '.js', '.json', '.md', '.txt', '.xml', '.svg'];
    
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`File type '${ext}' not allowed. Allowed types: ${allowedExtensions.join(', ')}`);
    }

    try {
      const content = await readFile(safePath, 'utf-8');
      const lines = content.split('\n');
      
      return {
        path,
        content,
        size: content.length,
        lines: lines.length,
        encoding: 'utf-8',
        extension: ext,
        summary: `Successfully read ${basename(path)} (${(content.length / 1024).toFixed(1)}KB, ${lines.length} lines)`
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${path}. Please check the path and try again.`);
      } else if (error.code === 'EACCES') {
        throw new Error(`Permission denied: Cannot read ${path}. Check file permissions.`);
      } else if (error.code === 'EISDIR') {
        throw new Error(`Path is a directory: ${path}. Please specify a file.`);
      } else {
        throw new Error(`Failed to read file ${path}: ${error.message}`);
      }
    }
  }

  // Tool: Rewrite content to match project style
  async styleRewrite(args) {
    const { content, type = 'html' } = args;
    
    const styleGuide = {
      html: {
        indentation: '    ', // 4 spaces
        preferSingleQuotes: false,
        includeComments: true,
        semanticStructure: true
      },
      css: {
        propertyOrder: ['display', 'position', 'top', 'right', 'bottom', 'left'],
        preferShorthand: true,
        includeComments: true
      },
      javascript: {
        preferConst: true,
        preferArrowFunctions: true,
        includeDocstrings: true
      }
    };

    // Simple style improvements (in a real implementation, this would be more sophisticated)
    let rewritten = content;
    
    if (type === 'html') {
      // Ensure proper indentation
      rewritten = rewritten.replace(/^\s+/gm, (match) => {
        const level = Math.floor(match.length / 4);
        return '    '.repeat(level);
      });
      
      // Add meta description if missing
      if (!rewritten.includes('<meta name="description"')) {
        rewritten = rewritten.replace(
          '<title>',
          '<meta name="description" content="Physics education content from Physics Daily">\n    <title>'
        );
      }
    }

    return {
      original: content,
      rewritten,
      changes: content !== rewritten ? ['Fixed indentation', 'Added missing meta tags'] : ['No changes needed'],
      summary: `Styled ${type} content according to project guidelines`
    };
  }

  // Tool: Analyze content gaps and missing chapters
  async analyzeContentGaps() {
    try {
      const chaptersData = await this.listChapters();
      const chapters = chaptersData.chapters;
      
      // Expected chapter ranges for each topic
      const expectedRanges = {
        mechanics: { start: 1, end: 14, name: 'Mechanics' },
        fluids: { start: 15, end: 17, name: 'Fluids' },
        waves: { start: 18, end: 20, name: 'Waves' },
        thermodynamics: { start: 21, end: 24, name: 'Thermodynamics' },
        electromagnetism: { start: 25, end: 39, name: 'Electromagnetism' },
        optics: { start: 40, end: 45, name: 'Optics' },
        modern: { start: 46, end: 52, name: 'Modern Physics' }
      };
      
      const analysis = {};
      const overallGaps = [];
      const recommendations = [];
      
      for (const [topic, range] of Object.entries(expectedRanges)) {
        const topicChapters = chapters.filter(c => c.topic === topic);
        const existingNumbers = topicChapters.map(c => parseInt(c.chapter)).sort((a, b) => a - b);
        const missing = [];
        const incomplete = [];
        
        // Find missing chapters
        for (let i = range.start; i <= range.end; i++) {
          if (!existingNumbers.includes(i)) {
            missing.push(i);
          }
        }
        
        // Find incomplete chapters (missing index.html or mcq.html)
        topicChapters.forEach(chapter => {
          const issues = [];
          if (!chapter.hasIndex) issues.push('missing index.html');
          if (!chapter.hasMcq) issues.push('missing mcq.html');
          if (issues.length > 0) {
            incomplete.push({ chapter: chapter.chapter, issues });
          }
        });
        
        analysis[topic] = {
          name: range.name,
          expected: range.end - range.start + 1,
          existing: existingNumbers.length,
          missing,
          incomplete,
          coverage: ((existingNumbers.length / (range.end - range.start + 1)) * 100).toFixed(1)
        };
        
        if (missing.length > 0) {
          overallGaps.push(`${range.name}: Missing chapters ${missing.join(', ')}`);
        }
        
        if (incomplete.length > 0) {
          recommendations.push(`${range.name}: Complete ${incomplete.length} chapters with missing files`);
        }
      }
      
      // Priority recommendations
      const priorityOrder = Object.entries(analysis)
        .sort((a, b) => parseFloat(a[1].coverage) - parseFloat(b[1].coverage))
        .slice(0, 3);
      
      return {
        analysis,
        gaps: overallGaps,
        recommendations,
        priority: priorityOrder.map(([topic, data]) => ({
          topic,
          name: data.name,
          coverage: data.coverage,
          action: `Focus on ${data.name} (${data.coverage}% complete)`
        })),
        summary: `Found ${overallGaps.length} content gaps across ${Object.keys(analysis).length} topics`
      };
    } catch (error) {
      throw new Error(`Failed to analyze content gaps: ${error.message}`);
    }
  }

  // Tool: Validate overall site structure
  async validateSiteStructure() {
    try {
      const issues = [];
      const checks = [];
      
      // Check main pages
      const mainPages = ['index.html', 'about.html', 'settings.html', 'leaderboard.html'];
      for (const page of mainPages) {
        try {
          await readFile(join(PROJECT_ROOT, page), 'utf-8');
          checks.push({ type: 'main-page', item: page, status: 'ok' });
        } catch (error) {
          issues.push(`Missing main page: ${page}`);
          checks.push({ type: 'main-page', item: page, status: 'missing' });
        }
      }
      
      // Check critical assets
      const criticalAssets = [
        'assets/css/global.css',
        'assets/js/firebase-config.js',
        'assets/js/auth-manager.js',
        'service-worker.js',
        'manifest.webmanifest'
      ];
      
      for (const asset of criticalAssets) {
        try {
          await readFile(join(PROJECT_ROOT, asset), 'utf-8');
          checks.push({ type: 'asset', item: asset, status: 'ok' });
        } catch (error) {
          issues.push(`Missing critical asset: ${asset}`);
          checks.push({ type: 'asset', item: asset, status: 'missing' });
        }
      }
      
      // Check topic index pages
      const topics = ['mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'modern', 'waves', 'fluids'];
      for (const topic of topics) {
        try {
          await readFile(join(PROJECT_ROOT, topic, `${topic}.html`), 'utf-8');
          checks.push({ type: 'topic-index', item: `${topic}/${topic}.html`, status: 'ok' });
        } catch (error) {
          // Try alternative location
          try {
            await readFile(join(PROJECT_ROOT, `${topic}.html`), 'utf-8');
            checks.push({ type: 'topic-index', item: `${topic}.html`, status: 'ok-alt-location' });
          } catch (altError) {
            issues.push(`Missing topic index: ${topic}.html or ${topic}/${topic}.html`);
            checks.push({ type: 'topic-index', item: topic, status: 'missing' });
          }
        }
      }
      
      const score = ((checks.filter(c => c.status === 'ok' || c.status === 'ok-alt-location').length / checks.length) * 100).toFixed(1);
      
      return {
        score: parseFloat(score),
        issues,
        checks,
        summary: `Site structure ${score}% complete with ${issues.length} issues found`,
        recommendations: issues.length > 0 ? [
          'Fix missing files to improve site functionality',
          'Ensure all navigation links work properly',
          'Test site deployment after fixing issues'
        ] : ['Site structure is complete and ready for deployment']
      };
    } catch (error) {
      throw new Error(`Failed to validate site structure: ${error.message}`);
    }
  }

  // Tool: Analyze quiz quality and statistics
  async analyzeQuizQuality() {
    try {
      const quizFiles = [];
      const analysis = {};
      
      // Find all quiz JSON files
      try {
        const mcqDataPath = join(PROJECT_ROOT, 'assets', 'js', 'mcq-data');
        const files = await readdir(mcqDataPath);
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            try {
              const content = await readFile(join(mcqDataPath, file), 'utf-8');
              const data = JSON.parse(content);
              quizFiles.push({ file, data });
            } catch (error) {
              analysis[file] = { error: `Failed to parse: ${error.message}` };
            }
          }
        }
      } catch (error) {
        return {
          error: 'mcq-data directory not found or inaccessible',
          recommendation: 'Create assets/js/mcq-data/ directory and add quiz files'
        };
      }
      
      // Analyze each quiz
      for (const { file, data } of quizFiles) {
        const validation = await this.validateQuizJson({ content: data });
        const questions = data.questions || [];
        
        // Quality metrics
        const metrics = {
          questionCount: questions.length,
          avgQuestionLength: questions.length > 0 ? 
            Math.round(questions.reduce((sum, q) => sum + (q.question?.length || 0), 0) / questions.length) : 0,
          avgExplanationLength: questions.length > 0 ?
            Math.round(questions.reduce((sum, q) => sum + (q.explanation?.length || 0), 0) / questions.length) : 0,
          hasVariedCorrectAnswers: new Set(questions.map(q => q.correct)).size > 1,
          qualityScore: 0
        };
        
        // Calculate quality score
        let score = 0;
        if (metrics.questionCount >= 5) score += 25;
        if (metrics.avgQuestionLength >= 20 && metrics.avgQuestionLength <= 200) score += 25;
        if (metrics.avgExplanationLength >= 30) score += 25;
        if (metrics.hasVariedCorrectAnswers) score += 25;
        metrics.qualityScore = score;
        
        analysis[file] = {
          valid: validation.valid,
          metrics,
          issues: validation.errors || [],
          recommendations: []
        };
        
        // Add recommendations
        if (metrics.questionCount < 5) {
          analysis[file].recommendations.push('Add more questions (minimum 5 recommended)');
        }
        if (!metrics.hasVariedCorrectAnswers) {
          analysis[file].recommendations.push('Vary correct answer positions to avoid patterns');
        }
        if (metrics.avgExplanationLength < 30) {
          analysis[file].recommendations.push('Add more detailed explanations');
        }
      }
      
      const totalQuizzes = Object.keys(analysis).length;
      const validQuizzes = Object.values(analysis).filter(a => !a.error && a.valid).length;
      const avgQuality = totalQuizzes > 0 ?
        Object.values(analysis).reduce((sum, a) => sum + (a.metrics?.qualityScore || 0), 0) / totalQuizzes : 0;
      
      return {
        totalQuizzes,
        validQuizzes,
        avgQuality: Math.round(avgQuality),
        analysis,
        summary: `Analyzed ${totalQuizzes} quizzes, ${validQuizzes} valid, average quality ${Math.round(avgQuality)}%`
      };
    } catch (error) {
      throw new Error(`Failed to analyze quiz quality: ${error.message}`);
    }
  }

  // Tool: Generate comprehensive content report
  async generateContentReport() {
    try {
      const [gapsAnalysis, structureValidation, quizAnalysis] = await Promise.all([
        this.analyzeContentGaps().catch(e => ({ error: e.message })),
        this.validateSiteStructure().catch(e => ({ error: e.message })),
        this.analyzeQuizQuality().catch(e => ({ error: e.message }))
      ]);
      
      const report = {
        timestamp: new Date().toISOString(),
        sections: {
          contentGaps: gapsAnalysis,
          siteStructure: structureValidation,
          quizQuality: quizAnalysis
        },
        overallHealth: 'unknown',
        priorities: [],
        nextSteps: []
      };
      
      // Calculate overall health score
      let healthScore = 0;
      let scoreCount = 0;
      
      if (structureValidation.score !== undefined) {
        healthScore += structureValidation.score;
        scoreCount++;
      }
      
      if (quizAnalysis.avgQuality !== undefined) {
        healthScore += quizAnalysis.avgQuality;
        scoreCount++;
      }
      
      if (scoreCount > 0) {
        const avgHealth = healthScore / scoreCount;
        report.overallHealth = avgHealth >= 80 ? 'excellent' : avgHealth >= 60 ? 'good' : avgHealth >= 40 ? 'fair' : 'needs-attention';
      }
      
      // Generate priorities and next steps
      if (gapsAnalysis.priority) {
        report.priorities.push(...gapsAnalysis.priority.map(p => p.action));
      }
      
      if (structureValidation.issues && structureValidation.issues.length > 0) {
        report.nextSteps.push('Fix critical site structure issues');
      }
      
      if (quizAnalysis.validQuizzes < quizAnalysis.totalQuizzes) {
        report.nextSteps.push('Validate and fix quiz JSON files');
      }
      
      return {
        ...report,
        summary: `Site health: ${report.overallHealth} - ${report.priorities.length} priorities, ${report.nextSteps.length} next steps`
      };
    } catch (error) {
      throw new Error(`Failed to generate content report: ${error.message}`);
    }
  }

  // Tool: Bulk validate all quiz files
  async bulkValidateQuizzes() {
    try {
      const results = [];
      const mcqDataPath = join(PROJECT_ROOT, 'assets', 'js', 'mcq-data');
      
      try {
        const files = await readdir(mcqDataPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        for (const file of jsonFiles) {
          try {
            const content = await readFile(join(mcqDataPath, file), 'utf-8');
            const data = JSON.parse(content);
            const validation = await this.validateQuizJson({ content: data });
            
            results.push({
              file,
              valid: validation.valid,
              errors: validation.errors,
              questionCount: data.questions?.length || 0,
              status: validation.valid ? 'valid' : 'invalid'
            });
          } catch (error) {
            results.push({
              file,
              valid: false,
              errors: [{ message: `Parse error: ${error.message}` }],
              questionCount: 0,
              status: 'error'
            });
          }
        }
        
        const summary = {
          total: results.length,
          valid: results.filter(r => r.valid).length,
          invalid: results.filter(r => !r.valid).length,
          totalQuestions: results.reduce((sum, r) => sum + r.questionCount, 0)
        };
        
        return {
          results,
          summary,
          recommendations: summary.invalid > 0 ? [
            'Fix invalid quiz files to ensure proper functionality',
            'Review error messages for specific issues',
            'Consider using createQuizJson tool for proper structure'
          ] : ['All quiz files are valid and ready for use'],
          status: summary.invalid === 0 ? 'all-valid' : 'issues-found'
        };
        
      } catch (error) {
        return {
          error: 'mcq-data directory not accessible',
          recommendation: 'Create assets/js/mcq-data/ directory and add quiz JSON files'
        };
      }
    } catch (error) {
      throw new Error(`Failed to bulk validate quizzes: ${error.message}`);
    }
  }

  // Tool: Generate multiple quiz files for chapters
  async generateBulkQuizzes(args) {
    const { topic, chapters, templateQuestions } = args;
    
    if (!topic || !chapters || !Array.isArray(chapters)) {
      throw new Error('Topic and chapters array are required');
    }
    
    if (!templateQuestions || !Array.isArray(templateQuestions) || templateQuestions.length === 0) {
      throw new Error('Template questions array is required and must contain at least one question');
    }
    
    const results = [];
    const errors = [];
    
    for (const chapter of chapters) {
      try {
        // Customize questions for each chapter
        const customizedQuestions = templateQuestions.map(q => ({
          ...q,
          question: q.question.replace(/Chapter \d+/g, `Chapter ${chapter}`),
          explanation: q.explanation.replace(/Chapter \d+/g, `Chapter ${chapter}`)
        }));
        
        const quizResult = await this.createQuizJson({
          topic,
          chapter: chapter.toString(),
          questions: customizedQuestions
        });
        
        results.push({
          chapter,
          filename: quizResult.filename,
          quiz: quizResult.quiz,
          valid: quizResult.validation.valid
        });
        
      } catch (error) {
        errors.push({
          chapter,
          error: error.message
        });
      }
    }
    
    return {
      topic,
      generated: results.length,
      errors: errors.length,
      results,
      errorDetails: errors,
      summary: `Generated ${results.length} quiz files for ${topic}, ${errors.length} errors`,
      nextSteps: [
        'Save generated quiz files to assets/js/mcq-data/',
        'Customize questions for chapter-specific content',
        'Test quiz functionality in browser'
      ]
    };
  }

  // Tool: Optimize quiz difficulty and balance
  async optimizeQuizDifficulty(args) {
    const { quizData, targetDifficulty = 'medium' } = args;
    
    if (!quizData || !quizData.questions) {
      throw new Error('Quiz data with questions array is required');
    }
    
    const questions = quizData.questions;
    const analysis = {
      original: {
        questionCount: questions.length,
        avgQuestionLength: Math.round(questions.reduce((sum, q) => sum + (q.question?.length || 0), 0) / questions.length),
        correctAnswerDistribution: questions.reduce((acc, q) => {
          acc[q.correct] = (acc[q.correct] || 0) + 1;
          return acc;
        }, {}),
        hasPatterns: false
      },
      optimized: {},
      changes: []
    };
    
    let optimizedQuestions = [...questions];
    
    // Check for answer patterns
    const correctAnswers = questions.map(q => q.correct);
    const uniqueAnswers = new Set(correctAnswers);
    analysis.original.hasPatterns = uniqueAnswers.size < Math.max(2, questions.length / 3);
    
    // Balance correct answer positions
    if (analysis.original.hasPatterns) {
      const targetDistribution = [0, 1, 2, 3];
      let currentIndex = 0;
      
      optimizedQuestions = optimizedQuestions.map((q, index) => {
        if (analysis.original.hasPatterns && Math.random() < 0.6) {
          const newCorrect = targetDistribution[currentIndex % 4];
          currentIndex++;
          
          if (newCorrect !== q.correct) {
            // Swap options to maintain correctness
            const newOptions = [...q.options];
            [newOptions[q.correct], newOptions[newCorrect]] = [newOptions[newCorrect], newOptions[q.correct]];
            
            analysis.changes.push(`Question ${index + 1}: Moved correct answer from position ${q.correct} to ${newCorrect}`);
            
            return {
              ...q,
              options: newOptions,
              correct: newCorrect
            };
          }
        }
        return q;
      });
    }
    
    // Difficulty adjustments based on target
    const difficultyAdjustments = {
      easy: {
        maxQuestionLength: 120,
        minExplanationLength: 50,
        suggestions: ['Use simpler vocabulary', 'Add more context clues', 'Include obvious wrong answers']
      },
      medium: {
        maxQuestionLength: 180,
        minExplanationLength: 75,
        suggestions: ['Balance obvious and tricky distractors', 'Include moderate technical terms', 'Provide detailed explanations']
      },
      hard: {
        maxQuestionLength: 250,
        minExplanationLength: 100,
        suggestions: ['Use technical vocabulary', 'Create subtle distractors', 'Require deeper understanding']
      }
    };
    
    const target = difficultyAdjustments[targetDifficulty] || difficultyAdjustments.medium;
    
    analysis.optimized = {
      questionCount: optimizedQuestions.length,
      avgQuestionLength: Math.round(optimizedQuestions.reduce((sum, q) => sum + (q.question?.length || 0), 0) / optimizedQuestions.length),
      correctAnswerDistribution: optimizedQuestions.reduce((acc, q) => {
        acc[q.correct] = (acc[q.correct] || 0) + 1;
        return acc;
      }, {}),
      balanceScore: Math.round((uniqueAnswers.size / 4) * 100),
      difficultyLevel: targetDifficulty
    };
    
    return {
      originalQuiz: quizData,
      optimizedQuiz: { questions: optimizedQuestions },
      analysis,
      recommendations: target.suggestions,
      summary: `Optimized quiz for ${targetDifficulty} difficulty with ${analysis.changes.length} changes made`
    };
  }

  // Tool: Generate sitemap for the website
  async generateSitemap() {
    try {
      const baseUrl = 'https://physicsdaily.github.io';
      const pages = [];
      
      // Add main pages
      const mainPages = ['index.html', 'about.html', 'settings.html', 'leaderboard.html', 'resources.html'];
      for (const page of mainPages) {
        try {
          await readFile(join(PROJECT_ROOT, page), 'utf-8');
          pages.push({
            url: `${baseUrl}/${page.replace('.html', '')}`,
            priority: page === 'index.html' ? '1.0' : '0.8',
            changefreq: 'weekly'
          });
        } catch (error) {
          // Page doesn't exist, skip
        }
      }
      
      // Add topic pages
      const topics = ['mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'modern', 'waves', 'fluids'];
      for (const topic of topics) {
        try {
          await readFile(join(PROJECT_ROOT, `${topic}.html`), 'utf-8');
          pages.push({
            url: `${baseUrl}/${topic}`,
            priority: '0.9',
            changefreq: 'monthly'
          });
        } catch (error) {
          try {
            await readFile(join(PROJECT_ROOT, topic, `${topic}.html`), 'utf-8');
            pages.push({
              url: `${baseUrl}/${topic}/${topic}`,
              priority: '0.9',
              changefreq: 'monthly'
            });
          } catch (altError) {
            // Topic page doesn't exist, skip
          }
        }
      }
      
      // Add chapter pages
      const chaptersData = await this.listChapters();
      for (const chapter of chaptersData.chapters) {
        if (chapter.hasIndex) {
          pages.push({
            url: `${baseUrl}/${chapter.path}`,
            priority: '0.7',
            changefreq: 'monthly'
          });
        }
        if (chapter.hasMcq) {
          pages.push({
            url: `${baseUrl}/${chapter.path}/mcq`,
            priority: '0.6',
            changefreq: 'monthly'
          });
        }
      }
      
      // Generate XML sitemap
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\\n')}
</urlset>`;
      
      return {
        sitemap,
        pageCount: pages.length,
        pages: pages.slice(0, 10), // First 10 for preview
        summary: `Generated sitemap with ${pages.length} pages`,
        filename: 'sitemap.xml'
      };
    } catch (error) {
      throw new Error(`Failed to generate sitemap: ${error.message}`);
    }
  }

  // Tool: Validate deployment readiness
  async validateDeployment() {
    try {
      const checks = [];
      const errors = [];
      const warnings = [];
      
      // Check critical files
      const criticalFiles = [
        'index.html',
        'manifest.webmanifest',
        'service-worker.js',
        'robots.txt',
        'assets/css/global.css',
        'assets/js/firebase-config.js'
      ];
      
      for (const file of criticalFiles) {
        try {
          await readFile(join(PROJECT_ROOT, file), 'utf-8');
          checks.push({ type: 'critical-file', item: file, status: 'ok' });
        } catch (error) {
          errors.push(`Missing critical file: ${file}`);
          checks.push({ type: 'critical-file', item: file, status: 'missing' });
        }
      }
      
      // Check PWA requirements
      try {
        const manifestContent = await readFile(join(PROJECT_ROOT, 'manifest.webmanifest'), 'utf-8');
        const manifest = JSON.parse(manifestContent);
        
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
        for (const field of requiredFields) {
          if (manifest[field]) {
            checks.push({ type: 'pwa-manifest', item: field, status: 'ok' });
          } else {
            warnings.push(`PWA manifest missing field: ${field}`);
            checks.push({ type: 'pwa-manifest', item: field, status: 'missing' });
          }
        }
        
        // Check icons
        if (manifest.icons && manifest.icons.length > 0) {
          checks.push({ type: 'pwa-icons', item: 'icons-defined', status: 'ok' });
        } else {
          warnings.push('PWA manifest should include icon definitions');
          checks.push({ type: 'pwa-icons', item: 'icons-defined', status: 'missing' });
        }
      } catch (error) {
        errors.push('PWA manifest is invalid or missing');
      }
      
      // Check service worker
      try {
        const swContent = await readFile(join(PROJECT_ROOT, 'service-worker.js'), 'utf-8');
        if (swContent.includes('cache') && swContent.includes('fetch')) {
          checks.push({ type: 'service-worker', item: 'functional', status: 'ok' });
        } else {
          warnings.push('Service worker may not be properly configured');
          checks.push({ type: 'service-worker', item: 'functional', status: 'warning' });
        }
      } catch (error) {
        errors.push('Service worker is missing or invalid');
      }
      
      // Check robots.txt
      try {
        const robotsContent = await readFile(join(PROJECT_ROOT, 'robots.txt'), 'utf-8');
        if (robotsContent.includes('User-agent') && robotsContent.includes('Sitemap')) {
          checks.push({ type: 'seo', item: 'robots.txt', status: 'ok' });
        } else {
          warnings.push('robots.txt should include User-agent and Sitemap directives');
          checks.push({ type: 'seo', item: 'robots.txt', status: 'warning' });
        }
      } catch (error) {
        warnings.push('robots.txt is missing - consider adding for SEO');
      }
      
      const score = ((checks.filter(c => c.status === 'ok').length / checks.length) * 100).toFixed(1);
      const readiness = errors.length === 0 ? (warnings.length === 0 ? 'ready' : 'ready-with-warnings') : 'not-ready';
      
      return {
        readiness,
        score: parseFloat(score),
        errors,
        warnings,
        checks,
        summary: `Deployment ${readiness} - ${score}% checks passed, ${errors.length} errors, ${warnings.length} warnings`,
        recommendations: [
          ...errors.map(e => `Fix: ${e}`),
          ...warnings.map(w => `Consider: ${w}`)
        ]
      };
    } catch (error) {
      throw new Error(`Failed to validate deployment: ${error.message}`);
    }
  }

  // Tool: Generate robots.txt file
  async generateRobotsTxt(args) {
    const { baseUrl = 'https://physicsdaily.github.io', allowAll = true, includeSitemap = true } = args || {};
    
    let robotsTxt = '';
    
    if (allowAll) {
      robotsTxt += 'User-agent: *\\nAllow: /\\n\\n';
    } else {
      robotsTxt += 'User-agent: *\\nDisallow: /assets/js/mcq-data/\\n\\n';
    }
    
    // Add crawl delay for courtesy
    robotsTxt += 'Crawl-delay: 1\\n\\n';
    
    if (includeSitemap) {
      robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\\n`;
    }
    
    // Add common SEO directives
    robotsTxt += `\\n# Additional directives
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /`;
    
    return {
      content: robotsTxt,
      filename: 'robots.txt',
      summary: `Generated robots.txt with ${allowAll ? 'open' : 'restricted'} access policy`,
      recommendations: [
        'Place robots.txt in the root directory',
        'Test robots.txt with Google Search Console',
        'Update sitemap URL if different from generated'
      ]
    };
  }

  // Tool: Get system performance and health statistics
  async getSystemStats() {
    try {
      const stats = getSystemStats();
      const toolCount = Object.keys(this.tools).length;
      
      return {
        server: {
          name: config.server.name,
          version: config.server.version,
          uptime: process.uptime(),
          nodeVersion: process.version,
          toolCount
        },
        ...stats,
        summary: `Server healthy - ${toolCount} tools available, ${stats.performance.totalOperations} operations completed`
      };
    } catch (error) {
      throw new Error(`Failed to get system stats: ${error.message}`);
    }
  }

  // MCP Protocol: Handle tool calls
  async handleToolCall(name, args) {
    if (!this.tools[name]) {
      logger.warn('Unknown tool requested', { tool: name, availableTools: Object.keys(this.tools) });
      const error = new Error(`Unknown tool: ${name}`);
      error.code = 'TOOL_NOT_FOUND';
      error.availableTools = Object.keys(this.tools);
      throw error;
    }
    
    try {
      const result = await this.tools[name](args);
      return result;
    } catch (error) {
      // Log error details for debugging
      logger.error('Tool execution failed', {
        tool: name,
        error: error.message,
        code: error.code || 'TOOL_EXECUTION_ERROR',
        args: config.server.debug ? args : '[hidden]'
      });
      
      // Re-throw with additional context
      error.tool = name;
      error.timestamp = Date.now();
      throw error;
    }
  }

  // MCP Protocol: List available tools
  listTools() {
    return [
      {
        name: 'validateQuizJson',
        description: 'Validate quiz JSON structure against schema',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: ['string', 'object'], description: 'Quiz JSON content to validate' }
          },
          required: ['content']
        }
      },
      {
        name: 'createQuizJson',
        description: 'Create properly structured quiz JSON',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Physics topic (e.g., mechanics)' },
            chapter: { type: 'string', description: 'Chapter number' },
            questions: {
              type: 'array',
              description: 'Array of question objects',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correct: { type: 'integer' },
                  explanation: { type: 'string' }
                }
              }
            }
          },
          required: ['questions']
        }
      },
      {
        name: 'listChapters',
        description: 'List all chapters in the project',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'generateChapterScaffold',
        description: 'Generate HTML scaffolding for a new chapter',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Physics topic' },
            chapter: { type: 'string', description: 'Chapter number' },
            title: { type: 'string', description: 'Chapter title (optional)' }
          },
          required: ['topic', 'chapter']
        }
      },
      {
        name: 'readFileRestricted',
        description: 'Read project files safely',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string', description: 'Relative path from project root' }
          },
          required: ['path']
        }
      },
      {
        name: 'styleRewrite',
        description: 'Rewrite content to match project style guide',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Content to rewrite' },
            type: { type: 'string', enum: ['html', 'css', 'javascript'], description: 'Content type' }
          },
          required: ['content']
        }
      },
      {
        name: 'analyzeContentGaps',
        description: 'Analyze missing chapters and content gaps across all physics topics',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'validateSiteStructure',
        description: 'Validate overall site structure and critical files',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'analyzeQuizQuality',
        description: 'Analyze quiz quality, statistics, and identify improvement opportunities',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'generateContentReport',
        description: 'Generate comprehensive content analysis report',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'bulkValidateQuizzes',
        description: 'Validate all quiz JSON files in the project',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'generateBulkQuizzes',
        description: 'Generate multiple quiz files for chapters using template questions',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Physics topic' },
            chapters: { type: 'array', items: { type: 'number' }, description: 'Array of chapter numbers' },
            templateQuestions: {
              type: 'array',
              description: 'Template questions to customize for each chapter',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correct: { type: 'integer' },
                  explanation: { type: 'string' }
                }
              }
            }
          },
          required: ['topic', 'chapters', 'templateQuestions']
        }
      },
      {
        name: 'optimizeQuizDifficulty',
        description: 'Optimize quiz difficulty and balance answer distribution',
        inputSchema: {
          type: 'object',
          properties: {
            quizData: {
              type: 'object',
              description: 'Quiz data to optimize',
              properties: {
                questions: { type: 'array' }
              },
              required: ['questions']
            },
            targetDifficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Target difficulty level'
            }
          },
          required: ['quizData']
        }
      },
      {
        name: 'generateSitemap',
        description: 'Generate XML sitemap for the website',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'validateDeployment',
        description: 'Validate deployment readiness and check critical files',
        inputSchema: { type: 'object', properties: {} }
      },
      {
        name: 'generateRobotsTxt',
        description: 'Generate robots.txt file for SEO',
        inputSchema: {
          type: 'object',
          properties: {
            baseUrl: { type: 'string', description: 'Base URL of the website' },
            allowAll: { type: 'boolean', description: 'Allow all crawlers (default: true)' },
            includeSitemap: { type: 'boolean', description: 'Include sitemap reference (default: true)' }
          }
        }
      },
      {
        name: 'getSystemStats',
        description: 'Get comprehensive system performance and health statistics',
        inputSchema: { type: 'object', properties: {} }
      }
    ];
  }
}

// JSON-RPC 2.0 Server with enhanced error handling
const server = new PhysicsDailyMCP();

process.stdin.on('data', async (data) => {
  let request;
  
  try {
    request = JSON.parse(data.toString());
    
    // Validate JSON-RPC request format
    if (!request.method || typeof request.method !== 'string') {
      throw new Error('Invalid JSON-RPC request: missing or invalid method');
    }
    
    let response;

    switch (request.method) {
      case 'tools/list':
        logger.debug('Listing available tools');
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: { tools: server.listTools() }
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = request.params || {};
        
        if (!name) {
          throw new Error('Tool name is required');
        }
        
        logger.debug('Tool call requested', { tool: name, hasArgs: !!args });
        
        const result = await server.handleToolCall(name, args);
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        };
        break;

      case 'ping':
        // Health check endpoint
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: { 
            status: 'healthy', 
            timestamp: Date.now(),
            uptime: process.uptime(),
            version: config.server.version
          }
        };
        break;

      default:
        logger.warn('Unknown JSON-RPC method', { method: request.method });
        response = {
          jsonrpc: '2.0',
          id: request.id,
          error: { 
            code: -32601, 
            message: 'Method not found',
            data: { method: request.method, availableMethods: ['tools/list', 'tools/call', 'ping'] }
          }
        };
    }

    process.stdout.write(JSON.stringify(response) + '\n');
    
  } catch (error) {
    logger.error('Request processing failed', {
      error: error.message,
      code: error.code || 'REQUEST_ERROR',
      requestId: request?.id || null,
      method: request?.method || 'unknown'
    });
    
    const errorResponse = {
      jsonrpc: '2.0',
      id: request?.id || null,
      error: { 
        code: error.code === 'RATE_LIMIT_EXCEEDED' ? -32000 : 
              error.code === 'VALIDATION_ERROR' ? -32602 :
              error.code === 'TOOL_NOT_FOUND' ? -32601 : -32603,
        message: error.message,
        data: {
          code: error.code,
          timestamp: Date.now(),
          ...(error.validationErrors && { validationErrors: error.validationErrors }),
          ...(error.rateLimitInfo && { rateLimitInfo: error.rateLimitInfo }),
          ...(error.availableTools && { availableTools: error.availableTools })
        }
      }
    };
    
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

// Enhanced process signal handling
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection', { reason, promise });
  process.exit(1);
});

// Startup complete
logger.info('Physics Daily MCP Server started successfully', {
  version: config.server.version,
  availableTools: Object.keys(server.tools).length,
  pid: process.pid
});

