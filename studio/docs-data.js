/**
 * OPERO Editorial Product & Technical Documentation Data.
 * Expanded narrative prose, clean hairline tables, semantic icon keys, and
 * 1 to 1.5 week delivery plan covering Planning, Design, Development, Integration, and Testing.
 */
(function (global) {
  'use strict';

  const CHAPTERS = [
    {
      id: 'ch-overview',
      category: 'features',
      icon: 'lightbulb',
      number: '01',
      title: 'Concept Overview & Why OPERO Exists',
      lead: 'Turning ordinary desktop work into accurate, evidence-backed operation manuals without manual screenshots or cloud exposure.',
      paragraphs: [
        'At Man Machine Interface Inc. (MMI), internal operation manuals explain how employees operate enterprise software, back-office portals, and internal engineering tools. Producing a single manual today requires repetitive manual effort: an author must walk through every screen step by step, pause to capture screenshots at the exact right moment, draw arrows and callout boxes by hand, and write consistent procedural instructions in multiple languages. Whenever the underlying software updates, large portions of that manual become outdated and must be recreated.',
        'OPERO eliminates this bottleneck with a single promise: operate your computer normally, and the application quietly builds a structured, editable manual behind the scenes. While cloud tools demonstrate that automated screen-capture guide generation is practical, external SaaS platforms upload screenshots containing customer records, personal data, and confidential workflows to third-party servers. OPERO is architected from day one as a local-first desktop system that runs capture, OCR, AI drafting, translation, and export strictly inside MMI’s local environment.',
        'Rather than acting as a passive screen recorder or an autonomous bot that clicks buttons on your behalf, OPERO serves as an evidence-driven documentation system. Every drafted step remains permanently linked to the timestamped interaction events and screenshots that prove it happened, and every AI-generated instruction remains in draft status until a human author reviews and approves it.'
      ],
      subsections: [
        {
          icon: 'anchor',
          title: 'Core Product Promise & Six Architectural Principles',
          body: 'OPERO enforces six engineering rules: (1) Evidence always comes before generated prose—raw screenshots, event metadata, and extracted UI labels remain the immutable source of truth. (2) Processing is local-first by default with zero mandatory cloud AI dependency. (3) Human approval is required before publication because AI output is a draft, not an authoritative procedure. (4) Capture stays completely independent of AI inference so recording never fails if a local model is stopped or unavailable. (5) Privacy is built in via explicit user-initiated recording, visible indicators, pause controls, and application exclusions. (6) Complexity scales progressively, proving the 1 to 1.5 week desktop MVP before adding shared team workspaces.'
        }
      ],
    },
    {
      id: 'ch-features',
      category: 'features',
      icon: 'cube',
      number: '02',
      title: 'Listed Features & Release Boundaries',
      lead: 'Tightly bounded Release 1 MVP capabilities engineered for a 1 to 1.5 week delivery cycle, paired with clear post-MVP expansions.',
      paragraphs: [
        'To guarantee high reliability inside a focused 1 to 1.5 week build window, MMI separates OPERO capabilities into required Release 1 desktop functions and follow-on Release 2/3 team extensions. Release 1 (OPERO Desktop) proves the complete local vertical slice: capturing a real MMI workflow, generating an illustrated manual in English, Japanese, or Filipino, refining it in OPERO Studio, and exporting offline to PDF or Word.',
        'Required core capabilities deliver immediate daily value: Automatic Capture records user-authorized clicks, window switches, and deduplicated screenshots without manual hotkeys; AI Step Drafting transforms grouped interactions into clear, consistently structured procedural steps; Editable Annotations place adjustable numbers, arrows, boxes, blur masks, crops, labels, and spotlights directly over screenshots; and First-Class Multilingual Support models English, Japanese, and Filipino variants natively from the initial SQLite schema.',
        'Follow-on capabilities—including shared team collaboration, reviewer approval routing, role-based access control, automated workflow change detection, and optional voice narration packs—are intentionally decoupled from the 1 to 1.5 week core sprint so Release 1 ships lean, deterministic, and thoroughly tested.'
      ],
      tables: [
        {
          caption: 'Feature Scope & Release Classification',
          headers: ['Feature Area', 'Functional Behavior', 'Delivery Scope'],
          rowIcons: ['camera', 'bot', 'feather', 'earth', 'bookmark', 'building'],
          rows: [
            ['Automatic Capture', 'Explicit start, pause, resume, and stop controls with time-linked screenshots and event metadata.', 'Required — Release 1 (1–1.5 Week Sprint)'],
            ['AI Step Drafting', 'Generates step titles, descriptions, prerequisites, and warnings strictly from recorded evidence.', 'Required — Release 1 (1–1.5 Week Sprint)'],
            ['Editable Annotations', 'Non-destructive numbers, arrows, boxes, studio blurs, crops, labels, and spotlight overlays.', 'Required — Release 1 (1–1.5 Week Sprint)'],
            ['Multilingual Manuals', 'Native English, Japanese, and Filipino variants with protected UI labels and glossary checking.', 'Required — Release 1 (1–1.5 Week Sprint)'],
            ['Templates & Local History', 'Standardized guide templates, local restore points, and revision snapshots.', 'Baseline in Release 1; Shared in Release 2'],
            ['Workspace & Intelligence', 'Multi-user team editing, approval routing, RBAC, and automated workflow diffing.', 'Post-MVP — Release 2 / Release 3'],
          ],
        },
      ],
    },
    {
      id: 'ch-design',
      category: 'design',
      icon: 'palette',
      number: '03',
      title: 'Design Concepts, Color System & Mascot UX',
      lead: 'A minimal White-Primary, Light Blue Secondary, and Black Accent interface with Cupertino Liquid Glass reserved for floating controls.',
      paragraphs: [
        'OPERO uses a restrained, typography-led visual language inspired by minimal Cupertino software and clean print manuals. The palette follows a strict three-color hierarchy: Pure White (#FFFFFF) anchors the primary canvas so manual steps and screenshots remain effortless to read; Light Blue (#69BCFC with soft #F4F9FF and #EBF6FF washes) defines secondary sidebars, subtle borders, and Pero the mascot; and Crisp Black (#0F172A) establishes high-contrast primary actions, headings, focus rings, and active timeline indicators.',
        'Translucent Liquid Glass surfaces (frosted white translucency with backdrop blur and a 1px top specular highlight) are reserved strictly for floating chrome such as the top navigation bar, floating Capture HUD, contextual tool palettes, and popovers. The center document editing canvas stays solid white so step prose and screenshot callouts remain sharp, backed by a one-click Solid Surface Fallback for accessibility and lower-powered graphics hardware.',
        'Typography pairs Plus Jakarta Sans for display headings, Inter and Noto Sans JP for unified Latin, Filipino diacritic, and Japanese Kanji/Kana prose, and JetBrains Mono with tabular numerals for timestamps and coordinate telemetry. Pero, MMI’s penguin companion, appears exclusively in onboarding, empty states, floating capture indicators, and processing progress—never inside dense editing panes—and honors reduced-motion preferences.'
      ],
      subsections: [
        {
          icon: 'eye',
          title: 'Seven Explicit User Experience States',
          body: 'System status is always communicated with paired text, semantic icons, and color—never color alone: Ready displays project and privacy exclusions; Recording keeps a persistent floating HUD with live timer, Pause, and Stop; Paused halts capture immediately; Processing displays OCR, grouping, and LLM progress with safe cancellation; Needs Review highlights uncertain AI steps for verification; Verified Draft confirms human inspection; and Exported confirms the saved artifact path while preserving the editable project.'
        }
      ],
      references: [
        {
          title: 'Reference 01 — 3-Pane Capture, Local Model Router & Export Workspace',
          src: './references/ref-voxt-workspace.jpg',
          caption: 'Informs OPERO’s calm white-first 3-pane workspace: left session navigation, center live capture & structured summary canvas, and right inspector for local Ollama model routing, Whisper ASR controls, and one-click export.',
        },
        {
          title: 'Reference 02 — Split Document Canvas & Contextual AI Actions',
          src: './references/ref-askyourpdf-workspace.jpg',
          caption: 'Informs OPERO Studio’s high-contrast document reading canvas with floating contextual actions (Explain, Summarize, Rewrite), clean zoom/page controls, and side-by-side AI verification.',
        },
      ],
    },
    {
      id: 'ch-functions',
      category: 'pipeline',
      icon: 'windmill',
      number: '04',
      title: 'Core Functions & Nine-Stage Processing Pipeline',
      lead: 'Separating deterministic capture and event reconstruction from schema-constrained local AI drafting.',
      paragraphs: [
        'A foundational insight from Opero_Research.pdf is never to make a single large language model responsible for observing the screen, deciding what happened, translating content, and formatting the final manual in one pass. Instead, OPERO routes every recording through nine modular, independently testable stages where deterministic rules always execute before probabilistic AI.',
        'During Capture and Enrichment, native OS adapters record clicks, window transitions, and non-sensitive interaction metadata while capturing screenshots only on meaningful state changes, using perceptual hashing to skip duplicate frames. OS Accessibility APIs and PaddleOCR extract exact button labels and bounding coordinates. Next, deterministic Reconstruction groups low-level clicks (such as filling three form fields and clicking Save) into coherent candidate steps while retaining every raw event reference.',
        'Only after this structured evidence bundle is assembled does the local LLM Generation stage draft step titles and explanations. Authors then review prose and adjust annotations in OPERO Studio’s three-pane workspace. Optional Translation applies approved glossaries across English, Japanese, and Filipino, Quality Gates verify citations and protected UI labels, optional Narration renders voice tracks, and Export compiles final PDF, DOCX, HTML, or Markdown files.'
      ],
      tables: [
        {
          caption: 'The Nine Processing Stages from Desktop Action to Published Manual',
          headers: ['Stage', 'Input', 'Output & Primary Responsibility'],
          rowIcons: ['camera', 'flashlight', 'puzzle-piece', 'bot', 'feather', 'globe', 'saved', 'headphones', 'send'],
          rows: [
            ['1. Capture', 'User-authorized PC activity', 'Timestamped interaction metadata and deduplicated screenshots via Rust OS adapters.'],
            ['2. Enrichment', 'Raw screenshots & events', 'Extracted UI labels, text blocks, and control bounds via PaddleOCR and OS Accessibility APIs.'],
            ['3. Reconstruction', 'Normalized events & labels', 'Human-meaningful candidate steps grouped deterministically by time gaps, window switches, and commits.'],
            ['4. Generation', 'Evidence-backed step bundles', 'Structured source-language manual draft citing exact event and screenshot IDs.'],
            ['5. Review (Studio)', 'Draft steps & overlays', 'Human verification of prose, ordering, reversible studio blur, and 7 annotation types.'],
            ['6. Translation', 'Approved source segments', 'Segmented English, Japanese, and Filipino variants constrained by MMI glossaries.'],
            ['7. Quality Gates', 'Source & target segments', 'Automated validation of glossary adherence, preserved UI labels, numbers, and citations.'],
            ['8. Narration (Opt-in)', 'Verified manual text', 'Optional local audio tracks and timing metadata generated by isolated TTS engines.'],
            ['9. Export', 'Verified manual variant', 'Print-ready PDF (Typst), editable DOCX, accessible HTML, or Markdown with irreversible redaction.'],
          ],
        },
      ],
    },
    {
      id: 'ch-compatibility',
      category: 'compatibility',
      icon: 'laptop',
      number: '05',
      title: 'Use Cases, User Roles & System Compatibility',
      lead: 'Built for employees, manual authors, reviewers, and IT administrators across Windows, macOS, and Linux hardware tiers.',
      paragraphs: [
        'OPERO supports four organizational roles: the Employee or Recorder who executes routine workflows and discards accidental personal frames before processing; the Manual Author who refines step wording, splits or merges steps, positions annotations, and manages translations; the Reviewer or Approver who validates procedural accuracy before transitioning a manual from Draft to Approved; and the IT Administrator who distributes signed installers, approved local models, and mandatory privacy exclusion lists.',
        'To remain dependable across MMI’s mixed workstation fleet, OPERO abstracts screen capture and accessibility inspection behind native Rust OS adapters rather than fragile browser-only extensions. Because office PCs vary in RAM and GPU availability, the pipeline adapts dynamically by hardware tier so standard 8 GB laptops run smoothly with an OCR-first flow while 16 GB, 32 GB, and GPU-equipped systems unlock larger quantized models.'
      ],
      tables: [
        {
          caption: 'Operating System Capture & Hardware Compatibility Matrix',
          headers: ['Platform / Tier', 'Native Technology / Strategy', 'Compatibility & Engineering Notes'],
          rowIcons: ['briefcase', 'laptop', 'building', 'leaf', 'flash', 'rocket'],
          rows: [
            ['Windows 10 / 11', 'Windows Graphics Capture + UI Automation (UIA)', 'Supports mixed-DPI multi-monitor layouts, window exclusion, and Win32/browser UIA trees.'],
            ['macOS (Apple Silicon / Intel)', 'ScreenCaptureKit + Accessibility API (AX)', 'Uses explicit OS Screen Recording and Accessibility permissions; handles Retina 2x scaling.'],
            ['Linux (Ubuntu / Enterprise)', 'PipeWire via xdg-desktop-portal + AT-SPI', 'Supports Wayland compositors through portal permissions and standard desktop packaging.'],
            ['8 GB RAM PCs', 'OCR-first + deterministic templates / 1.5B–3B model', 'Vision-language inference stays disabled by default to prevent memory thrashing.'],
            ['16 GB RAM PCs', 'PaddleOCR + 3B–4B quantized LLM (Qwen3 / Gemma 3)', 'Recommended baseline; benchmarks combined Tauri app and model peak RSS together.'],
            ['32 GB RAM & GPU', '7B–8B quantized LLM + optional VLM & Metal/CUDA', 'Enables on-demand vision fallback for unlabelled controls and accelerated batch processing.'],
          ],
        },
      ],
    },
    {
      id: 'ch-local-ai',
      category: 'ai',
      icon: 'bot',
      number: '06',
      title: 'Local AI LLM, Vision-Language & OCR Architecture',
      lead: 'Specialized open-weight model roles behind an interchangeable runtime interface with strict anti-hallucination guardrails.',
      paragraphs: [
        'Rather than binding OPERO to a single vendor, all local inference executes behind a provider abstraction supporting Ollama and llama.cpp. Every approved model is registered in the local Model Manager with its exact revision, quantization, disk footprint, supported languages, and license terms, enabling offline import and instant rollback without code changes.',
        'OPERO assigns bounded responsibilities to five specialized roles: the Step Writer (quantized Qwen3 or Gemma 3) turns verified event groups into concise procedural steps; the Context Summarizer drafts workflow overviews and prerequisites; the Translator converts segmented blocks using protected terminology; the Vision-Language Helper (Qwen2.5-VL or Gemma 3 Vision) runs only when Accessibility metadata and PaddleOCR cannot identify a control; and optional Embeddings (BGE-small or multilingual-e5) augment SQLite FTS5 for cross-manual search.',
        'Strict guardrails block hallucinations and prompt injection: models cannot invent button labels or claim form submissions succeeded without visible UI confirmation; every drafted step must cite source events and screenshots or raise a review flag; and all captured OCR text and window titles are isolated as untrusted data delimiters so on-screen text can never override system instructions.'
      ],
      tables: [
        {
          caption: 'Local AI & OCR Candidate Models',
          headers: ['Subsystem Role', 'Primary Candidates', 'Selection & Verification Focus'],
          rowIcons: ['glasses', 'bot', 'eye', 'map'],
          rows: [
            ['Multilingual OCR', 'PaddleOCR (PP-OCRv6) with Tesseract fallback', 'Recognizes 100+ languages including mixed Japanese Kanji/Kana and Latin/Filipino UI labels.'],
            ['Instruction LLM', 'Qwen3 (Apache-2.0) & Gemma 3 (3B–8B quantized)', 'High multilingual instruction fidelity; benchmarked on MMI Japanese and Filipino manuals.'],
            ['Vision-Language Fallback', 'Qwen2.5-VL / Gemma 3 Vision (optional)', 'Invoked strictly on ambiguous controls when OCR and Accessibility APIs lack labels.'],
            ['Local Retrieval', 'SQLite FTS5 + BGE-small / multilingual-e5', 'Deterministic keyword search works offline immediately; embeddings add semantic recall.'],
          ],
        },
      ],
    },
    {
      id: 'ch-techstack',
      category: 'stack',
      icon: 'globe',
      number: '07',
      title: 'Technology Stack & First-Class Multilingual Design',
      lead: 'A lightweight Tauri 2 + Rust + React desktop architecture paired with native English, Japanese, and Filipino data modeling.',
      paragraphs: [
        'OPERO pairs Tauri 2 and Rust for the native shell and capture subsystem with React and TypeScript for the Studio UI. Rust handles low-overhead screen capture, event queuing, image cropping, perceptual hashing, irreversible pixel redaction, and SQLite persistence. On the frontend, Tailwind CSS tokens implement the White, Light Blue, and Black design system, Zustand manages local editor state, and TipTap stores manuals as structured blocks rather than fragile raw HTML.',
        'For distribution, Typst renders fast, deterministic offline PDFs with full CJK and Filipino glyph embedding, complemented by DOCX export for teams needing editable Word deliverables and HTML/Markdown for internal portals. Search starts deterministically with SQLite FTS5, while SQLCipher provides optional encrypted local databases.',
        'Multilingual support is modeled natively at the schema level using canonical BCP-47 tags (en-US, ja-JP, fil-PH), tracking UI language, authoring language, target translation language, observed app UI language, and narration language independently. OPERO never silently equates Filipino (fil) with Tagalog (tl): menus always label Filipino explicitly and map internal model codes only at the adapter boundary after glossary validation.'
      ],
      tables: [
        {
          caption: 'Protected Multilingual Glossary Strategy (Sample Terms)',
          headers: ['Source Term', 'Japanese (ja-JP)', 'Filipino (fil-PH)', 'Localization Rule'],
          rowIcons: ['saved', 'home', 'send', 'camera'],
          rows: [
            ['Save', '保存', 'I-save / I-save ang', 'Use approved procedural phrasing while keeping exact on-screen UI button labels in quotes.'],
            ['Dashboard', 'ダッシュボード', 'Dashboard', 'Preserve the English UI label verbatim whenever target software displays English labels.'],
            ['Submit', '送信', 'Isumite', 'Translate as a clear imperative action verb in procedural instructions.'],
            ['Record', '記録', 'I-record / Itala', 'Disambiguate between recording a screen workflow session and logging a database record.'],
          ],
        },
      ],
    },
    {
      id: 'ch-speech',
      category: 'speech',
      icon: 'headphones',
      number: '08',
      title: 'Use of Speech Technologies: STT & TTS',
      lead: 'Opt-in local Whisper dictation and accessible text-to-speech narration isolated from core workflow capture.',
      paragraphs: [
        'Speech capabilities are optional extensions in OPERO, enabling employees to dictate spoken notes during capture or review, transcribe meeting action notes, and generate accessible audio narration for published guides. By architectural rule, speech is disabled and isolated by default: users who do not need voice features never grant microphone permissions and never download audio weights, keeping the 1 to 1.5 week Release 1 core build lightweight.',
        'For Speech-to-Text (STT), OPERO evaluates whisper.cpp (MIT-licensed native C/C++ runtime with low memory overhead) and faster-whisper (MIT-licensed CTranslate2 runtime for batch transcription). Both support English, Japanese, Filipino, and code-switching, subject to word-error-rate validation on realistic MMI audio.',
        'For Text-to-Speech (TTS), OPERO evaluates MeloTTS (MIT, English and Japanese), Piper (lightweight local CPU TTS), and VoiceStudio.sh as an isolated local voice workspace. Because MeloTTS does not list Filipino in its default language set, Filipino TTS is never promised without verification. Moreover, because VoiceStudio.sh and LibreTranslate carry AGPL-3.0 licenses, they remain isolated behind an optional local HTTP/MCP boundary rather than bundled into the OPERO binary. Voice cloning is strictly disabled by default.'
      ],
      tables: [
        {
          caption: 'Speech Integration Guardrails & Extension Phases',
          headers: ['Phase', 'Speech Capability', 'Privacy & Licensing Guardrail'],
          rowIcons: ['lock', 'headset', 'megaphone', 'music-note-2'],
          rows: [
            ['Release 1 Core (1–1.5 Wks)', 'Zero mandatory speech weights', 'Core capture, OCR, AI drafting, Studio editing, and PDF/DOCX export run 100% without audio models.'],
            ['Extension V1 — Voice Notes', 'Opt-in STT dictation (whisper.cpp / faster-whisper)', 'Explicit mic trigger, persistent active indicator, and editable transcript verification.'],
            ['Extension V2 — Read-Aloud', 'Accessible TTS playback (MeloTTS / Piper)', 'Human verification of technical acronyms and Japanese/Filipino pronunciation.'],
            ['Extension V3 — Narration', 'Training audio & isolated VoiceStudio API', 'Zero default voice cloning; written consent and AGPL-3.0 process isolation required.'],
          ],
        },
      ],
    },
    {
      id: 'ch-security',
      category: 'security',
      icon: 'lock',
      number: '09',
      title: 'Security, Privacy Controls & License Governance',
      lead: 'Defense-in-depth local privacy enforcement, irreversible export redaction, prompt-injection isolation, and strict asset licensing.',
      paragraphs: [
        'Running offline eliminates third-party cloud exposure, yet local databases, screenshot folders, temporary caches, model weights, and exported manuals still require rigorous safeguards. OPERO enforces explicit user-initiated recording consent, configurable excluded applications (such as password managers, payroll portals, and private messaging tools), zero default capture of raw typed passwords, and crash-safe atomic session writes.',
        'OPERO draws an unbreakable boundary between editing convenience and final publication safety: inside OPERO Studio, blur overlays remain non-destructive and reversible so authors can refine masked regions; during PDF, DOCX, HTML, or Markdown export, OpenCV/Rust pixel redaction permanently destroys underlying sensitive pixels before writing the output artifact.',
        'License governance audits four independent asset classes prior to MMI deployment: application source code, open-weight LLM/OCR models, optional voice models, and recorded company workflows. All captured screen text and window titles are wrapped as untrusted data delimiters to neutralize prompt-injection risks.'
      ],
      tables: [
        {
          caption: 'Local Security, Privacy & Licensing Verification Matrix',
          headers: ['Control Area', 'Enforced Policy', 'Acceptance Check'],
          rowIcons: ['key', 'eye', 'handshake'],
          rows: [
            ['Capture Consent & Exclusions', 'Explicit start/stop HUD, visible REC indicator, excluded app list, and zero raw password capture.', 'Excluded windows emit zero frames and zero keystroke secrets in SQLite.'],
            ['Reversible vs. Final Redaction', 'Studio blur stays editable internally; export burns irreversible pixel blocks into PDF/DOCX.', 'Extracted PDF/image layers contain zero recoverable redacted pixel data.'],
            ['Prompt-Injection & Licenses', 'OCR/UI text isolated as untrusted data; AGPL-3.0 tools isolated behind optional local boundaries.', 'Schema validator rejects ungrounded outputs; 4-class license manifest verified.'],
          ],
        },
      ],
    },
    {
      id: 'ch-delivery-timeline',
      category: 'timeline',
      icon: 'calendar',
      number: '10',
      title: '1 to 1.5 Week Project Timeline & Delivery Lifecycle',
      lead: 'A focused 5–8 working-day execution plan spanning Planning, Design, Development, Integration, and Testing.',
      paragraphs: [
        'OPERO Release 1 is scoped for rapid, disciplined delivery in 1 to 1.5 weeks (5 to 8 working days). Rather than sprawling multi-month milestones, the team locks a crisp MVP vertical slice in Day 1, finalizes the minimal White/Light-Blue/Black design system and UI layouts by Day 2, executes parallel Rust capture + AI pipeline + Studio frontend development across Days 2–5, completes end-to-end integration on Days 6–7, and closes with rigorous testing and MMI pilot acceptance on Days 7–8.',
        'This compressed timeline succeeds because deterministic engineering precedes AI complexity: native capture, deduplication, SQLite storage, and Studio editing are built to function independently first, then connected cleanly to PaddleOCR, quantized local LLMs, and Typst PDF/DOCX export. Post-MVP capabilities such as shared team collaboration and optional speech narration packs are scheduled cleanly as follow-on iterations after Release 1 passes acceptance.'
      ],
      subsections: [
        {
          icon: 'map',
          title: '1. Planning (Week 1, Day 1)',
          body: 'Lock Release 1 MVP scope boundaries, freeze the 12 core SQLite entities and BCP-47 (en-US, ja-JP, fil-PH) ContentVariant schema, confirm OS Screen Recording / Accessibility permission flows across Windows, macOS, and Linux, establish 8 GB / 16 GB / 32 GB hardware baselines, and verify open-weight model licenses (Apache-2.0 / MIT) and privacy exclusion defaults.'
        },
        {
          icon: 'palette',
          title: '2. Design (Week 1, Days 1–2)',
          body: 'Finalize the White-Primary (#FFFFFF), Light Blue (#69BCFC), and Black (#0F172A) design tokens, Cupertino Liquid Glass floating Capture HUD specifications, 3-pane OPERO Studio wireframes, 7 non-destructive annotation overlay controls, trilingual Google Fonts typography rules (Plus Jakarta Sans, Inter, Noto Sans JP, JetBrains Mono), and Pero mascot UX-state mappings.'
        },
        {
          icon: 'laptop',
          title: '3. Development (Week 1, Days 2–5)',
          body: 'Build core modules in parallel: Tauri 2 + Rust shell, native OS capture adapters with perceptual hashing and crash-safe atomic session storage, PaddleOCR + deterministic step grouping engine, schema-constrained Ollama/llama.cpp drafting & glossary translation adapters, and the React/TypeScript OPERO Studio editor with 7 annotation tools and Typst PDF/DOCX export.'
        },
        {
          icon: 'puzzle-piece',
          title: '4. Integration (Week 1.5, Days 6–7)',
          body: 'Wire all nine processing stages end-to-end (Capture → Enrichment → Reconstruction → Generation → Studio Review → Translation → QA → Export), connect live <PeroStateMascot /> UX transitions across recording, OCR, drafting, review, and export states, enforce protected UI-label glossary rules, and attach optional isolated extension hooks for future STT/TTS audio modules.'
        },
        {
          icon: 'saved',
          title: '5. Testing & Pilot Readiness (Week 1.5, Days 7–8)',
          body: 'Execute automated unit, schema-validation, and UI-token checks; verify capture-independent-of-AI resilience when Ollama/llama.cpp is stopped; audit irreversible export pixel redaction in generated PDFs/DOCX; run bilingual/trilingual (en-US, ja-JP, fil-PH) quality gates; profile combined app + model RSS memory on 8 GB and 16 GB machines; and complete live MMI pilot sign-off.'
        }
      ],
      tables: [
        {
          caption: '1 to 1.5 Week Project Delivery Schedule & Acceptance Gates',
          headers: ['Phase', 'Estimated Window', 'Core Deliverables', 'Exit Criteria'],
          rowIcons: ['map', 'palette', 'laptop', 'puzzle-piece', 'saved'],
          rows: [
            ['Planning', 'Week 1 · Day 1', 'MVP scope lock, SQLite + BCP-47 schema freeze, OS permission matrix, model/license checklist.', 'Signed-off schema, hardware tier targets, and exclusion defaults.'],
            ['Design', 'Week 1 · Days 1–2', '3-color theme tokens, Liquid Glass HUD, 3-pane Studio UI, 7 annotation specs, Pero state map.', 'Approved UI kit, responsive layouts, and WCAG 2.2 AA contrast verification.'],
            ['Development', 'Week 1 · Days 2–5', 'Rust capture & deduplication, PaddleOCR + grouping, LLM/MT adapters, Studio editor & Typst/DOCX export.', 'All core modules pass unit checks and function independently offline.'],
            ['Integration', 'Week 1.5 · Days 6–7', 'End-to-end 9-stage pipeline wiring, live Pero state bindings, glossary QA checks, speech hook isolation.', 'Single real workflow captures, drafts, translates, and exports cleanly.'],
            ['Testing', 'Week 1.5 · Days 7–8', 'Resilience tests (no-AI capture), irreversible redaction audit, EN/JA/FIL QA, 8 GB/16 GB RAM profiling.', 'Zero critical unsupported claims, verified redaction, and pilot sign-off.'],
          ],
        },
      ],
    },
  ];

  global.PeroDocsData = { CHAPTERS };
})(window);
