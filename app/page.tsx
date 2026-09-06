import Link from 'next/link';
import { ArrowUpRight, ArrowDown, Layers3, ScanLine } from 'lucide-react';
import { Header, Footer, LearningLoop, ShapeDiagram, DomainDiagram } from './site-components';
export default function Home() {
  return <><Header active="home"/><main id="main">
    <section className="hero wrap">
      <div className="hero-top"><span className="eyebrow"><i/> A home for AI expertise</span><span className="edition">TOOLS + FRAMEWORKS / 001</span></div>
      <div className="hero-grid"><div><h1>Go beyond<br/>using AI.<br/><em>Develop acumen.</em></h1><p className="hero-copy">The tools to create meaningful learning.<br/>The clarity to know what to learn next.</p><a className="button lime" href="#products">Explore the projects <ArrowDown size={18}/></a></div><LearningLoop/></div>
      <div className="hero-bottom"><span>Human judgment. Expanded possibility.</span><span>SCROLL TO EXPLORE <ArrowDown size={14}/></span></div>
    </section>
    <section className="products wrap" id="products"><div className="section-heading"><span className="eyebrow">01 / The projects</span><h2>Two ways forward.<br/><span>One direction: capability.</span></h2></div>
      <div className="product-grid">
        <Link className="product-card composer-card" href="/composer"><div className="card-heading"><Layers3 size={26}/><span className="tag">Course authoring / In development</span></div><div className="card-copy"><h3>Composer<span>↗</span></h3><p>What Blender is to 3D,<br/>Composer aims to be for e-learning.</p></div><ShapeDiagram/><div className="card-bottom"><p>An open-source engine that lets AI agents turn your expertise into interactive courses.</p><span className="text-link">Meet Composer <ArrowUpRight size={19}/></span></div></Link>
        <Link className="product-card assess-card" href="/assess"><div className="card-heading"><ScanLine size={26}/><span className="tag">Competency assessment</span></div><div className="card-copy"><h3>Assess<span>↗</span></h3><p>Understand your capabilities.<br/>Find your next edge.</p></div><DomainDiagram/><div className="card-bottom"><p>An adaptive assessment framework that turns AI skills and judgment into a path for development.</p><span className="text-link">Explore Assess <ArrowUpRight size={19}/></span></div></Link>
      </div>
    </section>
    <section className="belief wrap"><span className="eyebrow">02 / The idea behind Aicumen</span><div><h2>Access to intelligence<br/>is just the beginning.</h2><p>Expertise grows when you make something, question the result, and try again with better judgment. Aicumen brings together tools for that work: creating learning worth engaging with, and understanding how your own AI practice can grow.</p></div></section>
    <section className="closing wrap"><p>Less guesswork.<br/><em>More acumen.</em></p><a href="#products" className="round-link" aria-label="Explore the projects"><ArrowUpRight size={40}/></a></section>
  </main><Footer/></>;
}
