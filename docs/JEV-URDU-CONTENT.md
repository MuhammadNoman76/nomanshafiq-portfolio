# Jev-Urdu launch content evidence

Published article: `/blog/jev-urdu-benchmarks/`. Evaluation date: 1 October 2026.

The local source of truth is the Jev folder's `benchmark/metrics.csv`, `benchmark/accuracy_deltas.csv`, `benchmark/URDU_BENCHMARK.md`, and `benchmark/decisions.jsonl.gz`. The 32 published local accuracy rows were checked against saved argmax/gold decisions, including the 601-decision unseen-template subset. The website publishes a selected set of benchmarks from the recorded run. Public aggregate fixtures in `public/benchmarks/` preserve exact local CSV metrics and reported three-decimal API comparison/timing values. Math and fixture regression checks are in `tests/jev-benchmarks.test.mjs`.

SHA-256 source fingerprints:

- `metrics.csv`: `24341D2EB8FF5B97F66E82B769D613B15405E141383D4C2C7B8049159104A610`
- `accuracy_deltas.csv`: `BAAC7F1787667546083DE1FB5E25847861E5BB66420499FC802C35FC4D60C650`
- `decisions.jsonl.gz`: `31CACE4982FE220D5C84139663A00ACAA1036D353B55E2EBDFF427764D281DA9`

The article leads with independent Urdu XNLI, includes the negative MASSIVE result, and makes the Roman Urdu accuracy/F1/calibration tradeoff explicit. MASSIVE uses the 18-class scenario/domain task (`mteb/amazon_massive_scenario`), not the 60-class intent task. All local models are present in the full-suite explorer. Confidence intervals are paired, with 2,000 bootstrap resamples, and are about accuracy changes on the evaluated decisions.

The English-prompt condition changes question/options language, not passage language. Public multilingual positioning is therefore scoped to a multilingual foundation and the evaluated Urdu, Roman Urdu, and internal mixed-script workflows; broader languages remain a roadmap. Internal template-based results are separate and are never presented as independent or broad real-world accuracy. Mixed-script internal conditions comprise 317 decisions, Roman Urdu 133, and Urdu script 301.

The TypeSafe Jev 1.13 API comparison uses 100 identical items per external suite/prompt and 100 internal inputs/232 decisions. It has a separate explorer and must never be mixed with complete-suite accuracy. TypeSafe's Jev is unaffiliated. Tesla T4 throughput is local batch inference at batch size 64 over 22,775 decisions per model; no single-request or API speed claim is made.

Jev-Urdu uses the JHU-CLSP mmBERT-base encoder with a decision head. Muhammad Noman's work covers Urdu fine-tuning, task interfaces, and engineering. The notebook starts from `convaiinnovations/laya`, subfolder `multilingual`; this identifies the starting weights rather than the encoder architecture. The public Hub API was verified during this work as public, language tag `ur`, and relation `finetune`. The Python quick start uses the published jev-urdu 0.1.0 PyPI package, checked against its wheel and the current packages/jev-urdu API; it shows no fabricated output. The wheel SHA-256 was verified against PyPI metadata: 57c15d95b795493d3a2f38499db4a3aaa0a8585527ebb1903b91ba809b36b413. Library release guidance is distinct from the previously recorded model benchmark and throughput figures. Exported probabilities are overconfident on independent tasks and are not promoted as production trust thresholds.

Model sizes were verified against public Hugging Face file metadata and safetensors headers: Jev-Urdu and Laya multilingual each contain approximately 321.9 million parameters, with 643,835,514-byte FP16 weight files. Laya English contains approximately 421.3 million parameters, with an 842,609,210-byte weight file. The routed benchmark selects between these checkpoints; their combined disk size is 1,486,444,724 bytes. Decimal MB/GB exclude tokenizers and runtime memory. TypeSafe's official model reference does not disclose Jev 1.13's parameter count or downloadable weights. Public aggregate JSON keeps encoder and starting-checkpoint identifiers in separate fields.

Original artwork was generated with the built-in imagegen tool, then optimized into `public/art/jev-urdu-cover.webp` and a 1200×630 social image `jev-urdu-social.jpg`. Prompt: editorial landscape cover with connected silver sculptural ribbon/bidirectional paths on cool-grey studio paper, cobalt-blue and restrained orange spheres, soft shadows, satin aluminium, premium tactile engineering aesthetic, negative space for actual typography; no text, numeric charts, logos, watermarks, people, or neon. Charts are live HTML graphics driven by the aggregate JSON, not numbers invented by image generation.

The LinkedIn introduction is a reviewable local draft in `docs/launch/jev-urdu-linkedin.md`; it is not automatically posted.
