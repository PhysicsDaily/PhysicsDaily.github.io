# MCQ Question Management Guide

This guide explains how to easily add and manage MCQ (Multiple Choice Questions) using the new JSON-based system.

## 📁 File Structure

```
assets/
├── data/
│   └── mcq-questions/
│       ├── chapter3-force-newton-laws.json
│       ├── chapter4-energy.json (example)
│       └── chapter5-momentum.json (example)
├── js/
│   └── mcq-engine.js
└── css/
    └── mcq-styles.css
```

## 📝 JSON Question Format

Each chapter's MCQ questions are stored in a JSON file with the following structure:

### Basic Structure

```json
{
  "chapter": {
    "id": "chapter3",
    "title": "Force and Newton's Laws",
    "topic": "mechanics",
    "description": "Test your understanding of forces and Newton's three laws of motion"
  },
  "quiz": {
    "timeLimit": 1800,
    "passingScore": 70,
    "instructions": [
      "Read each question carefully before selecting your answer.",
      "You have 30 minutes to complete this quiz.",
      "Each question has only one correct answer.",
      "You can review your answers before submitting."
    ]
  },
  "questions": [
    // Array of question objects
  ]
}
```

### Question Object Format

```json
{
  "id": 1,
  "type": "multiple-choice",
  "difficulty": "easy",
  "question": "According to Newton's first law of motion, an object at rest will:",
  "options": [
    "Always remain at rest",
    "Remain at rest unless acted upon by an unbalanced force",
    "Eventually start moving on its own",
    "Move only if pushed very hard"
  ],
  "correct": 1,
  "explanation": "Newton's first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an unbalanced external force.",
  "topics": ["Newton's First Law", "Inertia"],
  "points": 2
}
```

## 🎯 Field Descriptions

### Chapter Information
- **id**: Unique identifier for the chapter
- **title**: Display title for the quiz
- **topic**: Physics topic (mechanics, thermodynamics, etc.)
- **description**: Brief description shown to students

### Quiz Settings
- **timeLimit**: Time limit in seconds (1800 = 30 minutes)
- **passingScore**: Minimum percentage to pass (70 = 70%)
- **instructions**: Array of instruction strings

### Question Fields
- **id**: Unique question number (should be sequential)
- **type**: Question type (currently only "multiple-choice")
- **difficulty**: "easy", "medium", or "hard"
- **question**: The question text (supports HTML)
- **options**: Array of answer choices (exactly 4 options)
- **correct**: Index of correct answer (0-3, where 0 = first option)
- **explanation**: Detailed explanation shown after answering
- **topics**: Array of topic tags for categorization
- **points**: Points awarded for correct answer

## ✨ Adding New Questions

### Step 1: Create JSON File
1. Create a new JSON file in `assets/data/mcq-questions/`
2. Use the naming format: `chapter[number]-[topic-name].json`
3. Copy the basic structure from existing files

### Step 2: Configure Chapter Settings
```json
{
  "chapter": {
    "id": "chapter4",
    "title": "Energy and Work",
    "topic": "mechanics",
    "description": "Test your understanding of kinetic energy, potential energy, and work"
  },
  "quiz": {
    "timeLimit": 2400,
    "passingScore": 75,
    "instructions": [
      "Read each question carefully.",
      "You have 40 minutes to complete this quiz.",
      "Calculators are allowed.",
      "Show your work for numerical problems."
    ]
  }
}
```

### Step 3: Add Questions
```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "difficulty": "easy",
      "question": "The SI unit of energy is:",
      "options": [
        "Watt (W)",
        "Joule (J)",
        "Newton (N)",
        "Pascal (Pa)"
      ],
      "correct": 1,
      "explanation": "The joule (J) is the SI unit of energy. It's defined as the energy expended when applying a force of one newton through a distance of one meter.",
      "topics": ["Energy", "SI Units"],
      "points": 2
    }
  ]
}
```

### Step 4: Update HTML File
Update the corresponding MCQ HTML file to load the new JSON:

```html
<script>
    const quiz = new MCQQuizEngine('mcq-quiz-container');
    quiz.loadQuiz('../../assets/data/mcq-questions/chapter4-energy.json');
</script>
```

## 🎨 Difficulty Guidelines

### Easy Questions (2 points)
- Basic definitions and concepts
- Simple recall of formulas
- Straightforward applications

### Medium Questions (3 points)
- Application of concepts to new situations
- Multi-step problem solving
- Conceptual understanding

### Hard Questions (5 points)
- Complex problem solving
- Integration of multiple concepts
- Advanced applications

## 💡 Best Practices

### Writing Good Questions
1. **Clear and Concise**: Make questions easy to understand
2. **Single Concept**: Focus on one main concept per question
3. **Avoid Negatives**: Use positive phrasing when possible
4. **Balanced Options**: Make all distractors plausible

### Writing Options
1. **Equal Length**: Keep options roughly the same length
2. **No Obvious Patterns**: Vary the position of correct answers
3. **Parallel Structure**: Use consistent grammar and format
4. **No "All of the Above"**: Avoid this type of option

### Writing Explanations
1. **Educational**: Explain why the answer is correct
2. **Complete**: Address common misconceptions
3. **References**: Include relevant formulas or principles
4. **Encouraging**: Maintain a positive, educational tone

## 🔧 Technical Notes

### File Naming Convention
- Use lowercase with hyphens: `chapter3-force-newton-laws.json`
- Include chapter number and descriptive topic name
- Keep filenames under 50 characters

### JSON Validation
- Always validate JSON syntax before deployment
- Use proper escaping for special characters
- Ensure arrays and objects are properly closed

### Testing New Quizzes
1. Load the quiz in a browser
2. Test all navigation features
3. Verify timer functionality
4. Check all answer combinations
5. Review explanations for clarity

## 📊 Analytics and Insights

The MCQ engine automatically tracks:
- Time spent per question
- Answer accuracy by difficulty
- Common wrong answers
- Completion rates

This data can be used to improve question quality and identify learning gaps.

## 🚀 Future Enhancements

Planned features:
- Multiple question types (fill-in-the-blank, matching)
- Adaptive difficulty based on performance
- Detailed analytics dashboard
- Bulk question import tools
- Collaborative question authoring

## 🆘 Troubleshooting

### Common Issues

**Quiz doesn't load:**
- Check JSON syntax validity
- Verify file path is correct
- Ensure server is serving JSON files properly

**Questions appear broken:**
- Check that `correct` index matches available options
- Verify all required fields are present
- Ensure question IDs are unique and sequential

**Styling issues:**
- Verify CSS files are properly linked
- Check browser console for errors
- Ensure all CSS custom properties are defined

### Support
For technical support or questions about the MCQ system, please refer to the project documentation or contact the development team.