import type { Metadata } from 'next';
import { ArrowUpRight, ArrowDown, ArrowLeft } from '../icons';
import { Header, Footer, DomainDiagram } from '../site-components';
export const metadata: Metadata = {
  title: 'Assess — Find your next edge',
  description:
    'Explore an adaptive AI competency assessment framework: seven domains, five levels, and a personalized path for professional development. Based on SAICA.',
};
import { AssessmentSample, DomainExplorer } from '../interactions';
const domains = [
  [
    'Foundational concepts',
    'Understand how models work, where their limits lie, and what their parameters change.',
  ],
  [
    'Prompting',
    'Frame requests, supply useful context, and improve an approach when the result falls short.',
  ],
  [
    'Workflow design',
    'Connect steps, tools, and human checkpoints into a process that works.',
  ],
  [
    'Ethics and risk',
    'Recognize bias, protect privacy, and judge when the risks outweigh the benefits.',
  ],
  [
    'Tool selection',
    'Match the model, tool, or approach to the task and its constraints.',
  ],
  [
    'Output evaluation',
    'Check evidence, detect unreliable claims, and judge the quality of a result.',
  ],
  [
    'Metacognition',
    'Examine your assumptions, calibrate your confidence, and reflect on your own reasoning.',
  ],
];
const levels = [
  [
    '01',
    'The Copy-Paster',
    'Uses AI output with limited checking or adaptation.',
  ],
  [
    '02',
    'The Prompt Crafter',
    'Prompts deliberately and improves results through iteration.',
  ],
  [
    '03',
    'The Maker',
    'Connects tools and critically evaluates multi-step work.',
  ],
  [
    '04',
    'The Engineer',
    'Builds reliable workflows with safeguards and clear trade-offs.',
  ],
  [
    '05',
    'The Orchestrator',
    'Designs, evaluates, and improves AI systems for others.',
  ],
];
export default function Assess() {
  return (
    <>
      <Header active="assess" />
      <main id="main">
        <section className="detail-hero wrap assess-hero">
          <a href="/" className="back-link">
            <ArrowLeft size={15} /> All projects
          </a>
          <div className="detail-title-row">
            <span className="eyebrow">02 / Assess</span>
            <span className="status">
              <i /> Based on the SAICA framework
            </span>
          </div>
          <div className="detail-grid">
            <div>
              <h1>
                Find your
                <br />
                <em>next edge.</em>
              </h1>
              <p className="detail-lead">
                Knowing how to prompt is one part of the picture. Understand
                your AI skills, your judgment, and where to grow next.
              </p>
              <a href="#assessment-sample" className="button ink">
                Try a real question <ArrowDown size={18} />
              </a>
            </div>
            <div className="detail-visual">
              <span className="eyebrow">AI COMPETENCE / SEVEN DIMENSIONS</span>
              <DomainDiagram />
            </div>
          </div>
          <div className="assessment-stats">
            <div>
              <strong>7</strong>
              <span>Domains of competence</span>
            </div>
            <div>
              <strong>12</strong>
              <span>Adaptive questions per session</span>
            </div>
            <div>
              <strong>
                ~20<span> min</span>
              </strong>
              <span>Designed assessment length</span>
            </div>
          </div>
        </section>
        <AssessmentSample />
        <section className="editorial-section wrap" id="framework">
          <div className="section-heading">
            <span className="eyebrow">01 / Beyond the right answer</span>
            <h2>
              What can you do?
              <br />
              <span>How do you decide?</span>
            </h2>
          </div>
          <div className="steps">
            <article>
              <span className="step-number">01</span>
              <h3>Demonstrate your skill.</h3>
              <p>
                Write a prompt. Critique an output. Design a workflow. The
                framework combines structured questions with open-ended tasks
                that reveal how you think.
              </p>
            </article>
            <article>
              <span className="step-number">02</span>
              <h3>Meet the right challenge.</h3>
              <p>
                Question difficulty adapts to your responses, while coverage
                across all seven domains keeps the assessment broader than your
                strongest skill.
              </p>
            </article>
            <article>
              <span className="step-number">03</span>
              <h3>Leave with direction.</h3>
              <p>
                The report is designed to connect a competency profile with
                explained strengths, growth areas, learning resources, and a
                guide to the next level.
              </p>
            </article>
          </div>
        </section>
        <section className="domains-section wrap">
          <div className="domains-intro">
            <span className="eyebrow">02 / The whole practitioner</span>
            <h2>
              More than
              <br />
              <em>prompting.</em>
            </h2>
            <p>
              Seven domains bring knowledge, applied skill, and professional
              judgment into one picture.
            </p>
          </div>
          <DomainExplorer domains={domains} />
        </section>
        <section className="editorial-section wrap">
          <div className="section-heading">
            <span className="eyebrow">03 / A progression in agency</span>
            <h2>
              From using outputs
              <br />
              <span>to shaping systems.</span>
            </h2>
          </div>
          <div className="levels">
            {levels.map(([n, title, body]) => (
              <article key={n}>
                <span className="level-num">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className="development-note">
            These personas describe stages of practice, not fixed identities.
            The framework is a formative development tool; pilot calibration and
            validation are still planned. It is not designed for hiring,
            performance reviews, or credentialing.
          </p>
          <a
            className="text-link"
            href="/documents/assess-framework.md"
            download
          >
            Download the framework overview <ArrowDown size={18} />
          </a>
        </section>
        <section className="editorial-section wrap">
          <div className="section-heading">
            <span className="eyebrow">04 / Inside the assessment</span>
            <h2>
              A framework you can
              <br />
              <span>look inside.</span>
            </h2>
          </div>
          <div className="question-types">
            {[
              'Multiple choice',
              'Multiple select',
              'Ranking',
              'Matching',
              'Scenario judgment',
              'Prompt writing',
              'Prompt critique',
              'Output evaluation',
              'Short written response',
              'Workflow design',
              'Build-step evaluation',
              'Reflection',
            ].map((type) => (
              <span key={type}>{type}</span>
            ))}
          </div>
          <div className="capability-details">
            <details open>
              <summary>How the next question is chosen</summary>
              <p>
                The adaptive engine starts at an Elo rating of 1000. Each scored
                response adjusts that estimate using a K-factor of 32. Before
                optimizing difficulty across the whole bank, it prioritizes
                domains you have not yet encountered. Within the chosen pool, it
                selects among questions close to the estimate and avoids
                repeating an item. A standard session serves 12 questions.
              </p>
            </details>
            <details>
              <summary>How answers are scored</summary>
              <p>
                Structured items use scoring rules: exact matches, partial
                credit, pair accuracy, or ordering accuracy. Open-ended items
                use weighted rubric dimensions with concrete level descriptions.
                The current prototype calls a local Claude CLI for that scoring;
                if it is unavailable, the code falls back to a provisional
                heuristic. The sample on this page uses only its original answer
                key and makes no AI scoring call.
              </p>
            </details>
            <details>
              <summary>What the report gives you</summary>
              <p>
                The report code groups your answers by domain, calculates
                averages, identifies relative strengths and growth areas, and
                suggests domain-specific learning paths. The broader framework
                also specifies per-question rationale and guidance for
                progression. A profile is meant to help you choose your next
                practice, rather than reduce your expertise to one number.
              </p>
            </details>
            <details>
              <summary>
                What is implemented, and what still needs validation
              </summary>
              <p>
                The repository contains an adaptive selection engine, question
                components, structured scoring, an open-ended scoring
                integration, and report views. The local bank currently contains
                59 questions across all 12 formats. Difficulty calibration,
                human–AI scoring reliability, and fairness studies are planned.
                These development-stage results are not a professional
                credential.
              </p>
            </details>
          </div>
          <div className="source-links">
            <a href="/documents/saica-readme.md" download>
              Read the original framework <ArrowDown size={16} />
            </a>
            <a
              href="https://github.com/dliangthinks/saica"
              target="_blank"
              rel="noreferrer"
            >
              View SAICA on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <a href="/composer" className="cross-project wrap">
          <div>
            <span className="eyebrow">Explore the other project</span>
            <h2>
              Turn expertise into experience.
              <br />
              <em>Meet Composer.</em>
            </h2>
          </div>
          <ArrowUpRight size={44} />
        </a>
      </main>
      <Footer />
    </>
  );
}
