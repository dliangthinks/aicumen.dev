# Composer — Project overview

Composer is Aicumen's open-source course authoring engine, designed to be driven by AI agents through the Model Context Protocol (MCP). It is currently in design; no authoring engine has been released.

## The aim

What Blender is to 3D content, Composer aims to be for e-learning: an extensible, programmatic foundation for interactive learning experiences. A person supplies intent and judgment. An agent performs instructional design and calls tools. The engine validates, stores, and renders the course.

## Content and presentation

A shape describes the structure of learning content independently of its appearance. The proposed starting taxonomy contains fifteen shapes, including prose, collections, pairs, figures, categorizations, matrices, questions, scenarios, models, and reflection prompts.

A presentation determines what the learner does with that content. Pairs, for example, can be shown as a glossary, flashcards, or a matching exercise. The four stances are expository, exploratory, practice, and assessment. Re-presenting the same structure should not require rewriting it.

## Human review

The intended preview workflow lets reviewers compare presentations and give feedback on a precise selection. The agent remains the author of record, and approved content is protected. Media briefs follow a shared course style.

## Scope

Composer is an engine, not an LLM or learning management system. Standalone web courses are the intended output; SCORM and xAPI packaging are planned. Its open-source design uses the MIT license.

This overview summarizes the local aicumen repository README, reviewed September 6, 2026. Capabilities described here are design intentions, not a release announcement.
