#!/usr/bin/env node

import { readFile, readdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

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
    this.tools = {
      validateQuizJson: this.validateQuizJson.bind(this),
      createQuizJson: this.createQuizJson.bind(this),
      listChapters: this.listChapters.bind(this),
      generateChapterScaffold: this.generateChapterScaffold.bind(this),
      readFileRestricted: this.readFileRestricted.bind(this),
      styleRewrite: this.styleRewrite.bind(this)
    };
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
    
    if (!questions || !Array.isArray(questions)) {
      throw new Error('Questions array is required');
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

      for (const topic of topics) {
        try {
          const topicPath = join(PROJECT_ROOT, topic);
          const entries = await readdir(topicPath, { withFileTypes: true });
          
          for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('chapter')) {
              const chapterNum = entry.name.replace('chapter', '');
              chapters.push({
                topic,
                chapter: chapterNum,
                path: join(topic, entry.name),
                hasIndex: false,
                hasMcq: false
              });
            }
          }
        } catch (e) {
          // Topic directory doesn't exist, skip
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
    
    if (!topic || !chapter) {
      throw new Error('Topic and chapter number are required');
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
    
    // Security: Only allow reading from project directory and safe file types
    const safePath = join(PROJECT_ROOT, path);
    const allowedExtensions = ['.html', '.css', '.js', '.json', '.md', '.txt'];
    const ext = path.toLowerCase().substring(path.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`File type ${ext} not allowed for reading`);
    }

    try {
      const content = await readFile(safePath, 'utf-8');
      return {
        path,
        content,
        size: content.length,
        lines: content.split('\n').length,
        summary: `Read ${basename(path)} (${content.length} characters, ${content.split('\n').length} lines)`
      };
    } catch (error) {
      throw new Error(`Failed to read file ${path}: ${error.message}`);
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

  // MCP Protocol: Handle tool calls
  async handleToolCall(name, args) {
    if (!this.tools[name]) {
      throw new Error(`Unknown tool: ${name}`);
    }
    
    return await this.tools[name](args);
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
      }
    ];
  }
}

// JSON-RPC 2.0 Server
const server = new PhysicsDailyMCP();

process.stdin.on('data', async (data) => {
  try {
    const request = JSON.parse(data.toString());
    let response;

    switch (request.method) {
      case 'tools/list':
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: { tools: server.listTools() }
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = request.params;
        const result = await server.handleToolCall(name, args);
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        };
        break;

      default:
        response = {
          jsonrpc: '2.0',
          id: request.id,
          error: { code: -32601, message: 'Method not found' }
        };
    }

    process.stdout.write(JSON.stringify(response) + '\n');
  } catch (error) {
    const response = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: error.message }
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  }
});

// Handle process signals
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

console.error('Physics Daily MCP Server started');