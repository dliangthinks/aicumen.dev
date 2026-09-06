'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, RotateCcw, Pause, Play, Check } from './icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import demo from './demo-data.json';

export function SiteMotion() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(media.matches);
    const update = () => setPaused(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'running';
  }, [paused]);
  useEffect(() => {
    const bar = document.getElementById('reading-progress');
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar)
          bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-reveal', 'visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      document
        .querySelectorAll(
          '.editorial-section,.feature-section,.domains-section,.belief,.closing,.cross-project,.product-card,.why-block',
        )
        .forEach((el) => {
          if (el.getBoundingClientRect().top > window.innerHeight) {
            el.setAttribute('data-reveal', 'pending');
            observer.observe(el);
          }
        });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <>
      <div id="reading-progress" aria-hidden="true" />
      <Button
        className="motion-toggle"
        variant="outline"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}{' '}
        {paused ? 'Play motion' : 'Pause motion'}
      </Button>
    </>
  );
}

const journey = [
  {
    value: 'learn',
    label: 'Learn',
    text: 'Understand what agents can actually do, where they fall short, and what good judgment with them looks like.',
  },
  {
    value: 'build',
    label: 'Build',
    text: 'Make software for agents and AI-powered workflows that put that understanding to work, in the open.',
  },
  {
    value: 'inspire',
    label: 'Inspire',
    text: 'Share what worked and what did not, so the next person starts further along. Then the cycle turns again.',
  },
];
export function Journey({ children }: { children: ReactNode }) {
  const [step, setStep] = useState('learn');
  return (
    <div className="journey" data-step={step}>
      {children}
      <Tabs
        value={step}
        onValueChange={(v) => setStep(String(v))}
        className="journey-tabs"
      >
        <TabsList
          aria-label="Explore the aicumen cycle"
          className="journey-controls"
        >
          {journey.map((s, i) => (
            <TabsTrigger key={s.value} value={s.value}>
              0{i + 1} / {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {journey.map((s) => (
          <TabsContent key={s.value} value={s.value}>
            <p>{s.text}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const modes = [
  ['glossary', 'Glossary'],
  ['flashcards', 'Flashcards'],
  ['matching', 'Matching'],
];
export function ComposerDemo() {
  const [mode, setMode] = useState('glossary');
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [term, setTerm] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [feedback, setFeedback] = useState(
    'Choose a concept, then its definition.',
  );
  const reset = () => {
    setTerm(null);
    setMatched([]);
    setFeedback('Choose a concept, then its definition.');
  };
  const match = (index: number) => {
    if (term === null) {
      setFeedback('Choose a concept first.');
      return;
    }
    if (term === index) {
      setMatched((prev) => [...prev, index]);
      setFeedback(
        matched.length === demo.pairs.length - 1
          ? 'All three matched. The content stayed the same; your task changed.'
          : `${demo.pairs[index].left}: matched. Choose the next concept.`,
      );
      setTerm(null);
    } else
      setFeedback(
        'That definition belongs to a different concept. Try another.',
      );
  };
  return (
    <section className="demo-section wrap" id="composer-demo">
      <div className="section-heading">
        <span className="eyebrow">Try the idea / Interactive demo</span>
        <h2>
          Same three pairs.
          <br />
          <span>Read them, explore them, then try them.</span>
        </h2>
      </div>
      <p className="demo-intro">
        Switch the presentation and the stance changes with it. Read the
        glossary, turn over a flashcard, then match them. Nothing is retyped
        between views.
      </p>
      <div className="composer-lab">
        <aside className="source-panel">
          <div className="lab-label">
            <span className="live-dot" /> THE CONTENT / PAIRS
          </div>
          <h3>
            Three concepts.
            <br /> One source.
          </h3>
          {demo.pairs.map((p, i) => (
            <div className="source-row" key={p.left}>
              <span>0{i + 1}</span>
              <strong>{p.left}</strong>
              <small>term + definition</small>
            </div>
          ))}
          <p>
            Presentation changes.
            <br />
            Source content stays intact.
          </p>
          <span className="source-credit">
            Example content from SAICA
            <br />
            Question q_match_04
          </span>
        </aside>
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(String(v))}
          className="presentation-panel"
        >
          <div className="presentation-top">
            <span className="lab-label">PRESENTATION</span>
            <span className="lab-label">
              {mode === 'glossary'
                ? 'READ'
                : mode === 'flashcards'
                  ? 'EXPLORE'
                  : 'PRACTICE'}
            </span>
          </div>
          <TabsList className="demo-tabs" aria-label="Content presentation">
            {modes.map(([v, label]) => (
              <TabsTrigger value={v} key={v}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="glossary" className="demo-view">
            <dl className="glossary">
              {demo.pairs.map((p) => (
                <div key={p.left}>
                  <dt>{p.left}</dt>
                  <dd>{p.right}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent value="flashcards" className="demo-view">
            <div className="flashcard-wrap">
              <button
                className={`flashcard ${flipped ? 'flipped' : ''}`}
                onClick={() => setFlipped(!flipped)}
                aria-label={flipped ? 'Show term' : 'Reveal definition'}
                aria-pressed={flipped}
              >
                <span className="flash-face flash-front" aria-hidden={flipped}>
                  <span className="lab-label">CONCEPT {card + 1} / 3</span>
                  <strong>{demo.pairs[card].left}</strong>
                  <span>
                    Click to reveal <RotateCcw size={15} />
                  </span>
                </span>
                <span className="flash-face flash-back" aria-hidden={!flipped}>
                  <span className="lab-label">{demo.pairs[card].left}</span>
                  <strong>{demo.pairs[card].right}</strong>
                  <span>
                    Click to turn back <RotateCcw size={15} />
                  </span>
                </span>
              </button>
              <div className="flash-controls">
                <span>
                  {card + 1} of {demo.pairs.length}
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCard((card + 1) % demo.pairs.length);
                    setFlipped(false);
                  }}
                >
                  Next concept <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="matching" className="demo-view">
            <div className="match-columns">
              <div>
                {demo.pairs.map((p, i) => (
                  <Button
                    className="match-term"
                    variant="outline"
                    key={p.left}
                    disabled={matched.includes(i)}
                    aria-pressed={term === i}
                    onClick={() => {
                      setTerm(i);
                      setFeedback(`Now choose the definition of ${p.left}.`);
                    }}
                  >
                    {matched.includes(i) ? <Check size={15} /> : null}
                    {p.left}
                  </Button>
                ))}
              </div>
              <div>
                {[2, 0, 1].map((i) => (
                  <Button
                    className="match-definition"
                    variant="outline"
                    key={i}
                    disabled={matched.includes(i)}
                    onClick={() => match(i)}
                  >
                    {demo.pairs[i].right}
                  </Button>
                ))}
              </div>
            </div>
            <div className="match-footer">
              <p role="status">{feedback}</p>
              <Button
                variant="ghost"
                onClick={reset}
                aria-label="Reset matching exercise"
              >
                <RotateCcw size={17} />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <p className="demo-disclosure">
        A working illustration of Composer’s design principle, built for this
        page. This is not a connection to the unreleased Composer engine.
      </p>
    </section>
  );
}
