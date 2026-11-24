/**
 * OPERO Interactive Engineering Vector Diagrams (Core Set 1–4).
 * Zero-CDN crisp inline SVGs styled strictly in OPERO White (#FFFFFF),
 * Sky Blue (#69BCFC / #F4F9FF), and Black Accent (#0F172A).
 */
(function (global) {
  'use strict';

  const DEFS = `
    <defs>
      <marker id="op-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0F172A"/>
      </marker>
      <marker id="op-arr-sky" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2D8FED"/>
      </marker>
    </defs>
  `;

  function erdTable(x, y, w, name, cols) {
    const rowH = 19;
    const h = 30 + cols.length * rowH + 8;
    const rows = cols
      .map((c, idx) => {
        const cy = y + 44 + idx * rowH;
        const badge = c.k ? `<tspan fill="#2D8FED" font-weight="700">${c.k} </tspan>` : '';
        return `<text x="${x + 12}" y="${cy}" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">${badge}${c.n}</text>
                <text x="${x + w - 12}" y="${cy}" text-anchor="end" font-size="10" fill="#526071" font-family="JetBrains Mono, monospace">${c.t}</text>`;
      })
      .join('');
    return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.4"/>
        <rect x="${x}" y="${y}" width="${w}" height="28" rx="10" fill="#0F172A"/>
        <rect x="${x}" y="${y + 18}" width="${w}" height="10" fill="#0F172A"/>
        <text x="${x + 12}" y="${y + 18}" font-size="11.5" font-weight="700" fill="#FFFFFF" font-family="Plus Jakarta Sans, sans-serif">${name}</text>
        ${rows}
      </g>
    `;
  }

  const DIAGRAMS = {
    'erd-sqlite': {
      id: 'erd-sqlite',
      title: 'Entity-Relationship Diagram (SQLite WAL Schema)',
      caption: 'All 12 relational + FTS5/vector tables stored locally inside opero.sqlite3 (WAL mode, zero external database daemon).',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 640" width="1080" height="640" role="img" aria-label="OPERO SQLite Entity-Relationship Diagram">
          ${DEFS}
          <rect width="1080" height="640" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">OPERO Local-First SQLite WAL — Entity-Relationship Diagram (ERD)</text>
          <text x="24" y="50" font-size="11.5" fill="#526071" font-family="Inter, sans-serif">Primary Keys (PK) · Foreign Keys (FK) · Dual-Core Vector RAG + Meeting Notes + Pero Agent + Document Analyzer</text>

          ${erdTable(24, 72, 226, 'projects', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { n: 'title', t: 'TEXT' },
            { n: 'owner / dept', t: 'TEXT' },
            { n: 'default_locale', t: 'BCP-47' },
            { n: 'archived', t: 'INT' },
          ])}

          ${erdTable(296, 72, 238, 'recording_sessions', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { k: 'FK', n: 'project_id', t: 'projects' },
            { n: 'title / status', t: 'TEXT' },
            { n: 'capture_profile', t: 'TEXT' },
            { n: 'active_duration_ms', t: 'INT' },
          ])}

          ${erdTable(580, 72, 224, 'captured_events', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { k: 'FK', n: 'session_id', t: 'sessions' },
            { n: 'event_type', t: 'TEXT' },
            { n: 'app / target_label', t: 'TEXT' },
            { n: 'coords_x_y', t: 'INT' },
          ])}

          ${erdTable(840, 72, 216, 'screenshots', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { k: 'FK', n: 'session_id', t: 'sessions' },
            { n: 'relative_path', t: 'TEXT' },
            { n: 'sha256 / dhash', t: 'TEXT' },
            { n: 'redaction_state', t: 'TEXT' },
          ])}

          ${erdTable(24, 248, 226, 'manuals', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { k: 'FK', n: 'project_id', t: 'projects' },
            { n: 'template_id', t: 'TEXT' },
            { n: 'source_locale', t: 'BCP-47' },
            { n: 'steps_json', t: 'JSON' },
          ])}

          ${erdTable(296, 248, 238, 'analyzed_documents', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { n: 'filename / format', t: 'TEXT' },
            { n: 'sha256 / byte_size', t: 'TEXT' },
            { n: 'engine_used', t: 'TEXT' },
            { n: 'document_json', t: 'JSON' },
          ])}

          ${erdTable(580, 248, 224, 'meeting_notes', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { n: 'title / status', t: 'TEXT' },
            { n: 'audio_source / path', t: 'WAV' },
            { n: 'src -> target_loc', t: 'BCP-47' },
            { n: 'segments / actions', t: 'JSON' },
          ])}

          ${erdTable(840, 248, 216, 'user_profiles', [
            { k: 'PK', n: 'id', t: 'default' },
            { n: 'name / occupation', t: 'TEXT' },
            { n: 'personality', t: 'TEXT' },
            { n: 'default_locale', t: 'BCP-47' },
            { n: 'sound_enabled', t: 'INT' },
          ])}

          ${erdTable(24, 434, 246, 'agent_threads', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { n: 'title', t: 'TEXT' },
            { n: 'locale', t: 'BCP-47' },
            { n: 'updated_at', t: 'ISO-8601' },
          ])}

          ${erdTable(314, 434, 246, 'agent_messages', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { k: 'FK', n: 'thread_id', t: 'threads' },
            { n: 'role / content', t: 'TEXT' },
            { n: 'tool_calls_json', t: 'JSON' },
            { n: 'citations / link', t: 'JSON' },
          ])}

          ${erdTable(604, 434, 224, 'memory_chunks (+FTS5)', [
            { k: 'PK', n: 'id', t: 'TEXT' },
            { n: 'core_type', t: 'E | S' },
            { n: 'source_type / id', t: 'TEXT' },
            { n: 'locale / pinned', t: 'BCP-47' },
            { n: 'title / content', t: 'FTS5' },
          ])}

          ${erdTable(860, 434, 196, 'memory_vectors', [
            { k: 'PK', n: 'chunk_id', t: 'FK' },
            { n: 'quant_i8_vec', t: '384 B' },
            { n: 'scale / norm', t: 'REAL' },
            { n: 'model_id', t: 'TEXT' },
          ])}

          <path d="M 250 130 L 296 130" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr)"/>
          <text x="260" y="123" font-size="10" fill="#526071" font-family="JetBrains Mono, monospace">1:N</text>

          <path d="M 534 130 L 580 130" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr)"/>
          <text x="544" y="123" font-size="10" fill="#526071" font-family="JetBrains Mono, monospace">1:N</text>

          <path d="M 804 130 L 840 130" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr)"/>

          <path d="M 136 205 L 136 248" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr)"/>
          <text x="142" y="232" font-size="10" fill="#526071" font-family="JetBrains Mono, monospace">1:N</text>

          <path d="M 270 500 L 314 500" stroke="#2D8FED" stroke-width="1.6" marker-end="url(#op-arr-sky)"/>
          <text x="280" y="493" font-size="10" fill="#2D8FED" font-family="JetBrains Mono, monospace">1:N</text>

          <path d="M 828 500 L 860 500" stroke="#2D8FED" stroke-width="1.6" marker-end="url(#op-arr-sky)"/>
          <text x="833" y="493" font-size="10" fill="#2D8FED" font-family="JetBrains Mono, monospace">1:1</text>

          <path d="M 692 381 L 692 434" stroke="#2D8FED" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#op-arr-sky)"/>
          <text x="700" y="412" font-size="10" fill="#2D8FED" font-family="Inter, sans-serif">Auto-indexed to RAG</text>
        </svg>
      `,
    },

    'sys-architecture': {
      id: 'sys-architecture',
      title: 'High-Level System Architecture Diagram',
      caption: 'Four-tier local-first desktop architecture: React 19 UI, Tauri 2 Shell & Menu Bar Tray, Rust Loopback Daemon (127.0.0.1:4317), and Native OS / Local AI Engines.',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 540" width="1080" height="540" role="img" aria-label="OPERO System Architecture Diagram">
          ${DEFS}
          <rect width="1080" height="540" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">OPERO System Architecture — 100% Local-First Desktop Stack</text>

          <rect x="24" y="54" width="1032" height="114" rx="12" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="40" y="76" font-size="12" font-weight="800" fill="#2D8FED" font-family="Plus Jakarta Sans, sans-serif">LAYER 1 · PRESENTATION &amp; DESKTOP SHELL (React 19 + TypeScript + Tauri 2 + Zustand)</text>
          <rect x="40" y="90" width="150" height="60" rx="10" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="115" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Dashboard &amp; QuickBar</text>
          <text x="115" y="134" text-anchor="middle" font-size="10.5" fill="#526071">6 Tiles · Ask Pero · Tray</text>

          <rect x="206" y="90" width="156" height="60" rx="10" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="284" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Capture &amp; Studio</text>
          <text x="284" y="134" text-anchor="middle" font-size="10.5" fill="#526071">7 Annotations · Templates</text>

          <rect x="378" y="90" width="160" height="60" rx="10" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="458" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Document Analyzer</text>
          <text x="458" y="134" text-anchor="middle" font-size="10.5" fill="#526071">PDF/DOCX · Box/Arrow/Crop</text>

          <rect x="554" y="90" width="158" height="60" rx="10" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="633" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Meeting Notes (⌘4)</text>
          <text x="633" y="134" text-anchor="middle" font-size="10.5" fill="#526071">OS Audio · Pero Overlay</text>

          <rect x="728" y="90" width="150" height="60" rx="10" fill="#0F172A"/>
          <text x="803" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">Pero Agent (⌘5)</text>
          <text x="803" y="134" text-anchor="middle" font-size="10.5" fill="#69BCFC">Live Chat · PeroAvatar</text>

          <rect x="894" y="90" width="146" height="60" rx="10" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="967" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Dynamic i18n</text>
          <text x="967" y="134" text-anchor="middle" font-size="10.5" fill="#526071">en-US · ja-JP · fil-PH</text>

          <path d="M 540 168 L 540 202" stroke="#0F172A" stroke-width="2" marker-end="url(#op-arr)"/>
          <text x="554" y="190" font-size="11" fill="#526071" font-family="JetBrains Mono, monospace">Loopback HTTP JSON · 127.0.0.1:4317 (RFC 7807 Errors + 100KB/10MB Caps)</text>

          <rect x="24" y="204" width="1032" height="136" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.6"/>
          <text x="40" y="226" font-size="12" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">LAYER 2 · RUST EMBEDDED DAEMON &amp; CORE ENGINE (opero-daemon + opero-core + opero-export)</text>

          <rect x="40" y="242" width="184" height="80" rx="10" fill="#F8FBFF" stroke="#E2EAF2"/>
          <text x="132" y="266" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Capture &amp; Pipeline</text>
          <text x="132" y="284" text-anchor="middle" font-size="10.5" fill="#526071">dHash Dedup · Privacy Filter</text>
          <text x="132" y="302" text-anchor="middle" font-size="10.5" fill="#526071">Deterministic Grouping</text>

          <rect x="240" y="242" width="184" height="80" rx="10" fill="#F8FBFF" stroke="#E2EAF2"/>
          <text x="332" y="266" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Doc &amp; Meeting Engines</text>
          <text x="332" y="284" text-anchor="middle" font-size="10.5" fill="#526071">doc_parser · doc_analyzer</text>
          <text x="332" y="302" text-anchor="middle" font-size="10.5" fill="#526071">meeting_audio · compiler</text>

          <rect x="440" y="242" width="194" height="80" rx="10" fill="#EBF6FF" stroke="#69BCFC" stroke-width="1.4"/>
          <text x="537" y="266" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Agent &amp; Dual-Core RAG</text>
          <text x="537" y="284" text-anchor="middle" font-size="10.5" fill="#526071">6 Tools · Smart Intent Gate</text>
          <text x="537" y="302" text-anchor="middle" font-size="10.5" fill="#526071">FTS5 + 384d int8 RRF (&lt;8MB)</text>

          <rect x="650" y="242" width="184" height="80" rx="10" fill="#F8FBFF" stroke="#E2EAF2"/>
          <text x="742" y="266" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">Hardware &amp; Updater</text>
          <text x="742" y="284" text-anchor="middle" font-size="10.5" fill="#526071">CPU/RAM Tier · Ollama Mgmt</text>
          <text x="742" y="302" text-anchor="middle" font-size="10.5" fill="#526071">Official main SHA-256 Sync</text>

          <rect x="850" y="242" width="190" height="80" rx="10" fill="#F8FBFF" stroke="#E2EAF2"/>
          <text x="945" y="266" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">opero-export Writers</text>
          <text x="945" y="284" text-anchor="middle" font-size="10.5" fill="#526071">Offline PDF · DOCX · HTML · MD</text>
          <text x="945" y="302" text-anchor="middle" font-size="10.5" fill="#526071">Irreversible Pixel Redaction</text>

          <path d="M 220 340 L 220 384" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr)"/>
          <path d="M 540 340 L 540 384" stroke="#2D8FED" stroke-width="1.8" marker-end="url(#op-arr-sky)"/>
          <path d="M 860 340 L 860 384" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr)"/>

          <rect x="24" y="386" width="328" height="128" rx="12" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="42" y="410" font-size="12" font-weight="800" fill="#0F172A">NATIVE OS FFI &amp; AUDIO HELPERS</text>
          <text x="42" y="434" font-size="11" fill="#526071">• macOS: CoreGraphics, AXIsProcessTrusted</text>
          <text x="42" y="454" font-size="11" fill="#526071">• macOS: opero-audio-tap (AVAudioEngine + Speech)</text>
          <text x="42" y="474" font-size="11" fill="#526071">• Windows: GraphicsCaptureAccess · WASAPI</text>
          <text x="42" y="494" font-size="11" fill="#526071">• Single-Instance Lock + Spotlight-Safe DMG/NSIS</text>

          <rect x="376" y="386" width="328" height="128" rx="12" fill="#0F172A"/>
          <text x="394" y="410" font-size="12" font-weight="800" fill="#69BCFC">ISOLATED LOCAL AI RUNTIME (127.0.0.1:11434)</text>
          <text x="394" y="434" font-size="11" fill="#FFFFFF">• Qwen3 Compact (qwen3:1.7b) — Default 8 GB+</text>
          <text x="394" y="454" font-size="11" fill="#CBD5E1">• Qwen3 Balanced (4b) · Gemma 3 Vision (4b)</text>
          <text x="394" y="474" font-size="11" fill="#CBD5E1">• Qwen3 Deep (8b) · Built-In Offline Fallback</text>
          <text x="394" y="494" font-size="11" fill="#69BCFC">• Isolated OPERO HOME &amp; OLLAMA_MODELS Dir</text>

          <rect x="728" y="386" width="328" height="128" rx="12" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="746" y="410" font-size="12" font-weight="800" fill="#0F172A">LOCAL PERSISTENCE (SQLITE WAL + FILES)</text>
          <text x="746" y="434" font-size="11" fill="#526071">• opero.sqlite3 (WAL, 12 tables, FTS5 + int8)</text>
          <text x="746" y="454" font-size="11" fill="#526071">• MMI Public Knowledge (mmi-sc.co.jp, trilingual)</text>
          <text x="746" y="474" font-size="11" fill="#526071">• meetings/*.wav · screenshots/*.png</text>
          <text x="746" y="494" font-size="11" fill="#526071">• exports/*.{pdf,docx,html,md}</text>
        </svg>
      `,
    },

    'agent-rag-flow': {
      id: 'agent-rag-flow',
      title: 'Pero Agent Tool-Calling & Dual-Core Vector RAG Flow',
      caption: 'How Pero Agent routes greetings cleanly, invokes grounded local tools, fuses FTS5 BM25 + 384-dim int8 cosine vectors via RRF, and generates dynamic multi-turn Ollama /api/chat replies.',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 390" width="1080" height="390" role="img" aria-label="Pero Agent and Dual-Core Vector RAG Flow Diagram">
          ${DEFS}
          <rect width="1080" height="390" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">Pero Agent (⌘5) — Multi-Turn Local LLM &amp; Dual-Core Vector RAG Pipeline</text>

          <rect x="24" y="64" width="166" height="84" rx="12" fill="#0F172A"/>
          <text x="107" y="96" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FFFFFF">User Prompt</text>
          <text x="107" y="116" text-anchor="middle" font-size="10.5" fill="#69BCFC">AgentChat / Dashboard</text>
          <text x="107" y="133" text-anchor="middle" font-size="10" fill="#CBD5E1">EN · JA · FIL</text>

          <path d="M 190 106 L 228 106" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr)"/>

          <rect x="230" y="64" width="182" height="84" rx="12" fill="#FFFFFF" stroke="#69BCFC" stroke-width="1.6"/>
          <text x="321" y="94" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F172A">Smart Intent Gate</text>
          <text x="321" y="114" text-anchor="middle" font-size="10.5" fill="#526071">Greeting vs Knowledge</text>
          <text x="321" y="132" text-anchor="middle" font-size="10" fill="#2D8FED">Zero raw dump on "hello"</text>

          <path d="M 412 106 L 452 106" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr)"/>

          <rect x="454" y="54" width="236" height="170" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
          <text x="572" y="78" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">6 Executable Local Tools</text>
          <text x="470" y="102" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">1. search_knowledge (RAG)</text>
          <text x="470" y="122" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">2. list_documents</text>
          <text x="470" y="142" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">3. list_meetings</text>
          <text x="470" y="162" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">4. create_manual_template</text>
          <text x="470" y="182" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">5. translate_text (EN/JA/FIL)</text>
          <text x="470" y="202" font-size="11" fill="#0F172A" font-family="JetBrains Mono, monospace">6. action_link (Studio/Doc)</text>

          <path d="M 690 130 L 732 130" stroke="#2D8FED" stroke-width="1.8" marker-end="url(#op-arr-sky)"/>

          <rect x="734" y="54" width="322" height="170" rx="12" fill="#EBF6FF" stroke="#69BCFC" stroke-width="1.5"/>
          <text x="895" y="78" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">Multi-Turn Ollama /api/chat</text>
          <text x="752" y="104" font-size="11" fill="#0F172A">• System Persona + Last 8 Thread Turns</text>
          <text x="752" y="126" font-size="11" fill="#0F172A">• Grounded Citations (MMI, Docs, Meetings)</text>
          <text x="752" y="148" font-size="11" fill="#0F172A">• Active Model: qwen3:1.7b / 4b / 8b / gemma3</text>
          <text x="752" y="170" font-size="11" fill="#2D8FED" font-weight="600">• Output: PeroAvatar Bubble + Actions Taken</text>
          <text x="752" y="192" font-size="11" fill="#526071">• Graceful Offline Fallback + Start Local AI</text>

          <rect x="24" y="256" width="1032" height="110" rx="12" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="42" y="280" font-size="12" font-weight="800" fill="#2D8FED">DUAL-CORE SQLITE VECTOR RAG (&lt; 8 MB RAM · ZERO EXTERNAL VECTOR DB)</text>
          <rect x="42" y="294" width="286" height="56" rx="9" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="185" y="318" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F172A">Core 1: Episodic Memory</text>
          <text x="185" y="336" text-anchor="middle" font-size="10.5" fill="#526071">Author edits · Meeting notes · Docs</text>

          <rect x="352" y="294" width="320" height="56" rx="9" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="512" y="318" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F172A">Core 2: Semantic Memory (Pinned)</text>
          <text x="512" y="336" text-anchor="middle" font-size="10.5" fill="#526071">MMI Public Info (mmi-sc.co.jp) · Glossary · SOPs</text>

          <rect x="696" y="294" width="342" height="56" rx="9" fill="#0F172A"/>
          <text x="867" y="318" text-anchor="middle" font-size="11.5" font-weight="700" fill="#FFFFFF">Hybrid Reciprocal Rank Fusion (RRF)</text>
          <text x="867" y="336" text-anchor="middle" font-size="10.5" fill="#69BCFC">SQLite FTS5 BM25 + 384-dim int8 Cosine</text>

          <path d="M 572 224 L 572 256" stroke="#2D8FED" stroke-width="1.6" marker-end="url(#op-arr-sky)"/>
        </svg>
      `,
    },

    'meeting-pipeline': {
      id: 'meeting-pipeline',
      title: 'OS-Level Meeting Audio Capture & Dimmed Pero Compiling Pipeline',
      caption: 'Records system audio from Zoom, Teams, Google Meet, or any app alongside your microphone, transcribes locally, translates EN ↔ JA ↔ FIL, and compiles structured Meeting Notes behind the dimmed Pero Mascot overlay.',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 340" width="1080" height="340" role="img" aria-label="OS-Level Meeting Notes Pipeline Diagram">
          ${DEFS}
          <rect width="1080" height="340" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">Meeting Notes (⌘4) — OS Audio Capture, Local STT, Translation &amp; Pero Overlay</text>

          <rect x="24" y="66" width="184" height="106" rx="12" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="116" y="92" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">1. OS Audio Sources</text>
          <text x="116" y="114" text-anchor="middle" font-size="10.5" fill="#526071">Zoom · Teams · Meet</text>
          <text x="116" y="132" text-anchor="middle" font-size="10.5" fill="#526071">System Audio + Mic</text>
          <text x="116" y="152" text-anchor="middle" font-size="10" fill="#2D8FED">opero-audio-tap / WASAPI</text>

          <path d="M 208 119 L 242 119" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr)"/>

          <rect x="244" y="66" width="180" height="106" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
          <text x="334" y="92" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">2. Safe WAV Persist</text>
          <text x="334" y="114" text-anchor="middle" font-size="10.5" fill="#526071">16kHz Mono PCM WAV</text>
          <text x="334" y="132" text-anchor="middle" font-size="10.5" fill="#526071">meetings/&lt;id&gt;.wav</text>
          <text x="334" y="152" text-anchor="middle" font-size="10" fill="#526071">[ARCH-001] Never Lost</text>

          <path d="M 424 119 L 458 119" stroke="#2D8FED" stroke-width="1.8" marker-end="url(#op-arr-sky)"/>

          <rect x="460" y="56" width="276" height="126" rx="14" fill="#0F172A"/>
          <text x="598" y="82" text-anchor="middle" font-size="12.5" font-weight="800" fill="#69BCFC">3. Dimmed Screen + Pero Overlay</text>
          <text x="480" y="106" font-size="11" fill="#FFFFFF">Step 1 · Transcribe (SFSpeech / whisper.cpp)</text>
          <text x="480" y="128" font-size="11" fill="#FFFFFF">Step 2 · Translate Script (EN ↔ JA ↔ FIL)</text>
          <text x="480" y="150" font-size="11" fill="#FFFFFF">Step 3 · Compile Summary, Decisions, Actions</text>
          <text x="480" y="170" font-size="10" fill="#94A3B8">Backdrop blur + Animated PeroMascot (processing)</text>

          <path d="M 736 119 L 770 119" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr)"/>

          <rect x="772" y="66" width="284" height="106" rx="12" fill="#EBF6FF" stroke="#69BCFC" stroke-width="1.5"/>
          <text x="914" y="92" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">4. Structured Meeting Notes</text>
          <text x="914" y="114" text-anchor="middle" font-size="11" fill="#0F172A">Resizable Bilingual Script + Summary</text>
          <text x="914" y="132" text-anchor="middle" font-size="10.5" fill="#526071">Decisions · Owner Action Items</text>
          <text x="914" y="152" text-anchor="middle" font-size="10.5" fill="#2D8FED">Auto-Indexed in RAG · PDF/DOCX/MD</text>

          <rect x="24" y="216" width="1032" height="96" rx="12" fill="#FFFFFF" stroke="#E2EAF2" stroke-width="1.4"/>
          <text x="42" y="242" font-size="12" font-weight="700" fill="#0F172A">Cross-Platform OS Audio Architecture</text>
          <text x="42" y="266" font-size="11" fill="#526071">• macOS: Native Swift binary (scripts/macos/opero_audio_tap.swift) compiled to ~/Library/Application Support/OPERO/bin/opero-audio-tap using AVAudioEngine + SFSpeechRecognizer.</text>
          <text x="42" y="288" font-size="11" fill="#526071">• Windows: WASAPI Loopback capture + local whisper-cli / Ollama bilingual compilation fallback with identical SQLite persistence and Studio export.</text>
        </svg>
      `,
    },
  };

  global.PeroDocsDiagrams = Object.assign(global.PeroDocsDiagrams || {}, DIAGRAMS);
})(window);
