/**
 * OPERO Editorial Product Documentation Renderer.
 * Clean prose, minimal hairline tables, sticky icon-paired TOC, live search,
 * and Jiggicons-style kinetic SVG icons across chapters, phases, and tables.
 */
(function (global) {
  'use strict';

  const CATEGORIES = [
    ['all', 'All Chapters', 'book'],
    ['diagrams', 'Diagrams (10)', 'compass'],
    ['features', 'Concept & Features', 'lightbulb'],
    ['design', 'Design & Mascot', 'palette'],
    ['pipeline', 'Pipeline & Meetings', 'windmill'],
    ['compatibility', 'Compatibility', 'laptop'],
    ['ai', 'Local AI & Agent', 'bot'],
    ['stack', 'Tech Stack & I18n', 'globe'],
    ['speech', 'Speech', 'headphones'],
    ['security', 'Security & CI/CD', 'lock'],
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
              <div class="editorial-kicker" style="display:inline-flex;align-items:center;gap:7px;">${ico('book', 17)}<span>OPERO v1.0 Product Blueprint &amp; Engineering Architecture</span></div>
              <h2>Architecture, ERD, Live Pero Agent, Meeting Notes &amp; Delivery Plan</h2>
              <p>
                Complete product and engineering reference covering core capture, Document Analyzer, OS-level Meeting Notes, Live Multi-Turn Pero Agent, Dual-Core SQLite Vector RAG, 7 interactive architecture/ERD/sequence diagrams, security boundaries, and CI/CD release governance.
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
      const filtered = D.CHAPTERS.filter((ch) => {
        const catOk =
          activeCat === 'all' ||
          ch.category === activeCat ||
          (activeCat === 'diagrams' && ch.diagrams && ch.diagrams.length > 0);
        return catOk && matchesQuery(ch, q);
      });

      document.getElementById('docsCatTabs').innerHTML = CATEGORIES.map(([id, label, iconName]) => `
        <button type="button" class="doc-tab-link ${id === activeCat ? 'active' : ''}" data-cat="${id}">${ico(iconName, 17)}<span>${label}</span></button>
      `).join('');
      document.querySelectorAll('#docsCatTabs button').forEach((b) => b.addEventListener('click', () => {
        activeCat = b.dataset.cat;
        renderChapters();
      }));

      const tocGroups = [
        { label: 'Product & Design', cats: ['features', 'design', 'compatibility'] },
        { label: 'Pipeline & Local AI', cats: ['pipeline', 'ai', 'stack', 'speech'] },
        { label: 'Architecture & Delivery', cats: ['diagrams', 'security', 'timeline'] },
      ];
      const usedIds = new Set();
      const groupHtml = tocGroups.map((grp) => {
        const items = D.CHAPTERS.filter((ch) => grp.cats.includes(ch.category) && !usedIds.has(ch.id));
        items.forEach((ch) => usedIds.add(ch.id));
        if (!items.length) return '';
        return `
          <div class="docs-toc-group">
            <div class="docs-toc-group-label">${grp.label}</div>
            <div class="docs-toc-items">
              ${items.map((ch) => `
                <button type="button" class="toc-link ${ch.id === activeChapterId ? 'active' : ''}" data-toc="${ch.id}" title="${escapeHtml(ch.number + '. ' + ch.title)}">
                  <span class="toc-num">${escapeHtml(ch.number)}</span>
                  <span class="toc-label">${escapeHtml(ch.title)}</span>
                </button>
              `).join('')}
            </div>
          </div>`;
      }).join('');
      const ungrouped = D.CHAPTERS.filter((ch) => !usedIds.has(ch.id));
      const extraHtml = ungrouped.length
        ? `<div class="docs-toc-group"><div class="docs-toc-group-label">More</div><div class="docs-toc-items">${ungrouped.map((ch) => `
            <button type="button" class="toc-link ${ch.id === activeChapterId ? 'active' : ''}" data-toc="${ch.id}" title="${escapeHtml(ch.number + '. ' + ch.title)}">
              <span class="toc-num">${escapeHtml(ch.number)}</span>
              <span class="toc-label">${escapeHtml(ch.title)}</span>
            </button>`).join('')}</div></div>`
        : '';
      document.getElementById('docsTocList').innerHTML = groupHtml + extraHtml;
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

          ${(ch.diagrams && ch.diagrams.length && global.PeroDocsDiagrams) ? `
            <div class="doc-diagrams-stack">
              ${ch.diagrams.map((diagId) => {
                const dg = global.PeroDocsDiagrams[diagId];
                if (!dg) return '';
                return `
                  <figure class="doc-diagram-card" data-diagram-id="${escapeHtml(dg.id)}">
                    <div class="doc-diagram-toolbar">
                      <div class="doc-diagram-title">${ico('compass', 16)}<span>${escapeHtml(dg.title)}</span></div>
                      <div class="doc-diagram-actions">
                        <button type="button" class="btn doc-diagram-expand" data-expand-diag="${escapeHtml(dg.id)}">Expand</button>
                        <button type="button" class="btn doc-diagram-dl" data-dl-diag="${escapeHtml(dg.id)}">Download SVG</button>
                      </div>
                    </div>
                    <div class="doc-diagram-canvas">${dg.svg}</div>
                    <figcaption class="doc-diagram-cap">${escapeHtml(dg.caption)}</figcaption>
                  </figure>
                `;
              }).join('')}
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

      box.querySelectorAll('[data-expand-diag]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const dg = global.PeroDocsDiagrams && global.PeroDocsDiagrams[btn.dataset.expandDiag];
          if (!dg) return;
          const modal = document.createElement('div');
          modal.className = 'doc-diagram-lightbox';
          modal.setAttribute('role', 'dialog');
          modal.setAttribute('aria-modal', 'true');
          modal.setAttribute('aria-label', dg.title);
          modal.innerHTML = `
            <div class="doc-diagram-lightbox-inner">
              <div class="doc-diagram-toolbar">
                <div class="doc-diagram-title"><span>${escapeHtml(dg.title)}</span></div>
                <button type="button" class="btn primary doc-lightbox-close">Close</button>
              </div>
              <div class="doc-diagram-lightbox-stage">${dg.svg}</div>
              <p class="doc-diagram-cap">${escapeHtml(dg.caption)}</p>
            </div>
          `;
          const close = () => modal.remove();
          modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
          modal.querySelector('.doc-lightbox-close').addEventListener('click', close);
          document.body.appendChild(modal);
        });
      });

      box.querySelectorAll('[data-dl-diag]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const dg = global.PeroDocsDiagrams && global.PeroDocsDiagrams[btn.dataset.dlDiag];
          if (!dg) return;
          const blob = new Blob([dg.svg.trim()], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `opero-${dg.id}.svg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
      });

      if (global.PeroIcons && global.PeroIcons.animateVisibleBurst) {
        global.PeroIcons.animateVisibleBurst(box);
      }

      if (typeof IntersectionObserver !== 'undefined') {
        if (box._tocObserver) box._tocObserver.disconnect();
        const obs = new IntersectionObserver(
          (entries) => {
            const visible = entries.find((e) => e.isIntersecting);
            if (!visible) return;
            activeChapterId = visible.target.id;
            document.querySelectorAll('#docsTocList button').forEach((x) => {
              const isAct = x.dataset.toc === activeChapterId;
              x.classList.toggle('active', isAct);
              if (isAct) x.scrollIntoView({ block: 'nearest' });
            });
          },
          { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
        );
        box.querySelectorAll('.doc-article[id]').forEach((el) => obs.observe(el));
        box._tocObserver = obs;
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
