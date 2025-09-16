# Physics Daily MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with powerful tools for managing Physics Daily content, quizzes, and project structure.

## Features

### 🎯 Content Management
- **Quiz Validation**: Validate quiz JSON files against schema with detailed error reporting
- **Quiz Generation**: Create properly structured quiz files with bulk operations
- **Quiz Optimization**: Balance difficulty and answer distribution automatically
- **Chapter Scaffolding**: Generate complete HTML templates for new chapters
- **Content Reading**: Safe file reading with enhanced security and error handling

### � Content Analysis
- **Gap Analysis**: Identify missing chapters and incomplete content across all physics topics
- **Quality Assessment**: Analyze quiz quality with metrics and improvement suggestions
- **Structure Validation**: Ensure consistent project architecture and file organization
- **Comprehensive Reporting**: Generate detailed content health reports

### 🚀 Deployment Tools
- **Sitemap Generation**: Create XML sitemaps automatically from site structure
- **Deployment Validation**: Check readiness for production deployment
- **SEO Optimization**: Generate robots.txt and validate PWA requirements
- **Performance Monitoring**: Analyze site structure for optimization opportunities

### 🔧 Development Tools
- **Bulk Operations**: Process multiple chapters and quizzes simultaneously
- **Style Enforcement**: Ensure content matches project style guide
- **Error Recovery**: Graceful handling of missing files and invalid data
- **Security Features**: Restricted file access and input validation

### 📚 Physics Topics Supported
- Mechanics (Chapters 1-14)
- Fluids (Chapters 15-17)
- Waves (Chapters 18-20)
- Thermodynamics (Chapters 21-24)
- Electromagnetism (Chapters 25-39)
- Optics (Chapters 40-45)
- Modern Physics (Chapters 46-52)

## Installation

```bash
cd mcp-server
npm install
```

## Usage

### Start the MCP Server
```bash
npm start
# or
npm run mcp
```

### Development Mode (with file watching)
```bash
npm run dev
```

## Available Tools

### Core Content Management

#### 1. validateQuizJson
Validates quiz JSON structure against the project schema with enhanced error reporting.

**Parameters:**
- `content` (string|object): Quiz JSON content to validate

**Returns:**
- Validation status with detailed error messages
- Question count and structure analysis
- Specific recommendations for fixes

**Example:**
```json
{
  "name": "validateQuizJson",
  "arguments": {
    "content": {
      "questions": [
        {
          "question": "What is Newton's first law?",
          "options": ["F=ma", "Object at rest stays at rest", "E=mc²", "F=mg"],
          "correct": 1,
          "explanation": "Newton's first law states that an object at rest stays at rest..."
        }
      ]
    }
  }
}
```

#### 2. createQuizJson
Creates properly structured quiz JSON files with comprehensive validation.

**Parameters:**
- `topic` (string): Physics topic (e.g., "mechanics")
- `chapter` (string): Chapter number
- `questions` (array): Array of question objects with validation

**Enhanced Features:**
- Validates question structure before creation
- Ensures 4 options per question
- Requires explanations for all questions
- Supports up to 50 questions per quiz

#### 3. generateChapterScaffold
Generates complete HTML scaffolding for new chapters with modern web standards.

**Parameters:**
- `topic` (string): Physics topic (must be valid)
- `chapter` (string): Chapter number (1-100)
- `title` (string, optional): Custom chapter title

**Features:**
- Validates topic against known physics subjects
- Creates both theory (index.html) and quiz (mcq.html) pages
- Includes proper meta tags, navigation, and responsive design
- Integrates with existing authentication and gamification systems

### Content Analysis Tools

#### 4. analyzeContentGaps
Comprehensive analysis of missing chapters and content gaps.

**Returns:**
- Missing chapters by topic with expected ranges
- Incomplete chapters (missing index.html or mcq.html)
- Coverage percentages and priority recommendations
- Action items for content completion

#### 5. validateSiteStructure
Validates overall site structure and critical dependencies.

**Returns:**
- Health score based on critical file availability
- Missing main pages, assets, and topic indices
- Deployment readiness assessment
- Specific fix recommendations

#### 6. analyzeQuizQuality
Detailed analysis of quiz quality and educational effectiveness.

**Returns:**
- Quality metrics (question count, length, answer distribution)
- Validation status for all quiz files
- Improvement recommendations
- Educational quality scoring

#### 7. generateContentReport
Generates comprehensive content analysis combining all assessment tools.

**Returns:**
- Overall site health status
- Priority action items
- Next steps for improvement
- Detailed analysis across all content areas

### Enhanced Quiz Management

#### 8. bulkValidateQuizzes
Validates all quiz JSON files in the project simultaneously.

**Returns:**
- Validation status for every quiz file
- Error details and parse issues
- Summary statistics
- Batch fix recommendations

#### 9. generateBulkQuizzes
Creates multiple quiz files for chapters using template questions.

**Parameters:**
- `topic` (string): Physics topic
- `chapters` (array): Array of chapter numbers
- `templateQuestions` (array): Template questions to customize

**Features:**
- Customizes questions for each chapter
- Maintains consistency across related chapters
- Validates all generated quizzes
- Provides detailed generation report

#### 10. optimizeQuizDifficulty
Optimizes quiz difficulty and balances answer distribution for better learning outcomes.

**Parameters:**
- `quizData` (object): Quiz data to optimize
- `targetDifficulty` (string): 'easy', 'medium', or 'hard'

**Features:**
- Balances correct answer positions to avoid patterns
- Adjusts question complexity for target difficulty
- Provides specific improvement suggestions
- Maintains educational integrity

### Deployment and SEO Tools

#### 11. generateSitemap
Creates XML sitemap automatically from site structure.

**Returns:**
- Complete XML sitemap ready for deployment
- Page count and structure analysis
- SEO-optimized priority and frequency settings
- Integration with existing content structure

#### 12. validateDeployment
Comprehensive deployment readiness validation.

**Returns:**
- Deployment readiness status
- Critical file availability check
- PWA manifest validation
- Service worker functionality assessment
- SEO requirements verification

#### 13. generateRobotsTxt
Generates SEO-optimized robots.txt file.

**Parameters:**
- `baseUrl` (string, optional): Website base URL
- `allowAll` (boolean, optional): Allow all crawlers
- `includeSitemap` (boolean, optional): Include sitemap reference

**Features:**
- Configurable crawler access policies
- AI bot restrictions for content protection
- Sitemap integration
- SEO best practices implementation

### Utility Tools

#### 14. listChapters
Enhanced chapter inventory with detailed status information.

**Returns:**
- Complete chapter listing across all topics
- File availability status (index.html, mcq.html)
- Chapter number validation
- Topic-wise statistics and summaries

#### 15. readFileRestricted
Secure file reading with enhanced safety features.

**Parameters:**
- `path` (string): Relative path from project root

**Security Features:**
- Directory traversal prevention
- File type whitelist enforcement
- Detailed error reporting
- File metadata analysis

#### 16. styleRewrite
Ensures content matches project style guidelines.

**Parameters:**
- `content` (string): Content to rewrite
- `type` (string): Content type (html, css, javascript)

**Features:**
- Indentation standardization
- Missing meta tag insertion
- Style guide compliance checking
- Quality improvement suggestions

## Integration with AI Assistants

This MCP server is designed to work with MCP-compatible AI assistants like:
- Claude Desktop
- VS Code extensions with MCP support
- Custom MCP clients

### Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "physics-daily": {
      "command": "node",
      "args": ["C:/path/to/PhysicsDaily.github.io/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

## Project Structure Integration

The MCP server understands your Physics Daily project structure:

```
PhysicsDaily.github.io/
├── mcp-server/           # This MCP server
├── assets/
│   ├── js/mcq-data/     # Quiz JSON files
│   └── ...
├── mechanics/           # Physics topics
├── thermodynamics/
├── electromagnetism/
└── ...
```

## Example Workflows

### 📝 Creating a New Chapter
```javascript
// 1. Generate chapter scaffold
{
  "name": "generateChapterScaffold",
  "arguments": {
    "topic": "mechanics",
    "chapter": "15",
    "title": "Advanced Dynamics"
  }
}

// 2. Create quiz with optimized difficulty
{
  "name": "createQuizJson",
  "arguments": {
    "topic": "mechanics",
    "chapter": "15",
    "questions": [...]
  }
}

// 3. Optimize quiz for medium difficulty
{
  "name": "optimizeQuizDifficulty",
  "arguments": {
    "quizData": { "questions": [...] },
    "targetDifficulty": "medium"
  }
}

// 4. Validate everything is correct
{
  "name": "validateQuizJson",
  "arguments": {
    "content": { "questions": [...] }
  }
}
```

### 📊 Content Analysis & Quality Assurance
```javascript
// 1. Generate comprehensive content report
{
  "name": "generateContentReport",
  "arguments": {}
}

// 2. Analyze specific content gaps
{
  "name": "analyzeContentGaps",
  "arguments": {}
}

// 3. Validate all quizzes at once
{
  "name": "bulkValidateQuizzes",
  "arguments": {}
}

// 4. Check deployment readiness
{
  "name": "validateDeployment",
  "arguments": {}
}
```

### 🚀 Bulk Operations for Multiple Chapters
```javascript
// 1. Generate quizzes for multiple chapters
{
  "name": "generateBulkQuizzes",
  "arguments": {
    "topic": "electromagnetism",
    "chapters": [25, 26, 27, 28],
    "templateQuestions": [
      {
        "question": "What is the key concept in Chapter X?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "This concept is fundamental to Chapter X because..."
      }
    ]
  }
}

// 2. Validate site structure
{
  "name": "validateSiteStructure",
  "arguments": {}
}

// 3. Generate SEO files
{
  "name": "generateSitemap",
  "arguments": {}
}

{
  "name": "generateRobotsTxt",
  "arguments": {
    "baseUrl": "https://physicsdaily.github.io",
    "allowAll": true,
    "includeSitemap": true
  }
}
```

### 🔍 Debugging and Troubleshooting
```javascript
// 1. Check specific file
{
  "name": "readFileRestricted",
  "arguments": {
    "path": "mechanics/chapter3/index.html"
  }
}

// 2. Analyze quiz quality issues
{
  "name": "analyzeQuizQuality",
  "arguments": {}
}

// 3. Get chapter overview
{
  "name": "listChapters",
  "arguments": {}
}

// 4. Fix content style
{
  "name": "styleRewrite",
  "arguments": {
    "content": "<html>...</html>",
    "type": "html"
  }
}
```

## Security Features

- **File Access Control**: Only safe file types (.html, .css, .js, .json, .md, .txt, .xml, .svg) and project directories
- **Input Validation**: All tool inputs are validated with descriptive error messages
- **Error Handling**: Graceful error responses with helpful troubleshooting information
- **Path Sanitization**: Prevents directory traversal attacks and unauthorized access
- **Content Validation**: JSON schema validation and structure verification
- **Resource Limits**: Reasonable limits on file sizes and operation scope

## Performance Features

- **Efficient File Operations**: Optimized file reading with proper encoding detection
- **Batch Processing**: Bulk operations for multiple files and chapters
- **Memory Management**: Controlled resource usage for large operations
- **Error Recovery**: Continues processing despite individual failures
- **Caching Strategy**: Minimal repeated file system operations

## Development

### Adding New Tools
1. Add tool method to `PhysicsDailyMCP` class with proper error handling
2. Register in `this.tools` object with appropriate binding
3. Add comprehensive tool definition to `listTools()` method
4. Update documentation with usage examples and parameter details
5. Test tool functionality with various inputs and edge cases

### Tool Development Best Practices
- Always validate inputs thoroughly
- Provide descriptive error messages
- Include usage examples in documentation
- Handle edge cases gracefully
- Follow security guidelines for file operations
- Return structured, useful data
- Include recommendations and next steps

### Testing Tools
```bash
# Test content analysis
echo '{"method":"tools/call","params":{"name":"generateContentReport","arguments":{}},"id":1}' | node index.js

# Test quiz validation
echo '{"method":"tools/call","params":{"name":"bulkValidateQuizzes","arguments":{}},"id":1}' | node index.js

# Test deployment validation
echo '{"method":"tools/call","params":{"name":"validateDeployment","arguments":{}},"id":1}' | node index.js

# Test chapter analysis
echo '{"method":"tools/call","params":{"name":"analyzeContentGaps","arguments":{}},"id":1}' | node index.js
```

## Integration Examples

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "physics-daily": {
      "command": "node",
      "args": ["C:/path/to/PhysicsDaily.github.io/mcp-server/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### VS Code MCP Extension
```json
{
  "mcp.servers": {
    "physics-daily": {
      "command": "node",
      "args": ["./mcp-server/index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

### Custom MCP Client
```javascript
import { MCPClient } from '@modelcontextprotocol/client';

const client = new MCPClient({
  command: 'node',
  args: ['./mcp-server/index.js'],
  cwd: process.cwd()
});

await client.connect();

// Use content analysis tools
const report = await client.callTool('generateContentReport', {});
console.log('Site Health:', report.overallHealth);

// Generate new content
const scaffold = await client.callTool('generateChapterScaffold', {
  topic: 'mechanics',
  chapter: '15',
  title: 'Advanced Dynamics'
});
```

## Troubleshooting

### Common Issues
- **"Method not found"**: Check tool name spelling
- **"File type not allowed"**: Ensure file extension is in allowed list
- **"Path not found"**: Verify relative path from project root

### Debug Mode
The server logs to stderr, so you can see debug information while keeping JSON-RPC communication clean.

---

**Next Steps:**
1. Integrate with your preferred MCP client
2. Start using tools for content creation
3. Customize tools for your specific workflow needs

Happy physics content creation! 🚀