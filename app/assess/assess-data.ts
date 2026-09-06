/* Source-grounded data for the Assessor page. Framework facts follow the
   SAICA README; bank metadata mirrors src/data/bank.json (id, format,
   domain, level, difficulty only). */

export type Level = {
  n: number;
  persona: string;
  stage: string;
  agency: 'Consumer' | 'Director' | 'Builder';
  summary: string;
  behaviors: string[];
};

export const levels: Level[] = [
  {
    n: 1,
    persona: 'The Copy-Paster',
    stage: 'Novice',
    agency: 'Consumer',
    summary: 'Uses AI output with limited checking or adaptation.',
    behaviors: [
      'Accepts output at face value',
      'Cannot say why a prompt worked or failed',
      'No working sense of model limits',
    ],
  },
  {
    n: 2,
    persona: 'The Prompt Crafter',
    stage: 'Advanced beginner',
    agency: 'Director',
    summary: 'Prompts deliberately and improves results through iteration.',
    behaviors: [
      'Uses role, format, and few-shot patterns',
      'Recognizes common failure modes',
      'Repairs a failing prompt step by step',
    ],
  },
  {
    n: 3,
    persona: 'The Maker',
    stage: 'Competent',
    agency: 'Director',
    summary: 'Connects tools and critically evaluates multi-step work.',
    behaviors: [
      'Connects AI to external data or systems',
      'Designs multi-step workflows',
      'Knows where AI should not be trusted',
    ],
  },
  {
    n: 4,
    persona: 'The Engineer',
    stage: 'Proficient',
    agency: 'Builder',
    summary: 'Builds reliable workflows with safeguards and clear trade-offs.',
    behaviors: [
      'Ships production-adjacent workflows over APIs',
      'Adds safety checks and guardrails',
      'Weighs latency, cost, and reliability',
    ],
  },
  {
    n: 5,
    persona: 'The Orchestrator',
    stage: 'Expert',
    agency: 'Builder',
    summary: 'Designs, evaluates, and improves AI systems for others.',
    behaviors: [
      'Designs AI-powered tools for teams',
      'Writes evaluations of system behavior',
      'Sees systemic risk and architectural trade-offs',
    ],
  },
];

export type Domain = {
  key: string;
  name: string;
  short: string;
  bloom: string;
  assesses: string;
};

export const domains: Domain[] = [
  {
    key: 'Foundational concepts',
    name: 'Foundational concepts',
    short: 'Foundations',
    bloom: 'Remember / Understand',
    assesses:
      'How language models work, the parameters that change their behavior, and the core architectures behind them.',
  },
  {
    key: 'Prompting',
    name: 'Prompting',
    short: 'Prompting',
    bloom: 'Apply',
    assesses:
      'Few-shot examples, chain-of-thought, role prompting, and structured output formats, used on purpose.',
  },
  {
    key: 'Workflow design',
    name: 'Workflow design',
    short: 'Workflows',
    bloom: 'Analyze / Create',
    assesses:
      'Multi-step pipelines, human-in-the-loop patterns, tool chaining, and orchestration.',
  },
  {
    key: 'Ethics and risk',
    name: 'Ethics and risk',
    short: 'Ethics & risk',
    bloom: 'Evaluate',
    assesses:
      'Bias, privacy implications, responsible deployment decisions, and guardrail design.',
  },
  {
    key: 'Tool selection',
    name: 'Tool selection',
    short: 'Tool selection',
    bloom: 'Analyze / Evaluate',
    assesses:
      'Matching capabilities to tasks, the API versus fine-tuning versus retrieval trade-off, and model selection reasoning.',
  },
  {
    key: 'Output evaluation',
    name: 'Output evaluation',
    short: 'Evaluation',
    bloom: 'Analyze / Evaluate',
    assesses:
      'Detecting hallucinations, checking factual accuracy, and applying quality rubrics to generated content.',
  },
  {
    key: 'Metacognition',
    name: 'Metacognition',
    short: 'Metacognition',
    bloom: 'Metacognitive knowledge',
    assesses:
      'Tracking assumptions, calibrating confidence, and reflecting on your own AI-assisted reasoning.',
  },
];

/* Illustrative report shapes, one per mid-ladder persona. Not real data. */
export const profiles: { label: string; values: number[] }[] = [
  { label: 'A Prompt Crafter', values: [55, 70, 30, 45, 40, 35, 30] },
  { label: 'A Maker', values: [65, 75, 70, 55, 72, 60, 45] },
  { label: 'An Engineer', values: [80, 78, 88, 75, 85, 74, 62] },
];

export type Format = {
  key: string;
  name: string;
  kind: 'structured' | 'open';
  bloom: string;
  assesses: string;
  scoring: string;
};

export const formats: Format[] = [
  { key: 'MCQ', name: 'Multiple choice', kind: 'structured', bloom: 'Remember / Understand', assesses: 'Conceptual knowledge and definitional accuracy.', scoring: 'Exact match.' },
  { key: 'MultipleSelect', name: 'Multiple select', kind: 'structured', bloom: 'Understand', assesses: 'Knowledge where several propositions are true at once.', scoring: 'Partial credit: hits minus false positives.' },
  { key: 'Ranking', name: 'Ranking', kind: 'structured', bloom: 'Apply', assesses: 'Procedural understanding, where sequence matters.', scoring: 'Position-distance scoring.' },
  { key: 'Matching', name: 'Matching', kind: 'structured', bloom: 'Understand / Apply', assesses: 'Categorical associations and concept mapping.', scoring: 'Pair accuracy.' },
  { key: 'ScenarioJudgment', name: 'Scenario judgment', kind: 'structured', bloom: 'Evaluate', assesses: 'Workplace decisions under realistic constraints.', scoring: 'Exact match on the defensible choice.' },
  { key: 'PromptWriting', name: 'Prompt writing', kind: 'open', bloom: 'Apply / Create', assesses: 'Constructing an effective prompt for a task and context.', scoring: 'Rubric, AI-scored per dimension.' },
  { key: 'PromptCritique', name: 'Prompt critique', kind: 'open', bloom: 'Analyze / Evaluate', assesses: 'Diagnosing a weak prompt and articulating improvements.', scoring: 'Rubric, AI-scored per dimension.' },
  { key: 'OutputEvaluation', name: 'Output evaluation', kind: 'open', bloom: 'Analyze / Evaluate', assesses: 'Judging generated content for quality, accuracy, and fit.', scoring: 'Rubric, AI-scored per dimension.' },
  { key: 'ShortWritten', name: 'Short written', kind: 'open', bloom: 'Understand / Analyze', assesses: 'Explaining a concept in your own words.', scoring: 'Rubric, AI-scored per dimension.' },
  { key: 'WorkflowDesign', name: 'Workflow design', kind: 'open', bloom: 'Analyze / Create', assesses: 'Designing multi-step workflows with tool choices and human checkpoints.', scoring: 'Rubric, AI-scored per dimension.' },
  { key: 'BuildStepEvaluation', name: 'Build-step evaluation', kind: 'open', bloom: 'Evaluate / Create', assesses: 'Assessing an AI-assisted process and finding where it fails.', scoring: 'Rubric, AI-scored per dimension.' },
  { key: 'Reflection', name: 'Reflection', kind: 'open', bloom: 'Metacognitive', assesses: 'Awareness of your own reasoning and its limits.', scoring: 'Rubric, AI-scored per dimension.' },
];

export type BankItem = {
  id: string;
  type: string;
  domain: string;
  level: number;
  elo: number;
};

/* Metadata for every item in the bank. Question text is not included. */
export const bank: BankItem[] = [
  { id: 'q_mcq_01', type: 'MCQ', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_ms_01', type: 'MultipleSelect', domain: 'Prompting', level: 2, elo: 1000 },
  { id: 'q_rank_01', type: 'Ranking', domain: 'Workflow design', level: 2, elo: 1000 },
  { id: 'q_match_01', type: 'Matching', domain: 'Ethics and risk', level: 2, elo: 1000 },
  { id: 'q_sj_01', type: 'ScenarioJudgment', domain: 'Ethics and risk', level: 2, elo: 1000 },
  { id: 'q_pw_01', type: 'PromptWriting', domain: 'Prompting', level: 2, elo: 1000 },
  { id: 'q_pc_01', type: 'PromptCritique', domain: 'Prompting', level: 2, elo: 1000 },
  { id: 'q_oe_01', type: 'OutputEvaluation', domain: 'Output evaluation', level: 1, elo: 1000 },
  { id: 'q_sw_01', type: 'ShortWritten', domain: 'Foundational concepts', level: 1, elo: 1000 },
  { id: 'q_wd_01', type: 'WorkflowDesign', domain: 'Workflow design', level: 3, elo: 1200 },
  { id: 'q_bse_01', type: 'BuildStepEvaluation', domain: 'Tool selection', level: 4, elo: 1400 },
  { id: 'q_ref_01', type: 'Reflection', domain: 'Metacognition', level: 2, elo: 1000 },
  { id: 'q_mcq_02', type: 'MCQ', domain: 'Foundational concepts', level: 1, elo: 810 },
  { id: 'q_mcq_03', type: 'MCQ', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_mcq_04', type: 'MCQ', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_sj_02', type: 'ScenarioJudgment', domain: 'Tool selection', level: 1, elo: 700 },
  { id: 'q_mcq_05', type: 'MCQ', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_ms_02', type: 'MultipleSelect', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_match_02', type: 'Matching', domain: 'Prompting', level: 2, elo: 1000 },
  { id: 'q_sj_03', type: 'ScenarioJudgment', domain: 'Tool selection', level: 2, elo: 1000 },
  { id: 'q_mcq_06', type: 'MCQ', domain: 'Foundational concepts', level: 3, elo: 1200 },
  { id: 'q_mcq_07', type: 'MCQ', domain: 'Foundational concepts', level: 3, elo: 1200 },
  { id: 'q_mcq_08', type: 'MCQ', domain: 'Foundational concepts', level: 3, elo: 1200 },
  { id: 'q_sw_02', type: 'ShortWritten', domain: 'Foundational concepts', level: 3, elo: 1200 },
  { id: 'q_match_03', type: 'Matching', domain: 'Tool selection', level: 3, elo: 1200 },
  { id: 'q_wd_02', type: 'WorkflowDesign', domain: 'Workflow design', level: 3, elo: 1200 },
  { id: 'q_rank_02', type: 'Ranking', domain: 'Workflow design', level: 4, elo: 1400 },
  { id: 'q_mcq_09', type: 'MCQ', domain: 'Foundational concepts', level: 4, elo: 1400 },
  { id: 'q_mcq_10', type: 'MCQ', domain: 'Foundational concepts', level: 4, elo: 1400 },
  { id: 'q_sj_04', type: 'ScenarioJudgment', domain: 'Ethics and risk', level: 4, elo: 1400 },
  { id: 'q_sw_03', type: 'ShortWritten', domain: 'Tool selection', level: 4, elo: 1400 },
  { id: 'q_bse_02', type: 'BuildStepEvaluation', domain: 'Workflow design', level: 4, elo: 1400 },
  { id: 'q_mcq_11', type: 'MCQ', domain: 'Foundational concepts', level: 5, elo: 1600 },
  { id: 'q_mcq_12', type: 'MCQ', domain: 'Foundational concepts', level: 5, elo: 1600 },
  { id: 'q_ms_03', type: 'MultipleSelect', domain: 'Foundational concepts', level: 5, elo: 1600 },
  { id: 'q_wd_03', type: 'WorkflowDesign', domain: 'Workflow design', level: 5, elo: 1600 },
  { id: 'q_sj_05', type: 'ScenarioJudgment', domain: 'Ethics and risk', level: 5, elo: 1600 },
  { id: 'q_pw_02', type: 'PromptWriting', domain: 'Output evaluation', level: 5, elo: 1600 },
  { id: 'q_oe_02', type: 'OutputEvaluation', domain: 'Output evaluation', level: 5, elo: 1600 },
  { id: 'q_ref_02', type: 'Reflection', domain: 'Metacognition', level: 3, elo: 1200 },
  { id: 'q_pc_02', type: 'PromptCritique', domain: 'Prompting', level: 4, elo: 1400 },
  { id: 'q_mcq_13', type: 'MCQ', domain: 'Foundational concepts', level: 1, elo: 710 },
  { id: 'q_sj_06', type: 'ScenarioJudgment', domain: 'Prompting', level: 1, elo: 720 },
  { id: 'q_rank_03', type: 'Ranking', domain: 'Prompting', level: 1, elo: 730 },
  { id: 'q_oe_03', type: 'OutputEvaluation', domain: 'Output evaluation', level: 1, elo: 800 },
  { id: 'q_mcq_14', type: 'MCQ', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_sw_04', type: 'ShortWritten', domain: 'Prompting', level: 2, elo: 1000 },
  { id: 'q_sj_07', type: 'ScenarioJudgment', domain: 'Prompting', level: 2, elo: 1000 },
  { id: 'q_match_04', type: 'Matching', domain: 'Foundational concepts', level: 2, elo: 1000 },
  { id: 'q_mcq_15', type: 'MCQ', domain: 'Foundational concepts', level: 3, elo: 1200 },
  { id: 'q_sw_05', type: 'ShortWritten', domain: 'Tool selection', level: 3, elo: 1200 },
  { id: 'q_sj_08', type: 'ScenarioJudgment', domain: 'Tool selection', level: 3, elo: 1200 },
  { id: 'q_ref_03', type: 'Reflection', domain: 'Metacognition', level: 2, elo: 1000 },
  { id: 'q_ms_05', type: 'MultipleSelect', domain: 'Ethics and risk', level: 2, elo: 1000 },
  { id: 'q_pc_03', type: 'PromptCritique', domain: 'Output evaluation', level: 3, elo: 1200 },
  { id: 'q_rank_04', type: 'Ranking', domain: 'Ethics and risk', level: 3, elo: 1200 },
  { id: 'q_pw_03', type: 'PromptWriting', domain: 'Prompting', level: 3, elo: 1200 },
  { id: 'q_match_05', type: 'Matching', domain: 'Ethics and risk', level: 4, elo: 1400 },
  { id: 'q_ref_04', type: 'Reflection', domain: 'Metacognition', level: 4, elo: 1400 },
];

export const SESSION_LENGTH = 12;
export const START_RATING = 1000;
export const K_FACTOR = 32;
export const ELO_TOLERANCE = 50;

export function expectedScore(learner: number, question: number) {
  return 1 / (1 + Math.pow(10, (question - learner) / 400));
}

/* score is 0–100, as in the scoring pipeline. */
export function updateElo(learner: number, question: number, score: number) {
  return Math.round(learner + K_FACTOR * (score / 100 - expectedScore(learner, question)));
}

export function ratingToLevel(rating: number) {
  if (rating < 900) return 1;
  if (rating < 1100) return 2;
  if (rating < 1300) return 3;
  if (rating < 1500) return 4;
  return 5;
}

/* Sample items in five structured formats, five domains, rising difficulty. */
export type SampleQuestion =
  | { id: string; type: 'MultipleSelect'; domain: string; level: number; elo: number; question: string; options: string[]; correct: number[] }
  | { id: string; type: 'MCQ' | 'ScenarioJudgment'; domain: string; level: number; elo: number; question: string; options: string[]; correct: number }
  | { id: string; type: 'Matching'; domain: string; level: number; elo: number; question: string; pairs: { left: string; right: string }[] }
  | { id: string; type: 'Ranking'; domain: string; level: number; elo: number; question: string; options: string[]; correct: number[] };

export const sampleQuestions: SampleQuestion[] = [
  {
    id: 'q_ms_01',
    type: 'MultipleSelect',
    domain: 'Prompting',
    level: 2,
    elo: 1000,
    question:
      'Which of the following are valid techniques for improving prompt effectiveness? Select all that apply.',
    options: [
      'Providing few-shot examples of desired output',
      'Setting temperature to exactly 0.5 for all tasks',
      'Including explicit output format instructions',
      'Adding role/persona context to the system message',
      'Always using the longest possible prompt',
    ],
    correct: [0, 2, 3],
  },
  {
    id: 'q_mcq_06',
    type: 'MCQ',
    domain: 'Foundational concepts',
    level: 3,
    elo: 1200,
    question: 'What is a “context window” in the context of LLMs?',
    options: [
      'The user interface panel where you type your prompt',
      'The maximum amount of text (in tokens) the model can process in a single conversation',
      'A technique for focusing the model’s attention on a specific part of the input',
      'The time window during which an API session remains active',
    ],
    correct: 1,
  },
  {
    id: 'q_sj_08',
    type: 'ScenarioJudgment',
    domain: 'Tool selection',
    level: 3,
    elo: 1200,
    question:
      'You want to give your AI assistant access to your company’s Slack workspace so it can search past conversations and summarize project threads. What is the most appropriate approach?',
    options: [
      'Copy and paste relevant Slack messages into the AI chat as needed',
      'Export all of Slack to a text file and upload it as a knowledge base',
      'Set up an MCP connector that gives the AI scoped, read-only access to specific Slack channels with appropriate permissions',
      'Give the AI your personal Slack login credentials so it can browse freely',
    ],
    correct: 2,
  },
  {
    id: 'q_match_05',
    type: 'Matching',
    domain: 'Ethics and risk',
    level: 4,
    elo: 1400,
    question: 'Match each AI safety concept to its correct description.',
    pairs: [
      {
        left: 'Red-teaming',
        right:
          'Deliberately trying to make an AI system fail or produce harmful outputs to identify vulnerabilities',
      },
      {
        left: 'Guardrails',
        right: 'Rules or filters that constrain AI behavior to prevent undesirable outputs',
      },
      {
        left: 'Jailbreaking',
        right: 'Techniques that bypass an AI model’s safety restrictions through crafted prompts',
      },
      {
        left: 'Constitutional AI',
        right:
          'A training approach where the model is taught to follow a set of principles to self-correct harmful responses',
      },
    ],
  },
  {
    id: 'q_rank_02',
    type: 'Ranking',
    domain: 'Workflow design',
    level: 4,
    elo: 1400,
    question: 'Rank these steps for building a RAG-based Q&A system from first to last.',
    options: [
      'Collect and clean source documents',
      'Split documents into chunks and generate embeddings',
      'Store embeddings in a vector database',
      'At query time, retrieve relevant chunks and inject them into the prompt',
      'Generate a response and cite sources',
    ],
    correct: [0, 1, 2, 3, 4],
  },
];

export const formatName = (key: string) =>
  formats.find((f) => f.key === key)?.name ?? key;
