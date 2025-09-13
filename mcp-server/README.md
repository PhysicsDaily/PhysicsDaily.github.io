# Physics Daily MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with powerful tools for managing Physics Daily content, quizzes, and project structure.

## Features

### 🎯 Content Management
- **Quiz Validation**: Validate quiz JSON files against schema
- **Quiz Generation**: Create properly structured quiz files
- **Chapter Scaffolding**: Generate HTML templates for new chapters
- **Content Reading**: Safe file reading with type restrictions

### 🔧 Development Tools
- **Chapter Listing**: Inventory all chapters across physics topics
- **Style Rewriting**: Ensure content matches project style guide
- **Structure Validation**: Maintain consistent project architecture

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

### 1. validateQuizJson
Validates quiz JSON structure against the project schema.

**Parameters:**
- `content` (string|object): Quiz JSON content to validate

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

### 2. createQuizJson
Creates properly structured quiz JSON files.

**Parameters:**
- `topic` (string): Physics topic (e.g., "mechanics")
- `chapter` (string): Chapter number
- `questions` (array): Array of question objects

### 3. listChapters
Lists all chapters in the project with their status.

**Returns:**
- Chapter inventory across all topics
- File status (has index.html, has mcq.html)
- Topic summaries

### 4. generateChapterScaffold
Generates complete HTML scaffolding for new chapters.

**Parameters:**
- `topic` (string): Physics topic
- `chapter` (string): Chapter number
- `title` (string, optional): Custom chapter title

**Returns:**
- Complete `index.html` with theory structure
- Complete `mcq.html` with quiz interface
- Proper navigation and breadcrumbs

### 5. readFileRestricted
Safely reads project files with security restrictions.

**Parameters:**
- `path` (string): Relative path from project root

**Security:**
- Only allows safe file extensions (.html, .css, .js, .json, .md, .txt)
- Restricted to project directory

### 6. styleRewrite
Rewrites content to match project style guidelines.

**Parameters:**
- `content` (string): Content to rewrite
- `type` (string): Content type (html, css, javascript)

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

### Creating a New Chapter
1. Use `generateChapterScaffold` to create HTML templates
2. Use `createQuizJson` to generate quiz data
3. Use `validateQuizJson` to ensure quiz structure is correct
4. Use `styleRewrite` to ensure content matches project style

### Content Validation
1. Use `listChapters` to inventory existing content
2. Use `readFileRestricted` to examine specific files
3. Use `validateQuizJson` to check quiz data integrity

### Bulk Operations
1. Use `listChapters` to identify gaps
2. Use `generateChapterScaffold` for multiple chapters
3. Use batch validation tools for quality assurance

## Security Features

- **File Access Control**: Only safe file types and project directories
- **Input Validation**: All tool inputs are validated
- **Error Handling**: Graceful error responses with helpful messages
- **Path Sanitization**: Prevents directory traversal attacks

## Development

### Adding New Tools
1. Add tool method to `PhysicsDailyMCP` class
2. Register in `this.tools` object
3. Add tool definition to `listTools()` method
4. Update documentation

### Testing Tools
```bash
# Test validation
echo '{"method":"tools/call","params":{"name":"listChapters","arguments":{}},"id":1}' | node index.js

# Test chapter generation
echo '{"method":"tools/call","params":{"name":"generateChapterScaffold","arguments":{"topic":"mechanics","chapter":"15"}},"id":1}' | node index.js
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