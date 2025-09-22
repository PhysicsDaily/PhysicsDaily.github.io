---
layout: base.njk
permalink: mechanics/chapter3/mcq.html
title: Force and Newton's Laws Quiz
topic: mechanics
chapter: 3
description: Practice multiple-choice questions that cover Newton's laws, free-body diagrams, and friction scenarios.
pageScripts:
  - /assets/js/quiz-manager.js
  - /assets/js/pages/force-newton-quiz.js
---

<div class="chapter-quiz">
  <header class="header">
    <div class="container">
      <h1>Chapter 3: Force and Newton's Laws</h1>
      <p class="subtitle">Choose how many questions you want, set a timer, and test your understanding.</p>
    </div>
  </header>

  <section class="instructions-container" id="instructions-container">
    <h2>Quiz Setup</h2>
    <ul>
      <li>Questions draw from the official Chapter 3 question bank.</li>
      <li>Each correct answer awards <strong>+4</strong> marks; each incorrect answer applies a <strong>-1</strong> penalty.</li>
      <li>Unanswered questions score zero.</li>
      <li>Use the palette to jump between questions before submitting.</li>
    </ul>
    <div class="quiz-setup">
      <div class="setup-item">
        <label for="question-count-select">Number of Questions</label>
        <select id="question-count-select">
          <option value="5" selected>5 (Quick Test)</option>
          <option value="10">10 (Standard)</option>
          <option value="20">20 (Full Practice)</option>
        </select>
      </div>
      <div class="setup-item">
        <label for="timer-input">Timer (minutes)</label>
        <input type="number" id="timer-input" value="10" min="1">
      </div>
    </div>
    <button id="start-test-btn" class="btn">Start Test</button>
  </section>

  <section class="quiz-interface" id="quiz-interface" hidden>
    <div class="test-container">
      <div class="test-main">
        <div class="timer-container">
          <div class="timer-label">Time Remaining</div>
          <div id="timer-display">00:00:00</div>
        </div>
        <div id="question-header" class="question-header"></div>
        <div id="question-content" class="question-content"></div>
        <ul id="options-list" class="options-list"></ul>
        <div class="quiz-navigation">
          <button id="prev-btn" class="btn btn-secondary">Previous</button>
          <button id="mark-review-btn" class="btn btn-secondary">Mark for Review</button>
          <button id="next-btn" class="btn">Save &amp; Next</button>
        </div>
      </div>
      <aside class="test-sidebar">
        <div class="sidebar-header">Question Palette</div>
        <div id="question-palette" class="question-palette"></div>
        <button id="submit-test-btn" class="btn">Submit Test</button>
      </aside>
    </div>
  </section>

  <section class="results-container" id="results-container" hidden>
    <header class="header">
      <div class="container">
        <h2>Quiz Results</h2>
      </div>
    </header>
    <div id="results-summary" class="results-summary"></div>
    <div id="detailed-results"></div>
    <button class="btn" onclick="location.reload()">Take Another Test</button>
  </section>
</div>


