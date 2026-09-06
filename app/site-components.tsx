import { ArrowUpRight } from './icons';
export function Header({ active }: { active: string }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a href="/" className="wordmark" aria-label="Aicumen home">
          <span className="brand-symbol" aria-hidden="true">
            a*
          </span>
          aicumen<span className="brand-domain">.dev</span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href="/composer"
            aria-current={active === 'composer' ? 'page' : undefined}
          >
            Composer
          </a>
          <a
            href="/assess"
            aria-current={active === 'assess' ? 'page' : undefined}
          >
            Assess
          </a>
          <a href="/#products" className="nav-explore">
            Explore the projects <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer wrap">
      <a href="/" className="wordmark">
        aicumen<span className="brand-domain">.dev</span>
      </a>
      <p>AI expertise is a practice.</p>
      <span>© {new Date().getFullYear()} Aicumen</span>
    </footer>
  );
}
export function LearningLoop() {
  return (
    <div className="learning-loop">
      <span className="diagram-label">EXPERTISE IS A PRACTICE</span>
      <svg viewBox="0 0 480 440" role="img" aria-labelledby="loop-title">
        <title id="loop-title">
          Develop expertise through a repeating cycle of creating, assessing,
          and refining.
        </title>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#d3fb52" />
          </marker>
        </defs>
        <circle cx="240" cy="215" r="174" fill="none" stroke="#424837" />
        <circle
          className="orbit-dashes"
          cx="240"
          cy="215"
          r="143"
          fill="none"
          stroke="#697345"
          strokeDasharray="2 9"
        />
        <circle cx="240" cy="215" r="102" fill="none" stroke="#424837" />
        <path
          className="orbit-path"
          d="M240 41 A174 174 0 0 1 404 273"
          stroke="#d3fb52"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <path
          d="M389 305 A174 174 0 0 1 78 279"
          stroke="#d3fb52"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <path
          d="M68 241 A174 174 0 0 1 196 47"
          stroke="#d3fb52"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrow)"
        />
        <path d="M135 215H345M240 110V320" stroke="#424837" />
        <circle cx="240" cy="215" r="57" fill="#d3fb52" />
        <text x="240" y="235" textAnchor="middle" className="loop-center">
          a*
        </text>
        <g className="orbit-label">
          <rect x="180" y="21" width="120" height="39" rx="20" />
          <text x="240" y="46" textAnchor="middle">
            01 / CREATE
          </text>
          <rect x="327" y="293" width="126" height="39" rx="20" />
          <text x="390" y="318" textAnchor="middle">
            02 / ASSESS
          </text>
          <rect x="27" y="293" width="126" height="39" rx="20" />
          <text x="90" y="318" textAnchor="middle">
            03 / REFINE
          </text>
        </g>
        <g className="orbit-satellite">
          <circle cx="240" cy="72" r="5" fill="#d3fb52" />
        </g>
        <circle cx="240" cy="318" r="4" fill="#d3fb52" />
      </svg>
      <div className="diagram-note">
        <span>MAKE → REFLECT → GROW</span>
        <span>↺ REPEAT</span>
      </div>
    </div>
  );
}
export function ShapeDiagram() {
  return (
    <div
      className="shape-diagram"
      aria-label="One content structure can be presented as flashcards, a glossary, or a matching exercise."
    >
      <div className="shape-source">
        <span className="small-label">CONTENT SHAPE</span>
        <strong>Terms + definitions</strong>
        <span className="shape-pair">
          Concept <span>↔</span> Meaning
        </span>
      </div>
      <div className="branch-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="shape-outputs">
        <div>
          <span className="mini-icon">▱</span>Flashcards
        </div>
        <div>
          <span className="mini-icon">≡</span>Glossary
        </div>
        <div>
          <span className="mini-icon">⇄</span>Matching
        </div>
      </div>
      <p className="diagram-caption">SAME CONTENT. DIFFERENT WAYS TO LEARN.</p>
    </div>
  );
}
const domainNames = [
  'Foundations',
  'Prompting',
  'Workflows',
  'Ethics & risk',
  'Tool selection',
  'Evaluation',
  'Metacognition',
];
export function DomainDiagram() {
  const point = (r: number, i: number) => [
    220 + Math.sin((i * 2 * Math.PI) / 7) * r,
    165 - Math.cos((i * 2 * Math.PI) / 7) * r,
  ];
  const poly = (r: number) =>
    Array.from({ length: 7 }, (_, i) => point(r, i).join(',')).join(' ');
  return (
    <div className="domain-diagram">
      <svg
        viewBox="0 0 440 335"
        role="img"
        aria-label="Seven domains of AI competence: foundations, prompting, workflows, ethics and risk, tool selection, output evaluation, and metacognition."
      >
        {[35, 65, 95, 125].map((r) => (
          <polygon
            key={r}
            points={poly(r)}
            fill="none"
            stroke="#a6b5a4"
            strokeOpacity=".6"
          />
        ))}
        {domainNames.map((label, i) => {
          const [x, y] = point(125, i);
          const [tx, ty] = point(145, i);
          return (
            <g key={label}>
              <line
                x1="220"
                y1="165"
                x2={x}
                y2={y}
                stroke="#a6b5a4"
                strokeOpacity=".6"
              />
              <circle cx={x} cy={y} r="4" fill="#204c39" />
              <text
                x={tx}
                y={ty + 4}
                textAnchor={i === 0 ? 'middle' : i < 4 ? 'start' : 'end'}
              >
                {label}
              </text>
            </g>
          );
        })}
        <circle cx="220" cy="165" r="29" fill="#204c39" />
        <text x="220" y="172" textAnchor="middle" className="domain-center">
          7
        </text>
      </svg>
      <p className="diagram-caption">A FRAMEWORK FOR THE WHOLE PRACTITIONER.</p>
    </div>
  );
}
