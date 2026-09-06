'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play, Check, ArrowDown, RotateCcw } from '../icons';

/* Shared: is motion currently allowed (site toggle + OS preference)? */
function useMotionAllowed() {
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    const html = document.documentElement;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () =>
      setAllowed(html.dataset.motion !== 'paused' && !media.matches);
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ['data-motion'] });
    media.addEventListener('change', read);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', read);
    };
  }, []);
  return allowed;
}

function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ------------------------------------------------------------------ */
/* 1. Hero: a lesson assembled from tool calls                          */
/* ------------------------------------------------------------------ */

type BuildStep = {
  who: 'agent' | 'reviewer';
  tool: string;
  args: string;
  reply: string;
  note: string;
  hold: number;
};

const buildSteps: BuildStep[] = [
  {
    who: 'agent',
    tool: 'create_lesson',
    args: '{ title: "Handling a refund request", duration_minutes: 12 }',
    reply: '{ lesson_id: "l_refund", revision: 3 }',
    note: 'The agent has read the lesson plan. The server never sees it.',
    hold: 2000,
  },
  {
    who: 'agent',
    tool: 'set_theme',
    args: '{ preset: "warm", transition: { preset: "wave" }, media_style: { visual: { mode: "illustration", style: "flat vector, limited palette, soft shadows", mood: "calm, competent" }, narration: { voice: "warm-neutral-1", pace: "measured" } } }',
    reply: '{ revision: 2, contrast: { checked: 14, failed: 0 } }',
    note: 'Style is decided once, per course: palette, type, seams between sections, and how every image and voice should feel.',
    hold: 2600,
  },
  {
    who: 'agent',
    tool: 'add_figure',
    args: '{ presentation: "hero", media: { brief: "A support agent mid-call at a plain desk, listening…", kind: "image", aspect: "21:9" } }',
    reply: '{ id: "b_hero", media: [{ status: "pending" }] }',
    note: 'Media starts as a brief, composed with the course style. The page renders now, with a placeholder.',
    hold: 2300,
  },
  {
    who: 'agent',
    tool: 'add_passage',
    args: '{ presentation: "statement_b", body: "A refund request is not a cost to minimise…", narration: "auto" }',
    reply: '{ id: "b_open", media: [{ kind: "narration", status: "pending" }] }',
    note: 'Narration is a field. The body is the script; the voice comes from the media style.',
    hold: 2200,
  },
  {
    who: 'agent',
    tool: 'add_container',
    args: '{ kind: "section", options: { background: "accent_soft", transition: { preset: "wave" } } }',
    reply: '{ id: "sec_terms", slots: [], revision: 8 }',
    note: 'A section with a backdrop. The seam to the surface above is drawn by the theme, not placed by hand.',
    hold: 2300,
  },
  {
    who: 'agent',
    tool: 'add_pairs',
    args: '{ parent: "sec_terms", presentation: "glossary", roles: { a: "Term", b: "Meaning" }, items: [ …3 ] }',
    reply: '{ id: "b_terms", revision: 9 }',
    note: 'Three terms. The shape is pairs; glossary is just today’s presentation.',
    hold: 2200,
  },
  {
    who: 'agent',
    tool: 'add_collection',
    args: '{ parent: "sec_terms", presentation: "process", ordered: true, items: [ "Acknowledge", "Verify", "Decide", "Act", "Confirm" ] }',
    reply: '{ id: "b_steps", revision: 10 }',
    note: 'An ordered collection. It could be tabs, a timeline, or an ordering exercise.',
    hold: 2200,
  },
  {
    who: 'agent',
    tool: 'add_question',
    args: '{ parent: "sec_terms", kind: "multiple_choice", prompt: "At the decide step, what do you say?", options: [ …3 ] }',
    reply: '{ id: "q_decide", revision: 20 }',
    note: 'A knowledge check, validated against the question profile.',
    hold: 2200,
  },
  {
    who: 'reviewer',
    tool: 'set_presentation',
    args: '{ block_id: "b_terms", presentation: "flashcards_grid" }',
    reply: '{ revision: 35 }',
    note: 'A person, in the preview, clicks once. Same content, different form. No agent turn.',
    hold: 3000,
  },
  {
    who: 'reviewer',
    tool: 'set_status',
    args: '{ lesson_id: "l_refund", status: "approved" }',
    reply: '{ revision: 63, status: "approved" }',
    note: 'Approved lessons reject quiet changes. One author of record.',
    hold: 3600,
  },
];

const STEP = {
  theme: 1,
  hero: 2,
  statement: 3,
  section: 4,
  pairs: 5,
  process: 6,
  question: 7,
  swap: 8,
  approve: 9,
};

const terms = [
  ['Goodwill refund', 'Money returned when policy does not require it, to keep the relationship.'],
  ['Policy refund', 'Money returned because the policy says so. No judgment involved.'],
  ['Chargeback', 'The customer’s bank reverses the charge. Costs a fee.'],
];
const processSteps = ['Acknowledge', 'Verify', 'Decide', 'Act', 'Confirm'];

export function AgentBuild() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const motion = useMotionAllowed();
  const [stageRef, inView] = useInView<HTMLDivElement>(0.25);
  const transcriptRef = useRef<HTMLOListElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const pairsRef = useRef<HTMLDivElement>(null);

  const running = playing && motion && inView;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setStep((s) => (s + 1) % buildSteps.length),
      buildSteps[step].hold,
    );
    return () => clearTimeout(timer);
  }, [running, step]);

  useEffect(() => {
    const list = transcriptRef.current;
    if (list) list.scrollTop = list.scrollHeight;
    const page = pageRef.current;
    if (!page) return;
    if (step === STEP.swap && pairsRef.current) {
      const top =
        pairsRef.current.getBoundingClientRect().top -
        page.getBoundingClientRect().top +
        page.scrollTop;
      page.scrollTop = Math.max(0, top - 24);
    } else {
      page.scrollTop = page.scrollHeight;
    }
  }, [step]);

  const current = buildSteps[step];
  const status =
    step >= STEP.approve ? 'approved' : step >= STEP.swap ? 'review' : 'draft';
  const pairsAsCards = step >= STEP.swap;

  return (
    <div className="build-stage" ref={stageRef} data-step={step}>
      <div className="build-transcript">
        <div className="build-bar">
          <span className="lab-label">
            <span className="live-dot" /> TOOL CALLS / MCP
          </span>
          <span className="lab-label">
            {String(step + 1).padStart(2, '0')} / {String(buildSteps.length).padStart(2, '0')}
          </span>
        </div>
        <ol ref={transcriptRef} aria-live="polite">
          {buildSteps.slice(0, step + 1).map((s, i) => (
            <li key={s.tool + i} data-who={s.who} data-current={i === step}>
              <span className="call-who">
                {s.who === 'agent' ? 'agent' : 'reviewer'} <b>→</b>
              </span>
              <code className="call-line">
                <span className="call-tool">{s.tool}</span>{' '}
                <span className="call-args">{s.args}</span>
              </code>
              <code className="call-reply">← {s.reply}</code>
            </li>
          ))}
        </ol>
        <p className="build-note" key={step}>
          {current.note}
        </p>
        <div className="build-controls">
          <div className="build-dots">
            {buildSteps.map((s, i) => (
              <button
                key={s.tool + i}
                type="button"
                aria-label={`Step ${i + 1}: ${s.tool}`}
                aria-current={i === step ? 'step' : undefined}
                data-who={s.who}
                onClick={() => {
                  setStep(i);
                  setPlaying(false);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="build-play"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={!playing}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      <div
        className="build-preview"
        data-theme={step >= STEP.theme ? 'warm' : 'plain'}
        aria-label="Live preview of the lesson being built"
      >
        <div className="preview-chrome">
          <span className="chrome-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="chrome-title">
            Frontline Service Basics / Lesson 2
            {step >= STEP.theme ? ' · theme: warm' : ''}
          </span>
          <span className="chrome-status" data-status={status}>
            {status === 'approved' ? <Check size={11} /> : <i />} {status}
          </span>
        </div>
        <div className="preview-page" ref={pageRef}>
          <div className="pv-block pv-title" key="title">
            <span className="pv-kicker">LESSON 2 · 12 MIN</span>
            <h4>Handling a refund request</h4>
          </div>
          {step >= STEP.hero && (
            <div className="pv-block pv-hero" key="hero">
              <span className="pv-tag">figure · hero · image pending · flat vector, limited palette</span>
              <p>
                “A support agent mid-call at a plain desk, listening, one hand
                resting on a notepad. Wide composition with empty space on the
                right for a title.”
              </p>
            </div>
          )}
          {step >= STEP.statement && (
            <blockquote className="pv-block pv-statement" key="statement">
              <span className="pv-tag">passage · statement_b · narration: warm-neutral-1, pending</span>
              A refund request is not a cost to minimise. It is the moment a
              customer decides whether to stay.
            </blockquote>
          )}
          {step >= STEP.section && (
            <div className="pv-block pv-section" key="section">
              <span className="pv-tag">section · background: accent_soft · transition: wave</span>
              {step >= STEP.pairs && (
                <div
                  className={`pv-block pv-pairs ${pairsAsCards ? 'as-cards' : 'as-glossary'}`}
                  key="pairs"
                  ref={pairsRef}
                >
                  <span className="pv-tag">
                    pairs · {pairsAsCards ? 'flashcards_grid' : 'glossary'}
                  </span>
                  <h5>Three words you will hear</h5>
                  <div className="pv-pair-list">
                    {terms.map(([a, b]) => (
                      <div className="pv-pair" key={a}>
                        <strong>{a}</strong>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {step >= STEP.process && (
                <div className="pv-block pv-process" key="process">
                  <span className="pv-tag">collection · process · ordered</span>
                  <h5>The five steps</h5>
                  <ol>
                    {processSteps.map((s, i) => (
                      <li key={s} style={{ '--i': i } as CSSProperties}>
                        <span>{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {step >= STEP.question && (
                <div className="pv-block pv-question" key="question">
                  <span className="pv-tag">question · knowledge_check · multiple_choice</span>
                  <h5>At the decide step, what do you say?</h5>
                  <ul>
                    <li>Which refund it is, and why</li>
                    <li>That you will look into it</li>
                    <li>Nothing until the form is submitted</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {step >= STEP.approve && (
            <div className="pv-approved" key="approved">
              <Check size={14} /> Lesson approved · revision 63
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. A hand on a mouse vs. a tool call                                 */
/* ------------------------------------------------------------------ */

const libraryTiles = [
  'Text',
  'Statement',
  'Quote',
  'List',
  'Image',
  'Gallery',
  'Accordion',
  'Tabs',
  'Process',
  'Quiz',
];

export function HandVsTool() {
  const [pos, setPos] = useState(50);
  return (
    <div className="juxta-wrap">
      <div className="juxta" style={{ '--split': `${pos}%` } as CSSProperties}>
        <div className="juxta-pane juxta-left" aria-hidden={pos < 4}>
          <div className="editor-mock">
            <div className="editor-top">
              <span>Untitled lesson</span>
              <span className="editor-buttons">
                <i>Edit</i>
                <i>Preview</i>
                <i>Publish</i>
              </span>
            </div>
            <div className="editor-body">
              <div className="editor-library">
                <span className="editor-label">Blocks</span>
                {libraryTiles.map((t) => (
                  <span key={t} className="lib-tile">
                    <i />
                    {t}
                  </span>
                ))}
              </div>
              <div className="editor-canvas">
                <div className="canvas-block">
                  <b />
                  <b style={{ width: '70%' }} />
                </div>
                <div className="insert-line">
                  <span>+</span>
                </div>
                <div className="canvas-block">
                  <b style={{ width: '40%' }} />
                  <b />
                  <b style={{ width: '85%' }} />
                </div>
                <div className="insert-line insert-line--active">
                  <span>+</span> Insert block here
                </div>
              </div>
            </div>
            <svg className="mock-cursor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 3l14 8-6 1.5L10 19 5 3z"
                fill="#20231d"
                stroke="#fafbf7"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="juxta-label juxta-label--left">
            A HAND ON A MOUSE · CHOOSE, INSERT, TYPE, PREVIEW, REPEAT
          </span>
        </div>
        <div
          className="juxta-pane juxta-right"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          aria-hidden={pos > 96}
        >
          <div className="call-mock">
            <span className="lab-label">
              <span className="live-dot" /> ONE TOOL CALL
            </span>
            <pre>
              <span className="call-who">agent →</span>{' '}
              <span className="call-tool">add_collection</span> {'{'}
              {'\n'}  presentation: <i>&quot;process&quot;</i>, ordered: <i>true</i>,
              {'\n'}  items: [ <i>&quot;Acknowledge&quot;</i>, <i>&quot;Verify&quot;</i>,{' '}
              <i>&quot;Decide&quot;</i>, <i>&quot;Act&quot;</i>, <i>&quot;Confirm&quot;</i> ]
              {'\n'}
              {'}'}
              {'\n'}
              <span className="call-reply">
                ← {'{'} id: &quot;b_steps&quot;, revision: 10 {'}'}
              </span>
            </pre>
            <div className="call-result">
              <span className="pv-tag">rendered · collection · process</span>
              <ol>
                {processSteps.map((s, i) => (
                  <li key={s}>
                    <span>{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <span className="juxta-label juxta-label--right">
            A TOOL CALL · ONE CALL, ONE BLOCK, RENDERED
          </span>
        </div>
        <div className="juxta-handle" style={{ left: `${pos}%` }} aria-hidden="true">
          <span>◂ ▸</span>
        </div>
        <input
          type="range"
          className="juxta-range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Drag to compare a button-driven editor with a single tool call"
        />
      </div>
      <p className="juxta-caption">
        Drag the divider. A course that takes a designer two weeks in a
        button-driven editor can be drafted by an agent from a lesson plan in
        minutes.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Prose hides structure: recover it                                 */
/* ------------------------------------------------------------------ */

type OutlineRow = {
  id: string;
  indent: number;
  shape: string;
  presentation: string;
  stance: string;
  detail?: string;
  note: string;
  section?: boolean;
};

const outline: OutlineRow[] = [
  { id: 'sec_open', indent: 0, shape: 'section', presentation: '', stance: '', note: '', section: true },
  { id: 'b_hero', indent: 1, shape: 'figure', presentation: 'hero', stance: 'expository', detail: 'image pending', note: 'A medium and its commentary. The image is a brief until it is generated.' },
  { id: 'b_open', indent: 1, shape: 'passage', presentation: 'statement_b', stance: 'expository', detail: 'narration', note: 'A statement worth remembering. The body doubles as the narration script.' },
  { id: 'b_terms', indent: 1, shape: 'pairs', presentation: 'glossary', stance: 'expository', detail: '3 items', note: 'Term and meaning. Read it as a glossary now; practise it as flashcards or matching later, nothing retyped.' },
  { id: 'sec_process', indent: 0, shape: 'section', presentation: '', stance: '', note: '', section: true },
  { id: 'b_steps', indent: 1, shape: 'collection', presentation: 'process', stance: 'expository', detail: 'ordered · 5', note: 'Five sentences in a paragraph were an ordered collection all along. Process, timeline, tabs: same data.' },
  { id: 'b_form', indent: 1, shape: 'annotated', presentation: 'labeled_graphic', stance: 'exploratory', detail: '4 anchors', note: 'Meaning that lives in where. Labels belong on the image, not in a list below it.' },
  { id: 'sec_judge', indent: 0, shape: 'section', presentation: '', stance: '', note: '', section: true },
  { id: 'b_policy', indent: 1, shape: 'categories', presentation: 'sorting_activity', stance: 'practice', detail: '2 × 4', note: 'Items in buckets. Shown as grouped lists first, then the learner sorts them.' },
  { id: 'cols_emails', indent: 1, shape: 'columns', presentation: 'passage · note ×2', stance: 'expository', detail: 'layout 1:1', note: '“Side by side” is layout, not a block type. Two passages in two columns.' },
  { id: 'sec_check', indent: 0, shape: 'section', presentation: '', stance: '', note: '', section: true },
  { id: 'q_decide', indent: 1, shape: 'question', presentation: 'knowledge_check', stance: 'assessment', detail: 'multiple_choice', note: 'A prompt with an answer key and feedback.' },
  { id: 'q_cb', indent: 1, shape: 'question', presentation: 'knowledge_check', stance: 'assessment', detail: 'true_false', note: 'Same shape, a different validation profile.' },
  { id: 'b_order', indent: 1, shape: 'question', presentation: 'knowledge_check', stance: 'assessment', detail: 'tile_sequence ← b_steps', note: 'Reshaped from the five steps. The ordered collection becomes the answer key.' },
  { id: 'b_close', indent: 1, shape: 'passage', presentation: 'statement_a', stance: 'expository', detail: 'narration', note: 'One idea, one statement, narrated.' },
];

type Segment = { text: string; ids?: string[] };

const plan: Segment[] = [
  { text: 'Open with a scene: an agent on a call.', ids: ['b_hero'] },
  { text: ' ' },
  { text: 'Say why refunds matter (retention, not cost).', ids: ['b_open'] },
  { text: ' ' },
  { text: 'Define three terms: goodwill refund, policy refund, chargeback.', ids: ['b_terms'] },
  { text: ' ' },
  { text: 'Show the five-step refund process: acknowledge, verify, decide, act, confirm.', ids: ['b_steps'] },
  { text: ' ' },
  { text: 'Learners should be able to order the steps.', ids: ['b_order'] },
  { text: ' ' },
  { text: 'Walk through the refund form (screenshot) and point out the four fields people get wrong.', ids: ['b_form'] },
  { text: ' ' },
  { text: 'Sort: which requests are refundable under policy and which are not (eight examples).', ids: ['b_policy'] },
  { text: ' ' },
  { text: 'Two example emails, one good, one bad, side by side.', ids: ['cols_emails'] },
  { text: ' Check: ' },
  { text: 'one multiple choice on the decide step,', ids: ['q_decide'] },
  { text: ' ' },
  { text: 'one true/false on chargebacks,', ids: ['q_cb'] },
  { text: ' ' },
  { text: 'one ordering of the five steps.', ids: ['b_order'] },
  { text: ' ' },
  { text: 'Close with the one thing to remember: confirm in writing, always.', ids: ['b_close'] },
  { text: ' ' },
  { text: 'Narrate the opening and the closing.', ids: ['b_open', 'b_close'] },
];

export function ProseToShapes() {
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<string[]>([]);
  const activeRow = outline.find((r) => active.includes(r.id) && !r.section);
  const rowIndex = (id: string) =>
    outline.filter((r) => !r.section).findIndex((r) => r.id === id);

  return (
    <div className="prose-lab" data-revealed={revealed}>
      <div className="prose-pane">
        <div className="build-bar">
          <span className="lab-label">THE LESSON PLAN / WHAT THE HUMAN WROTE</span>
          <span className="lab-label">PROSE</span>
        </div>
        <p className="plan-text">
          {plan.map((seg, i) =>
            seg.ids ? (
              <a
                key={i}
                href={`#outline-${seg.ids[0]}`}
                className="prose-mark"
                data-active={seg.ids.some((id) => active.includes(id))}
                style={{ '--i': rowIndex(seg.ids[0]) } as CSSProperties}
                onMouseEnter={() => setActive(seg.ids!)}
                onFocus={() => setActive(seg.ids!)}
                onMouseLeave={() => setActive([])}
                onBlur={() => setActive([])}
                onClick={(e) => {
                  e.preventDefault();
                  setRevealed(true);
                  setActive(seg.ids!);
                }}
              >
                {seg.text}
              </a>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
        <div className="prose-actions">
          <button
            type="button"
            className="button ink"
            onClick={() => setRevealed((r) => !r)}
            aria-pressed={revealed}
          >
            {revealed ? 'Hide the structure' : 'Recover the structure'}
          </button>
          <span>
            {revealed
              ? 'Hover a sentence, or a row on the right.'
              : 'Eleven sentences. Structure in every one.'}
          </span>
        </div>
      </div>
      <div className="outline-pane">
        <div className="build-bar">
          <span className="lab-label">
            <span className="live-dot" /> get_lesson {'{'} detail: &quot;outline&quot; {'}'}
          </span>
          <span className="lab-label">SHAPES</span>
        </div>
        <ol className="outline-list">
          {outline.map((row) => {
            const idx = rowIndex(row.id);
            return (
              <li
                key={row.id}
                id={`outline-${row.id}`}
                className={row.section ? 'outline-section' : undefined}
                style={{ '--i': row.section ? 0 : idx } as CSSProperties}
              >
                {row.section ? (
                  <span>{row.id}</span>
                ) : (
                  <button
                    type="button"
                    className="outline-row"
                    data-active={active.includes(row.id)}
                    aria-label={`${row.id}: ${row.shape} shown as ${row.presentation}`}
                    onMouseEnter={() => setActive([row.id])}
                    onFocus={() => setActive([row.id])}
                    onMouseLeave={() => setActive([])}
                    onBlur={() => setActive([])}
                    onClick={() => setRevealed(true)}
                  >
                    <span className="ol-id">{row.id}</span>
                    <span className="ol-shape">{row.shape}</span>
                    <span className="ol-pres">{row.presentation}</span>
                    <span className="ol-stance" data-stance={row.stance}>
                      {row.stance}
                    </span>
                    <span className="ol-detail">{row.detail}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
        <p className="outline-note" aria-live="polite">
          {activeRow ? (
            <>
              <b>{activeRow.shape}</b> {activeRow.note}
            </>
          ) : revealed ? (
            'Twelve blocks, seven shapes, four stances. Every row is a tool call the agent made.'
          ) : (
            'The outline the server would return once the agent has done its work.'
          )}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. The shape atlas: fifteen shapes, presentations by stance          */
/* ------------------------------------------------------------------ */

type Shape = {
  name: string;
  tier: 1 | 2;
  what: string;
  absorbs: string;
  stances: Partial<Record<'expository' | 'exploratory' | 'practice' | 'assessment', string[]>>;
};

const shapes: Shape[] = [
  {
    name: 'passage',
    tier: 1,
    what: 'A unit of prose: an explanation, a definition, a statement worth remembering, something someone said.',
    absorbs: 'Rise Text, Statement, Quote',
    stances: {
      expository: ['paragraph', 'heading', 'statement', 'note', 'quote', 'quote_on_image', 'callout', 'definition', 'pull_quote'],
    },
  },
  {
    name: 'collection',
    tier: 1,
    what: 'A set of items, ordered or not. Steps, stages, eras, options, examples, principles. The most common structure in learning material.',
    absorbs: 'Rise List, Accordion, Tabs, Process, Timeline; H5P Timeline, Image Sequencing',
    stances: {
      expository: ['bulleted_list', 'numbered_list', 'accordion', 'tabs', 'cards_grid', 'carousel', 'process', 'timeline', 'steps_checklist', 'info_wall', 'narrative'],
      exploratory: ['reveal_stepper', 'image_sequence'],
      practice: ['ordering', 'checklist_commit'],
    },
  },
  {
    name: 'pairs',
    tier: 1,
    what: 'Items that go together two by two. Term and definition, symptom and cause, before and after.',
    absorbs: 'Rise Flashcards, Matching; H5P Dialog Cards, Memory Game',
    stances: {
      expository: ['glossary', 'two_column_table', 'dialog_cards'],
      practice: ['flashcards_grid', 'flashcards_stack', 'memory_game', 'matching_drag', 'connect_lines', 'scratch_reveal'],
      assessment: ['matching'],
    },
  },
  {
    name: 'figure',
    tier: 1,
    what: 'One medium and its commentary: a picture, video, audio clip, embed, download, or code sample.',
    absorbs: 'Rise Image, Multimedia, Code snippet',
    stances: {
      expository: ['image_centered', 'image_full_width', 'hero', 'image_and_text', 'text_on_image', 'video_player', 'audio_player', 'embed', 'attachment_card', 'code_snippet'],
    },
  },
  {
    name: 'gallery',
    tier: 1,
    what: 'Several media as a set: examples, a portfolio, a sequence of states, two states to compare.',
    absorbs: 'Rise Gallery; H5P Image Slider, Juxtaposition, Agamotto',
    stances: {
      expository: ['carousel', 'grid_2', 'grid_3', 'grid_4', 'collage', 'lightbox_grid'],
      exploratory: ['juxtaposition', 'agamotto', 'slideshow'],
    },
  },
  {
    name: 'annotated',
    tier: 1,
    what: 'A medium with anchored notes. Parts of a diagram, moments in a video, places on a map: where or when is the meaning.',
    absorbs: 'Rise Labeled Graphic; H5P Image Hotspots, Interactive Video, Virtual Tour',
    stances: {
      expository: ['numbered_callouts'],
      exploratory: ['labeled_graphic', 'interactive_video', 'video_chapters', 'virtual_tour', 'map_pins'],
      practice: ['find_the_hotspot'],
      assessment: ['hotspot_question'],
    },
  },
  {
    name: 'categories',
    tier: 1,
    what: 'Items grouped into named buckets. Types of X, do’s and don’ts, roles and responsibilities.',
    absorbs: 'Rise Sorting Activity; H5P Drag and Drop',
    stances: {
      expository: ['grouped_lists', 'kanban_columns', 'tag_groups'],
      practice: ['sorting_activity', 'swipe_sort'],
      assessment: ['sorting_question'],
    },
  },
  {
    name: 'question',
    tier: 1,
    what: 'A prompt with an answer key. Twelve kinds, from multiple choice to fill-in-the-blank to tile sequences, each a validation profile.',
    absorbs: 'Rise Knowledge Check; H5P Multiple Choice, Fill in the Blanks, Mark the Words, Question Set',
    stances: {
      practice: ['self_check', 'guess_then_reveal'],
      assessment: ['knowledge_check', 'inline_check', 'quiz_set'],
    },
  },
  {
    name: 'separator',
    tier: 1,
    what: 'Structural punctuation. A line, a number, a gate that holds back what follows, a seam between two surfaces.',
    absorbs: 'Rise Divider family; Adapt Trickle',
    stances: {
      expository: ['line', 'numbered', 'spacer', 'continue', 'transition'],
    },
  },
  {
    name: 'scenario',
    tier: 2,
    what: 'A branching narrative. A situation, a choice, a consequence, with Twine-style state.',
    absorbs: 'Rise Scenario; H5P Branching Scenario; Twine',
    stances: {
      expository: ['decision_tree_diagram'],
      exploratory: ['chat_simulation', 'card_scenario', 'text_adventure'],
    },
  },
  {
    name: 'dataset',
    tier: 2,
    what: 'Numbers with structure: quantities, trends, proportions, comparisons of magnitude.',
    absorbs: 'Rise Chart; H5P Chart',
    stances: {
      expository: ['bar', 'line', 'pie', 'area', 'stat_tiles', 'data_table', 'sparkline_row'],
      exploratory: ['chart_hover', 'chart_build'],
    },
  },
  {
    name: 'matrix',
    tier: 2,
    what: 'Entities against attributes. Three plans against seven features. The shape of every comparison.',
    absorbs: 'Rise Table',
    stances: {
      expository: ['table', 'comparison_table', 'feature_matrix', 'heatmap'],
      practice: ['fill_the_matrix'],
    },
  },
  {
    name: 'prompt',
    tier: 2,
    what: 'A question with no key. Reflection, prediction, commitment, opinion, notes.',
    absorbs: 'H5P Essay, Documentation Tool, Cornell Notes',
    stances: {
      exploratory: ['journal', 'commit_then_reveal', 'rating_slider', 'notes_panel', 'documentation_wizard'],
    },
  },
  {
    name: 'model',
    tier: 2,
    what: 'Variables and the relationships between them. Compound interest, dosage, supply and demand. The explorable-explanation shape no e-learning tool has.',
    absorbs: 'Nothing in Rise or H5P. Bret Victor, Brilliant, Observable.',
    stances: {
      exploratory: ['slider_explorer', 'calculator', 'what_if_table', 'live_chart'],
    },
  },
  {
    name: 'custom',
    tier: 2,
    what: 'An escape hatch for anything there is no shape for yet. Sandboxed, themed, with a completion protocol Rise code blocks already speak.',
    absorbs: 'Rise Code Block, Storyline block; H5P Iframe Embedder',
    stances: {
      exploratory: ['sandboxed_frame'],
    },
  },
];

const stanceOrder = ['expository', 'exploratory', 'practice', 'assessment'] as const;
const stanceVerb: Record<(typeof stanceOrder)[number], string> = {
  expository: 'Read it',
  exploratory: 'Explore it',
  practice: 'Try it',
  assessment: 'Prove it',
};

function ShapeGlyph({ name }: { name: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'passage':
      return <svg {...common}><path d="M4 6h16M4 11h16M4 16h10" /></svg>;
    case 'collection':
      return <svg {...common}><circle cx="5" cy="6" r="1.4" fill="currentColor" /><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="5" cy="18" r="1.4" fill="currentColor" /><path d="M9 6h11M9 12h11M9 18h11" /></svg>;
    case 'pairs':
      return <svg {...common}><rect x="3" y="7" width="7" height="10" /><rect x="14" y="7" width="7" height="10" /><path d="M10 12h4" /></svg>;
    case 'figure':
      return <svg {...common}><rect x="3" y="4" width="18" height="14" /><path d="m3 15 5-5 4 4 3-3 6 6" /><circle cx="16" cy="8" r="1.3" fill="currentColor" /></svg>;
    case 'gallery':
      return <svg {...common}><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /><rect x="13" y="13" width="8" height="8" /></svg>;
    case 'annotated':
      return <svg {...common}><rect x="3" y="4" width="18" height="14" /><circle cx="9" cy="10" r="2.2" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="2.2" fill="currentColor" stroke="none" /><path d="M9 10h6" /></svg>;
    case 'categories':
      return <svg {...common}><path d="M3 4h7v16H3zM14 4h7v16h-7z" /><path d="M6 9h1M6 13h1M17 9h1M17 13h1M17 17h1" /></svg>;
    case 'question':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>;
    case 'separator':
      return <svg {...common}><path d="M3 12h6M15 12h6" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /></svg>;
    case 'scenario':
      return <svg {...common}><circle cx="5" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 11.5 17 6.5M7 12.5l10 5" /></svg>;
    case 'dataset':
      return <svg {...common}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>;
    case 'matrix':
      return <svg {...common}><rect x="3" y="3" width="18" height="18" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>;
    case 'prompt':
      return <svg {...common}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></svg>;
    case 'model':
      return <svg {...common}><path d="M3 8h18M3 16h18" /><circle cx="9" cy="8" r="2.4" fill="currentColor" /><circle cx="15" cy="16" r="2.4" fill="currentColor" /></svg>;
    default:
      return <svg {...common}><path d="m8 6-5 6 5 6M16 6l5 6-5 6M13 4l-2 16" /></svg>;
  }
}

export function ShapeAtlas() {
  const [selected, setSelected] = useState('pairs');
  const shape = shapes.find((s) => s.name === selected)!;
  return (
    <div className="atlas">
      <div className="atlas-grid" role="tablist" aria-label="Content shapes">
        {shapes.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={s.name === selected}
            className="atlas-tile"
            data-tier={s.tier}
            style={{ '--i': i } as CSSProperties}
            onClick={() => setSelected(s.name)}
            onMouseEnter={() => setSelected(s.name)}
          >
            <ShapeGlyph name={s.name} />
            <span>{s.name}</span>
          </button>
        ))}
      </div>
      <div className="atlas-detail" role="tabpanel" key={shape.name}>
        <div className="atlas-detail-head">
          <span className="lab-label">
            SHAPE {String(shapes.indexOf(shape) + 1).padStart(2, '0')} / 15 · TIER {shape.tier}
          </span>
          <h3>{shape.name}</h3>
          <p>{shape.what}</p>
        </div>
        <div className="atlas-stances">
          {stanceOrder.map((st) => {
            const list = shape.stances[st];
            return (
              <div key={st} className="atlas-stance" data-empty={!list}>
                <span className="atlas-stance-name">
                  <b>{st}</b>
                  <em>{stanceVerb[st]}</em>
                </span>
                <div className="atlas-chips">
                  {list ? (
                    list.map((p) => <span key={p}>{p}</span>)
                  ) : (
                    <span className="atlas-chip-empty">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="atlas-absorbs">
          <span>Absorbs</span> {shape.absorbs}
        </p>
        <p className="atlas-total">
          Add a presentation and every existing block of this shape can be
          shown that way. Add a shape and you are making a claim about learning
          content, which is what an open repository is for.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Storyline's dynamics as data: a narration cue firing a trigger    */
/* ------------------------------------------------------------------ */

const script = [
  ['acknowledge', 'First, acknowledge. Say back what you heard.'],
  ['verify', 'Then verify: find the order and the charge before you decide anything.'],
  ['decide', 'Now decide. Policy refund, goodwill refund, or decline, and say why.'],
  ['act', 'Act. Submit the form, one per charge.'],
  ['confirm', 'And confirm, in writing, before the call ends.'],
];

const CUE_SECONDS = 2;
const CUE_HOLD = 1.6;

export function CueSync() {
  const motion = useMotionAllowed();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const [phase, setPhase] = useState(-1); // -1 idle, 0..4 speaking, 5 done
  const headRef = useRef<HTMLSpanElement>(null);
  const running = motion && inView;

  useEffect(() => {
    if (!running) {
      const id = requestAnimationFrame(() => {
        setPhase(-1);
        if (headRef.current) headRef.current.style.left = '0%';
      });
      return () => cancelAnimationFrame(id);
    }
    const total = script.length * CUE_SECONDS;
    const cycle = total + CUE_HOLD;
    const start = performance.now();
    let frame = 0;
    let last = -2;
    const tick = (now: number) => {
      const t = ((now - start) / 1000) % cycle;
      const next = t >= total ? script.length : Math.floor(t / CUE_SECONDS);
      if (next !== last) {
        last = next;
        setPhase(next);
      }
      if (headRef.current)
        headRef.current.style.left = `${Math.min(t / total, 1) * 100}%`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const stateOf = (i: number) =>
    phase === -1 ? 'idle' : i === phase ? 'active' : i < phase ? 'visited' : 'idle';

  return (
    <div className="cue-lab" ref={ref} data-phase={phase}>
      <div className="cue-script">
        <div className="build-bar">
          <span className="lab-label">
            <span className="live-dot" /> NARRATION · GENERATED FROM THE SCRIPT
          </span>
          <span className="lab-label">
            {phase >= 0 && phase < script.length ? `cue(${script[phase][0]})` : 'CUES'}
          </span>
        </div>
        <p className="cue-text">
          {script.map(([cue, line], i) => (
            <span key={cue} className="cue-phrase" data-state={stateOf(i)}>
              <mark>[cue:{cue}]</mark> {line}{' '}
            </span>
          ))}
        </p>
        <div className="cue-track" aria-hidden="true">
          {script.map(([cue], i) => (
            <i key={cue} style={{ left: `${i * 20}%` }} data-state={stateOf(i)} />
          ))}
          <span className="cue-head" ref={headRef} />
        </div>
        <p className="cue-caption">
          The agent marks cues in the script. The speech provider returns word
          timings. The server resolves each cue to a time, and{' '}
          <code>cue(verify)</code> becomes an event any trigger can listen for.
        </p>
      </div>
      <div className="cue-stage">
        <span className="pv-tag">collection · process · states driven by cues</span>
        <ol className="cue-steps">
          {processSteps.map((st, i) => (
            <li key={st} data-state={stateOf(i)}>
              <span>{i + 1}</span>
              {st}
            </li>
          ))}
        </ol>
        <code className="cue-trigger">
          triggers: [{'{'} on: <i>&quot;cue(verify)&quot;</i>, do:{' '}
          <i>&quot;set_state(steps.1, active)&quot;</i> {'}'}]
        </code>
        <p className="cue-caption">
          “Highlight step two when the narrator reaches it” is a trigger, not
          something dragged on a timeline. No pixel is pinned, so it holds on
          every screen.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. The classic Storyline slide: three objects, three layers, a gate  */
/* ------------------------------------------------------------------ */

const layerItems = [
  {
    id: 'goodwill',
    title: 'Goodwill refund',
    body: 'Money returned when policy does not require it, to keep the relationship. Use it when the customer is right in spirit and the policy is silent.',
  },
  {
    id: 'policy',
    title: 'Policy refund',
    body: 'Money returned because the policy says so. No judgment involved. Find the clause, quote it, and process the refund.',
  },
  {
    id: 'chargeback',
    title: 'Chargeback',
    body: 'The customer’s bank reverses the charge. It costs a fee and counts against the business. Every chargeback is a refund request that reached the bank first.',
  },
];

export function LayerGate() {
  const [open, setOpen] = useState<number | null>(null);
  const [visited, setVisited] = useState<number[]>([]);
  const [continued, setContinued] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const complete = visited.length === layerItems.length;

  const pulse = (line: string) => {
    setFlash(line);
    window.setTimeout(() => setFlash((f) => (f === line ? null : f)), 900);
  };
  const openLayer = (i: number) => {
    setOpen(i);
    pulse('overlay');
  };
  const closeLayer = () => {
    if (open !== null && !visited.includes(open)) {
      setVisited((v) => [...v, open]);
      pulse('visited');
    }
    setOpen(null);
  };
  const reset = () => {
    setOpen(null);
    setVisited([]);
    setContinued(false);
    setFlash(null);
  };

  const live = (key: string) =>
    flash === key ||
    (key === 'overlay' && open !== null) ||
    (key === 'complete' && complete) ||
    (key === 'gate' && complete && !continued) ||
    (key === 'after' && continued);

  return (
    <div className="gate-lab">
      <div className="gate-stage" data-open={open !== null}>
        <div className="preview-chrome">
          <span className="chrome-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="chrome-title">Lesson 2 · section “Three kinds of refund”</span>
          <span className="chrome-status" data-status={complete ? 'approved' : 'draft'}>
            {complete ? <Check size={11} /> : <i />} {visited.length} / {layerItems.length} visited
          </span>
        </div>
        <div className="gate-slide">
          <span className="pv-tag">collection · cards_grid · states: normal, visited</span>
          <h5>Three kinds of refund. Open each one.</h5>
          <div className="gate-cards">
            {layerItems.map((item, i) => (
              <button
                type="button"
                key={item.id}
                className="gate-card"
                data-state={visited.includes(i) ? 'visited' : 'normal'}
                aria-pressed={open === i}
                onClick={() => openLayer(i)}
              >
                <span className="gate-card-num">
                  {visited.includes(i) ? <Check size={13} /> : `0${i + 1}`}
                </span>
                <strong>{item.title}</strong>
                <span className="gate-card-hint">
                  {visited.includes(i) ? 'visited' : 'open'}
                </span>
              </button>
            ))}
          </div>
          <div className="gate-footer">
            <button
              type="button"
              className="gate-continue"
              disabled={!complete || continued}
              onClick={() => {
                setContinued(true);
                pulse('after');
              }}
            >
              Continue <ArrowDown size={14} />
            </button>
            <span className="gate-hint">
              {continued
                ? 'Gate opened. The next block is visible.'
                : complete
                  ? 'All three visited. The gate is unlocked.'
                  : `Visit all three to continue · ${visited.length} of ${layerItems.length}`}
            </span>
            <button type="button" className="gate-reset" onClick={reset} aria-label="Reset the slide">
              <RotateCcw size={14} />
            </button>
          </div>
          <div className="gate-after" data-visible={continued} aria-hidden={!continued}>
            <span className="pv-tag">passage · statement_a · was hidden by the gate</span>
            <p>Now that you can tell them apart: the five steps of handling any of them.</p>
          </div>
          <section
            className="gate-layer"
            data-open={open !== null}
            aria-hidden={open === null}
            aria-labelledby="gate-layer-title"
          >
            {open !== null && (
              <>
                <span className="pv-tag">layer · overlay(item) · slides in from the right</span>
                <h6 id="gate-layer-title">{layerItems[open].title}</h6>
                <p>{layerItems[open].body}</p>
                <button type="button" className="gate-close" onClick={closeLayer}>
                  Close and mark visited <Check size={14} />
                </button>
              </>
            )}
          </section>
        </div>
      </div>
      <div className="gate-spec">
        <div className="build-bar">
          <span className="lab-label">
            <span className="live-dot" /> THE SAME SLIDE, AS DATA
          </span>
          <span className="lab-label">TWO CALLS</span>
        </div>
        <pre>
          <span className="call-who">agent →</span>{' '}
          <span className="call-tool">add_collection</span> {'{'}
          {'\n'}  presentation: <i>&quot;cards_grid&quot;</i>, heading: <i>&quot;Three kinds of refund&quot;</i>,
          {'\n'}  items: [ goodwill, policy, chargeback ],
          {'\n'}  states: [ <i>&quot;normal&quot;</i>, <i>&quot;visited&quot;</i> ],
          {'\n'}  triggers: [
          {'\n'}
          <span className="spec-line" data-live={live('overlay')}>
            {'    '}{'{'} on: <i>&quot;click(item)&quot;</i>, do: <i>&quot;overlay(item)&quot;</i> {'}'},
          </span>
          {'\n'}
          <span className="spec-line" data-live={flash === 'visited'}>
            {'    '}{'{'} on: <i>&quot;close(item)&quot;</i>, do: <i>&quot;set_state(item, visited)&quot;</i> {'}'}
          </span>
          {'\n'}  ],
          {'\n'}
          <span className="spec-line" data-live={live('complete')}>
            {'  '}completion: <i>&quot;all_items(state == visited)&quot;</i>
          </span>
          {'\n'}{'}'}
          {'\n'}
          <span className="call-reply">← {'{'} id: &quot;b_types&quot;, revision: 21 {'}'}</span>
          {'\n\n'}
          <span className="spec-line" data-live={live('gate')}>
            <span className="call-who">agent →</span>{' '}
            <span className="call-tool">add_separator</span> {'{'} presentation: <i>&quot;continue&quot;</i>, label: <i>&quot;Continue&quot;</i>, require_completion: <i>true</i> {'}'}
          </span>
          {'\n'}
          <span className="call-reply">← {'{'} id: &quot;b_gate&quot;, revision: 22 {'}'}</span>
          {'\n\n'}
          <span className="spec-line" data-live={live('after')}>
            <span className="call-who">agent →</span>{' '}
            <span className="call-tool">add_passage</span> {'{'} presentation: <i>&quot;statement_a&quot;</i>, body: <i>&quot;Now that you can tell them apart…&quot;</i> {'}'}
          </span>
        </pre>
        <p className="gate-note">
          States, a trigger per event, and a gate that hides everything after it
          until the collection reports complete. The <code>reveal_gate</code>,{' '}
          <code>events</code>, and <code>state</code> behaviors ship in the
          runtime, so the layer is keyboard-reachable and the gate is announced,
          with no per-slide scripting.
        </p>
      </div>
    </div>
  );
}

const parity: [string, string, boolean?][] = [
  ['Variables and references in text', 'course and lesson variables, {{name}} interpolation'],
  ['Triggers with conditions', 'declarative triggers: { on, when, do }'],
  ['Object states', 'named states on items and annotations, set_state'],
  ['Entrance, exit, emphasis animation', 'animation per block or item, theme defaults'],
  ['Motion paths', 'motion: an SVG path or keyframes, on a trigger, on scroll, on a cue'],
  ['Timeline and cue points', 'narration cues resolved from word timings; a timeline inside scene'],
  ['Layers, lightboxes', 'overlay and show/hide triggers, sections, the scene shape'],
  ['Freely positioned slide objects', 'scene: layers on a stage that scales to any screen'],
  ['Fixed pixel layouts, hand-edited timelines', 'not offered, by design', true],
];

export function ParityList() {
  return (
    <dl className="parity">
      {parity.map(([sl, ac, excluded]) => (
        <div key={sl} data-excluded={excluded}>
          <dt>{sl}</dt>
          <dd>{ac}</dd>
        </div>
      ))}
    </dl>
  );
}
