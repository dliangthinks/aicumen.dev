# SAICA — Stanford AI Competency Assessment

<p align="center">
  <img src="public/saica-banner.png" alt="SAICA Banner" width="600" />
</p>

## Executive Summary

SAICA is a **formative diagnostic** that places professionals on a five-level AI competency spectrum. In approximately 20 minutes, a 12-question adaptive assessment evaluates knowledge, applied skills, and professional judgment across seven domains — then generates a personalized report with level placement, domain profile, and curated learning paths.

The tool is designed for working professionals — educators, analysts, developers, and knowledge workers — who use or are integrating AI into their practice. It is analogous to a reading-level placement test or language diagnostic: its purpose is to guide self-directed professional development, not to certify or rank individuals. SAICA is not appropriate for use in hiring, performance review, or credentialing decisions.

---

## Assessment Design Philosophy

SAICA is built on three pedagogical principles:

**Competency is not knowledge recall.** Traditional multiple-choice alone measures recognition — the ability to identify a correct answer when presented with choices. Recognition is the lowest level of Bloom's taxonomy and is a weak proxy for professional capability. SAICA uses twelve question types specifically to assess applied skills at higher cognitive levels: application, analysis, evaluation, and creation. A learner who can define "hallucination" in an MCQ may still fail to detect one in a produced output — and the latter is the competency that matters.

**Adaptive difficulty produces more precise measurement in less time.** A fixed-order, fixed-difficulty assessment cannot efficiently discriminate across a five-level competency range without becoming either too easy for experts or too discouraging for novices. SAICA uses Elo-based adaptive item selection to target each question at the learner's estimated ability level, maximizing information gain per item. This lets a 12-question session achieve the measurement precision that would otherwise require 20–30 fixed items.

**Feedback must be actionable, not merely evaluative.** A score alone does not help a learner grow. The report explains what performance at each level looks like in observable professional behavior, identifies specific domain gaps with AI-generated rationale, and maps those gaps to concrete next steps. The intent is for every learner — regardless of level — to leave with clarity about where they are and a specific path forward.

---

## The Five Competency Levels

The level structure draws from the **Dreyfus Model of Skill Acquisition** (Dreyfus & Dreyfus, 1980), adapted to the domain of professional AI use. In the Dreyfus model, expertise progresses through five stages characterized by a shift in how practitioners relate to rules, context, and judgment: from rigid rule-following at the novice stage, where context is ignored and instructions are applied literally, to fluid situational judgment at the expert stage, where behavior is deeply internalized and the practitioner can evaluate and improve the practice of others.

Applied to AI, this progression maps onto a shift in agency: at the lowest levels, the professional is a *consumer* of AI output; at mid-levels, a *director* of AI behavior; at the highest levels, a *builder* of AI systems for others.

| Level | Persona | Dreyfus Stage | Observable Professional Behaviors |
|-------|---------|---------------|----------------------------------|
| 1 | **The Copy-Paster** | Novice | Accepts AI output at face value; minimal prompt modification; cannot articulate why a prompt succeeded or failed; no awareness of model limitations |
| 2 | **The Prompt Crafter** | Advanced Beginner | Uses deliberate prompting patterns (role, format, few-shot); structures outputs; recognizes common failure modes; can improve a failing prompt iteratively |
| 3 | **The Maker** | Competent | Connects AI to external data or systems; designs multi-step workflows; critically evaluates output quality before acting on it; identifies domain where AI should not be trusted |
| 4 | **The Engineer** | Proficient | Builds production-adjacent workflows with API integration; implements safety checks and guardrails; considers latency, cost, and reliability tradeoffs; documents assumptions |
| 5 | **The Orchestrator** | Expert | Designs AI-powered tools for teams; writes evaluations to measure system behavior; manages model selection and cost at scale; identifies systemic risks and architectural tradeoffs |

The behavioral descriptors above are the construct SAICA measures — not the personas, which are illustrative shorthand. Two learners may both score at Level 3 while working in entirely different professional contexts; what they share is the set of observable capabilities that define the Competent stage.

---

## Seven Assessment Domains

The seven domains were selected to cover the full spectrum of AI competency as articulated in two emerging professional frameworks: the **UNESCO AI Competency Framework** (2023) and the European **DigComp 2.2** framework (Vuorikari et al., 2022). Both frameworks identify applied AI fluency as multi-dimensional — encompassing foundational knowledge, technical skills, critical evaluation, ethical judgment, and metacognitive awareness. SAICA operationalizes these dimensions into seven assessable domains.

The domain structure also reflects **Anderson & Krathwohl's (2001) revision of Bloom's Taxonomy**, ensuring that the assessment spans the full cognitive range — from factual knowledge and comprehension (Foundational Concepts) through synthesis and creation (Workflow Design) and metacognitive self-regulation (Metacognition).

| Domain | Bloom's Cognitive Level | What It Assesses |
|--------|------------------------|-----------------|
| **Foundational Concepts** | Remember / Understand | How language models work, key parameters (temperature, context window, tokens), core architectures |
| **Prompting** | Apply | Prompt engineering techniques: few-shot, chain-of-thought, role prompting, structured output formats |
| **Workflow Design** | Analyze / Create | Designing multi-step AI pipelines, human-in-the-loop patterns, tool chaining, orchestration |
| **Ethics and Risk** | Evaluate | Identifying bias, privacy implications, responsible deployment decisions, guardrail design |
| **Tool Selection** | Analyze / Evaluate | Matching capabilities to tasks, API vs. fine-tuning vs. RAG tradeoffs, model selection reasoning |
| **Output Evaluation** | Analyze / Evaluate | Detecting hallucinations, assessing factual accuracy, applying quality rubrics to generated content |
| **Metacognition** | Metacognitive Knowledge | Tracking assumptions, calibrating confidence, reflecting on one's own AI-assisted reasoning process |

The adaptive algorithm enforces full domain coverage before optimizing for difficulty targeting — every learner is assessed across all seven domains, regardless of their ability trajectory.

---

## Twelve Question Types

The assessment uses twelve question types across two scoring categories, structured to assess different cognitive levels that multiple-choice alone cannot reach.

**Structured types** (deterministic scoring) assess recall and procedural knowledge — necessary foundations, but not sufficient for professional AI competence:

| Type | Cognitive Level | What It Assesses | Scoring |
|------|----------------|-----------------|---------|
| MCQ | Remember / Understand | Conceptual knowledge and definitional accuracy | Exact match |
| Multiple Select | Understand | Nuanced knowledge where several propositions are simultaneously true | Partial credit: correct hits minus false positives |
| Ranking | Apply | Procedural understanding — knowing the right sequence matters | Position-distance scoring |
| Matching | Understand / Apply | Categorical associations and concept mapping | Pair accuracy percentage |
| Scenario Judgment | Evaluate | Workplace decision-making under realistic constraints | Exact match on defensible choice |

**Open-ended types** (AI-scored) assess applied skill and professional judgment — the competencies that most directly predict real-world performance:

| Type | Cognitive Level | What It Assesses |
|------|----------------|-----------------|
| Prompt Writing | Apply / Create | Constructing effective prompts for a given task and context |
| Prompt Critique | Analyze / Evaluate | Diagnosing weaknesses in a provided prompt and articulating improvements |
| Output Evaluation | Analyze / Evaluate | Critically assessing AI-generated content for quality, accuracy, and appropriateness |
| Short Written | Understand / Analyze | Articulating conceptual understanding in the learner's own words |
| Workflow Design | Analyze / Create | Designing multi-step AI workflows with appropriate tool choices and human checkpoints |
| Build-Step Evaluation | Evaluate / Create | Assessing the design of an AI-assisted process and identifying where it could fail |
| Reflection | Metacognitive | Demonstrating awareness of one's own reasoning process and its limitations |

### Why Open-Ended Questions Are Essential

The shift from structured to open-ended formats corresponds to the shift from *recognizing* competence to *demonstrating* it. Research on skill assessment consistently shows that performance tasks — even brief ones — predict real-world capability better than recognition formats at higher Bloom levels (Messick, 1994). A learner who correctly identifies "chain-of-thought prompting" in an MCQ may still produce a prompt with no reasoning chain; the Prompt Writing item tests whether they can actually do it.

---

## Scoring and Measurement

### Open-Ended Item Scoring

Open-ended responses are scored by a large language model using a structured rubric system designed to reduce the known weaknesses of LLM-as-judge evaluation.

**Per-dimension rubric injection.** Each open-ended question maps to 2–4 rubric dimensions (e.g., `accuracy`, `reasoning`, `risk awareness`). The full 1–5 level description for each dimension is injected into the scoring prompt, so the model evaluates against a concrete behavioral standard rather than an implicit one. 15 reusable dimensions are centrally defined in `src/data/rubrics.json`.

**Chain-of-thought reasoning before scoring.** The model is instructed to reason through its evaluation of each dimension before assigning a score. Wei et al. (2022) demonstrated that eliciting reasoning prior to a judgment improves LLM accuracy significantly over direct score elicitation. SAICA's scoring prompt follows this pattern.

**Verbosity bias mitigation.** LLM judges are known to award higher scores to longer responses independent of quality (Zheng et al., 2023). SAICA's scoring prompt explicitly instructs the model to evaluate substance only, ignoring length.

**Deterministic aggregation.** The model never computes a final score. It produces per-dimension scores on a 1–5 scale. Code then applies question-level weights and aggregates: `(Σ dimension_score × weight) / Σ weight`, scaled to 0–100. This separates the model's judgment task (dimension-level quality assessment) from the arithmetic (score computation), eliminating one source of LLM unreliability.

### Difficulty Calibration

Question difficulty ratings (Elo scale: 800–1600) were initially assigned through structured expert judgment, with each item evaluated against the level descriptors and the behavioral indicators for its Dreyfus stage. Items were calibrated so that a learner performing at level *n* should answer level-*n* items correctly approximately 50% of the time — the standard Item Response Theory criterion for maximizing measurement information.

These initial ratings are expert estimates, not empirically derived. Formal calibration using real response data is planned for the first pilot cohort; Elo ratings will be adjusted as the response distribution informs truer difficulty estimates.

### Reliability

**AI-scored items:** Formal human–AI inter-rater reliability studies are planned for the pilot phase. The design choices above (rubric injection, chain-of-thought, deterministic aggregation) collectively reduce sources of scorer variance. Structured rubrics in particular constrain the judgment space significantly compared to holistic scoring.

**Adaptive measurement:** With a K-factor of 32 and 12 items, the Elo estimate can shift by up to ±192 points per session. In a 5-level range spanning 800 points, this is sufficient to differentiate learners reliably at level boundaries after the first few items provide anchoring information. Sessions with all structured items (faster scoring) will produce tighter estimates than sessions with many open-ended items, because the latter introduce AI-scoring variance into the Elo signal.

### Bias and Fairness Considerations

Structured question types (MCQ, Multiple Select, Ranking, Matching, Scenario Judgment) use language-neutral scoring formats and do not disadvantage non-native English writers.

Open-ended rubric dimensions — particularly *Clarity & Structure* — may disadvantage learners whose linguistic or communicative norms differ from the rubric's implicit standard. The *Clarity* dimension specifically measures how well a response is organized and expressed; this conflates communication style with substantive understanding in ways that may not be equitable across populations. A fairness analysis across linguistic backgrounds is planned as part of the pilot validation study.

---

## Adaptive Question Selection

The adaptive engine implements **Elo-based item selection** — a method adapted from chess rating systems and used in several adaptive educational platforms (e.g., Duolingo, Khan Academy's exercise system) to efficiently estimate learner ability from a short item sequence.

**How it works:**

1. **Session start** — The learner begins at a neutral Elo rating of 1000 (corresponding to Level 2). The first question targets medium difficulty.
2. **Score and update** — After each response, the answer is scored (deterministically for structured types, via AI rubric for open-ended). The learner's Elo shifts based on performance: exceeding expectation raises the rating, falling short lowers it. A learner who answers a Level 4 item correctly gains more points than one who answers a Level 2 item correctly.
3. **Select next** — The engine picks the unanswered item whose difficulty is closest to the learner's current rating, maximizing the expected information gain of each question. **Domain coverage takes priority:** the algorithm enforces exposure to all seven domains before optimizing for difficulty targeting.
4. **Completion** — After 12 questions, the session ends and the report is generated.

**Why 12 questions:** Twelve items balanced measurement precision against learner fatigue. With domain coverage enforced (7 domains), the remaining 5 questions are available for difficulty-targeted measurement. Preliminary simulation with the K=32 parameter suggests sufficient discrimination across the five-level range; this will be validated against pilot data.

---

## The Report

After completing the assessment, learners receive a personalized report structured to support self-directed learning:

- **Level placement** — Competency level (1–5) with behavioral description of what that level looks like in practice
- **Domain radar profile** — Performance across all seven domains, identifying relative strengths and gaps
- **Strength and growth narratives** — AI-generated interpretive text grounded in actual responses
- **Level progression bar** — Visual positioning within the five-level progression
- **Per-question review** — Score, learner response, and per-dimension rubric rationale for every item
- **Personalized learning paths** — Curated resources targeting the weakest domains
- **Level-up guide** — Specific behavioral indicators the learner should develop to reach the next level

The report is designed to be read in 10–15 minutes and to generate a specific development commitment, not just awareness of a score.

---

## Ethical Use

SAICA is a **formative diagnostic** instrument calibrated for self-directed professional development. Like a reading-level placement test, its validity is tied to the purpose it was designed for.

**This instrument is not appropriate for:** hiring decisions, performance reviews, promotion criteria, or academic credentialing. Using SAICA results for consequential decisions about individuals would constitute construct misuse — the instrument was not designed, calibrated, or validated for those purposes, and doing so could cause harm.

**Data:** Assessment responses and scores are stored in session only and are not transmitted to third parties. No personally identifiable information is required to complete the assessment.

---

## References

Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). *A taxonomy for learning, teaching, and assessing: A revision of Bloom's taxonomy of educational objectives.* Longman.

Dreyfus, S. E., & Dreyfus, H. L. (1980). *A five-stage model of the mental activities involved in directed skill acquisition.* University of California, Berkeley.

Messick, S. (1994). The interplay of evidence and consequences in the validation of performance assessments. *Educational Researcher, 23*(2), 13–23.

UNESCO. (2023). *AI competency framework for students.* United Nations Educational, Scientific and Cultural Organization.

Vuorikari, R., Kluzer, S., & Punie, Y. (2022). *DigComp 2.2: The digital competence framework for citizens.* Publications Office of the European Union.

Wei, J., et al. (2022). Chain-of-thought prompting elicits reasoning in large language models. *Advances in Neural Information Processing Systems, 35.*

Zheng, L., et al. (2023). Judging LLM-as-a-judge with MT-bench and chatbot arena. *Advances in Neural Information Processing Systems, 36.*
