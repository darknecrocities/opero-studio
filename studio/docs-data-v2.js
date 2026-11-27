/**
 * OPERO v1.0 Shipped Architecture, ERD, Pero Agent, Meeting Notes & Release Documentation.
 * Extends window.PeroDocsData.CHAPTERS with current v1.0 modules and 7 interactive SVG diagrams.
 */
(function (global) {
  'use strict';

  const V2_CHAPTERS = [
    {
      id: 'ch-architecture-erd',
      category: 'diagrams',
      icon: 'building',
      number: '11',
      title: 'System Architecture & SQLite WAL Entity-Relationship Diagram',
      lead: 'A complete four-tier local-first desktop architecture backed by a 12-table SQLite WAL database with zero external database daemons.',
      paragraphs: [
        'OPERO runs entirely on the user’s workstation using a Tauri 2 native shell paired with a React 19 + TypeScript workspace and an embedded Rust loopback daemon (opero-daemon on 127.0.0.1:4317). Separating the UI from the Rust core guarantees that capture, OS-level audio recording, SQLite WAL persistence, Dual-Core Vector RAG, and offline document export continue cleanly even if the frontend window reloads or the local LLM runtime is stopped.',
        'All persistent state lives inside a single local SQLite WAL file (opero.sqlite3) under the operating system’s Application Support directory. Relational tables for projects, sessions, events, screenshots, manuals, analyzed documents, meeting notes, and agent threads sit directly alongside FTS5 full-text indexes and 384-dimensional int8 quantized vectors—eliminating external vector servers and keeping resident memory under 8 MB.'
      ],
      diagrams: ['sys-architecture', 'erd-sqlite'],
      tables: [
        {
          caption: 'Core SQLite WAL Storage Tables & Responsibilities',
          headers: ['Table Group', 'Tables Included', 'Primary Responsibility'],
          rowIcons: ['camera', 'docs', 'headphones', 'bot', 'bookmark'],
          rows: [
            ['Workflow Capture', 'projects, recording_sessions, captured_events, screenshots', 'Immutable evidence trail linking every manual step to timestamped actions and deduplicated frames.'],
            ['Manuals & Analyzer', 'manuals, analyzed_documents', 'Trilingual (en-US, ja-JP, fil-PH) SOPs, 7 MMI templates, and Box/Arrow/Crop document reports.'],
            ['Meeting Notes', 'meeting_notes', 'OS-level audio paths, bilingual timestamped transcripts, executive summaries, decisions, and action items.'],
            ['Pero Agent Chat', 'agent_threads, agent_messages', 'Multi-turn local LLM chat history, executed tool traces, grounded citations, and deep-link actions.'],
            ['Dual-Core Vector RAG', 'memory_chunks, memory_chunks_fts, memory_vectors', 'Core 1 Episodic edits/meetings + Core 2 Semantic pinned MMI public knowledge & glossary (< 8 MB RAM).'],
          ],
        },
      ],
    },
    {
      id: 'ch-pero-agent-rag',
      category: 'ai',
      icon: 'bot',
      number: '12',
      title: 'Live Multi-Turn Pero Agent, Hardware-Aware Models & Dual-Core RAG',
      lead: 'An autonomous local-first chatbot powered by isolated Ollama (/api/chat), smart intent gating, 6 grounded tools, and trilingual MMI public knowledge.',
      paragraphs: [
        'Pero Agent (⌘5) is a real multi-turn conversational assistant connected directly to OPERO’s local tools and SQLite Dual-Core Vector RAG. A smart greeting and intent gate ensures casual messages such as "hello" or "こんにちは" receive natural, conversational replies from the active local LLM without dumping raw memory blocks. When a user asks factual, corporate, document, meeting, or workflow questions, Pero executes grounded local tools and attaches a collapsible Actions Taken trace.',
        'To prevent external-drive or environment conflicts, OPERO’s runtime manager (ollama_runtime.rs) launches local Ollama on 127.0.0.1:11434 using an isolated HOME and OLLAMA_MODELS directory inside OPERO’s own data folder. Hardware detection (hardware.rs) inspects CPU, total RAM, and GPU tier to recommend the ideal local model—from Qwen3 Compact (qwen3:1.7b, 8 GB+) and Qwen3 Balanced (qwen3:4b) to Gemma 3 Vision (gemma3:4b) and Qwen3 Deep (qwen3:8b)—with a Built-In Offline engine always available.',
        'Core 2 Semantic Memory is pre-seeded idempotently with verified public corporate knowledge for Man Machine Interface, Inc. (https://www.mmi-sc.co.jp/) in English, Japanese, and Filipino—including company history, Hachioji Head Office, Kojimachi Office, Representative Director Tetsuya Sekiguchi, Managing Director Hiroshi Yamanaka, and Executive Officers—strictly excluding internal or private data.'
      ],
      diagrams: ['agent-rag-flow'],
      tables: [
        {
          caption: 'Release 1 ISMS-Approved Local Model Catalog (HP ProBook 450 G8 Baseline)',
          headers: ['Display Name', 'Model Tag', 'Measured RAM', 'Release 1 Role & Strength'],
          rowIcons: ['laptop', 'sparkles', 'lock'],
          rows: [
            ['Qwen2.5 3B (Standard)', 'qwen2.5:3b', '1.94 GB (2.54 GB total)', 'Release 1 Standard for HP ProBook 450 G8 (16 GB CPU-only, <= 6 GB cap). Apache-2.0, 33.1 tok/s CPU-only, 90/100 SOP quality.'],
            ['Qwen3 1.7B (Lighter Fallback)', 'qwen3:1.7b', '1.13 GB (1.73 GB total)', 'Release 1 Lighter Fallback for 8 GB or constrained PCs. Apache-2.0, 52.2 tok/s CPU-only, 90/100 SOP quality.'],
            ['Built-In Offline', 'offline', '0 GB model RAM', 'Zero-download deterministic structural checks, glossary grounding, and offline export when Ollama is not provisioned.'],
          ],
        },
      ],
    },
    {
      id: 'ch-meetings-analyzer',
      category: 'pipeline',
      icon: 'headphones',
      number: '13',
      title: 'OS-Level Meeting Notes (⌘4) & Document Analyzer (⌘3)',
      lead: 'Cross-app OS audio recording with a dimmed Pero compiling overlay, paired with interactive PDF/Word Box, Arrow, and Crop analysis.',
      paragraphs: [
        'Meeting Notes (⌘4) enables users to record meetings happening in Zoom, Microsoft Teams, Google Meet, Slack, or any desktop application at the OS level. On macOS, OPERO compiles a native Swift helper (opero-audio-tap) built on AVAudioEngine and on-device SFSpeechRecognizer; on Windows, it targets WASAPI Loopback + microphone capture. Raw 16 kHz mono PCM WAV audio is persisted safely before inference begins ([ARCH-001]).',
        'When the user stops recording, OPERO smoothly dims the viewport and centers the animated Pero Mascot (PeroCompilingOverlay) through three transparent stages: transcribing OS audio, translating the script across English, Japanese, and Filipino, and compiling an Executive Summary, Key Decisions, and Owner Action Items. Compiled notes are automatically indexed into Dual-Core Vector RAG so Pero Agent can answer questions about past meetings, and can be exported to PDF, DOCX, HTML, or Markdown.',
        'Document Analyzer v2 (⌘3) ingests .pdf, .docx, .doc, .txt, and .md files locally via doc_parser.rs, automatically detects source language (Japanese ja-JP, English en-US, Filipino fil-PH) and auto-translates foreign content into the user’s target language via Local AI, and generates a comprehensive 8-section structured analysis report persisted in SQLite history. Users can place manual Box, Arrow, and Crop annotations with dynamic Local AI translations & explanations, download the full 8-section report directly as PDF, DOCX, HTML, or Markdown, and seamlessly query uploaded documents in Pero Agent (⌘5)—while deleting any document from Document Analyzer atomically purges all linked chunks, FTS5 entries, and vectors from Pero Agent memory.'
      ],
      diagrams: ['meeting-pipeline', 'analyzer-sequence'],
      tables: [
        {
          caption: 'Document Analyzer v2 — 8-Section Structured Report & RAG Lifecycle',
          headers: ['Section', 'Scope & Output', 'Persistence & Pero Agent RAG'],
          rowIcons: ['docs', 'globe', 'sparkles', 'rocket', 'lock', 'bookmark', 'cube', 'feather'],
          rows: [
            ['01 · Executive Overview', 'Document classification, word count, primary language, completeness score, SHA-256.', 'Saved in SQLite analyzed_documents + Core 1 RAG.'],
            ['02 · Auto-Translation', 'Detects Japanese/non-target text automatically; side-by-side original ↔ translated blocks + EN/JA/FIL switcher.', 'Translated blocks indexed in Pero Agent memory.'],
            ['03 · Key Findings', 'Concrete extracted facts, dates, metrics, and rules grounded in parsed blocks.', 'Queryable in Pero Agent (⌘5) with citations.'],
            ['04 · Action Items', 'Prioritized follow-up steps and recommended fixes derived from annotations.', 'Included in PDF/DOCX/HTML/MD downloads.'],
            ['05 · Risks & Compliance Gaps', 'Unfilled table cells, missing sign-offs, and policy warning notices.', 'Highlighted on canvas & summary report.'],
            ['06 · Protected Glossary', 'Domain acronyms and bilingual slash pairs preserved verbatim during translation.', 'Enforced across EN / polite JA / FIL outputs.'],
            ['07 · Structure Outline', 'Detected headings, tables, and block hierarchy map.', 'Powers instant block-level inspection.'],
            ['08 · Manual & AI Annotations', 'All Box, Arrow, and Crop regions with editable Local AI explanations & reasoning.', 'Re-synced to RAG on save; purged atomically on delete.'],
          ],
        },
      ],
    },
    {
      id: 'ch-security-cicd',
      category: 'security',
      icon: 'lock',
      number: '14',
      title: 'Zero-Cloud Security Boundaries, Resizable UI & CI/CD Governance',
      lead: 'Defense-in-depth local trust boundaries, fluid 280ms slide transitions, single-instance desktop installers, and 8-check GitHub Actions promotion.',
      paragraphs: [
        'Every piece of screen text, OCR output, uploaded document content, and meeting transcript is treated as untrusted input ([SEC-001]) and isolated with escaped delimiters before reaching any LLM prompt. Password managers (1Password, Keychain) and sensitive fields are filtered before disk write, loopback-only URL validation blocks SSRF against RFC 1918 and cloud metadata endpoints, and Studio visual blurs are strictly separated from irreversible pixel redaction in exported PDFs and PNGs.',
        'The desktop workspace shares onboarding’s unified warm white-and-light-grayish palette (--bg-canvas radial #FAF9F7 → #F2F1EE → #ECEBE7, --bg-surface #FAF9F7, --bg-subtle #EAE8E3, --border #DDDAD3) with Pero Sky Blue (#69BCFC) and Crisp Black (#0F172A) accents, draggable ResizeHandle splitters (persisted widths), smooth 280ms spring slide animations for sidebar collapse, warm Kokoro-82M neural EN/JA Pero onboarding voices, staggered Dashboard Quick Launch tiles, and live EN/JA/FIL localization across every screen.',
        'Every feature branch must pass 5 local CI parity gates (scripts/verify_ci_local.sh — 500-line ceiling across all files, Rust workspace tests, Python live daemon stress tests, TypeScript + 420 Vitest cases, and 4-viewport Playwright E2E) before opening a PR to develop (8 GitHub Actions checks), fast-forwarding to staging, and promoting to main for official macOS (.dmg) and Windows (.exe) releases.'
      ],
      diagrams: ['security-boundary', 'cicd-release'],
    },
  ];

  if (global.PeroDocsData && Array.isArray(global.PeroDocsData.CHAPTERS)) {
    global.PeroDocsData.CHAPTERS.push(...V2_CHAPTERS);
  }
})(window);
