---
layout: chapter-fixed.njk
title: Measurement and Units
chapter: 1
topic: mechanics
description: Master the fundamentals of measurement, units, dimensional analysis, and significant figures in physics
hasConceptual: true
hasMCQ: true
hasNumerical: true
hasSimulation: true
learningObjectives:
  - Understand the importance of units and measurements in physics
  - Apply dimensional analysis to check equations and derive relationships
  - Use significant figures correctly in calculations
  - Convert between different unit systems effectively
keyConcepts:
  - title: SI Units
    description: The International System of Units provides standardized base units for physical quantities
    formula: "Length (m), Mass (kg), Time (s), Current (A), Temperature (K)"
  - title: Dimensional Analysis
    description: A powerful tool for checking equations and deriving relationships between physical quantities
    formula: "[M L T] notation for mass, length, and time dimensions"
  - title: Significant Figures
    description: Rules for expressing uncertainty in measurements and calculations
    formula: "Precision = (smallest division) / 2"
---

# Measurement and Units

## Introduction

Physics is fundamentally about measuring and describing the natural world. This chapter introduces the essential tools and concepts needed for accurate measurement and analysis in physics.

## The Importance of Standards

All measurements in physics require comparison with a standard. The SI (International System) provides globally accepted standards for fundamental quantities.

### Base SI Units

- **Length**: meter (m)
- **Mass**: kilogram (kg)
- **Time**: second (s)
- **Electric Current**: ampere (A)
- **Temperature**: kelvin (K)
- **Amount of Substance**: mole (mol)
- **Luminous Intensity**: candela (cd)

## Dimensional Analysis

Dimensional analysis is a powerful problem-solving tool that uses the dimensions of physical quantities to:

1. Check the validity of equations
2. Derive relationships between quantities
3. Convert between unit systems

### Example: Checking an Equation

Consider the equation for kinetic energy: KE = ½mv²

- Dimensions of left side: [Energy] = [M L² T⁻²]
- Dimensions of right side: [M][L T⁻¹]² = [M L² T⁻²]
- Since both sides match, the equation is dimensionally consistent.

## Significant Figures and Uncertainty

Every measurement has inherent uncertainty. Significant figures help us express this uncertainty consistently.

### Rules for Significant Figures

1. All non-zero digits are significant
2. Zeros between non-zero digits are significant
3. Leading zeros are not significant
4. Trailing zeros after a decimal point are significant

## Practice Problems

<div class="practice-problem">
    <div class="problem-header">
        <span class="problem-number">Problem 1</span>
        <span class="problem-difficulty easy">Easy</span>
    </div>
    <div class="problem-statement">
        Convert 72 km/h to m/s.
    </div>
    <div class="reveal-solution">
        <div class="solution-content" style="display: none;">
            72 km/h × (1000 m/km) × (1 h/3600 s) = 20 m/s
        </div>
    </div>
</div>

## Interactive Elements

<div class="concept-check" id="check-1" data-question='{"question": "Which of the following has dimensions of [M L T⁻²]?", "options": ["Force", "Energy", "Power", "Momentum"], "correct": 0, "explanation": "Force = mass × acceleration = [M][L T⁻²] = [M L T⁻²]"}'></div>

<div class="simulation-container" data-simulation="measurement">
    <h3 class="simulation-title">Unit Conversion Interactive Tool</h3>
    <canvas id="measurement-sim" class="simulation-canvas"></canvas>
    <div class="simulation-controls">
        <button class="start-btn">Start</button>
        <button class="stop-btn">Stop</button>
        <button class="reset-btn">Reset</button>
    </div>
</div>
