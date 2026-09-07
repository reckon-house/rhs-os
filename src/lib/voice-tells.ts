/* ── THE SHAPES THAT READ AS WRITTEN ─────────────────────────────────
   One list, two readers. scripts/voice-lint.mjs runs it over every
   study's prose; the Ask route runs it over the model's answer before
   a visitor sees it. Neither can judge voice; what they can find is
   the tells, which are shapes: the flourish at the end of a sentence
   that makes it quotable, the balanced "not X, not Y", the triplet
   that closes a sentence, "the noun is the noun", the banned words,
   the dash. Each is a proxy for the rule in VOICE.md ("The grey
   half"): state what it is or why it was decided, and stop.

   A flag is a sentence to READ, or, in the route, to ask for again. */
export type Tell = { key: string; re: RegExp; label: string };

export const TELLS: Tell[] = [
  { key: "tail", label: "a flourish closes the sentence",
    re: /,\s*(?:none of (?:them|it) [^.]*|all of it [^.]*|on purpose|alike|for one|at once|and nothing (?:more|else)|and (?:then )?some|no less|and stays that way|and that is (?:that|all)|nothing else)[.!?]$/i },
  { key: "feels", label: "'that feels X' at the end", re: /\b(?:that|which) feels? \w+[.!?]$/i },
  { key: "not-not", label: "balanced 'not X, not Y'", re: /\bnot\b[^.]*?,\s*(?:and\s+)?not\b|^Not [^.]*\. Not /i },
  { key: "is-the", label: "'the noun is the noun'",
    re: /\bthe (\w+) is the \1\b|\bthe (\w+) (?:is|was) the (?!same|only|first|last|one)\w+\b[^.]*[.!?]$/i },
  { key: "triplet-close", label: "a triplet closes the sentence", re: /,\s*\w+,\s*(?:and\s+)?\w+[.!?]$/ },
  { key: "stack", label: "stacked adjectives", re: /\b(?:\w+ly )?\w+, \w+, and \w+ (?:\w+)[.!?]$/ },
  { key: "banned", label: "a banned word",
    re: /\b(?:seamless(?:ly)?|robust|innovative|cutting-edge|best-in-class|leverag(?:e|es|ed|ing)|elevat(?:e|es|ed|ing)|disrupt(?:s|ed|ing|ive)|journey|passion(?:ate)?|tapestry|craft(?:ed|ing)\s+(?:meaningful|experiences)|the result was)\b/i },
  { key: "surfaces-verb", label: "'surfaces' as a verb", re: /\b(?:it|this|that|which) surfaces\b/i },
  { key: "dash", label: "a dash", re: /—|–|\s-\s/ },
  { key: "quotable", label: "three short sentences in a row, the pull-quote rhythm",
    re: /^[A-Z][^,.]{3,40}\. [A-Z][^,.]{3,40}\. [A-Z][^,.]{3,40}\.$/ },
  /* the shapes the September pass took out of the studies, read back
     from its diffs: the verdict a sentence lands on its own fact, the
     "nothing... and nothing" pair, the appraisal, the never-tail */
  { key: "verdict", label: "a verdict on the fact just stated",
    re: /\b(?:which|that) is (?:what|why|the whole point|the point)\b|\bthe most \w+ thing\b|\bthe whole point\b/i },
  { key: "none-none", label: "balanced 'nothing... and nothing'",
    re: /\b(?:nothing|none|no one|never)\b[^.]*,?\s+and\s+(?:nothing|none|no one|never)\b/i },
  { key: "reads-as", label: "an appraisal in place of the thing", re: /\b(?:reads? as|comes? across as|feels? like it)\b/i },
  { key: "never-tail", label: "'and it never...' closing the sentence", re: /,\s*and (?:it|they|nothing) never \w+[^.]*[.!?]$/i },
  { key: "first-last", label: "'from the first X to the last Y'", re: /\bfrom the first \w+ to the last \w+/i },
];

/* prose into sentences; the source files carry literal \n, the model
   carries real ones, and both are a space here */
export const sentencesOf = (s: string): string[] =>
  s.replace(/\\n|\n/g, " ").split(/(?<=[.!?])\s+(?=[A-Z“"'])/).map((x) => x.trim()).filter((x) => x.length > 12);

export const tellsIn = (sentence: string): Tell[] => TELLS.filter((t) => t.re.test(sentence));

/* every sentence that trips, with what it tripped */
export const flag = (text: string): { sentence: string; why: Tell[] }[] =>
  sentencesOf(text).map((sentence) => ({ sentence, why: tellsIn(sentence) })).filter((x) => x.why.length);
