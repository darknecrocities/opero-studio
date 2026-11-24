/**
 * OPERO Interactive Engineering Vector Diagrams (Extended Set 5–7).
 * Document Analyzer Sequence, Zero-Cloud Security Boundary, and CI/CD Release Pipeline.
 */
(function (global) {
  'use strict';

  const DEFS = `
    <defs>
      <marker id="op-arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#0F172A"/>
      </marker>
      <marker id="op-arr2-sky" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2D8FED"/>
      </marker>
    </defs>
  `;

  const EXTRA_DIAGRAMS = {
    'analyzer-sequence': {
      id: 'analyzer-sequence',
      title: 'Document Analyzer & Annotation Sequence Diagram',
      caption: 'End-to-end flow for .pdf, .docx, .doc, .txt, and .md ingestion, structural parsing, interactive Box/Arrow/Crop AI explanations, and full report export.',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 380" width="1080" height="380" role="img" aria-label="Document Analyzer Sequence Diagram">
          ${DEFS}
          <rect width="1080" height="380" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">Document Analyzer (⌘3) — Sequence Diagram</text>

          <rect x="44" y="54" width="160" height="38" rx="9" fill="#0F172A"/>
          <text x="124" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">User / Canvas UI</text>
          <line x1="124" y1="92" x2="124" y2="352" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>

          <rect x="296" y="54" width="176" height="38" rx="9" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
          <text x="384" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">opero-daemon API</text>
          <line x1="384" y1="92" x2="384" y2="352" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>

          <rect x="564" y="54" width="186" height="38" rx="9" fill="#EBF6FF" stroke="#69BCFC" stroke-width="1.5"/>
          <text x="657" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">doc_parser + analyzer</text>
          <line x1="657" y1="92" x2="657" y2="352" stroke="#B9E0FE" stroke-width="1.5" stroke-dasharray="4 4"/>

          <rect x="840" y="54" width="196" height="38" rx="9" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="938" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#0F172A">SQLite + opero-export</text>
          <line x1="938" y1="92" x2="938" y2="352" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>

          <path d="M 124 128 L 380 128" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr2)"/>
          <text x="252" y="121" text-anchor="middle" font-size="11" fill="#0F172A">1. POST /analyzer/ingest (.pdf/.docx/.txt)</text>

          <path d="M 384 156 L 653 156" stroke="#2D8FED" stroke-width="1.6" marker-end="url(#op-arr2-sky)"/>
          <text x="518" y="149" text-anchor="middle" font-size="11" fill="#2D8FED">2. Extract blocks, tables, blanks &amp; locales</text>

          <path d="M 657 186 L 934 186" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr2)"/>
          <text x="795" y="179" text-anchor="middle" font-size="11" fill="#0F172A">3. Persist AnalyzedDocument + Auto Callouts</text>

          <path d="M 380 218 L 128 218" stroke="#2D8FED" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#op-arr2-sky)"/>
          <text x="252" y="211" text-anchor="middle" font-size="11" fill="#526071">4. Render resizable Canvas + Inspector</text>

          <path d="M 124 256 L 653 256" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr2)"/>
          <text x="388" y="249" text-anchor="middle" font-size="11" fill="#0F172A">5. Manual Box / Arrow / Crop -> POST /analyzer/explain-region (Ollama / Offline)</text>

          <path d="M 124 298 L 380 298" stroke="#0F172A" stroke-width="1.6" marker-end="url(#op-arr2)"/>
          <text x="252" y="291" text-anchor="middle" font-size="11" fill="#0F172A">6. POST /analyzer/documents/:id/report</text>

          <path d="M 384 328 L 934 328" stroke="#2D8FED" stroke-width="1.8" marker-end="url(#op-arr2-sky)"/>
          <text x="659" y="321" text-anchor="middle" font-size="11" font-weight="600" fill="#2D8FED">7. Compile Manual -> Open in Studio or Export PDF / DOCX / HTML / MD</text>
        </svg>
      `,
    },

    'security-boundary': {
      id: 'security-boundary',
      title: 'Zero-Cloud Security, Privacy & Trust Boundary Diagram',
      caption: 'Defense-in-depth boundaries isolating untrusted screen/OCR text, blocking SSRF outside 127.0.0.1, separating reversible blur from irreversible pixel redaction, and enforcing OS-native permissions.',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 370" width="1080" height="370" role="img" aria-label="Security and Privacy Trust Boundary Diagram">
          ${DEFS}
          <rect width="1080" height="370" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">Zero-Cloud Security &amp; Privacy Trust Boundaries</text>

          <rect x="24" y="54" width="290" height="288" rx="12" fill="#FFFFFF" stroke="#C43D4B" stroke-width="1.5" stroke-dasharray="6 4"/>
          <text x="40" y="80" font-size="12" font-weight="800" fill="#C43D4B">UNTRUSTED INPUT ZONE</text>
          <text x="40" y="106" font-size="11" fill="#0F172A">• Raw Screen Captures &amp; Window Titles</text>
          <text x="40" y="128" font-size="11" fill="#0F172A">• Uploaded PDF / Word / Text Files</text>
          <text x="40" y="150" font-size="11" fill="#0F172A">• Live Meeting Audio &amp; Transcripts</text>
          <rect x="40" y="176" width="258" height="70" rx="9" fill="#FEF2F2" stroke="#FECACA"/>
          <text x="52" y="198" font-size="11" font-weight="700" fill="#C43D4B">[SEC-001] Prompt-Injection Shield</text>
          <text x="52" y="218" font-size="10.5" fill="#526071">Delimiter escaping + untrusted data</text>
          <text x="52" y="234" font-size="10.5" fill="#526071">isolation before any LLM prompt.</text>
          <rect x="40" y="258" width="258" height="68" rx="9" fill="#F8FAFC" stroke="#E2EAF2"/>
          <text x="52" y="280" font-size="11" font-weight="700" fill="#0F172A">[SEC-002] App Exclusion Filter</text>
          <text x="52" y="300" font-size="10.5" fill="#526071">1Password, Keychain, password inputs</text>
          <text x="52" y="316" font-size="10.5" fill="#526071">dropped prior to disk write.</text>

          <path d="M 314 198 L 362 198" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr2)"/>

          <rect x="364" y="54" width="352" height="288" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8"/>
          <text x="382" y="80" font-size="12" font-weight="800" fill="#0F172A">LOCAL LOOPBACK TRUST ZONE (127.0.0.1)</text>
          <rect x="382" y="96" width="316" height="68" rx="9" fill="#EBF6FF" stroke="#69BCFC"/>
          <text x="396" y="118" font-size="11.5" font-weight="700" fill="#0F172A">Strict Loopback &amp; SSRF Validator</text>
          <text x="396" y="138" font-size="10.5" fill="#526071">Blocks RFC 1918 &amp; 169.254.169.254 metadata.</text>
          <text x="396" y="154" font-size="10.5" fill="#526071">Allow-listed model tags &amp; GitHub release host.</text>

          <rect x="382" y="176" width="316" height="70" rx="9" fill="#F4F9FF" stroke="#B9E0FE"/>
          <text x="396" y="198" font-size="11.5" font-weight="700" fill="#0F172A">Native OS Permission FFI</text>
          <text x="396" y="218" font-size="10.5" fill="#526071">macOS TCC (CoreGraphics + Accessibility + Mic)</text>
          <text x="396" y="234" font-size="10.5" fill="#526071">Windows GraphicsCaptureAccess + UIPI</text>

          <rect x="382" y="258" width="316" height="68" rx="9" fill="#F8FAFC" stroke="#E2EAF2"/>
          <text x="396" y="280" font-size="11.5" font-weight="700" fill="#0F172A">RFC 7807 Sanitized Error Boundary</text>
          <text x="396" y="300" font-size="10.5" fill="#526071">X-Correlation-ID headers, 100KB/10MB caps,</text>
          <text x="396" y="316" font-size="10.5" fill="#526071">zero stack-trace or secret leaks.</text>

          <path d="M 716 198 L 764 198" stroke="#2D8FED" stroke-width="1.8" marker-end="url(#op-arr2-sky)"/>

          <rect x="766" y="54" width="290" height="288" rx="12" fill="#0F172A"/>
          <text x="784" y="80" font-size="12" font-weight="800" fill="#69BCFC">VERIFIED OUTPUT &amp; STORAGE</text>
          <text x="784" y="112" font-size="11.5" font-weight="700" fill="#FFFFFF">Reversible vs Irreversible Redaction</text>
          <text x="784" y="134" font-size="10.5" fill="#CBD5E1">• Studio Blur: non-destructive overlay</text>
          <text x="784" y="154" font-size="10.5" fill="#CBD5E1">• Export Redact: destroys pixels in PNG/PDF</text>
          <text x="784" y="190" font-size="11.5" font-weight="700" fill="#FFFFFF">Git &amp; Repo Hygiene ([SEC-003])</text>
          <text x="784" y="212" font-size="10.5" fill="#CBD5E1">• Never commits .env, *.sqlite*, *.gguf</text>
          <text x="784" y="232" font-size="10.5" fill="#CBD5E1">• GitGuardian + CI secret scan on every PR</text>
          <text x="784" y="268" font-size="11.5" font-weight="700" fill="#69BCFC">Zero Cloud Telemetry</text>
          <text x="784" y="290" font-size="10.5" fill="#CBD5E1">• 100% offline capture, RAG, chat &amp; export</text>
          <text x="784" y="310" font-size="10.5" fill="#CBD5E1">• Optional manual GitHub Release check only</text>
        </svg>
      `,
    },

    'cicd-release': {
      id: 'cicd-release',
      title: 'CI/CD Verification & Multi-Platform Release Pipeline',
      caption: 'Branch promotion flow from feature branches through 5-gate local parity, 8 GitHub Actions checks on develop, staging pre-releases, main official installers (.dmg + .exe), and opero-studio GitHub Pages.',
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 300" width="1080" height="300" role="img" aria-label="CI/CD and Multi-Platform Release Pipeline Diagram">
          ${DEFS}
          <rect width="1080" height="300" rx="14" fill="#F8FBFF"/>
          <text x="24" y="32" font-size="15" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">CI/CD Quality Gates &amp; Branch Promotion Pipeline</text>

          <rect x="24" y="68" width="182" height="114" rx="12" fill="#FFFFFF" stroke="#B9E0FE" stroke-width="1.5"/>
          <text x="115" y="94" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">1. feature/*</text>
          <text x="115" y="116" text-anchor="middle" font-size="10.5" fill="#526071">verify_ci_local.sh</text>
          <text x="115" y="134" text-anchor="middle" font-size="10.5" fill="#526071">500-Line Ceiling</text>
          <text x="115" y="152" text-anchor="middle" font-size="10.5" fill="#2D8FED">Rust + Vitest + E2E</text>

          <path d="M 206 125 L 240 125" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr2)"/>

          <rect x="242" y="68" width="212" height="114" rx="12" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.6"/>
          <text x="348" y="94" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">2. PR → develop</text>
          <text x="348" y="116" text-anchor="middle" font-size="10.5" fill="#526071">8/8 GitHub Actions Checks</text>
          <text x="348" y="134" text-anchor="middle" font-size="10.5" fill="#526071">PR Title Lint · GitGuardian</text>
          <text x="348" y="152" text-anchor="middle" font-size="10.5" fill="#526071">4-Viewport Playwright QA</text>

          <path d="M 454 125 L 488 125" stroke="#2D8FED" stroke-width="1.8" marker-end="url(#op-arr2-sky)"/>

          <rect x="490" y="68" width="184" height="114" rx="12" fill="#EBF6FF" stroke="#69BCFC" stroke-width="1.5"/>
          <text x="582" y="94" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">3. staging</text>
          <text x="582" y="116" text-anchor="middle" font-size="10.5" fill="#526071">Fast-Forward Sync</text>
          <text x="582" y="134" text-anchor="middle" font-size="10.5" fill="#526071">Pre-Release Matrix</text>
          <text x="582" y="152" text-anchor="middle" font-size="10.5" fill="#2D8FED">Staging Smoke Gate</text>

          <path d="M 674 125 L 708 125" stroke="#0F172A" stroke-width="1.8" marker-end="url(#op-arr2)"/>

          <rect x="710" y="68" width="346" height="114" rx="12" fill="#0F172A"/>
          <text x="883" y="94" text-anchor="middle" font-size="12" font-weight="800" fill="#69BCFC">4. main (Official Production Release)</text>
          <text x="728" y="118" font-size="11" fill="#FFFFFF">• macOS Apple Silicon: OPERO_1.0.0_aarch64.dmg</text>
          <text x="728" y="138" font-size="11" fill="#FFFFFF">• Windows x64 NSIS: OPERO_1.0.0_x64-setup.exe</text>
          <text x="728" y="158" font-size="11" fill="#69BCFC">• SHA256SUMS + latest.json Official Auto-Updater</text>

          <rect x="24" y="210" width="1032" height="64" rx="10" fill="#FFFFFF" stroke="#E2EAF2"/>
          <text x="42" y="236" font-size="11.5" font-weight="700" fill="#0F172A">Companion Docs &amp; Mascot Portal (GitHub Pages)</text>
          <text x="42" y="256" font-size="11" fill="#526071">assets/images/mascot/pero-motions/ mirrors to darknecrocities/opero-studio (main) → Live at https://darknecrocities.github.io/opero-studio/</text>
        </svg>
      `,
    },
  };

  global.PeroDocsDiagrams = Object.assign(global.PeroDocsDiagrams || {}, EXTRA_DIAGRAMS);
})(window);
