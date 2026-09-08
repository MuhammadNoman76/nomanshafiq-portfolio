import {Spark} from "./StudioIcons";

export function Plant(){
  return <div className="plant desk-object parallax" data-depth=".12" aria-hidden="true">
    <span className="stem stem-a"/><span className="stem stem-b"/><span className="stem stem-c"/>
    {Array.from({length:16}).map((_,i)=><span key={i} className={`leaf leaf-${i+1}`} />)}
    <span className="plant-shadow"/>
  </div>;
}

export function StickyIdea(){
  return <div className="sticky-idea desk-object tactile" data-tilt aria-hidden="true"><span>Curiosity<br/>Builds<br/>Better<br/>Things. <b>☺</b></span></div>;
}

export function Marker(){
  return <div className="marker desk-object" aria-hidden="true"><i/><b/><span/></div>;
}

export function Coffee(){
  return <div className="coffee desk-object parallax" data-depth=".16" aria-hidden="true">
    <div className="saucer"/><div className="cup"><div className="coffee-liquid"><span className="latte latte-1"/><span className="latte latte-2"/><span className="latte latte-3"/></div><i className="handle"/></div><div className="cork"/>
  </div>;
}

export function BlackNotebook(){
  return <div className="black-notebook desk-object tactile" data-tilt aria-hidden="true"><Spark/><div className="black-note-copy">Build<br/>Experiment<br/>Learn<br/>Repeat</div><span className="book-edge"/></div>;
}

export function Handheld(){
  return <div className="handheld desk-object tactile parallax" data-depth=".21" data-tilt aria-hidden="true"><div className="screen"><span>MAKE<br/>IDEAS<br/>REAL</span><b>↳</b></div><div className="dpad"><i/><b/></div><span className="game-dot dot-a"/><span className="game-dot dot-b"/><span className="speaker">••••••</span></div>;
}

export function IdeaSheet(){
  return <div className="idea-sheet desk-object tactile" data-tilt aria-hidden="true"><span className="sheet-tab">IDEAS</span><p>IDEAS</p><ul><li>EXPERIMENTS</li><li>PRODUCTS</li><li>IMPACT</li></ul><div className="mini-chart"><i/><i/><i/><i/></div><span className="arrow-line">↗</span></div>;
}

export function FieldNotes(){
  return <div className="field-notes desk-object tactile parallax" data-depth=".08" data-tilt aria-hidden="true"><div className="spine"/><p className="field-title">FIELD<br/>NOTES</p><p className="field-copy">Engineer<br/>Builder<br/>Learner<br/>Forever</p><span className="field-rule"/></div>;
}

export function Pen(){
  return <div className="pen desk-object" aria-hidden="true"><span className="pen-cap"/><span className="pen-body"/><span className="pen-tip"/></div>;
}

export function GraphScrap(){
  return <div className="graph-scrap desk-object tactile" data-tilt aria-hidden="true"><span className="graph-grid"/><svg viewBox="0 0 180 100"><path d="M12 78 35 63 50 70 75 42 91 55 110 33 129 51 151 18 170 28" fill="none" stroke="currentColor" strokeWidth="2.2"/><path d="m154 16 16 12-18 2" fill="none" stroke="currentColor" strokeWidth="2"/></svg><p>A BRIGHTER<br/>MORE<br/>USEFUL<br/>TOMORROW.</p></div>;
}

export function Camera(){
  return <div className="camera desk-object parallax" data-depth=".11" aria-hidden="true"><div className="camera-top"><i/><b/></div><span className="camera-logo">NOMAN</span><div className="lens"><i/><b/><span/></div><div className="camera-grip"/></div>;
}

export function Laptop(){
  return <div className="laptop desk-object" aria-hidden="true"><div className="laptop-screen"><span>build / learn / ship</span><i/></div><div className="laptop-base"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div></div>;
}

export function Tape({className=""}:{className?:string}){ return <span className={`tape ${className}`} aria-hidden="true"/>; }

export function Skyline(){
  return <svg className="skyline" viewBox="0 0 240 145" aria-hidden="true">
    <defs>
      <linearGradient id="skyWash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ddd8cd"/><stop offset="1" stopColor="#c5c1b8"/></linearGradient>
      <linearGradient id="waterWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9b5ab"/><stop offset="1" stopColor="#8f908b"/></linearGradient>
    </defs>
    <rect width="240" height="145" fill="url(#skyWash)"/>
    <circle cx="188" cy="29" r="18" fill="#ebe5d9" opacity=".72"/>
    <path d="M0 103c38-8 65-6 97-3 45 4 79-5 143-2v47H0Z" fill="url(#waterWash)"/>
    <g fill="#6e706b">
      <rect x="10" y="70" width="15" height="31" rx="1"/><rect x="29" y="62" width="27" height="40" rx="1"/>
      <rect x="60" y="80" width="19" height="23" rx="1"/><rect x="85" y="58" width="22" height="46" rx="1"/>
      <rect x="112" y="43" width="29" height="62" rx="1"/><rect x="146" y="54" width="17" height="52" rx="1"/>
      <rect x="168" y="72" width="20" height="35" rx="1"/><rect x="193" y="58" width="27" height="50" rx="1"/><rect x="223" y="76" width="12" height="33" rx="1"/>
    </g>
    <g stroke="#b4b0a7" strokeWidth="1" opacity=".78"><path d="M0 113h240M0 123h240M0 134h240"/><path d="M23 105v13M51 104v14M96 104v14M132 104v15M183 106v13M216 106v14"/></g>
    <path d="M7 31c35 14 70-4 101 7 34 12 63 2 122-9" fill="none" stroke="#c0bbb1" strokeWidth="2" opacity=".78"/>
  </svg>;
}
