import type { Metadata } from 'next';
import { ArrowUpRight, ArrowDown, ArrowLeft } from '../icons';
import { Header, Footer } from '../site-components';
import {
  LevelLadder,
  DomainRadar,
  AdaptiveSimulator,
  QuestionSet,
  FormatGrid,
} from './assess-interactions';
import { bank, formats, domains, SESSION_LENGTH } from './assess-data';

export const metadata: Metadata = {
  title: 'Assessor — Find your next edge',
  description:
    'An adaptive AI competency assessment: five levels of practice, seven domains, a question bank that chooses each item for you, and a report that tells you what to practice next.',
};

export default function Assessor() {
  return (
    <>
      <Header active="assess" />
      <main id="main">
        <section className="detail-hero wrap assess-hero">
          <a href="/" className="back-link">
            <ArrowLeft size={15} /> All projects
          </a>
          <div className="detail-title-row">
            <span className="eyebrow">02 / Assessor</span>
            <span className="status">
              <i /> Formative diagnostic · In development
            </span>
          </div>
          <div className="detail-grid assessor-grid">
            <div>
              <h1>
                Find your
                <br />
                <em>next edge.</em>
              </h1>
              <p className="detail-lead">
                Knowing how to prompt is one part of the picture. Assessor
                places your AI practice on a five-level ladder, from copying
                outputs to orchestrating systems, and tells you what the next
                rung looks like.
              </p>
              <div className="hero-actions">
                <a href="#try" className="button ink">
                  Try five real questions <ArrowDown size={18} />
                </a>
                <a href="#adaptive" className="text-link">
                  See how the bank adapts <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <LevelLadder />
          </div>
          <div className="assessment-stats">
            <div>
              <strong>5</strong>
              <span>Levels, from Copy-Paster to Orchestrator</span>
            </div>
            <div>
              <strong>{domains.length}</strong>
              <span>Domains, all covered in every session</span>
            </div>
            <div>
              <strong>{formats.length}</strong>
              <span>Question formats, five scored by code, seven by rubric</span>
            </div>
            <div>
              <strong>
                {SESSION_LENGTH}
                <span> of {bank.length}</span>
              </strong>
              <span>Questions served per session, chosen adaptively</span>
            </div>
          </div>
        </section>

        <section className="domains-section wrap" id="domains">
          <div className="domains-intro">
            <span className="eyebrow">01 / The whole practitioner</span>
            <h2>
              More than
              <br />
              <em>prompting.</em>
            </h2>
            <p>
              Seven domains bring knowledge, applied skill, and professional
              judgment into one picture. Click a point to open a domain. Switch
              the profile to see how a report shape changes with practice.
            </p>
          </div>
          <DomainRadar />
        </section>

        <section className="editorial-section wrap adaptive-section" id="adaptive">
          <div className="section-heading">
            <span className="eyebrow">02 / The adaptive question bank</span>
            <h2>
              Twelve questions.
              <br />
              <span>Each one chosen while you answer.</span>
            </h2>
          </div>
          <div className="adaptive-copy">
            <p>
              A fixed test is either too easy for experts or discouraging for
              beginners. Assessor rates you the way chess rates players. You
              start at 1000. Answer well and the rating rises, so the next item
              is harder. Struggle and it falls. Before it chases difficulty, the
              engine makes sure it has visited all seven domains.
            </p>
            <p>
              Answer the current item yourself, or set a learner’s true rating
              and watch a whole session run. Every dot is a real item in the
              bank, placed by its difficulty.
            </p>
          </div>
          <AdaptiveSimulator />
          <div className="adaptive-notes">
            <div>
              <span className="lab-label">01 / COVERAGE FIRST</span>
              <p>
                While any domain is unseen, the next item comes from one of
                them. Seven of the twelve questions are spent this way.
              </p>
            </div>
            <div>
              <span className="lab-label">02 / THEN TARGET</span>
              <p>
                The remaining five go to the items closest to your rating,
                where a question tells the engine the most.
              </p>
            </div>
            <div>
              <span className="lab-label">03 / MOVE THE RATING</span>
              <p>
                Beating a hard item moves you further than beating an easy
                one. A K-factor of 32 lets twelve answers span the whole ladder.
              </p>
            </div>
          </div>
        </section>

        <section className="demo-section wrap" id="try">
          <div className="section-heading">
            <span className="eyebrow">03 / Try it</span>
            <h2>
              Competence shows up
              <br />
              <span>in the decisions you make.</span>
            </h2>
          </div>
          <p className="demo-intro">
            Five questions in five formats, one from each of five domains,
            rising in difficulty. Structured formats are scored by the same
            rules a full session uses. The open-ended formats, which need a
            rubric and a scorer, are described below.
          </p>
          <QuestionSet />
          <p className="demo-disclosure">
            Five items are a taste, not a placement. A full session serves
            twelve, adapts to you, and includes open-ended tasks.
          </p>
        </section>

        <section className="editorial-section wrap formats-section">
          <div className="section-heading">
            <span className="eyebrow">04 / Twelve formats</span>
            <h2>
              Recognizing an answer
              <br />
              <span>is not the same as producing one.</span>
            </h2>
          </div>
          <p className="demo-intro">
            Multiple choice measures recognition, the lowest rung of Bloom’s
            taxonomy. Someone who can define “hallucination” may still miss one
            in a real output. So seven of the twelve formats ask you to write,
            critique, design, or reflect, and are scored against a rubric.
          </p>
          <FormatGrid />
          <div className="capability-details">
            <details>
              <summary>How open-ended answers are scored</summary>
              <p>
                Each open-ended item maps to two to four rubric dimensions,
                drawn from fifteen shared ones such as accuracy, reasoning,
                risk awareness, and safeguards. The scorer sees the full
                one-to-five description of every dimension, reasons before it
                scores, is told to ignore length, and never computes the final
                number. Code applies the weights. The prototype calls a local
                Claude model for this step.
              </p>
            </details>
            <details>
              <summary>What the report gives you</summary>
              <p>
                A level placement with the behaviors that define it, a radar
                profile across the seven domains, strengths and growth areas,
                a per-question review with the rubric rationale, learning paths
                aimed at the weakest domains, and a guide to the behaviors that
                mark the next level. It is meant to produce a specific next
                practice, not a number.
              </p>
            </details>
            <details>
              <summary>What is built, and what still needs validation</summary>
              <p>
                The adaptive engine, all twelve renderers, structured scoring,
                rubric-based AI scoring, session persistence, and the report are
                built. The bank holds {bank.length} items. Difficulty ratings
                are expert estimates awaiting pilot calibration. Human–AI
                scoring reliability and a fairness analysis across linguistic
                backgrounds are planned. The framework is for self-directed
                development, not hiring, performance review, or credentialing.
              </p>
            </details>
          </div>
          <div className="source-links">
            <a href="/documents/assess-framework.md" download>
              Framework overview <ArrowDown size={16} />
            </a>
            <a href="/documents/saica-readme.md" download>
              Read the design rationale <ArrowDown size={16} />
            </a>
            <a
              href="https://github.com/dliangthinks/saica"
              target="_blank"
              rel="noreferrer"
            >
              Source on GitHub <ArrowUpRight size={16} />
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
