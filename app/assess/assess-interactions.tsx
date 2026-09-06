'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowRight, ArrowUpRight, ArrowDown, Check, Pause, Play, RotateCcw } from '../icons';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  levels,
  domains,
  profiles,
  formats,
  bank,
  sampleQuestions,
  SESSION_LENGTH,
  START_RATING,
  ELO_TOLERANCE,
  expectedScore,
  updateElo,
  ratingToLevel,
  formatName,
  type BankItem,
  type SampleQuestion,
} from './assess-data';

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

const pad = (n: number) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* 1. Hero: the five levels, front and center                           */
/* ------------------------------------------------------------------ */

export function LevelLadder() {
  const [active, setActive] = useState(1);
  const [playing, setPlaying] = useState(true);
  const motion = useMotionAllowed();
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const running = playing && motion && inView;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % levels.length), 3400);
    return () => clearTimeout(timer);
  }, [running, active]);

  const level = levels[active];
  const agencyIndex = active === 0 ? 0 : active <= 2 ? 1 : 2;

  return (
    <div className="ladder" ref={ref} data-active={active}>
      <div className="ladder-top">
        <span className="lab-label">
          <span className="live-dot" /> FIVE LEVELS / A PROGRESSION IN AGENCY
        </span>
        <span className="lab-label">
          {pad(active + 1)} / {pad(levels.length)}
        </span>
      </div>
      <div className="ladder-steps" role="tablist" aria-label="Competency levels">
        {levels.map((l, i) => (
          <button
            key={l.n}
            type="button"
            role="tab"
            id={`ladder-tab-${i}`}
            aria-selected={i === active}
            aria-controls="ladder-panel"
            tabIndex={i === active ? 0 : -1}
            data-past={i < active}
            style={{ '--i': i } as CSSProperties}
            onClick={() => {
              setActive(i);
              setPlaying(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const next =
                  (active + (e.key === 'ArrowRight' ? 1 : levels.length - 1)) %
                  levels.length;
                setActive(next);
                setPlaying(false);
                document.getElementById(`ladder-tab-${next}`)?.focus();
              }
            }}
          >
            <span className="ladder-num">{pad(l.n)}</span>
            <span className="ladder-name">{l.persona.replace('The ', '')}</span>
          </button>
        ))}
      </div>
      <div
        className="ladder-panel"
        id="ladder-panel"
        role="tabpanel"
        aria-labelledby={`ladder-tab-${active}`}
        key={active}
      >
        <div className="ladder-meta">
          <span>
            Dreyfus stage <strong>{level.stage}</strong>
          </span>
          <span>
            Relationship to AI <strong>{level.agency}</strong>
          </span>
        </div>
        <h3>{level.persona}</h3>
        <p>{level.summary}</p>
        <ul>
          {level.behaviors.map((b) => (
            <li key={b}>
              <Check size={13} /> {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="ladder-foot">
        <div className="agency-track" aria-hidden="true">
          {['Consumer', 'Director', 'Builder'].map((a, i) => (
            <span key={a} data-on={i === agencyIndex} data-past={i < agencyIndex}>
              {a}
            </span>
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
  );
}

/* ------------------------------------------------------------------ */
/* 2. Seven domains: the radar is the explorer                          */
/* ------------------------------------------------------------------ */

const CX = 250;
const CY = 232;
const R = 160;
const angle = (i: number) => (i * 2 * Math.PI) / domains.length - Math.PI / 2;
const pt = (r: number, i: number) => [
  CX + Math.cos(angle(i)) * r,
  CY + Math.sin(angle(i)) * r,
];
const ring = (r: number) =>
  domains.map((_, i) => pt(r, i).join(',')).join(' ');

export function DomainRadar() {
  const [sel, setSel] = useState(0);
  const [profile, setProfile] = useState(1);
  const motion = useMotionAllowed();
  const target = profiles[profile].values;
  const [vals, setVals] = useState(target);
  const valsRef = useRef(vals);
  useEffect(() => {
    valsRef.current = vals;
  }, [vals]);

  useEffect(() => {
    const target = profiles[profile].values;
    if (!motion) {
      setVals(target);
      return;
    }
    const from = valsRef.current;
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 600);
      const e = 1 - Math.pow(1 - p, 3);
      setVals(from.map((v, i) => v + (target[i] - v) * e));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [profile, motion]);

  const domain = domains[sel];
  const items = bank.filter((q) => q.domain === domain.key);
  const lvls = items.map((q) => q.level);
  const shape = vals.map((v, i) => pt((v / 100) * R, i).join(',')).join(' ');

  return (
    <div className="radar-lab">
      <div className="radar-stage">
        <svg
          viewBox="0 0 500 470"
          role="img"
          aria-label={`Radar of seven domains. Selected: ${domain.name}. Showing an illustrative ${profiles[profile].label.toLowerCase()} profile.`}
        >
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon key={f} className="radar-ring" points={ring(R * f)} />
          ))}
          {domains.map((d, i) => {
            const [x, y] = pt(R, i);
            return (
              <line
                key={d.key}
                className="radar-axis"
                data-on={i === sel}
                x1={CX}
                y1={CY}
                x2={x}
                y2={y}
              />
            );
          })}
          <polygon className="radar-shape" points={shape} />
          {vals.map((v, i) => {
            const [x, y] = pt((v / 100) * R, i);
            return (
              <circle
                key={i}
                className="radar-value"
                data-on={i === sel}
                cx={x}
                cy={y}
                r={i === sel ? 6 : 4}
              />
            );
          })}
          {domains.map((d, i) => {
            const [x, y] = pt(R, i);
            const [tx, ty] = pt(R + 26, i);
            const anchor =
              Math.abs(Math.cos(angle(i))) < 0.2
                ? 'middle'
                : Math.cos(angle(i)) > 0
                  ? 'start'
                  : 'end';
            return (
              <g
                key={d.key}
                className="radar-vertex"
                data-on={i === sel}
                onClick={() => setSel(i)}
                aria-hidden="true"
              >
                <circle cx={x} cy={y} r="18" className="radar-hit" />
                <circle cx={x} cy={y} r="5" className="radar-dot" />
                <text x={tx} y={ty + 4} textAnchor={anchor}>
                  {d.short}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="radar-profiles" role="group" aria-label="Illustrative report profiles">
          <span className="lab-label">ILLUSTRATIVE PROFILE</span>
          {profiles.map((p, i) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={i === profile}
              onClick={() => setProfile(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="radar-side">
        <div className="radar-list" role="tablist" aria-label="AI competency domains">
          {domains.map((d, i) => (
            <button
              key={d.key}
              type="button"
              role="tab"
              id={`domain-tab-${i}`}
              aria-selected={i === sel}
              aria-controls="domain-panel"
              tabIndex={i === sel ? 0 : -1}
              onClick={() => setSel(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const next =
                    (sel + (e.key === 'ArrowDown' ? 1 : domains.length - 1)) %
                    domains.length;
                  setSel(next);
                  document.getElementById(`domain-tab-${next}`)?.focus();
                }
              }}
            >
              <span>{pad(i + 1)}</span>
              {d.name}
              <b>{Math.round(vals[i])}</b>
            </button>
          ))}
        </div>
        <div
          className="radar-detail"
          id="domain-panel"
          role="tabpanel"
          aria-labelledby={`domain-tab-${sel}`}
          key={sel}
        >
          <span className="lab-label">
            DOMAIN {pad(sel + 1)} / 07 · BLOOM: {domain.bloom.toUpperCase()}
          </span>
          <h3>{domain.name}</h3>
          <p>{domain.assesses}</p>
          <dl>
            <div>
              <dt>Items in the bank</dt>
              <dd>{items.length}</dd>
            </div>
            <div>
              <dt>Levels covered</dt>
              <dd>
                {Math.min(...lvls)}–{Math.max(...lvls)}
              </dd>
            </div>
            <div>
              <dt>Formats</dt>
              <dd>{new Set(items.map((q) => q.type)).size}</dd>
            </div>
          </dl>
          <span className="radar-footnote">
            Every session covers all seven domains before it optimizes for
            difficulty. Profile shapes are illustrative.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. The adaptive bank: watch a session choose its questions           */
/* ------------------------------------------------------------------ */

type Step = { item: BankItem; score: number; before: number; after: number };

const domainOrder = domains.map((d) => d.key);

function selectNext(asked: Set<string>, covered: Set<string>, rating: number) {
  const available = bank.filter((q) => !asked.has(q.id));
  if (available.length === 0) return null;
  const uncovered = domainOrder.filter((d) => !covered.has(d));
  let candidates = available;
  if (uncovered.length > 0) {
    const shuffled = [...uncovered].sort(() => Math.random() - 0.5);
    for (const d of shuffled) {
      const pool = available.filter((q) => q.domain === d);
      if (pool.length > 0) {
        candidates = pool;
        break;
      }
    }
  }
  let best = Infinity;
  for (const q of candidates) best = Math.min(best, Math.abs(q.elo - rating));
  const near = candidates.filter(
    (q) => Math.abs(q.elo - rating) <= best + ELO_TOLERANCE,
  );
  return near[Math.floor(Math.random() * near.length)];
}

const X0 = 120;
const X1 = 600;
const ELO_MIN = 650;
const ELO_MAX = 1650;
const ROW = 34;
const TOP = 30;
const xOf = (elo: number) =>
  X0 + ((elo - ELO_MIN) / (ELO_MAX - ELO_MIN)) * (X1 - X0);

export function AdaptiveSimulator() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState<BankItem | null>(null);
  const [skill, setSkill] = useState(1150);
  const [auto, setAuto] = useState(false);
  const motion = useMotionAllowed();
  const listRef = useRef<HTMLOListElement>(null);

  const rating = steps.length ? steps[steps.length - 1].after : START_RATING;
  const asked = new Set(steps.map((s) => s.item.id));
  const covered = new Set(steps.map((s) => s.item.domain));
  const done = steps.length >= SESSION_LENGTH;

  useEffect(() => {
    if (current || done) return;
    const askedIds = new Set(steps.map((s) => s.item.id));
    const seen = new Set(steps.map((s) => s.item.domain));
    const r = steps.length ? steps[steps.length - 1].after : START_RATING;
    setCurrent(selectNext(askedIds, seen, r));
  }, [current, done, steps]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [steps.length]);

  const answer = (score: number) => {
    if (!current) return;
    const after = updateElo(rating, current.elo, score);
    setSteps((s) => [...s, { item: current, score, before: rating, after }]);
    setCurrent(null);
  };

  useEffect(() => {
    if (done) setAuto(false);
    if (!auto || !current || done) return;
    const timer = setTimeout(
      () => {
        const score =
          Math.random() < expectedScore(skill, current.elo) ? 100 : 0;
        const after = updateElo(rating, current.elo, score);
        setSteps((s) => [...s, { item: current, score, before: rating, after }]);
        setCurrent(null);
      },
      motion ? 900 : 250,
    );
    return () => clearTimeout(timer);
  }, [auto, current, done, skill, motion, rating]);

  const reset = () => {
    setAuto(false);
    setSteps([]);
    setCurrent(null);
  };

  const uncoveredCount = domainOrder.filter((d) => !covered.has(d)).length;
  const phase = done
    ? 'complete'
    : uncoveredCount > 0
      ? 'coverage'
      : 'targeting';
  const finalLevel = levels[ratingToLevel(rating) - 1];

  return (
    <div className="sim" data-phase={phase}>
      <div className="sim-transcript">
        <div className="build-bar">
          <span className="lab-label">
            <span className="live-dot" /> ONE SESSION / {SESSION_LENGTH} QUESTIONS
          </span>
          <span className="lab-label">
            {pad(steps.length)} / {pad(SESSION_LENGTH)}
          </span>
        </div>
        <ol ref={listRef} aria-live="polite">
          {steps.map((s, i) => (
            <li key={s.item.id} data-score={s.score}>
              <span className="sim-n">{pad(i + 1)}</span>
              <span className="sim-what">
                {s.item.domain} · {formatName(s.item.type)} · difficulty {s.item.elo}
              </span>
              <span className="sim-result">
                scored {s.score} → rating {s.before} → <b>{s.after}</b>
              </span>
            </li>
          ))}
          {current && !done && (
            <li data-current="true" key={current.id}>
              <span className="sim-n">{pad(steps.length + 1)}</span>
              <span className="sim-what">
                {current.domain} · {formatName(current.type)} · difficulty {current.elo}
              </span>
              <span className="sim-result">
                {phase === 'coverage'
                  ? `coverage first: ${uncoveredCount} of 7 domains still unseen`
                  : `all domains seen: closest item to your ${rating}`}
                {' · '}chance of a good answer at {skill}:{' '}
                <b>{Math.round(expectedScore(skill, current.elo) * 100)}%</b>
              </span>
            </li>
          )}
          {done && (
            <li data-current="true" className="sim-done">
              <span className="sim-n">
                <Check size={12} />
              </span>
              <span className="sim-what">Session complete</span>
              <span className="sim-result">
                final rating <b>{rating}</b> → level {finalLevel.n}, {finalLevel.persona}
              </span>
            </li>
          )}
        </ol>
        <div className="sim-controls">
          {!done ? (
            <>
              <div className="sim-answer">
                <span className="lab-label">ANSWER THIS ONE</span>
                <div>
                  <Button variant="outline" onClick={() => answer(100)} disabled={!current || auto}>
                    Well <b>100</b>
                  </Button>
                  <Button variant="outline" onClick={() => answer(50)} disabled={!current || auto}>
                    Partly <b>50</b>
                  </Button>
                  <Button variant="outline" onClick={() => answer(0)} disabled={!current || auto}>
                    Poorly <b>0</b>
                  </Button>
                </div>
              </div>
              <div className="sim-auto">
                <label htmlFor="sim-skill" className="lab-label">
                  OR SIMULATE A LEARNER RATED <b>{skill}</b>
                </label>
                <div>
                  <input
                    id="sim-skill"
                    type="range"
                    min={700}
                    max={1600}
                    step={10}
                    value={skill}
                    onChange={(e) => setSkill(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    className="build-play"
                    onClick={() => setAuto((a) => !a)}
                    aria-pressed={auto}
                  >
                    {auto ? <Pause size={12} /> : <Play size={12} />}
                    {auto ? 'Pause' : 'Run session'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Button className="button ink sim-reset" onClick={reset}>
              Run another session <RotateCcw size={15} />
            </Button>
          )}
          {steps.length > 0 && !done && (
            <button type="button" className="sim-restart" onClick={reset}>
              <RotateCcw size={13} /> Start over
            </button>
          )}
        </div>
      </div>

      <div className="sim-chart" aria-hidden="true">
        <svg viewBox={`0 0 660 ${TOP + ROW * 7 + 46}`}>
          {[800, 1000, 1200, 1400, 1600].map((e, i) => (
            <g key={e} className="sim-band">
              <line x1={xOf(e)} x2={xOf(e)} y1={TOP - 10} y2={TOP + ROW * 7} />
              <text x={xOf(e)} y={TOP + ROW * 7 + 22} textAnchor="middle">
                L{i + 1} · {e}
              </text>
            </g>
          ))}
          {domainOrder.map((d, r) => (
            <g key={d} className="sim-row" data-covered={covered.has(d)}>
              <text x={X0 - 14} y={TOP + r * ROW + ROW / 2 + 4} textAnchor="end">
                {domains[r].short}
              </text>
              <line
                x1={X0}
                x2={X1}
                y1={TOP + r * ROW + ROW / 2}
                y2={TOP + r * ROW + ROW / 2}
              />
            </g>
          ))}
          {bank.map((q) => {
            const r = domainOrder.indexOf(q.domain);
            const siblings = bank.filter(
              (o) => o.domain === q.domain && o.elo === q.elo,
            );
            const k = siblings.indexOf(q);
            const offset = (k - (siblings.length - 1) / 2) * 9;
            const state = asked.has(q.id)
              ? 'asked'
              : current?.id === q.id
                ? 'current'
                : 'idle';
            return (
              <circle
                key={q.id}
                className="sim-dot"
                data-state={state}
                cx={xOf(q.elo)}
                cy={TOP + r * ROW + ROW / 2 + offset}
                r={state === 'current' ? 7 : 4.5}
              />
            );
          })}
          <g
            className="sim-marker"
            style={{ transform: `translateX(${xOf(rating)}px)` }}
          >
            <line x1={0} x2={0} y1={TOP - 22} y2={TOP + ROW * 7} />
            <rect x={-34} y={TOP - 40} width={68} height={20} rx={10} />
            <text x={0} y={TOP - 26} textAnchor="middle">
              you · {rating}
            </text>
          </g>
        </svg>
        <div className="sim-legend">
          <span>
            <i data-state="idle" /> in the bank ({bank.length})
          </span>
          <span>
            <i data-state="current" /> chosen next
          </span>
          <span>
            <i data-state="asked" /> asked
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Five real questions, five formats, scored the way the repo does   */
/* ------------------------------------------------------------------ */

type Result = { score: number; rationale: string };

const shuffleOrders: Record<string, number[]> = {
  q_match_05: [2, 0, 3, 1],
  q_rank_02: [3, 0, 4, 1, 2],
};

function scoreQuestion(q: SampleQuestion, response: unknown): Result {
  switch (q.type) {
    case 'MCQ':
    case 'ScenarioJudgment': {
      const ok = response === q.correct;
      return {
        score: ok ? 100 : 0,
        rationale: ok
          ? 'Exact match with the answer key.'
          : 'Scored by exact match: 0 of 100.',
      };
    }
    case 'MultipleSelect': {
      const selected = (response as number[]) ?? [];
      const correct = new Set(q.correct);
      let hits = 0;
      let fp = 0;
      for (const i of selected) {
        if (correct.has(i)) hits++;
        else fp++;
      }
      const score = Math.round(Math.max(0, (hits - fp) / correct.size) * 100);
      const missed = q.correct.filter((i) => !selected.includes(i));
      return {
        score,
        rationale:
          score === 100
            ? 'All correct options selected with no incorrect selections.'
            : `${hits} of ${correct.size} correct selected, ${fp} incorrect${
                missed.length ? `. Missed: ${missed.map((i) => `“${q.options[i]}”`).join(', ')}` : ''
              }.`,
      };
    }
    case 'Ranking': {
      const submitted = response as number[];
      const n = q.correct.length;
      let dist = 0;
      submitted.forEach((v, i) => (dist += Math.abs(i - q.correct.indexOf(v))));
      const max = n * (n - 1);
      const score = Math.round((1 - dist / max) * 100);
      return {
        score,
        rationale:
          score === 100
            ? 'Perfect ordering.'
            : `Ordering accuracy ${score} of 100. Total positional distance ${dist} of ${max}.`,
      };
    }
    case 'Matching': {
      const submitted = response as number[];
      const total = q.pairs.length;
      const correct = submitted.filter((v, i) => v === i).length;
      const score = Math.round((correct / total) * 100);
      return {
        score,
        rationale:
          score === 100
            ? 'All pairs matched correctly.'
            : `${correct} of ${total} pairs matched correctly.`,
      };
    }
  }
}

export function QuestionSet() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const q = sampleQuestions[index];
  const answer = answers[q.id];
  const result = results[q.id];

  const initialFor = (item: SampleQuestion): unknown => {
    if (item.type === 'Ranking') return shuffleOrders[item.id];
    if (item.type === 'Matching') return item.pairs.map(() => -1);
    if (item.type === 'MultipleSelect') return [];
    return null;
  };
  const value = answer ?? initialFor(q);
  const set = (v: unknown) => setAnswers((a) => ({ ...a, [q.id]: v }));

  const ready = (() => {
    if (q.type === 'Matching') return (value as number[]).every((v) => v >= 0);
    if (q.type === 'MultipleSelect') return (value as number[]).length > 0;
    if (q.type === 'Ranking') return true;
    return value !== null;
  })();

  const check = () =>
    setResults((r) => ({ ...r, [q.id]: scoreQuestion(q, value) }));

  /* Running rating across the five, in order answered. */
  let running = START_RATING;
  const trail: number[] = [START_RATING];
  for (const item of sampleQuestions) {
    const res = results[item.id];
    if (!res) continue;
    running = updateElo(running, item.elo, res.score);
    trail.push(running);
  }
  const answered = Object.keys(results).length;
  const allDone = answered === sampleQuestions.length;

  const resetAll = () => {
    setAnswers({});
    setResults({});
    setIndex(0);
  };

  return (
    <div className="qset">
      <div className="qset-steps" role="tablist" aria-label="Sample questions">
        {sampleQuestions.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            data-done={Boolean(results[item.id])}
            onClick={() => setIndex(i)}
          >
            <span>{pad(i + 1)}</span>
            {formatName(item.type)}
            {results[item.id] && <b>{results[item.id].score}</b>}
          </button>
        ))}
      </div>
      <div className="qset-body">
        <aside className="qset-side">
          <span className="lab-label">QUESTION {pad(index + 1)} OF {pad(sampleQuestions.length)}</span>
          <dl>
            <div>
              <dt>Domain</dt>
              <dd>{q.domain}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{formatName(q.type)}</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>
                Level {q.level} · {q.elo}
              </dd>
            </div>
          </dl>
          <div className="qset-rating">
            <span className="lab-label">YOUR RATING SO FAR</span>
            <div className="qset-trail" aria-hidden="true">
              {trail.map((r, i) => (
                <span key={i} data-last={i === trail.length - 1}>
                  {r}
                  {i < trail.length - 1 && <ArrowRight size={11} />}
                </span>
              ))}
            </div>
            <p>
              {allDone
                ? `Five answers moved a starting rating of ${START_RATING} to ${running}. A real session asks twelve, and chooses each one for you.`
                : `Every answer moves the same rating a real session uses. Harder items move it further.`}
            </p>
            {allDone && (
              <Button variant="ghost" onClick={resetAll}>
                <RotateCcw size={14} /> Start over
              </Button>
            )}
          </div>
        </aside>
        <div className="qset-question" key={q.id}>
          <h3 id={`q-${q.id}`}>{q.question}</h3>

          {(q.type === 'MCQ' || q.type === 'ScenarioJudgment') && (
            <RadioGroup
              value={value === null ? null : String(value as number)}
              onValueChange={(v) => set(Number(v))}
              aria-labelledby={`q-${q.id}`}
              className="scenario-options"
              disabled={Boolean(result)}
            >
              {q.options.map((option, i) => (
                <div
                  className="scenario-option"
                  key={option}
                  data-selected={value === i}
                  data-correct={result ? i === q.correct : undefined}
                >
                  <RadioGroupItem value={String(i)} id={`${q.id}-${i}`} />
                  <label htmlFor={`${q.id}-${i}`}>
                    <b>{String.fromCharCode(65 + i)}.</b> {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
          )}

          {q.type === 'MultipleSelect' && (
            <div className="scenario-options" role="group" aria-labelledby={`q-${q.id}`}>
              {q.options.map((option, i) => {
                const sel = (value as number[]).includes(i);
                return (
                  <div
                    className="scenario-option"
                    key={option}
                    data-selected={sel}
                    data-correct={result ? q.correct.includes(i) : undefined}
                  >
                    <input
                      type="checkbox"
                      className="native-check"
                      id={`${q.id}-${i}`}
                      checked={sel}
                      disabled={Boolean(result)}
                      onChange={(e) =>
                        set(
                          e.target.checked
                            ? [...(value as number[]), i]
                            : (value as number[]).filter((v) => v !== i),
                        )
                      }
                    />
                    <label htmlFor={`${q.id}-${i}`}>
                      <b>{String.fromCharCode(65 + i)}.</b> {option}
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {q.type === 'Matching' && (
            <div className="match-list" role="group" aria-labelledby={`q-${q.id}`}>
              {q.pairs.map((p, i) => {
                const chosen = (value as number[])[i];
                return (
                  <div
                    className="match-row"
                    key={p.left}
                    data-correct={result ? chosen === i : undefined}
                  >
                    <label htmlFor={`${q.id}-m${i}`}>
                      <b>{String.fromCharCode(65 + i)}.</b> {p.left}
                    </label>
                    <select
                      id={`${q.id}-m${i}`}
                      value={chosen}
                      disabled={Boolean(result)}
                      onChange={(e) => {
                        const next = [...(value as number[])];
                        next[i] = Number(e.target.value);
                        set(next);
                      }}
                    >
                      <option value={-1}>Choose a description…</option>
                      {shuffleOrders[q.id].map((ri) => (
                        <option key={ri} value={ri}>
                          {q.pairs[ri].right}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          )}

          {q.type === 'Ranking' && (
            <ol className="rank-list" aria-labelledby={`q-${q.id}`}>
              {(value as number[]).map((optIndex, pos) => (
                <li
                  key={optIndex}
                  data-correct={result ? q.correct[pos] === optIndex : undefined}
                >
                  <span className="rank-pos">{pos + 1}</span>
                  <span className="rank-text">{q.options[optIndex]}</span>
                  <span className="rank-moves">
                    <button
                      type="button"
                      aria-label={`Move “${q.options[optIndex]}” up`}
                      disabled={pos === 0 || Boolean(result)}
                      onClick={() => {
                        const next = [...(value as number[])];
                        [next[pos - 1], next[pos]] = [next[pos], next[pos - 1]];
                        set(next);
                      }}
                    >
                      <ArrowDown size={14} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move “${q.options[optIndex]}” down`}
                      disabled={pos === (value as number[]).length - 1 || Boolean(result)}
                      onClick={() => {
                        const next = [...(value as number[])];
                        [next[pos + 1], next[pos]] = [next[pos], next[pos + 1]];
                        set(next);
                      }}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          )}

          <div className="scenario-actions">
            {!result ? (
              <>
                <Button className="button ink" disabled={!ready} onClick={check}>
                  Check my answer <ArrowRight size={16} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: initialFor(q) }))}
                >
                  Reset
                </Button>
              </>
            ) : index < sampleQuestions.length - 1 ? (
              <Button className="button ink" onClick={() => setIndex(index + 1)}>
                Next question <ArrowRight size={16} />
              </Button>
            ) : (
              <Button className="button ink" onClick={() => setIndex(0)}>
                Review from the start <RotateCcw size={15} />
              </Button>
            )}
          </div>

          {result && (
            <div
              className={`answer-feedback ${result.score === 100 ? 'correct' : result.score > 0 ? 'partial' : 'incorrect'}`}
              role="status"
            >
              <strong>
                <span className="feedback-score">{result.score}</span>
                {result.score === 100
                  ? 'Full marks.'
                  : result.score > 0
                    ? 'Partial credit.'
                    : 'No credit this time.'}
              </strong>
              <p>{result.rationale}</p>
              {result.score < 100 && (
                <span>
                  Correct answer{q.type === 'MCQ' || q.type === 'ScenarioJudgment' ? '' : 's'} marked
                  in green above.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Twelve formats, two ways of scoring                               */
/* ------------------------------------------------------------------ */

export function FormatGrid({ children }: { children?: ReactNode }) {
  const [sel, setSel] = useState(0);
  const f = formats[sel];
  return (
    <div className="format-grid">
      <div className="format-groups">
        {(['structured', 'open'] as const).map((kind) => (
          <div key={kind} className="format-group">
            <span className="lab-label">
              {kind === 'structured'
                ? 'STRUCTURED / SCORED BY CODE'
                : 'OPEN-ENDED / SCORED BY RUBRIC'}
            </span>
            <div role="tablist" aria-label={`${kind} formats`}>
              {formats.map(
                (item, i) =>
                  item.kind === kind && (
                    <button
                      key={item.key}
                      type="button"
                      role="tab"
                      aria-selected={i === sel}
                      onMouseEnter={() => setSel(i)}
                      onFocus={() => setSel(i)}
                      onClick={() => setSel(i)}
                    >
                      {item.name}
                    </button>
                  ),
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="format-detail" key={sel} role="tabpanel">
        <span className="lab-label">
          {f.kind === 'structured' ? 'STRUCTURED' : 'OPEN-ENDED'} · BLOOM: {f.bloom.toUpperCase()}
        </span>
        <h3>{f.name}</h3>
        <p>{f.assesses}</p>
        <p className="format-scoring">
          <b>Scoring.</b> {f.scoring}
        </p>
        <span className="format-count">
          {bank.filter((q) => q.type === f.key).length} in the bank
          <ArrowUpRight size={13} />
        </span>
        {children}
      </div>
    </div>
  );
}
