import { ArrowUpRight, ArrowDown, Layers3, ScanLine } from './icons';
import {
  Header,
  Footer,
  LearningLoop,
  ShapeDiagram,
  DomainDiagram,
} from './site-components';
import { Journey } from './interactions';
export default function Home() {
  return (
    <>
      <Header active="home" />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-top">
            <span className="eyebrow">
              <i /> Learn. Build. Inspire.
            </span>
            <span className="edition">TOOLS + FRAMEWORKS / 001</span>
          </div>
          <div className="hero-grid">
            <div>
              <h1>
                Learn. Build.
                <br />
                Inspire.
                <br />
                <em>Develop aicumen.</em>
              </h1>
              <p className="hero-copy">
                Software for agents. AI-powered workflows.
                <br />
                Built in the open, so what we learn becomes what you build.
              </p>
              <a className="button lime" href="#products">
                Explore the projects <ArrowDown size={18} />
              </a>
            </div>
            <Journey>
              <LearningLoop />
            </Journey>
          </div>
          <div className="hero-bottom">
            <span>One cycle. Every project is a turn of it.</span>
            <span>
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </span>
          </div>
        </section>
        <section className="products wrap" id="products">
          <div className="section-heading">
            <span className="eyebrow">01 / The projects</span>
            <h2>
              What we are building.
              <br />
              <span>Software for agents. AI-powered workflows.</span>
            </h2>
          </div>
          <div className="product-grid">
            <a className="product-card composer-card" href="/composer">
              <div className="card-heading">
                <Layers3 size={26} />
                <span className="tag">Software for agents / In development</span>
              </div>
              <div className="card-copy">
                <h3>
                  Composer<span>↗</span>
                </h3>
                <p>
                  A course engine
                  <br />
                  whose author is an AI agent.
                </p>
              </div>
              <ShapeDiagram />
              <div className="card-bottom">
                <p>
                  An open-source MCP server. The agent structures the lesson,
                  chooses presentations, briefs the media, and styles the
                  course. You judge the result.
                </p>
                <span className="text-link">
                  Meet Composer <ArrowUpRight size={19} />
                </span>
              </div>
            </a>
            <a className="product-card assess-card" href="/assess">
              <div className="card-heading">
                <ScanLine size={26} />
                <span className="tag">AI-powered workflow / Competency assessment</span>
              </div>
              <div className="card-copy">
                <h3>
                  Assessor<span>↗</span>
                </h3>
                <p>
                  Understand your capabilities.
                  <br />
                  Find your next edge.
                </p>
              </div>
              <DomainDiagram />
              <div className="card-bottom">
                <p>
                  An adaptive, AI-scored assessment that places your AI practice
                  on a five-level ladder and tells you what the next rung asks
                  of you.
                </p>
                <span className="text-link">
                  Explore Assessor <ArrowUpRight size={19} />
                </span>
              </div>
            </a>
          </div>
        </section>
        <section className="belief wrap">
          <span className="eyebrow">02 / The idea behind Aicumen</span>
          <div>
            <h2>
              Aicumen is a cycle,
              <br />
              not a stockpile of tools.
            </h2>
            <p>
              Learn what agents can actually do and where they fall short. Build
              software and workflows that put that to work. Share what worked,
              and what did not, so the next person starts further along. Then
              the loop turns again. Every project here is one turn of it.
            </p>
          </div>
        </section>
        <section className="closing wrap">
          <p>
            Beyond using AI.
            <br />
            <em>More aicumen.</em>
          </p>
          <a
            href="#products"
            className="round-link"
            aria-label="Explore the projects"
          >
            <ArrowUpRight size={40} />
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
