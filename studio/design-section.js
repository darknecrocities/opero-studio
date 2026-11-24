/**
 * OPERO Primary Theme & Design System Interactive Showcase (Minimal Icon-Led Layout).
 * White Primary (#FFFFFF) + Light Blue Secondary (#69BCFC) + Black Accents (#0F172A).
 */
(function (global) {
  'use strict';

  const ico = (name, size) => (global.PeroIcons ? global.PeroIcons.icon(name, { size: size || 14 }) : '');

  const THEME_TOKENS = [
    { name: 'Primary Canvas', cssVar: '--bg', value: '#FFFFFF', role: 'Document canvas', textDark: true },
    { name: 'Subtle Sky', cssVar: '--bg-subtle', value: '#F4F9FF', role: 'Sidebars & headers', textDark: true },
    { name: 'Pero Sky', cssVar: '--brand-sky', value: '#69BCFC', role: 'Brand & glass rims', textDark: true },
    { name: 'Soft Sky Wash', cssVar: '--brand-sky-soft', value: '#EBF6FF', role: 'Active selection', textDark: true },
    { name: 'Sky Hairline', cssVar: '--border-strong', value: '#B9E0FE', role: 'Accent borders', textDark: true },
    { name: 'Liquid Glass', cssVar: '--bg-glass', value: 'rgba(255,255,255,0.74)', role: 'Floating HUDs', textDark: true },
    { name: 'Black Accent', cssVar: '--accent', value: '#0F172A', role: 'Primary CTAs & ink', textDark: false },
    { name: 'Muted Slate', cssVar: '--ink-muted', value: '#526071', role: 'Metadata & captions', textDark: false },
    { name: 'Hairline', cssVar: '--border', value: '#E2EAF2', role: '1px dividers', textDark: true },
    { name: 'Verified', cssVar: '--success', value: '#16865B', role: 'Approved step', textDark: false },
    { name: 'Needs Review', cssVar: '--warning', value: '#B7791F', role: 'Review flag', textDark: false },
    { name: 'Recording', cssVar: '--danger', value: '#C43D4B', role: 'Active capture', textDark: false },
  ];

  const TRILINGUAL_SAMPLES = {
    'en-US': {
      tag: 'en-US · English (Source UI: ja-JP)',
      heading: 'Step 04 — Register New Item',
      body: 'Click "新規登録" (Add New), enter the item code, and select "保存" (Save).',
      meta: 'ev_018 · sc_006 · Verified',
    },
    'ja-JP': {
      tag: 'ja-JP · 日本語',
      heading: '手順 04 — 新しい項目を登録する',
      body: '右上の「新規登録」をクリックし、項目コードを入力して「保存」を選択します。',
      meta: 'ev_018 · sc_006 · 承認済み',
    },
    'fil-PH': {
      tag: 'fil-PH · Filipino',
      heading: 'Hakbang 04 — Magrehistro ng Item',
      body: 'Piliin ang "新規登録" (Add New), ilagay ang code, at i-click ang "保存" (I-save).',
      meta: 'ev_018 · sc_006 · Glossary v2.4',
    },
  };

  const ANNOTATIONS = [
    ['number', 'Number', 'pin'], ['arrow', 'Arrow', 'send'], ['rect', 'Box', 'cube'],
    ['blur', 'Redact', 'eye'], ['crop', 'Crop', 'lasso'], ['label', 'Label', 'bookmark'], ['spotlight', 'Spotlight', 'lightbulb'],
  ];

  function initDesignSection(SVG_MAP) {
    const root = document.getElementById('designView');
    if (!root) return;

    let hudState = 'recording';
    let micActive = false;
    let activeLocale = 'en-US';
    let activeAnnot = { number: true, arrow: true, rect: true, blur: true, crop: false, label: true, spotlight: false };
    let reviewState = 'needs-review';

    root.innerHTML = `
      <header class="editorial-header" style="padding:16px 0 18px;margin-bottom:22px;">
        <div class="editorial-kicker">${ico('palette', 17)} Design System</div>
        <h2>White Primary, Light Blue &amp; Black Accents</h2>
        <p>Pure White (#FFFFFF) canvas · Light Blue (#69BCFC) surfaces · Black (#0F172A) actions · Liquid Glass floating HUDs.</p>
      </header>

      <div class="section-grid-2">
        <div class="card panel-pad">
          <div class="sec-head">
            <h3 style="display:inline-flex;align-items:center;gap:8px;">${ico('glasses', 20)}<span>1. Liquid Glass HUD</span></h3>
            <span class="mono">blur(24px)</span>
          </div>
          <div class="glass-lab-stage">
            <div id="dsGlassHud" class="glass-demo-hud">
              <div class="row-wrap" style="gap:10px;">
                <div id="dsHudMascot" style="width:44px;height:44px;display:grid;place-items:center;"></div>
                <div>
                  <div class="row-wrap">
                    <span id="dsHudBadge" class="state-tag rec">REC · 00:04:18</span>
                    <span class="mono">Exclusions ON</span>
                  </div>
                  <div class="mono" style="margin-top:3px;">MMI Inventory Portal</div>
                </div>
              </div>
              <div class="row-wrap">
                <button id="dsToggleRecBtn" type="button" class="btn primary"></button>
                <button id="dsToggleMicBtn" type="button" class="btn">${ico('headphones', 17)}<span>Mic: OFF</span></button>
              </div>
            </div>
          </div>
          <div class="section-grid-3" style="margin-top:12px;margin-bottom:0;">
            <label class="mono">Blur: <strong id="dsBlurVal">24px</strong>
              <input id="dsBlurSlider" type="range" min="0" max="40" value="24" style="width:100%;accent-color:var(--accent);margin-top:4px;" />
            </label>
            <label class="mono">Alpha: <strong id="dsAlphaVal">0.74</strong>
              <input id="dsAlphaSlider" type="range" min="45" max="98" value="74" style="width:100%;accent-color:var(--accent);margin-top:4px;" />
            </label>
            <div style="display:flex;align-items:flex-end;">
              <button id="dsSolidFallbackBtn" type="button" class="btn" style="width:100%;">${ico('toggle-left', 16)}<span>Solid: OFF</span></button>
            </div>
          </div>
        </div>

        <div class="card panel-pad">
          <div class="sec-head">
            <h3 style="display:inline-flex;align-items:center;gap:8px;">${ico('diamond', 20)}<span>Surface Hierarchy</span></h3>
            <span class="mono">WCAG 2.2 AA</span>
          </div>
          <div class="doc-table-wrap" style="margin-top:6px;">
            <table class="doc-table">
              <thead><tr><th>Material</th><th>Token</th><th>Scope</th></tr></thead>
              <tbody>
                <tr><td><strong>Ultra Thin</strong></td><td class="mono">0.62 · 16px</td><td>Loupe &amp; tags</td></tr>
                <tr><td><strong>Thin Glass</strong></td><td class="mono">0.68 · 20px</td><td>Tool palettes</td></tr>
                <tr><td><strong>Regular Glass</strong></td><td class="mono">0.74 · 24px</td><td>Topbar &amp; HUD</td></tr>
                <tr><td><strong>Solid Canvas</strong></td><td class="mono">#FFFFFF · 0px</td><td>Manual pages</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card panel-pad" style="margin-bottom:20px;">
        <div class="sec-head">
          <h3 style="display:inline-flex;align-items:center;gap:8px;">${ico('confetti', 20)}<span>2. App Icon &amp; Color Tokens</span></h3>
          <span id="dsTokenCopyStatus" class="mono" style="display:inline-flex;align-items:center;gap:6px;">${ico('saved', 15)}<span>Click any swatch to copy</span></span>
        </div>
        <div class="row-wrap" style="gap:16px;padding:14px 16px;margin-bottom:14px;border:1px solid var(--border);border-radius:12px;background:var(--bg-subtle);align-items:center;justify-content:space-between;">
          <div class="row-wrap" style="gap:14px;align-items:center;">
            <img src="./brand/opero-app-icon.png" alt="OPERO Official App Icon" width="76" height="76" style="width:76px;height:76px;display:block;object-fit:contain;flex-shrink:0;" />
            <div>
              <strong style="font-family:var(--font-display);font-size:15px;color:var(--ink);">OPERO App Icon</strong>
              <div class="mono" style="margin-top:3px;">1024px · 512px · 192px · SVG Squircle</div>
            </div>
          </div>
          <div class="row-wrap" style="gap:10px;">
            <div style="width:56px;height:56px;border-radius:12px;background:#FFFFFF;border:1px solid var(--border);display:grid;place-items:center;" title="Light 64px">
              <img src="./brand/opero-app-icon-256.png" alt="Light preview" width="40" height="40" />
            </div>
            <div style="width:56px;height:56px;border-radius:12px;background:#0F172A;display:grid;place-items:center;" title="Dark 64px">
              <img src="./brand/opero-app-icon-256.png" alt="Dark preview" width="40" height="40" />
            </div>
          </div>
        </div>
        <div id="dsTokenGrid" class="token-grid"></div>
      </div>

      <div class="card panel-pad" style="margin-bottom:20px;">
        <div class="sec-head">
          <h3 style="display:inline-flex;align-items:center;gap:8px;">${ico('globe', 20)}<span>3. Typography (EN / JA / FIL)</span></h3>
          <div id="dsLocaleBtns" class="row-wrap">
            <button type="button" class="btn active" data-loc="en-US">EN</button>
            <button type="button" class="btn" data-loc="ja-JP">日本語</button>
            <button type="button" class="btn" data-loc="fil-PH">FIL</button>
          </div>
        </div>
        <div class="section-grid-2" style="margin-bottom:0;">
          <div class="row-wrap" style="flex-direction:column;align-items:stretch;gap:8px;">
            <div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--bg-subtle);">
              <span class="label-xs" style="display:inline-flex;align-items:center;gap:5px;">${ico('book', 14)}<span>Display</span></span>
              <div style="font-family:var(--font-display);font-size:17px;font-weight:800;letter-spacing:-0.025em;margin-top:2px;">Plus Jakarta Sans</div>
            </div>
            <div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--bg-subtle);">
              <span class="label-xs" style="display:inline-flex;align-items:center;gap:5px;">${ico('earth', 14)}<span>UI &amp; Multilingual</span></span>
              <div style="font-family:var(--font-sans);font-size:16px;font-weight:600;margin-top:2px;">Inter + Noto Sans JP</div>
            </div>
            <div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--bg-subtle);">
              <span class="label-xs" style="display:inline-flex;align-items:center;gap:5px;">${ico('calculator', 14)}<span>Telemetry</span></span>
              <div style="font-family:var(--font-mono);font-size:13.5px;font-weight:600;margin-top:2px;">JetBrains Mono · 00:14:29</div>
            </div>
          </div>

          <div style="border:1px solid var(--border-strong);border-radius:12px;padding:16px;background:var(--bg);">
            <div id="dsTypeTag" class="mono" style="color:var(--ink-muted);"></div>
            <h4 id="dsTypeHead" style="font-family:var(--font-display);font-size:17px;font-weight:800;margin:6px 0;color:var(--ink);"></h4>
            <p id="dsTypeBody" style="font-family:var(--font-sans);font-size:13.5px;line-height:1.62;margin:0 0 10px;color:var(--ink);"></p>
            <div id="dsTypeMeta" class="mono" style="padding-top:8px;border-top:1px solid var(--border);"></div>
          </div>
        </div>
      </div>

      <div class="card panel-pad">
        <div class="sec-head">
          <h3 style="display:inline-flex;align-items:center;gap:8px;">${ico('laptop', 20)}<span>4. 3-Pane Studio &amp; 7 Annotations</span></h3>
          <div id="dsAnnotBtns" class="row-wrap"></div>
        </div>

        <div class="studio-preview-frame">
          <aside class="sp-sidebar">
            <span class="label-xs" style="display:inline-flex;align-items:center;gap:5px;">${ico('bookmark', 14)}<span>Outline</span></span>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
              <div style="padding:7px 9px;border-radius:8px;background:#FFF;border:1px solid var(--border);font-size:12px;">01. Launch</div>
              <div style="padding:7px 9px;border-radius:8px;background:#FFF;border:1px solid var(--border);font-size:12px;">02. Inventory</div>
              <div style="padding:7px 9px;border-radius:8px;background:var(--accent);color:#FFF;font-size:12px;font-weight:700;">04. Register Item</div>
              <div style="padding:7px 9px;border-radius:8px;background:#FFF;border:1px solid var(--border);font-size:12px;">05. Confirm</div>
            </div>
          </aside>

          <div class="sp-canvas">
            <div class="row-wrap" style="justify-content:space-between;">
              <div>
                <span class="mono">SOLID CANVAS (#FFFFFF)</span>
                <h4 style="margin:3px 0 0;font-family:var(--font-display);font-size:15px;">Step 04: Click "新規登録" and Save</h4>
              </div>
              <span id="dsStepStatusPill" class="state-tag paused">Needs Review</span>
            </div>
            <div id="dsAnnotStage" class="annot-stage"></div>
          </div>

          <aside class="sp-inspector">
            <span class="label-xs" style="display:inline-flex;align-items:center;gap:5px;">${ico('lightbulb', 14)}<span>Evidence</span></span>
            <div style="margin-top:8px;padding:9px;border-radius:9px;background:#FFF;border:1px solid var(--border);">
              <div class="mono">ev_018 · (1240, 188)</div>
              <div class="mono">sc_006 · 2560×1440</div>
              <div class="mono">AX + PaddleOCR</div>
            </div>
            <div style="margin-top:8px;padding:9px;border-radius:9px;background:#FFF;border:1px solid var(--border);">
              <div class="label-xs" style="margin-bottom:6px;">Review</div>
              <div class="row-wrap">
                <button type="button" class="btn" data-rev="needs-review" style="min-height:28px;font-size:11px;">${ico('eye', 16)}<span>Flag</span></button>
                <button type="button" class="btn primary" data-rev="verified-draft" style="min-height:28px;font-size:11px;">${ico('saved', 16)}<span>Verify</span></button>
              </div>
            </div>
            <div style="margin-top:8px;display:flex;align-items:center;gap:8px;padding:8px;border-radius:9px;background:#FFF;border:1px solid var(--border);">
              <div id="dsInspMascot" style="width:42px;height:42px;flex-shrink:0;"></div>
              <div style="font-size:11.5px;color:var(--ink-muted);" id="dsInspNote"></div>
            </div>
          </aside>
        </div>
      </div>
    `;

    const tokenGrid = document.getElementById('dsTokenGrid');
    tokenGrid.innerHTML = THEME_TOKENS.map((t) => `
      <button type="button" class="token-card" data-copy="${t.value}" title="Copy ${t.value}">
        <div class="token-swatch" style="background:${t.value};color:${t.textDark ? '#0F172A' : '#FFFFFF'};">
          <span class="mono" style="color:inherit;font-weight:700;">${t.value}</span>
        </div>
        <div style="font-family:var(--font-display);font-weight:700;font-size:12.5px;color:var(--ink);">${t.name}</div>
        <div class="mono" style="margin:2px 0;">var(${t.cssVar})</div>
        <div style="font-size:11px;color:var(--ink-muted);">${t.role}</div>
      </button>
    `).join('');

    tokenGrid.querySelectorAll('.token-card').forEach((card) => {
      card.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(card.dataset.copy); } catch (_) {}
        document.getElementById('dsTokenCopyStatus').textContent = `Copied ${card.dataset.copy}`;
      });
    });

    const hudEl = document.getElementById('dsGlassHud');
    const updateHudGlass = () => {
      const blur = document.getElementById('dsBlurSlider').value;
      const alpha = (parseInt(document.getElementById('dsAlphaSlider').value, 10) / 100).toFixed(2);
      document.getElementById('dsBlurVal').textContent = `${blur}px`;
      document.getElementById('dsAlphaVal').textContent = alpha;
      hudEl.style.background = `rgba(255, 255, 255, ${alpha})`;
      hudEl.style.backdropFilter = `blur(${blur}px) saturate(180%)`;
      hudEl.style.webkitBackdropFilter = `blur(${blur}px) saturate(180%)`;
    };
    document.getElementById('dsBlurSlider').addEventListener('input', updateHudGlass);
    document.getElementById('dsAlphaSlider').addEventListener('input', updateHudGlass);

    const renderHudState = () => {
      const mId = hudState === 'recording' ? 'recording-active' : 'capture-paused';
      document.getElementById('dsHudMascot').innerHTML = SVG_MAP[mId] || '';
      const svg = document.getElementById('dsHudMascot').querySelector('svg');
      if (svg) { svg.style.width = '44px'; svg.style.height = '44px'; }
      const badge = document.getElementById('dsHudBadge');
      badge.className = hudState === 'recording' ? 'state-tag rec' : 'state-tag paused';
      badge.textContent = hudState === 'recording' ? 'REC · 00:04:18' : 'PAUSED · 00:04:18';
      document.getElementById('dsToggleRecBtn').innerHTML = `${ico(hudState === 'recording' ? 'toggle-left' : 'send', 17)}<span>${hudState === 'recording' ? 'Pause' : 'Resume'}</span>`;
    };
    document.getElementById('dsToggleRecBtn').addEventListener('click', () => {
      hudState = hudState === 'recording' ? 'paused' : 'recording';
      renderHudState();
    });
    document.getElementById('dsToggleMicBtn').addEventListener('click', (e) => {
      micActive = !micActive;
      const btn = e.currentTarget;
      btn.innerHTML = `${ico('headphones', 17)}<span>${micActive ? 'Mic: ON' : 'Mic: OFF'}</span>`;
      btn.classList.toggle('active', micActive);
    });
    document.getElementById('dsSolidFallbackBtn').addEventListener('click', (e) => {
      const isSolid = document.body.classList.toggle('solid-fallback');
      e.currentTarget.innerHTML = `${ico('toggle-left', 16)}<span>Solid: ${isSolid ? 'ON' : 'OFF'}</span>`;
      e.currentTarget.classList.toggle('active', isSolid);
    });

    const renderLocale = () => {
      const s = TRILINGUAL_SAMPLES[activeLocale];
      document.getElementById('dsTypeTag').textContent = s.tag;
      document.getElementById('dsTypeHead').textContent = s.heading;
      document.getElementById('dsTypeBody').textContent = s.body;
      document.getElementById('dsTypeMeta').textContent = s.meta;
      document.querySelectorAll('#dsLocaleBtns button').forEach((b) => b.classList.toggle('active', b.dataset.loc === activeLocale));
    };
    document.querySelectorAll('#dsLocaleBtns button').forEach((b) => b.addEventListener('click', () => {
      activeLocale = b.dataset.loc;
      renderLocale();
    }));

    const renderAnnotations = () => {
      document.getElementById('dsAnnotBtns').innerHTML = ANNOTATIONS.map(([id, lbl, iconName]) => `
        <button type="button" class="btn ${activeAnnot[id] ? 'active' : ''}" data-annot="${id}" style="min-height:29px;font-size:11.5px;padding:0 10px;">${ico(iconName, 16)}<span>${lbl}</span></button>
      `).join('');
      document.querySelectorAll('#dsAnnotBtns button').forEach((b) => b.addEventListener('click', () => {
        activeAnnot[b.dataset.annot] = !activeAnnot[b.dataset.annot];
        renderAnnotations();
      }));

      document.getElementById('dsAnnotStage').innerHTML = `
        <div style="${activeAnnot.crop ? 'margin:6px 20px;border:2px dashed var(--accent);padding:10px;border-radius:10px;' : ''}">
          ${activeAnnot.spotlight ? '<div style="position:absolute;inset:0;background:rgba(15,23,42,0.28);pointer-events:none;border-radius:11px;"></div>' : ''}
          <div style="display:flex;justify-content:space-between;align-items:center;background:#FFFFFF;border:1px solid var(--border);padding:10px 14px;border-radius:9px;position:relative;z-index:2;">
            <span class="mono">MMI Inventory</span>
            <div class="row-wrap" style="position:relative;">
              <span class="mono" style="padding:4px 8px;border-radius:6px;background:var(--bg-subtle);${activeAnnot.blur ? 'filter:blur(4px);user-select:none;' : ''}">ID: MMI-94820</span>
              <button type="button" class="btn primary" style="position:relative;${activeAnnot.rect ? 'outline:2.5px solid #69BCFC;outline-offset:3px;' : ''}">新規登録</button>
              ${activeAnnot.number ? '<span style="position:absolute;top:-11px;right:-11px;width:22px;height:22px;border-radius:50%;background:#0F172A;color:#FFF;font-family:var(--font-display);font-weight:800;font-size:11px;display:grid;place-items:center;">1</span>' : ''}
            </div>
          </div>
          <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative;z-index:2;">
            <div style="background:#FFF;border:1px solid var(--border);padding:10px;border-radius:8px;">
              <span class="mono">Item Code</span>
              <div style="margin-top:4px;font-weight:600;">OPR-2026-JP</div>
            </div>
            <div style="background:#FFF;border:1px solid var(--border);padding:10px;border-radius:8px;position:relative;">
              <span class="mono">Target</span>
              <div style="margin-top:4px;font-weight:600;">Select 「新規登録」</div>
              ${activeAnnot.arrow ? '<svg width="86" height="34" viewBox="0 0 86 34" style="position:absolute;top:-20px;right:18px;" aria-hidden="true"><path d="M10 28 Q 44 5 74 6" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/><path d="M67 1 L 78 6 L 68 12" fill="none" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
            </div>
          </div>
          ${activeAnnot.label ? '<div style="margin-top:12px;position:relative;z-index:2;display:inline-block;padding:5px 10px;border-radius:7px;background:var(--brand-sky-soft);border:1px solid var(--border-strong);color:var(--ink);font-size:11.5px;font-weight:600;">「新規登録」 · (1240, 188)</div>' : ''}
        </div>
      `;
    };

    const renderReviewInspector = () => {
      const mId = reviewState === 'verified-draft' ? 'verified-celebrate' : 'needs-review-alert';
      document.getElementById('dsInspMascot').innerHTML = SVG_MAP[mId] || '';
      const svg = document.getElementById('dsInspMascot').querySelector('svg');
      if (svg) { svg.style.width = '42px'; svg.style.height = '42px'; }
      const pill = document.getElementById('dsStepStatusPill');
      pill.className = reviewState === 'verified-draft' ? 'state-tag verified' : 'state-tag paused';
      pill.textContent = reviewState === 'verified-draft' ? 'Verified' : 'Needs Review';
      document.getElementById('dsInspNote').textContent = reviewState === 'verified-draft'
        ? 'Verified by reviewer.'
        : 'Flagged for review.';
    };

    root.querySelectorAll('[data-rev]').forEach((b) => b.addEventListener('click', () => {
      reviewState = b.dataset.rev;
      renderReviewInspector();
    }));

    renderHudState();
    renderLocale();
    renderAnnotations();
    renderReviewInspector();
  }

  global.PeroDesignSection = { initDesignSection };
})(window);
