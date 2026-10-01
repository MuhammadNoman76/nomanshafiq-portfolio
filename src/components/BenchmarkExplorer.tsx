'use client';

import { useState } from 'react';
import { externalSuites, formatMetric, jevResults, localModels, metricInfo, modelColors, modelNames, signedPoints, suiteNames, type Metric, type PromptLanguage } from '@/data/jev-urdu';

function PromptControl({ value, onChange, prefix }: { value: PromptLanguage; onChange: (value: PromptLanguage) => void; prefix: string }) {
  return <fieldset className="benchmark-control"><legend>Question &amp; option language</legend><div className="benchmark-segment">{(['Urdu', 'English'] as const).map(language => <button key={language} type="button" aria-pressed={value === language} onClick={() => onChange(language)} aria-label={`${prefix}: ${language} prompts`}>{language} prompts</button>)}</div></fieldset>;
}

function Bar({ label, value, formatted, color, max }: { label: string; value: number; formatted: string; color: string; max: number }) {
  return <div className="benchmark-bar"><span className="benchmark-bar-label">{label}</span><div className="benchmark-bar-track" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, value / max * 100))}%`, backgroundColor: color }} /></div><strong>{formatted}</strong></div>;
}

export function FullSuiteExplorer() {
  const [prompt, setPrompt] = useState<PromptLanguage>('Urdu');
  const [metric, setMetric] = useState<Metric>('accuracy');
  const [visible, setVisible] = useState<string[]>([...localModels]);
  const rows = jevResults.metrics.filter(row => row.prompt === prompt && (externalSuites as readonly string[]).includes(row.benchmark));
  const max = metric === 'log_loss' ? Math.max(1, Math.ceil(Math.max(...rows.map(row => row[metric] ?? 0)))) : 1;
  const toggleModel = (model: string) => setVisible(current => current.includes(model) ? current.filter(item => item !== model) : [...current, model]);
  return <div className="benchmark-explorer" aria-label="Independent full-suite benchmark explorer">
    <div className="benchmark-topline"><span className="benchmark-kicker">EXPLORER 01 / FULL SUITES</span><a href="/benchmarks/jev-urdu-metrics.csv" download>Download metrics CSV <span aria-hidden="true">↗</span></a></div>
    <div className="benchmark-controls"><PromptControl value={prompt} onChange={setPrompt} prefix="Full-suite explorer"/><fieldset className="benchmark-control"><legend>Measure</legend><div className="benchmark-segment">{(Object.keys(metricInfo) as Metric[]).map(key => <button type="button" key={key} aria-pressed={metric === key} onClick={() => setMetric(key)}>{metricInfo[key].label}</button>)}</div></fieldset></div>
    <p className="benchmark-help">{metricInfo[metric].explanation} Prompt language changes the questions and options; passages stay Urdu or Roman Urdu.</p>
    <fieldset className="benchmark-models"><legend>Show models</legend>{localModels.map(model => <button type="button" aria-pressed={visible.includes(model)} key={model} onClick={() => toggleModel(model)}><span style={{ backgroundColor: modelColors[model] }} aria-hidden="true"/>{modelNames[model]}</button>)}</fieldset>
    <p className="benchmark-scale" role="status" aria-live="polite">{prompt} prompts · {metricInfo[metric].label} · {metricInfo[metric].lowerBetter ? 'Lower is better ↓' : 'Higher is better ↑'} · common scale 0–{metric === 'accuracy' ? '100%' : max}</p>
    {visible.length === 0 ? <p className="benchmark-empty">Choose a model above to display its results. The complete figures remain in the download.</p> : <div className="benchmark-groups">{externalSuites.map(suite => {
      const suiteRows = rows.filter(row => row.benchmark === suite);
      const delta = jevResults.deltas.find(row => row.benchmark === suite && row.prompt === prompt && row['jev-urdu minus'] === 'laya-multilingual');
      return <section className="benchmark-group" key={suite} aria-label={suiteNames[suite]}><div className="benchmark-group-heading"><h4>{suiteNames[suite]}</h4><span>{suiteRows[0].decisions.toLocaleString('en-US')} decisions</span></div>{localModels.filter(model => visible.includes(model)).map(model => {
        const row = suiteRows.find(item => item.model === model)!;
        const value = row[metric];
        return value === null ? <p key={model}>{modelNames[model]}: measure not reported.</p> : <Bar key={model} label={modelNames[model]} value={value} formatted={formatMetric(value, metric)} color={modelColors[model]} max={max}/>;
      })}{delta && <p className={`benchmark-delta ${delta['accuracy Δ'] < 0 ? 'benchmark-delta-negative' : ''}`}>Accuracy change vs Laya multilingual: <strong>{signedPoints(delta['accuracy Δ'])} pp</strong><span>95% paired interval {signedPoints(delta['95% CI low'])} to {signedPoints(delta['95% CI high'])} pp{delta.significant === 'no' ? ' · includes zero' : ''}</span></p>}</section>;
    })}</div>}
    <details className="benchmark-data-table"><summary>Read the figures as a table</summary><div className="benchmark-table-scroll"><table><caption>Independent full-suite results · {prompt} prompts · {metricInfo[metric].label}</caption><thead><tr><th scope="col">Benchmark</th><th scope="col">Model</th><th scope="col">Decisions</th><th scope="col">{metricInfo[metric].label}</th></tr></thead><tbody>{rows.filter(row => visible.includes(row.model)).map(row => <tr key={`${row.benchmark}-${row.model}`}><th scope="row">{suiteNames[row.benchmark]}</th><td>{modelNames[row.model]}</td><td>{row.decisions.toLocaleString('en-US')}</td><td>{formatMetric(row[metric], metric)}</td></tr>)}</tbody></table></div></details>
    <details className="benchmark-data-table"><summary>All paired accuracy comparisons and intervals</summary><div className="benchmark-table-scroll"><table><caption>Jev-Urdu minus each local comparison model · {prompt} prompts · percentage points</caption><thead><tr><th scope="col">Benchmark</th><th scope="col">Comparison model</th><th scope="col">Change</th><th scope="col">95% paired interval</th></tr></thead><tbody>{jevResults.deltas.filter(row => row.prompt === prompt && (externalSuites as readonly string[]).includes(row.benchmark)).map(row => <tr key={`${row.benchmark}-${row['jev-urdu minus']}`}><th scope="row">{suiteNames[row.benchmark]}</th><td>{modelNames[row['jev-urdu minus']]}</td><td>{signedPoints(row['accuracy Δ'])} pp</td><td>{signedPoints(row['95% CI low'])} to {signedPoints(row['95% CI high'])} pp</td></tr>)}</tbody></table></div></details>
    <noscript><p className="benchmark-help">This static view shows all models with Urdu prompts. Enable JavaScript to change the language, measure, or visible models.</p></noscript>
  </div>;
}

export function MatchedSampleExplorer() {
  const [prompt, setPrompt] = useState<PromptLanguage>('Urdu');
  const [suite, setSuite] = useState<string>('XNLI-ur');
  const chosenPrompt = suite === 'Laya-Urdu test' ? 'Urdu' : prompt;
  const row = jevResults.headToHead.find(item => item.benchmark === suite && item.prompt === chosenPrompt)!;
  const delta = jevResults.headToHeadDeltas.find(item => item.benchmark === suite && item.prompt === chosenPrompt)!;
  const models = ['jev-urdu', 'jev (TypeSafe)', 'laya-multilingual', 'laya (routed)', 'laya (English)', 'majority class'];
  return <div className="benchmark-explorer benchmark-matched" aria-label="Matched API sample comparison">
    <div className="benchmark-topline"><span className="benchmark-kicker">EXPLORER 02 / MATCHED SAMPLES</span><span>ACCURACY · HIGHER IS BETTER</span></div>
    <div className="benchmark-controls"><PromptControl value={prompt} onChange={setPrompt} prefix="Matched-sample explorer"/><label className="benchmark-select">Benchmark<select value={suite} onChange={event => setSuite(event.target.value)}>{[...externalSuites, 'Laya-Urdu test'].map(item => <option key={item} value={item}>{suiteNames[item]}{item === 'Laya-Urdu test' ? ' (internal)' : ''}</option>)}</select></label></div>
    <p className="benchmark-help">{suite === 'Laya-Urdu test' ? 'Internal only: 100 source inputs, 232 decisions, Urdu prompts. Changing the prompt control applies when you select an external suite.' : '100 identical items per external suite and prompt condition. These small-sample scores are separate from the full-suite results above.'} TypeSafe Jev 1.13 was accessed through its API.</p>
    <div className="benchmark-group-heading"><h4>{suiteNames[suite]}</h4><span>{chosenPrompt} prompts · {row.decisions} decisions</span></div>
    <div className="benchmark-matched-bars" role="status" aria-live="polite">{models.map(model => <Bar key={model} label={modelNames[model]} value={row.scores[model as keyof typeof row.scores]} formatted={`${(row.scores[model as keyof typeof row.scores] * 100).toFixed(1)}%`} color={modelColors[model]} max={1}/>)}</div>
    <p className={`benchmark-delta ${delta.delta < 0 ? 'benchmark-delta-negative' : ''}`}>Jev-Urdu minus TypeSafe Jev: <strong>{signedPoints(delta.delta)} pp</strong><span>95% paired interval {signedPoints(delta.low)} to {signedPoints(delta.high)} pp{!delta.significant ? ' · includes zero' : ''}</span></p>
    <details className="benchmark-data-table"><summary>Read matched scores and every API comparison</summary><div className="benchmark-table-scroll"><table><caption>Matched sample accuracy · {chosenPrompt} prompts · {suiteNames[suite]} · reported to three decimals</caption><thead><tr><th scope="col">Model</th><th scope="col">Decisions</th><th scope="col">Accuracy</th></tr></thead><tbody>{models.map(model => <tr key={model}><th scope="row">{modelNames[model]}</th><td>{row.decisions}</td><td>{(row.scores[model as keyof typeof row.scores]).toFixed(3)}</td></tr>)}</tbody></table><table><caption>Jev-Urdu minus TypeSafe Jev · all {prompt}-prompt samples</caption><thead><tr><th scope="col">Benchmark</th><th scope="col">Change</th><th scope="col">95% paired interval</th></tr></thead><tbody>{jevResults.headToHeadDeltas.filter(item => item.prompt === prompt).map(item => <tr key={item.benchmark}><th scope="row">{suiteNames[item.benchmark]}</th><td>{signedPoints(item.delta)} pp</td><td>{signedPoints(item.low)} to {signedPoints(item.high)} pp</td></tr>)}</tbody></table></div></details>
    <noscript><p className="benchmark-help">This static view shows the matched Urdu-prompt XNLI sample. Enable JavaScript to explore the other conditions.</p></noscript>
  </div>;
}
