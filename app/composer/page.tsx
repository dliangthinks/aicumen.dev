import type { Metadata } from 'next';
import { ArrowUpRight, ArrowDown, ArrowLeft } from '../icons';
import { Header, Footer, ShapeDiagram } from '../site-components';
export const metadata: Metadata = {
  title: 'Composer — An engine for learning',
  description:
    'An open-source MCP course authoring engine, designed for AI agents. Separate content from presentation and put human judgment at the center. In development.',
};
import { ComposerDemo } from '../interactions';
const steps = [
  [
    '01',
    'You set the intent.',
    'Bring a lesson plan, a policy, a transcript, or a subject you know well. Define what learners should be able to do.',
  ],
  [
    '02',
    'The agent authors.',
    'An AI agent structures the lesson and calls Composer’s tools to create, revise, style, and render the course.',
  ],
  [
    '03',
    'You shape the result.',
    'Review the preview, compare presentations, and approve the lesson. Approved lessons stay protected.',
  ],
];
export default function Composer() {
  return (
    <>
      <Header active="composer" />
      <main id="main">
        <section className="detail-hero wrap composer-hero">
          <a href="/" className="back-link">
            <ArrowLeft size={15} /> All projects
          </a>
          <div className="detail-title-row">
            <span className="eyebrow">01 / Composer</span>
            <span className="status">
              <i /> Design stage · Not yet released
            </span>
          </div>
          <div className="detail-grid">
            <div>
              <h1>
                An engine for
                <br />
                <em>learning.</em>
              </h1>
              <p className="detail-lead">
                What Blender is to 3D content, Composer aims to be for
                e-learning: an open engine for creating rich, interactive
                experiences.
              </p>
              <a className="button ink" href="#composer-demo">
                Try the concept <ArrowDown size={18} />
              </a>
            </div>
            <div className="detail-visual">
              <span className="eyebrow">CONTENT ≠ PRESENTATION</span>
              <ShapeDiagram />
              <p>One structure. Many learning experiences.</p>
            </div>
          </div>
          <div className="detail-meta">
            <span>OPEN SOURCE / MIT</span>
            <span>MCP SERVER</span>
            <span>BUILT FOR AI AGENTS</span>
          </div>
        </section>
        <ComposerDemo />
        <section className="editorial-section wrap" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">01 / A different way to author</span>
            <h2>
              You bring the expertise.
              <br />
              <span>The agent does the assembly.</span>
            </h2>
          </div>
          <div className="steps">
            {steps.map(([n, title, body]) => (
              <article key={n}>
                <span className="step-number">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="feature-section wrap">
          <div>
            <span className="eyebrow">02 / The core idea</span>
            <h2>
              Content has a structure.
              <br />
              <em>Give it room to move.</em>
            </h2>
            <p>
              A term and its definition are a pair. They can become a flashcard,
              a glossary entry, or a matching exercise. Composer’s design keeps
              that content independent of its presentation, so “show it
              differently” doesn’t mean starting over.
            </p>
            <a
              className="text-link"
              href="/documents/composer-overview.md"
              download
            >
              Download the project overview <ArrowDown size={18} />
            </a>
          </div>
          <div className="stance-list">
            <div>
              <span>01 / Expository</span>
              <strong>Read it.</strong>
            </div>
            <div>
              <span>02 / Exploratory</span>
              <strong>Explore it.</strong>
            </div>
            <div>
              <span>03 / Practice</span>
              <strong>Try it.</strong>
            </div>
            <div>
              <span>04 / Assessment</span>
              <strong>Demonstrate it.</strong>
            </div>
          </div>
        </section>
        <section className="editorial-section wrap design-notes">
          <div className="section-heading">
            <span className="eyebrow">03 / Designed from the ground up</span>
            <h2>
              A course engine.
              <br />
              <span>An open foundation.</span>
            </h2>
          </div>
          <div className="detail-list">
            <article>
              <span>01</span>
              <h3>Tools are the interface.</h3>
              <p>
                Composer is an MCP server. The agent reasons about the lesson;
                the engine validates, stores, and renders it. Human effort stays
                focused on intent and judgment.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Learning comes first.</h3>
              <p>
                The proposed model starts with 15 content shapes and four
                learner stances. Structure, interaction, and presentation work
                together to make content useful to the learner.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Room to extend.</h3>
              <p>
                New presentations can reuse existing content. The design also
                allows new shapes, shared interaction behaviors, and
                generated-media briefs that follow a course-wide style.
              </p>
            </article>
          </div>
          <div className="capability-details">
            <details>
              <summary>Change the form without rewriting the lesson.</summary>
              <p>
                The specification makes two distinct operations explicit.{' '}
                <code>set_presentation</code> keeps a block’s content and
                changes how learners encounter it. <code>reshape</code> changes
                the underlying structure when a defined transformation exists.
                If a transformation drops information, the engine is designed to
                say what is lost; changes that require new content go back to
                the agent.
              </p>
            </details>
            <details>
              <summary>Review with the same tools the agent uses.</summary>
              <p>
                The validation client is designed around swapping a block’s
                presentation, comparing up to three alternatives, and approving
                a whole lesson. Each change creates a revision. An approved
                lesson rejects further edits unless explicitly overridden, then
                returns to review. Anchored comments and multiple reviewers are
                later work in the current specification.
              </p>
            </details>
            <details>
              <summary>Generate media as part of a coherent course.</summary>
              <p>
                An image, video, or narration starts as a brief. The engine
                combines that brief with a shared course media style, tracks the
                pending asset, and records the result’s provenance. The agent
                uses an available generation service to fulfill the brief;
                direct provider adapters are planned for later. Preview
                placeholders let you assess structure before spending time
                generating media.
              </p>
            </details>
            <details>
              <summary>Export a course that can stand on its own.</summary>
              <p>
                The specified output is a static website: a course index, lesson
                pages, media assets, a stylesheet, and only the interaction
                behaviors the course uses. The layout tree supports stacks,
                columns, grids, split views, and sections. The engine is not a
                learning management system. SCORM and xAPI packaging remain on
                the roadmap; course import is excluded from the current
                specification.
              </p>
            </details>
          </div>
          <p className="development-note">
            Composer is currently in design. These are the architectural
            principles and intended capabilities; a released authoring engine is
            still ahead.
          </p>
        </section>
        <section className="editorial-section wrap roadmap">
          <div className="section-heading">
            <span className="eyebrow">
              04 / From design to a working engine
            </span>
            <h2>
              The path to
              <br />
              <span>the first release.</span>
            </h2>
          </div>
          <p className="demo-intro">
            The repository records design work, research spikes, a tool-call
            lesson transcript, and a validation-client mock. The next milestones
            build toward a complete authoring workflow.
          </p>
          <div className="roadmap-strip">
            <article>
              <span className="lab-label">M1 / PLANNED</span>
              <h3>Core</h3>
              <p>
                Course structure, revisions, validation, content shapes, and
                structural transformations.
              </p>
            </article>
            <article>
              <span className="lab-label">M2 / PLANNED</span>
              <h3>MCP server</h3>
              <p>
                Create, read, swap, reshape, resolve media, and export a course
                through tools.
              </p>
            </article>
            <article>
              <span className="lab-label">M3 / PLANNED</span>
              <h3>Render & review</h3>
              <p>
                Course themes, static export, live previews, comparisons, and
                lesson approval.
              </p>
            </article>
            <article>
              <span className="lab-label">M4 / PLANNED</span>
              <h3>Real-world trial</h3>
              <p>
                Author a real course, work through a review cycle, and use the
                findings to reach v0.1.
              </p>
            </article>
          </div>
          <div className="source-links">
            <a href="/documents/composer-spec.md" download>
              Read the source specification <ArrowDown size={16} />
            </a>
            <a href="/documents/composer-overview.md" download>
              Project overview <ArrowDown size={16} />
            </a>
          </div>
        </section>
        <a href="/assess" className="cross-project wrap">
          <div>
            <span className="eyebrow">Explore the other project</span>
            <h2>
              Find your next edge.
              <br />
              <em>Meet Assess.</em>
            </h2>
          </div>
          <ArrowUpRight size={44} />
        </a>
      </main>
      <Footer />
    </>
  );
}
