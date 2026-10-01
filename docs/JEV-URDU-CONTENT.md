# Jev-Urdu launch content evidence

Published article: `/blog/jev-urdu-benchmarks/`. Evaluation date: 1 October 2026.

The local source of truth is the Jev folder's `benchmark/metrics.csv`, `benchmark/accuracy_deltas.csv`, `benchmark/URDU_BENCHMARK.md`, and `benchmark/decisions.jsonl.gz`. All 40 local accuracy rows were checked against argmax/gold decisions across 91,100 records, including the 601-decision unseen-template subset. Public aggregate fixtures in `public/benchmarks/` preserve exact local CSV metrics and reported three-decimal API comparison/timing values. Math and fixture regression checks are in `tests/jev-benchmarks.test.mjs`.

SHA-256 source fingerprints:

- `metrics.csv`: `24341D2EB8FF5B97F66E82B769D613B15405E141383D4C2C7B8049159104A610`
- `accuracy_deltas.csv`: `BAAC7F1787667546083DE1FB5E25847861E5BB66420499FC802C35FC4D60C650`
- `decisions.jsonl.gz`: `31CACE4982FE220D5C84139663A00ACAA1036D353B55E2EBDFF427764D281DA9`

The article leads with independent Urdu XNLI, includes negative MASSIVE and USC results, and makes the Roman Urdu accuracy/F1/calibration tradeoff explicit. MASSIVE uses the 18-class scenario/domain task (`mteb/amazon_massive_scenario`), not the 60-class intent task. All local models are present in the full-suite explorer. Confidence intervals are paired, with 2,000 bootstrap resamples, and are about accuracy changes on the evaluated decisions.

The English-prompt condition changes question/options language, not passage language. Public multilingual positioning is therefore scoped to a multilingual foundation and the evaluated Urdu, Roman Urdu, and internal mixed-script workflows; broader languages remain a roadmap. Internal template-based results are separate and are never presented as independent or broad real-world accuracy. Mixed-script internal conditions comprise 317 decisions, Roman Urdu 133, and Urdu script 301.

The TypeSafe Jev 1.13 API comparison uses 100 identical items per external suite/prompt and 100 internal inputs/232 decisions. It has a separate explorer and must never be mixed with complete-suite accuracy. TypeSafe's Jev is unaffiliated. Tesla T4 throughput is local batch inference at batch size 64 over 22,775 decisions per model; no single-request or API speed claim is made.

Jev-Urdu is Muhammad Noman's Urdu fine-tuning, task interfaces, and engineering work based on Convai Innovations' multilingual Laya checkpoint and JHU-CLSP mmBERT-base, not pretraining from scratch. The public Hub API was verified during this work as public, language tag `ur`, and relation `finetune`. The Python quick start is taken from the notebook and verified against published `jev_urdu.py`; it shows no fabricated output. Exported probabilities are overconfident on independent tasks and are not promoted as production trust thresholds.

Original artwork was generated with the built-in imagegen tool, then optimized into `public/art/jev-urdu-cover.webp` and a 1200×630 social image `jev-urdu-social.jpg`. Prompt: editorial landscape cover with connected silver sculptural ribbon/bidirectional paths on cool-grey studio paper, cobalt-blue and restrained orange spheres, soft shadows, satin aluminium, premium tactile engineering aesthetic, negative space for actual typography; no text, numeric charts, logos, watermarks, people, or neon. Charts are live HTML graphics driven by the aggregate JSON, not numbers invented by image generation.

The LinkedIn introduction is a reviewable local draft in `docs/launch/jev-urdu-linkedin.md`; it is not automatically posted.
