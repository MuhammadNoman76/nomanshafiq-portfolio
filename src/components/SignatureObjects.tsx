import type { CSSProperties } from "react";

type ObjectProps = { className?: string };

export function SignalCassette({ className = "" }: ObjectProps) {
  return (
    <div className={`signal-cassette tactile ${className}`} data-tilt aria-hidden="true">
      <span className="cassette-screw screw-a" /><span className="cassette-screw screw-b" />
      <div className="cassette-label"><b>LANG / VOICE</b><small>signal specimen 01</small></div>
      <div className="cassette-window"><i /><i /><span className="cassette-tape" /></div>
      <div className="cassette-wave" aria-hidden="true">
        {[12, 24, 38, 18, 48, 31, 42, 16, 29, 44, 20, 34].map((height, index) => (
          <i key={index} style={{ "--wave-h": `${height}px`, "--wave-delay": `${index * -0.08}s` } as CSSProperties} />
        ))}
      </div>
      <span className="cassette-code">VOICE → PRODUCT</span>
    </div>
  );
}

export function AgentBadge({ className = "" }: ObjectProps) {
  return (
    <div className={`agent-badge tactile ${className}`} data-tilt aria-hidden="true">
      <div className="badge-rim" />
      <div className="badge-orbit orbit-a" /><div className="badge-orbit orbit-b" />
      <span className="badge-node node-a" /><span className="badge-node node-b" /><span className="badge-node node-c" />
      <div className="badge-core"><b>AGENT</b><small>THINK · TOOL · ACT</small></div>
      <span className="badge-index">N/06</span>
    </div>
  );
}

export function AgentCoreObject() {
  return (
    <article className="lab-object lab-agent tactile" data-tilt>
      <div className="specimen-label"><span>SPECIMEN 01</span><b>Agent Core</b></div>
      <div className="agent-core-art" aria-hidden="true">
        <div className="agent-core-glow" />
        <div className="agent-core-ring ring-one" /><div className="agent-core-ring ring-two" />
        <svg viewBox="0 0 250 250" className="agent-network">
          <path d="M38 132 84 72 129 111 175 57 213 120 166 179 109 164 58 199Z" />
          <path d="M84 72 109 164M129 111 166 179M38 132 129 111M213 120 109 164" />
          <circle cx="38" cy="132" r="7"/><circle cx="84" cy="72" r="7"/><circle cx="129" cy="111" r="9"/>
          <circle cx="175" cy="57" r="6"/><circle cx="213" cy="120" r="7"/><circle cx="166" cy="179" r="7"/>
          <circle cx="109" cy="164" r="7"/><circle cx="58" cy="199" r="6"/>
        </svg>
        <div className="agent-core-center"><b>AGENT</b><span>reasoning online</span></div>
      </div>
      <p>Reason, call tools, remember context, and stay observable.</p>
    </article>
  );
}

export function VoiceCapsuleObject() {
  return (
    <article className="lab-object lab-voice tactile" data-tilt>
      <div className="specimen-label"><span>SPECIMEN 02</span><b>Voice Capsule</b></div>
      <div className="voice-capsule-art" aria-hidden="true">
        <span className="capsule-end end-left"/><span className="capsule-end end-right"/>
        <div className="capsule-glass">
          <div className="capsule-wave">
            {[18,30,52,24,66,38,57,21,44,61,28,50,35,20].map((height,index)=>(
              <i key={index} style={{"--capsule-h":`${height}px`,"--capsule-delay":`${index * -0.09}s`} as CSSProperties}/>
            ))}
          </div>
          <span>LANGVOICE / LIVE SIGNAL</span>
        </div>
      </div>
      <p>Turn model output into a voice that feels immediate and human.</p>
    </article>
  );
}

export function SystemsChipObject() {
  return (
    <article className="lab-object lab-chip tactile" data-tilt>
      <div className="specimen-label"><span>SPECIMEN 03</span><b>Systems Chip</b></div>
      <div className="systems-chip-art" aria-hidden="true">
        <div className="chip-traces traces-one"/><div className="chip-traces traces-two"/>
        <div className="chip-body"><span>NOMAN</span><b>AI / SYSTEMS</b><small>PY · TS · CLOUD</small></div>
        <i className="chip-led led-a"/><i className="chip-led led-b"/><i className="chip-led led-c"/>
      </div>
      <p>Product thinking on top. Reliable infrastructure underneath.</p>
    </article>
  );
}

export function KarachiPassObject() {
  return (
    <article className="lab-object lab-pass tactile" data-tilt>
      <div className="specimen-label"><span>SPECIMEN 04</span><b>Origin Pass</b></div>
      <div className="karachi-pass-art" aria-hidden="true">
        <div className="pass-corner">KHI</div>
        <div className="pass-urdu">کراچی</div>
        <div className="pass-skyline"><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="pass-copy"><b>KARACHI / PAKISTAN</b><span>BUILT HERE · SHIPPED EVERYWHERE</span></div>
        <div className="pass-stamp">06<br/><small>AI</small></div>
        <div className="pass-code">NOMAN—BUILD—SHIP—LEARN</div>
      </div>
      <p>A global engineering mindset, grounded in where I come from.</p>
    </article>
  );
}

export function ArtifactLab() {
  return (
    <section className="artifact-lab section-canvas" aria-labelledby="artifact-lab-title">
      <div className="artifact-lab-heading">
        <div>
          <p className="micro-kicker">THE BUILD LAB</p>
          <h2 id="artifact-lab-title">Not decoration.<br/><span>Artifacts of how I think.</span></h2>
        </div>
        <p>Every object represents a layer of the work: intelligent agents, expressive interfaces, dependable systems, and the human context behind all of it.</p>
      </div>
      <div className="artifact-stage">
        <div className="lab-grid" aria-hidden="true" />
        <span className="lab-coordinate coord-a">01 / REASON</span>
        <span className="lab-coordinate coord-b">02 / EXPRESS</span>
        <span className="lab-coordinate coord-c">03 / SHIP</span>
        <span className="lab-coordinate coord-d">04 / ORIGIN</span>
        <AgentCoreObject />
        <VoiceCapsuleObject />
        <SystemsChipObject />
        <KarachiPassObject />
        <div className="lab-signature" aria-hidden="true"><span>✳</span><b>build things<br/>worth remembering.</b></div>
      </div>
    </section>
  );
}
