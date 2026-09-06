import type { Metadata } from 'next';
import { ArrowUpRight, ArrowDown, ArrowLeft } from '../icons';
import { Header, Footer } from '../site-components';
import { ComposerDemo } from '../interactions';
import {
  AgentBuild,
  HandVsTool,
  ProseToShapes,
  ShapeAtlas,
  CueSync,
  LayerGate,
  ParityList,
} from './composer-interactions';

export const metadata: Metadata = {
  title: 'Composer — Agent-driven course authoring',
  description:
    'An open-source course authoring engine delivered as an MCP server. An AI agent structures the lesson, chooses presentations, briefs media, sets theme and transitions; you judge. In development.',
};

const agentAuthors: [string, string][] = [
  ['Structure', 'Sections, columns, and blocks, as a layout tree'],
  ['Presentation', 'How each block reaches the learner, and at which stance'],
  ['Media briefs', 'Images, video, narration, and music, written as briefs'],
  ['Narration & cues', 'Scripts with cue markers, resolved from word timings'],
  ['Theme & media style', 'Palette, type, and how every asset should feel'],
  ['Backdrops & transitions', 'Section backgrounds and the seams between them'],
  ['Dynamics', 'Variables, triggers, states, animation, and motion'],
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
              <i /> In development · Core engine built, MCP server next
            </span>
          </div>
          <div className="composer-headline">
            <h1>
              Built for agents,
              <br />
              <em>not for clicking buttons.</em>
            </h1>
            <div>
              <p className="detail-lead">
                Composer is an open-source course engine delivered as an MCP
                server, and the author is an AI agent. From a lesson plan it
                structures the lesson, chooses how every block is presented,
                briefs the media, sets the theme, the backdrops and the
                transitions between them, and revises from your notes. You
                bring the expertise and the judgment.
              </p>
              <div className="hero-actions">
                <a className="button ink" href="#build">
                  Watch a lesson get built <ArrowDown size={18} />
                </a>
                <a className="text-link" href="#why">
                  Why it exists <ArrowDown size={16} />
                </a>
              </div>
            </div>
          </div>
          <div id="build" className="build-anchor">
            <AgentBuild />
            <p className="build-caption">
              Ten calls from the design transcript, replayed. Eight by the
              agent, two by a reviewer in the preview. The preview is a client
              of the same tools.
            </p>
          </div>
          <div className="authors-strip">
            <span className="lab-label">WHAT THE AGENT AUTHORS</span>
            <ul>
              {agentAuthors.map(([name, detail]) => (
                <li key={name}>
                  <b>{name}</b>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="detail-meta">
            <span>OPEN SOURCE / MIT</span>
            <span>MCP SERVER</span>
            <span>15 SHAPES</span>
            <span>AGENT-DRIVEN</span>
          </div>
        </section>

        <section className="editorial-section wrap why-section" id="why">
          <div className="section-heading">
            <span className="eyebrow">01 / Why this exists</span>
            <h2>
              Three problems with how courses get made.
              <br />
              <span>What Composer does about each.</span>
            </h2>
          </div>

          <article className="why-block">
            <div className="why-copy">
              <span className="why-number">01</span>
              <h3>
                Course authoring is manual, and the tools are built to keep it
                that way.
              </h3>
              <p>
                Articulate Rise 360 is very good software for a human at a
                screen: pick a block from the menu and it is inserted where you
                are, type into it, preview, repeat. We spent the better part of
                a year making an agent operate Rise through that interface. It
                worked, barely, and broke every time the interface changed.
              </p>
              <p>
                Composer is agent-driven all the way down. The agent does not
                only place blocks. It structures the lesson, chooses each
                presentation, briefs the images and narration, sets the theme,
                the section backdrops and the transitions between them, and
                revises from a reviewer’s notes. The person’s job moves from
                assembly to judgment.
              </p>
            </div>
            <HandVsTool />
          </article>

          <article className="why-block why-block--wide plan-block">
            <div className="why-copy why-copy--split">
              <div>
                <span className="why-number">01 →</span>
                <h3>
                  From a markdown lesson plan
                  <br />
                  to a layout tree.
                </h3>
              </div>
              <div>
                <p>
                  A lesson plan is prose, and prose hides structure. The five
                  steps of a procedure are five sentences in a paragraph. Three
                  terms are a list inside a sentence. Instructional design is
                  the work of recovering that structure and then making the
                  learner <em>do</em> something with it.
                </p>
                <p>
                  The agent reads the plan, recovers the structure, and makes
                  one tool call per piece. What the server holds is a layout
                  tree: sections, columns, and blocks, each with a shape and a
                  presentation. Click to see the plan become the tree.
                </p>
              </div>
            </div>
            <ProseToShapes />
          </article>

          <article className="why-block why-block--wide">
            <div className="why-copy why-copy--split">
              <div>
                <span className="why-number">02</span>
                <h3>
                  The block library is never enough, and adding to it is
                  manual.
                </h3>
              </div>
              <div>
                <p>
                  Rise ships about sixty block types, and an ecosystem has grown
                  up to add more: Mighty’s custom blocks, Articulate’s Code
                  Block and Custom Block, dozens of copy-paste components. Every
                  one is built and placed by hand, keeps its content in a
                  private format, and is harder to use than the blocks beside
                  it. H5P’s fifty-four content types are fifty-four islands.
                </p>
                <p>
                  Composer’s answer is shapes and presentations. A shape is what
                  the content <em>is</em>. A presentation is one way to show it.
                  Write one new presentation and every existing block of that
                  shape can be shown that way. Swap a block’s form without
                  retyping it. Let an agent define a new shape mid-session and
                  promote it to the shared library later. The library grows in
                  use.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="feature-section wrap atlas-section">
          <div>
            <span className="eyebrow">02 / The shape catalog</span>
            <h2>
              Fifteen shapes.
              <br />
              <em>Four stances.</em>
            </h2>
            <p>
              A shape is described independently of how it looks. A
              presentation reaches the learner with it, and its stance says
              what the learner does: read, explore, try, or prove. A flashcard
              is not a kind of content. It is one way of presenting pairs. So
              is a glossary, a table, a matching exercise.
            </p>
            <p>
              Because shapes are shared across stances, a lesson can return to
              the same block at a harder stance without authoring a new one.
              That progression is what the research on retrieval practice and
              active learning asks for.
            </p>
            <a
              className="text-link"
              href="/documents/composer-overview.md"
              download
            >
              Download the project overview <ArrowDown size={18} />
            </a>
          </div>
          <ShapeAtlas />
        </section>

        <ComposerDemo />

        <section className="editorial-section wrap why-section why-section--continued">
          <article className="why-block why-block--wide">
            <div className="why-copy why-copy--split">
              <div>
                <span className="why-number">03</span>
                <h3>
                  Storyline is the industry standard for a reason. Its timeline
                  is not that reason.
                </h3>
              </div>
              <div>
                <p>
                  Designers leave Rise for Articulate Storyline when they need
                  what Rise cannot do: variables, triggers, object states,
                  animation and motion paths, layers, narration synced to what
                  is on screen. Those features make a course feel authored
                  rather than assembled.
                </p>
                <p>
                  Composer’s position is that nearly all of this is data, and
                  Storyline’s demanding timeline and trigger panels exist only
                  because humans cannot comfortably write that data by hand. An
                  agent can. Variables, triggers, states, animation, motion and
                  narration cues are a declarative layer any block can carry,
                  validated like everything else, and responsive by
                  construction because nothing is pinned to a pixel.
                </p>
              </div>
            </div>
            <div className="demo-lead">
              <span className="lab-label">THE CLASSIC STORYLINE SLIDE</span>
              <p>
                Three clickable objects. Each opens a layer that slides in. The
                learner cannot continue until all three are visited. Rise has
                no way to build this. Try it, and watch the spec light up.
              </p>
            </div>
            <LayerGate />
            <div className="demo-lead">
              <span className="lab-label">NARRATION SYNCED TO THE SCREEN</span>
              <p>
                Storyline’s other signature: things happen when the narrator
                says them. Here the cue points come from the script itself.
              </p>
            </div>
            <CueSync />
            <div className="parity-wrap">
              <div className="parity-head">
                <span className="lab-label">STORYLINE CAPABILITY → WHERE IT LANDS</span>
                <span className="lab-label">FROM THE PARITY MAP</span>
              </div>
              <ParityList />
            </div>
          </article>
        </section>

        <section className="editorial-section wrap design-notes">
          <div className="section-heading">
            <span className="eyebrow">What falls out of the design</span>
            <h2>
              Cheap where it used to be
              <br />
              <span>expensive.</span>
            </h2>
          </div>
          <div className="capability-details">
            <details open>
              <summary>Swapping, two ways.</summary>
              <p>
                <b>Re-presentation</b> keeps the structure and changes the form.
                An accordion becomes tabs or a timeline, nothing retyped. It is
                deterministic, so the reviewer gets it as a button.{' '}
                <b>Re-shaping</b> turns one structure into another. The engine
                does the mechanical ones itself and publishes exactly what each
                one loses. The ones that need something written go to the
                agent, and the result replaces the original with its lineage
                preserved.
              </p>
            </details>
            <details>
              <summary>The human stays in the loop, at the point of judgment.</summary>
              <p>
                The most common reaction to a draft is not “the content is
                wrong” but “not like that.” So the preview lets a reviewer
                change how any block is presented with one click and compare
                alternatives side by side. For anything that is a matter of
                substance, the reviewer selects the exact thing and talks to
                the agent about it. Approved lessons are protected from quiet
                changes. The reviewer cannot edit content directly, so there is
                one author of record and the agent’s understanding never drifts
                from the truth.
              </p>
            </details>
            <details>
              <summary>Media is generated, not sourced.</summary>
              <p>
                Wherever a block needs an image, video, narration, or
                soundtrack, the agent writes a brief instead of supplying a
                file. The course renders immediately with placeholders that
                show the briefs, so structure can be validated before anything
                is generated. Style is decided once per course. Every result
                carries its brief, prompt, provider, and rights back into the
                course.
              </p>
            </details>
            <details>
              <summary>Backdrops and transitions come from the theme.</summary>
              <p>
                Rise stacks every block on one white page. In Composer a
                section can carry a backdrop, and the seam between two colored
                surfaces is drawn automatically by the theme: wave, layered,
                curve, slant, arrow, or zigzag. The agent decides which and
                why, per course, per section, or per edge. What Mighty added to
                Rise as a manual transition block is a default here.
              </p>
            </details>
          </div>
        </section>

        <a href="/assess" className="cross-project wrap">
          <div>
            <span className="eyebrow">Explore the other project</span>
            <h2>
              Find your next edge.
              <br />
              <em>Meet Assessor.</em>
            </h2>
          </div>
          <ArrowUpRight size={44} />
        </a>
      </main>
      <Footer />
    </>
  );
}
