/**
 * OPERO Editorial Product Documentation Renderer.
 * Clean prose, minimal hairline tables, sticky icon-paired TOC, live search,
 * and Jiggicons-style kinetic SVG icons across chapters, phases, and tables.
 */
(function (global) {
  'use strict';

  const CATEGORIES = [
    ['all', 'All Chapters', 'book'],
    ['features', 'Concept & Features', 'lightbulb'],
    ['design', 'Design & Mascot', 'palette'],
    ['pipeline', 'Pipeline', 'windmill'],
    ['compatibility', 'Compatibility', 'laptop'],
    ['ai', 'Local AI', 'bot'],
    ['stack', 'Tech Stack & I18n', 'globe'],
    ['speech', 'Speech', 'headphones'],
    ['security', 'Security', 'lock'],
    ['timeline', '1–1.5 Week Plan', 'calendar'],
  ];

  const ico = (name, size) => (global.PeroIcons ? global.PeroIcons.icon(name, { size: size || 17 }) : '');

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function initDocsSection() {
    const root = document.getElementById('docsView');
    const D = global.PeroDocsData;
    if (!root || !D) return;

    let activeCat = 'all';
    let searchQuery = '';
    let activeChapterId = D.CHAPTERS[0].id;

    root.innerHTML = `
      <header class="editorial-header">
        <div class="row-wrap" style="justify-content:space-between;align-items:center;gap:20px;">
          <div class="row-wrap" style="align-items:center;gap:18px;flex:1 1 560px;">
            <img src="./brand/opero-app-icon.png" alt="OPERO Official App Icon" width="104" height="104" style="width:104px;height:104px;display:block;object-fit:contain;flex-shrink:0;" />
            <div style="min-width:240px;flex:1;">
              <div class="editorial-kicker" style="display:inline-flex;align-items:center;gap:7px;">${ico('book', 17)}<span>OPERO Product Blueprint &amp; Documentation</span></div>
              <h2>Architecture, Local AI &amp; 1–1.5 Week Delivery Plan</h2>
              <p>
                Complete product and engineering reference covering core features, minimal design system, 9-stage local AI pipeline, OS compatibility, multilingual architecture, security governance, and the 1 to 1.5 week delivery lifecycle across Planning, Design, Development, Integration, and Testing.
              </p>
            </div>
          </div>
          <div class="row-wrap" style="gap:8px;align-self:flex-start;">
            <div class="search-wrap">
              <span class="search-ico">${ico('flashlight', 17)}</span>
              <input id="docsSearchInput" type="search" class="search has-ico" style="width:220px;" placeholder="Filter blueprint..." aria-label="Filter documentation" />
            </div>
            <button id="docsPrintBtn" type="button" class="btn primary">${ico('receipt', 17)}<span>Print / PDF</span></button>
          </div>
        </div>

        <div class="docs-filter-strip">
          <nav id="docsCatTabs" class="doc-nav-tabs" aria-label="Documentation Categories"></nav>
        </div>
      </header>

      <div class="docs-layout">
        <aside class="docs-toc" aria-label="Document Outline">
          <div class="label-xs" style="margin-bottom:10px;padding:0 10px;display:flex;align-items:center;gap:7px;">${ico('bookmark', 16)}<span>Contents</span></div>
          <div id="docsTocList"></div>
        </aside>

        <div id="docsChaptersBox"></div>
      </div>
    `;

    const matchesQuery = (ch, q) => {
      if (!q) return true;
      const hay = [
        ch.title,
        ch.lead,
        ...(ch.paragraphs || []),
        ...(ch.subsections || []).map((s) => `${s.title} ${s.body}`),
        ...(ch.references || []).map((r) => `${r.title} ${r.caption}`),
        ...(ch.tables || []).map((t) => `${t.caption} ${t.headers.join(' ')} ${t.rows.map((r) => r.join(' ')).join(' ')}`),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    };

    const renderChapters = () => {
      const q = searchQuery.trim().toLowerCase();
      const filtered = D.CHAPTERS.filter((ch) => (activeCat === 'all' || ch.category === activeCat) && matchesQuery(ch, q));

      document.getElementById('docsCatTabs').innerHTML = CATEGORIES.map(([id, label, iconName]) => `
        <button type="button" class="doc-tab-link ${id === activeCat ? 'active' : ''}" data-cat="${id}">${ico(iconName, 17)}<span>${label}</span></button>
      `).join('');
      document.querySelectorAll('#docsCatTabs button').forEach((b) => b.addEventListener('click', () => {
        activeCat = b.dataset.cat;
        renderChapters();
      }));

      document.getElementById('docsTocList').innerHTML = D.CHAPTERS.map((ch) => `
        <button type="button" class="toc-link ${ch.id === activeChapterId ? 'active' : ''}" data-toc="${ch.id}">
          ${ico(ch.icon || 'book', 17)}
          <span>${ch.number}. ${escapeHtml(ch.title)}</span>
        </button>
      `).join('');
      document.querySelectorAll('#docsTocList button').forEach((b) => b.addEventListener('click', () => {
        activeChapterId = b.dataset.toc;
        if (activeCat !== 'all') { activeCat = 'all'; renderChapters(); }
        const targetEl = document.getElementById(activeChapterId);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('#docsTocList button').forEach((x) => x.classList.toggle('active', x.dataset.toc === activeChapterId));
      }));

      const box = document.getElementById('docsChaptersBox');
      if (!filtered.length) {
        box.innerHTML = `<article class="doc-article"><p class="muted" style="margin:0;">No sections matched "<strong>${escapeHtml(searchQuery)}</strong>". Clear the search filter or choose <strong>All Chapters</strong>.</p></article>`;
        return;
      }

      box.innerHTML = filtered.map((ch) => `
        <article class="doc-article" id="${ch.id}">
          <div class="doc-article-head">
            <div class="jigg-icon-badge">${ico(ch.icon || 'book', 24)}</div>
            <div>
              <div class="doc-article-num" style="margin-bottom:4px;">Section ${ch.number}</div>
              <h3>${escapeHtml(ch.title)}</h3>
            </div>
          </div>
          <p class="doc-lead">${escapeHtml(ch.lead)}</p>

          <div class="doc-prose">
            ${(ch.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
          </div>

          ${(ch.subsections || []).map((s) => `
            <div class="doc-subsec">
              <h4>${ico(s.icon || ch.icon || 'sparkles', 19)}<span>${escapeHtml(s.title)}</span></h4>
              <p>${escapeHtml(s.body)}</p>
            </div>
          `).join('')}

          ${(ch.references && ch.references.length) ? `
            <div class="doc-ref-section">
              <div class="label-xs" style="margin-bottom:10px;display:flex;align-items:center;gap:7px;">${ico('camera', 16)}<span>UI Design References</span></div>
              <div class="doc-ref-grid">
                ${ch.references.map((r, idx) => `
                  <figure class="doc-ref-card">
                    <a href="${escapeHtml(r.src)}" target="_blank" rel="noopener" class="doc-ref-link">
                      <img src="${escapeHtml(r.src)}" alt="${escapeHtml(r.title)}" class="doc-ref-img" />
                    </a>
                    <figcaption class="doc-ref-cap">
                      <strong style="display:inline-flex;align-items:center;gap:6px;">${ico(idx === 0 ? 'laptop' : 'glasses', 16)}<span>${escapeHtml(r.title)}</span></strong>
                      <span>${escapeHtml(r.caption)}</span>
                    </figcaption>
                  </figure>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${(ch.tables || []).map((t) => `
            <div style="margin-top:20px;">
              <div class="label-xs" style="margin-bottom:6px;display:flex;align-items:center;gap:7px;">${ico(ch.icon || 'bookmark', 16)}<span>${escapeHtml(t.caption)}</span></div>
              <div class="doc-table-wrap">
                <table class="doc-table">
                  <thead>
                    <tr>${t.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${t.rows.map((row, rIdx) => `
                      <tr>${row.map((cell, idx) => {
                        const rIcon = t.rowIcons && t.rowIcons[rIdx];
                        if (idx === 0) {
                          return `<td><span class="doc-table-cell-ico">${rIcon ? ico(rIcon, 18) : ''}<strong>${escapeHtml(cell)}</strong></span></td>`;
                        }
                        return `<td>${escapeHtml(cell)}</td>`;
                      }).join('')}</tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </article>
      `).join('');

      if (global.PeroIcons && global.PeroIcons.animateVisibleBurst) {
        global.PeroIcons.animateVisibleBurst(box);
      }
    };

    document.getElementById('docsSearchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderChapters();
    });

    document.getElementById('docsPrintBtn').addEventListener('click', () => {
      global.print();
    });

    renderChapters();
  }

  global.PeroDocsSection = { initDocsSection };
})(window);
