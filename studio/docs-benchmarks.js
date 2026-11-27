/**
 * OPERO Release 1 Local LLM Benchmark Bar Graphs & Hardware Compatibility Docs.
 * Populated from real measured Ollama runs (docs/model_benchmarks.json) in both
 * CPU-only (num_gpu=0) and Apple M3 Metal modes, with HP ProBook 450 G8 baseline analysis.
 */
(function (global) {
  'use strict';

  const MODELS = [
    { name: 'Qwen2.5 1.5B', tag: 'qwen2.5:1.5b', lic: 'Apache-2.0', role: 'Ultra-Light', ram: 1.03, appRam: 1.63, cpu: 62.8, metal: 79.5, ttft: 489, qEn: 31, qJa: 30, qFil: 26, qTot: 87, c8: 95, cPb: 97, cM3: 97, cGpu: 97 },
    { name: 'Qwen3 1.7B', tag: 'qwen3:1.7b', lic: 'Apache-2.0', role: 'R1 Fallback', ram: 1.13, appRam: 1.73, cpu: 52.2, metal: 66.0, ttft: 526, qEn: 35, qJa: 25, qFil: 30, qTot: 90, c8: 95, cPb: 98, cM3: 98, cGpu: 98 },
    { name: 'Qwen2.5 3B', tag: 'qwen2.5:3b', lic: 'Apache-2.0', role: 'R1 Standard', ram: 1.94, appRam: 2.54, cpu: 33.1, metal: 38.6, ttft: 1062, qEn: 35, qJa: 25, qFil: 30, qTot: 90, c8: 89, cPb: 96, cM3: 97, cGpu: 98 },
    { name: 'Phi-4 Mini 3.8B', tag: 'phi4-mini:3.8b', lic: 'MIT', role: 'R2 Candidate', ram: 2.64, appRam: 3.24, cpu: 25.1, metal: 31.1, ttft: 1385, qEn: 26, qJa: 35, qFil: 30, qTot: 91, c8: 38, cPb: 94, cM3: 95, cGpu: 98 },
    { name: 'Qwen3 4B', tag: 'qwen3:4b', lic: 'Apache-2.0', role: 'R2 Candidate', ram: 2.68, appRam: 3.28, cpu: 20.4, metal: 27.5, ttft: 1350, qEn: 0, qJa: 35, qFil: 18, qTot: 53, c8: 38, cPb: 85, cM3: 86, cGpu: 88 },
    { name: 'Gemma 3 4B', tag: 'gemma3:4b', lic: 'Gemma Terms', role: 'R2 Vision', ram: 2.17, appRam: 2.77, cpu: 22.5, metal: 28.7, ttft: 1311, qEn: 35, qJa: 35, qFil: 30, qTot: 100, c8: 87, cPb: 98, cM3: 99, cGpu: 100 },
  ];

  function buildSpeedRamSvg() {
    const rows = MODELS.map((m, i) => {
      const y = 92 + i * 52;
      const isR1 = m.role.startsWith('R1');
      const cpuW = Math.round((m.cpu / 85) * 320);
      const metW = Math.round((m.metal / 85) * 320);
      const ramW = Math.round((m.appRam / 6.5) * 300);
      const badgeFill = m.role === 'R1 Standard' ? '#0F172A' : m.role === 'R1 Fallback' ? '#2D8FED' : '#E2E8F0';
      const badgeTxt = isR1 ? '#FFFFFF' : '#475569';
      return `
        <g>
          ${isR1 ? `<rect x="16" y="${y - 14}" width="1048" height="46" rx="8" fill="#EBF6FF" opacity="0.65"/>` : ''}
          <text x="26" y="${y + 4}" font-size="12" font-weight="${isR1 ? 800 : 600}" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">${m.name}</text>
          <rect x="26" y="${y + 11}" width="82" height="15" rx="4" fill="${badgeFill}"/>
          <text x="67" y="${y + 22}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${badgeTxt}">${m.role}</text>

          <rect x="190" y="${y - 8}" width="${cpuW}" height="13" rx="4" fill="#0F172A"/>
          <text x="${196 + cpuW}" y="${y + 2}" font-size="10.5" font-weight="700" fill="#0F172A" font-family="JetBrains Mono, monospace">${m.cpu.toFixed(1)} tok/s</text>

          <rect x="190" y="${y + 9}" width="${metW}" height="13" rx="4" fill="#69BCFC"/>
          <text x="${196 + metW}" y="${y + 19}" font-size="10.5" font-weight="600" fill="#2D8FED" font-family="JetBrains Mono, monospace">${m.metal.toFixed(1)} tok/s</text>

          <rect x="650" y="${y - 2}" width="${ramW}" height="18" rx="5" fill="${isR1 ? '#16865B' : '#64748B'}"/>
          <text x="${658 + ramW}" y="${y + 11}" font-size="10.5" font-weight="700" fill="#0F172A" font-family="JetBrains Mono, monospace">${m.appRam.toFixed(2)} GB (${m.ram.toFixed(2)} model)</text>
        </g>`;
    }).join('');
    const capX = 650 + Math.round((6.0 / 6.5) * 300);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 420" width="1080" height="420" role="img" aria-label="Local LLM Speed and Memory Footprint Bar Graph">
        <rect width="1080" height="420" rx="14" fill="#F8FBFF"/>
        <text x="24" y="32" font-size="15.5" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">Measured Speed (CPU-Only vs Metal) &amp; Combined RAM vs. 6.0 GB ProBook Ceiling</text>
        <text x="24" y="50" font-size="11" fill="#526071" font-family="Inter, sans-serif">Measured via Ollama on Apple M3 (16 GB): CPU-Only (num_gpu=0) vs Metal · Combined RAM = Ollama resident size + 0.60 GB OPERO shell</text>

        <rect x="190" y="62" width="11" height="11" rx="2" fill="#0F172A"/><text x="206" y="71" font-size="10.5" font-weight="600" fill="#0F172A">CPU-Only (num_gpu=0)</text>
        <rect x="350" y="62" width="11" height="11" rx="2" fill="#69BCFC"/><text x="366" y="71" font-size="10.5" font-weight="600" fill="#2D8FED">Apple Metal GPU</text>
        <rect x="650" y="62" width="11" height="11" rx="2" fill="#16865B"/><text x="666" y="71" font-size="10.5" font-weight="600" fill="#16865B">R1 Approved RAM</text>
        <line x1="${capX}" y1="76" x2="${capX}" y2="396" stroke="#C43D4B" stroke-width="2" stroke-dasharray="5 4"/>
        <text x="${capX - 6}" y="71" text-anchor="end" font-size="10.5" font-weight="800" fill="#C43D4B" font-family="JetBrains Mono, monospace">6.0 GB ProBook Cap</text>
        ${rows}
      </svg>`;
  }

  function buildPcCompatSvg() {
    const groups = MODELS.map((m, i) => {
      const gx = 78 + i * 164;
      const bars = [
        { val: m.c8, color: '#94A3B8', label: '8G' },
        { val: m.cPb, color: '#0F172A', label: 'PB' },
        { val: m.cM3, color: '#69BCFC', label: 'M3' },
        { val: m.cGpu, color: '#16865B', label: '32G' },
      ];
      const barSvg = bars.map((b, j) => {
        const bx = gx + j * 30;
        const h = Math.round((b.val / 100) * 210);
        const by = 310 - h;
        return `
          <rect x="${bx}" y="${by}" width="24" height="${h}" rx="4" fill="${b.color}"/>
          <text x="${bx + 12}" y="${by - 6}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${b.val < 50 ? '#C43D4B' : '#0F172A'}" font-family="JetBrains Mono, monospace">${b.val}</text>`;
      }).join('');
      const isR1 = m.role.startsWith('R1');
      return `
        <g>
          ${isR1 ? `<rect x="${gx - 8}" y="86" width="132" height="262" rx="10" fill="#EBF6FF" opacity="0.65"/>` : ''}
          ${barSvg}
          <text x="${gx + 58}" y="330" text-anchor="middle" font-size="11.5" font-weight="${isR1 ? 800 : 600}" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">${m.name}</text>
          <text x="${gx + 58}" y="344" text-anchor="middle" font-size="9.5" font-weight="700" fill="${isR1 ? '#2D8FED' : '#64748B'}">${m.role}</text>
        </g>`;
    }).join('');

    const gridLines = [25, 50, 75, 100].map((v) => {
      const y = 310 - Math.round((v / 100) * 210);
      return `<line x1="56" y1="${y}" x2="1056" y2="${y}" stroke="#E2E8F0" stroke-width="1"/><text x="48" y="${y + 4}" text-anchor="end" font-size="10" fill="#64748B" font-family="JetBrains Mono, monospace">${v}%</text>`;
    }).join('');

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 390" width="1080" height="390" role="img" aria-label="Computer Spec Compatibility Bar Graph">
        <rect width="1080" height="390" rx="14" fill="#F8FBFF"/>
        <text x="24" y="32" font-size="15.5" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">Computer Spec Compatibility Score (0–100%) by Workstation Profile</text>
        <text x="24" y="50" font-size="11" fill="#526071" font-family="Inter, sans-serif">Weighted compatibility across RAM headroom, projected CPU/GPU throughput, and SOP quality · Scores &lt;40% indicate RAM budget overflow</text>

        <rect x="24" y="62" width="11" height="11" rx="2" fill="#94A3B8"/><text x="40" y="71" font-size="10.5" font-weight="600" fill="#475569">8 GB Entry Laptop (CPU-Only)</text>
        <rect x="240" y="62" width="11" height="11" rx="2" fill="#0F172A"/><text x="256" y="71" font-size="10.5" font-weight="800" fill="#0F172A">HP ProBook 450 G8 (16 GB CPU-Only Baseline)</text>
        <rect x="560" y="62" width="11" height="11" rx="2" fill="#69BCFC"/><text x="576" y="71" font-size="10.5" font-weight="600" fill="#2D8FED">16 GB Apple Silicon (Metal)</text>
        <rect x="780" y="62" width="11" height="11" rx="2" fill="#16865B"/><text x="796" y="71" font-size="10.5" font-weight="600" fill="#16865B">32 GB+ Dedicated GPU</text>

        ${gridLines}
        <line x1="56" y1="310" x2="1056" y2="310" stroke="#94A3B8" stroke-width="1.5"/>
        ${groups}
        <text x="24" y="374" font-size="10.5" fill="#526071">Key takeaway: Qwen2.5 3B (96% ProBook) + Qwen3 1.7B (98% ProBook, 95% 8 GB) cover 100% of office PCs with OSI Apache-2.0 licenses.</text>
      </svg>`;
  }

  function buildQualitySvg() {
    const rows = MODELS.map((m, i) => {
      const y = 92 + i * 44;
      const scale = 6.2;
      const wEn = Math.round(m.qEn * scale);
      const wJa = Math.round(m.qJa * scale);
      const wFil = Math.round(m.qFil * scale);
      const totW = wEn + wJa + wFil;
      const isR1 = m.role.startsWith('R1');
      return `
        <g>
          <text x="26" y="${y + 15}" font-size="12" font-weight="${isR1 ? 800 : 600}" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">${m.name}</text>
          <text x="26" y="${y + 29}" font-size="9.5" fill="#64748B" font-family="JetBrains Mono, monospace">${m.lic}</text>
          <rect x="195" y="${y + 3}" width="${wEn}" height="22" rx="3" fill="#0F172A"/>
          <rect x="${195 + wEn}" y="${y + 3}" width="${wJa}" height="22" rx="0" fill="#69BCFC"/>
          <rect x="${195 + wEn + wJa}" y="${y + 3}" width="${wFil}" height="22" rx="3" fill="#16865B"/>
          <text x="${205 + totW}" y="${y + 18}" font-size="11.5" font-weight="800" fill="#0F172A" font-family="JetBrains Mono, monospace">${m.qTot}/100 (${m.qEn}·${m.qJa}·${m.qFil})</text>
        </g>`;
    }).join('');

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 370" width="1080" height="370" role="img" aria-label="Trilingual Output Quality Breakdown Bar Graph">
        <rect width="1080" height="370" rx="14" fill="#F8FBFF"/>
        <text x="24" y="32" font-size="15.5" font-weight="800" fill="#0F172A" font-family="Plus Jakarta Sans, sans-serif">OPERO Trilingual SOP Output Quality Rubric (/100)</text>
        <text x="24" y="50" font-size="11" fill="#526071" font-family="Inter, sans-serif">Scored on strict JSON evidence citation (EN /35), polite です/ます Japanese with preserved UI labels (/35), and Filipino business prose (/30)</text>

        <rect x="195" y="62" width="11" height="11" rx="2" fill="#0F172A"/><text x="211" y="71" font-size="10.5" font-weight="600" fill="#0F172A">EN JSON &amp; Citations (/35)</text>
        <rect x="415" y="62" width="11" height="11" rx="2" fill="#69BCFC"/><text x="431" y="71" font-size="10.5" font-weight="600" fill="#2D8FED">Polite Japanese です/ます (/35)</text>
        <rect x="655" y="62" width="11" height="11" rx="2" fill="#16865B"/><text x="671" y="71" font-size="10.5" font-weight="600" fill="#16865B">Filipino Business (/30)</text>
        ${rows}
      </svg>`;
  }

  if (global.PeroDocsDiagrams) {
    global.PeroDocsDiagrams['benchmark-speed-ram'] = {
      id: 'benchmark-speed-ram',
      title: 'Measured Speed (CPU-Only vs Metal) & RAM vs. 6 GB ProBook Cap',
      caption: 'Real Ollama benchmark measurements comparing CPU-only (num_gpu=0) and Metal throughput against the 6.0 GB HP ProBook 450 G8 memory ceiling.',
      svg: buildSpeedRamSvg(),
    };
    global.PeroDocsDiagrams['benchmark-pc-compat'] = {
      id: 'benchmark-pc-compat',
      title: 'Computer Spec Compatibility Matrix (Bar Graph)',
      caption: 'Compatibility score (0–100%) per model across 8 GB CPU-only laptops, the HP ProBook 450 G8 baseline (16 GB CPU-only), 16 GB Apple Silicon, and 32 GB GPU workstations.',
      svg: buildPcCompatSvg(),
    };
    global.PeroDocsDiagrams['benchmark-quality-i18n'] = {
      id: 'benchmark-quality-i18n',
      title: 'Trilingual SOP Output Quality Breakdown (EN · JA · FIL)',
      caption: 'Deterministic quality rubric measuring JSON schema fidelity, evidence citation accuracy, polite Japanese (です/ます), and Filipino UI-label preservation.',
      svg: buildQualitySvg(),
    };
  }

  const BENCHMARK_CHAPTER = {
    id: 'ch-model-benchmarks',
    category: 'compatibility',
    icon: 'laptop',
    number: '15',
    title: 'ISMS Model Benchmarks & Computer Spec Compatibility',
    lead: 'Measured speed, resident memory, trilingual output quality, and workstation compatibility bar graphs validating the Release 1 HP ProBook 450 G8 baseline.',
    paragraphs: [
      'In alignment with ISMS governance (Q3 & Q16), OPERO Release 1 selects strictly from a fixed ISMS-approved local model list and never downloads new models or runtimes automatically. Instead of complex multi-tier auto-switching, Release 1 standardizes on one primary model for the baseline HP ProBook 450 G8 (Intel Core i7-1165G7, 16 GB RAM, CPU-only, <= 6 GB combined RAM) plus one lighter fallback for 8 GB or memory-constrained PCs, alongside the zero-RAM Built-In Offline engine.',
      'All six candidate models below were benchmarked locally through Ollama in both CPU-only mode (num_gpu=0) and Metal mode on an Apple M3 (16 GB) host using a standardized 3-task OPERO SOP suite: strict JSON step generation with evidence citations, polite Japanese (です/ます) translation preserving quoted UI labels, and Filipino business drafting. Hardware compatibility scores combine measured RAM headroom against each workstation tier budget, projected CPU/GPU throughput, and rubric quality.'
    ],
    diagrams: ['benchmark-speed-ram', 'benchmark-pc-compat', 'benchmark-quality-i18n'],
    tables: [
      {
        caption: 'Measured Local LLM Benchmark Results (CPU-Only num_gpu=0 & Metal)',
        headers: ['Model', 'License', 'App+Model RAM', 'CPU-Only tok/s', 'Metal tok/s', 'Quality (/100)', 'ProBook 450 G8 Compat', 'Release 1 Role'],
        rowIcons: ['sparkles', 'bot', 'laptop', 'cube', 'lightbulb', 'eye'],
        rows: MODELS.map((m) => [
          `${m.name} (${m.tag})`,
          m.lic,
          `${m.appRam.toFixed(2)} GB`,
          `${m.cpu.toFixed(1)} tok/s`,
          `${m.metal.toFixed(1)} tok/s`,
          `${m.qTot}/100`,
          `${m.cPb}%`,
          m.role,
        ]),
      },
      {
        caption: 'Workstation Spec Compatibility & Release 1 ISMS Rollout Policy',
        headers: ['Computer Spec Tier', 'RAM / Compute', 'Most Compatible Model', 'Policy Status'],
        rowIcons: ['laptop', 'building', 'sparkles', 'rocket'],
        rows: [
          ['8 GB Entry Office Laptop', '8 GB RAM · CPU-Only (<= 2.2 GB model)', 'Qwen3 1.7B (95%) or Qwen2.5 1.5B (95%)', 'Release 1 Lighter Fallback (Apache-2.0)'],
          ['HP ProBook 450 G8 (Baseline)', '16 GB RAM · i7-1165G7 · CPU-Only (<= 6 GB total)', 'Qwen2.5 3B (96%) + Qwen3 1.7B (98%)', 'Release 1 Primary Target (ISMS Allowlist)'],
          ['16 GB Apple Silicon Laptop', '16 GB Unified · Metal GPU', 'Qwen2.5 3B (97%) / Gemma 3 4B (99%)', 'R1 Standard; Gemma 3 pending ISMS review'],
          ['32 GB+ Workstation', '32 GB+ RAM · Dedicated GPU (>= 8 GB VRAM)', 'Gemma 3 4B (100%) / Qwen2.5 7B (R2+)', 'Deferred to Release 2+ Auto-Switching'],
        ],
      },
    ],
  };

  if (global.PeroDocsData && Array.isArray(global.PeroDocsData.CHAPTERS)) {
    global.PeroDocsData.CHAPTERS.push(BENCHMARK_CHAPTER);
  }
})(window);
