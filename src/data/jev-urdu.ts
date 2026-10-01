import results from '../../public/benchmarks/jev-urdu-results.json';

export type PromptLanguage = 'Urdu' | 'English';
export type Metric = 'accuracy' | 'macro_f1' | 'ece' | 'log_loss';
export const metricInfo: Record<Metric, { label: string; lowerBetter: boolean; percent: boolean; explanation: string }> = {
  accuracy: { label: 'Accuracy', lowerBetter: false, percent: true, explanation: 'The share of decisions that match the reference answer. Higher is better.' },
  macro_f1: { label: 'Macro F1', lowerBetter: false, percent: false, explanation: 'F1 averaged equally across classes, so smaller classes count too. Higher is better.' },
  ece: { label: 'Calibration error', lowerBetter: true, percent: false, explanation: 'Expected calibration error: how far confidence drifts from observed accuracy. Lower is better.' },
  log_loss: { label: 'Log loss', lowerBetter: true, percent: false, explanation: 'A penalty for wrong probabilities, especially confident mistakes. Lower is better.' },
};
export const localModels = ['jev-urdu', 'laya-multilingual', 'laya (routed)', 'laya (English)'] as const;
export const modelNames: Record<string, string> = {
  'jev-urdu': 'Jev-Urdu', 'laya-multilingual': 'Laya multilingual', 'laya (routed)': 'Laya routed',
  'laya (English)': 'Laya English', 'jev (TypeSafe)': 'TypeSafe Jev 1.13', 'majority class': 'Majority baseline',
};
export const modelColors: Record<string, string> = {
  'jev-urdu': '#2448df', 'laya-multilingual': '#586067', 'laya (routed)': '#8a694f',
  'laya (English)': '#38434e', 'jev (TypeSafe)': '#b94424', 'majority class': '#6c7176',
};
export const externalSuites = ['XNLI-ur', 'MASSIVE ur-PK', 'Roman-Urdu sentiment'] as const;
export const suiteNames: Record<string, string> = {
  'XNLI-ur': 'XNLI · Urdu inference', 'MASSIVE ur-PK': 'MASSIVE · Urdu domains',
  'Roman-Urdu sentiment': 'Roman Urdu · sentiment', 'Laya-Urdu test': 'Internal workflow suite',
};
export const jevResults = results;
export function formatMetric(value: number | null, metric: Metric): string {
  if (value === null) return 'Not reported';
  return metricInfo[metric].percent ? `${(value * 100).toFixed(1)}%` : value.toFixed(3);
}
export function signedPoints(value: number): string { return `${value >= 0 ? '+' : '−'}${Math.abs(value * 100).toFixed(1)}`; }
export const jevArticle = {
  title: 'Jev-Urdu: Urdu-first AI, measured in decisions.',
  description: 'My Urdu-first decision model, using a multilingual mmBERT-base encoder. Explore real Urdu benchmarks, paired comparisons, batch throughput, and the tradeoffs behind the release.',
  path: '/blog/jev-urdu-benchmarks/',
  modelUrl: 'https://huggingface.co/muhammadnoman76/jev-urdu',
  date: '2026-10-01',
};
