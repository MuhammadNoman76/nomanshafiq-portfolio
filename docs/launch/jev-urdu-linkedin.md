# Jev-Urdu LinkedIn launch post

Suggested attachment: `public/art/jev-urdu-social.jpg`.

---


Introducing Jev-Urdu — my Urdu-first decision model, using the multilingual mmBERT-base encoder.

Urdu in real products rarely comes in one form. People write in Urdu script, Roman Urdu, and a mix of Urdu and English. I wanted to build for that reality.

Jev-Urdu turns text and typed questions into structured answers: support triage, sentiment, claim checking, consent, instruction boundaries, and tool-result verification. It is a decision model for application workflows.

I developed the Urdu specialization and task interface around mmBERT-base and a decision head, then benchmarked the model against the Laya variants and TypeSafe's separate Jev API. Starting weights came from the multilingual checkpoint in Convai Innovations' Laya repository.

A few results from my recorded benchmark run:

• 59.0% accuracy on Urdu XNLI, compared with 46.1% for the multilingual Laya baseline — a 12.9 percentage-point gain across 5,010 decisions.
• 47.2% accuracy on Roman Urdu sentiment with Urdu questions, compared with 44.0% for that baseline.
• 279 decisions per second in batch inference on a Tesla T4, close to the multilingual baseline's throughput.

The full results include the tradeoffs. Domain classification and Roman Urdu sentiment quality still need work, and confidence calibration is a priority. English-question runs test prompt compatibility on Urdu text; wider language quality remains to be evaluated.

This is one more step in my work on Urdu language technology through LughaatNLP: an Urdu-first model with a multilingual foundation, measured openly and built for developers.

Explore the benchmarks and interactive charts:
https://www.nomanshafiq.com/blog/jev-urdu-benchmarks/

Model and Python quick start:
https://huggingface.co/muhammadnoman76/jev-urdu

If you are building Urdu or multilingual AI workflows, I would love to hear where structured decisions could help.

#JevUrdu #UrduNLP #MultilingualAI #OpenSource #MachineLearning


---

Editorial checks: figures are from the saved 1 October 2026 run, not a new inference run. The full-suite XNLI result is distinct from the matched 100-item API comparison. “Multilingual foundation” describes the model's lineage and intended direction; no quality claim is made for untested languages. Jev-Urdu is not affiliated with TypeSafe's Jev API. The post has been prepared for copying; it has not been posted to LinkedIn.
