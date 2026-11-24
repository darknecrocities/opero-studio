/**
 * Pero Motion Library View Controller (Minimal Icon-Led UI).
 */
(function (global) {
  'use strict';

  const OPERO_STATES = [
    ['onboarding', 'wave-hello', 'handshake'], ['ready', 'idle-breathe', 'home'], ['recording', 'recording-active', 'camera'],
    ['paused', 'capture-paused', 'toggle-left'], ['capturing', 'camera-snap', 'camera'], ['ocr', 'monocle-inspect', 'glasses'],
    ['processing', 'thinking-processing', 'bot'], ['drafting', 'writing-manual', 'feather'], ['annotating', 'annotating-arrows', 'pin'],
    ['searching', 'magnifying-search', 'flashlight'], ['needs-review', 'needs-review-alert', 'eye'], ['verified-draft', 'verified-celebrate', 'saved'],
    ['exported', 'export-document', 'send'], ['model-setup', 'model-loading', 'windmill'], ['privacy', 'privacy-shield', 'lock'],
    ['standby', 'sleep-standby', 'clock'], ['error', 'error-recover', 'flash'],
  ];

  const ico = (name, size) => (global.PeroIcons ? global.PeroIcons.icon(name, { size: size || 17 }) : '');

  function initLibraryView(ctx) {
    const { MOTIONS, SVG_MAP, T, applyColorVars, onRemixProject, getColors, setColors } = ctx;
    const $ = (id) => document.getElementById(id);

    let selectedId = 'thumbs-up';
    let libPlaying = true;
    let libBg = 'bg-white';
    let libFilter = '';
    let linkColors = false;

    function buildJsxSnippet(m) {
      const { capColor, jacketColor } = getColors();
      const capA = capColor !== '#69BCFC' ? ` capColor="${capColor}"` : '';
      const jktA = jacketColor !== '#69BCFC' ? ` jacketColor="${jacketColor}"` : '';
      return `<PeroMascot motion="${m.id}"${capA}${jktA} size={140} />`;
    }

    function renderStage() {
      const m = MOTIONS.find((x) => x.id === selectedId) || MOTIONS[0];
      $('libStageMeta').textContent = `${m.number} · ${(m.durationMs / 1000).toFixed(1)}s`;
      $('libName').textContent = m.name;
      $('libSlug').textContent = m.id;
      $('libDesc').textContent = m.operoStates.length ? `State: ${m.operoStates.join(', ')}` : 'Utility motion';
      $('libOpenSvg').href = m.svg;
      $('libOpenPng').href = m.png;
      $('libStageRender').innerHTML = SVG_MAP[m.id];
      document.querySelectorAll('#libGrid .m-card').forEach((c) => c.classList.toggle('active', c.dataset.id === m.id));
      document.querySelectorAll('#libSimChips button').forEach((c) => c.classList.toggle('active', c.dataset.motion === m.id));
    }

    function renderGrid() {
      const q = libFilter.trim().toLowerCase();
      const items = MOTIONS.filter((m) => !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.operoStates.some((s) => s.includes(q)));
      $('libGrid').innerHTML = items.map((m) => `
        <div class="m-card ${m.id === selectedId ? 'active' : ''}" data-id="${m.id}">
          <div class="m-thumb">${SVG_MAP[m.id]}</div>
          <div class="m-card-foot">
            <strong style="font-size:12px;line-height:1.25;">${m.name}</strong>
            <span class="mono">#${m.number}</span>
          </div>
          <div class="m-card-foot" style="margin-top:6px;">
            <span class="mono">${(m.durationMs / 1000).toFixed(1)}s</span>
            <button type="button" class="btn" style="min-height:26px;padding:0 8px;font-size:11px;" data-remix="${m.id}">${ico('flash', 15)}<span>Remix</span></button>
          </div>
        </div>`).join('');
      $('libGrid').querySelectorAll('.m-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          const remixBtn = e.target.closest('[data-remix]');
          if (remixBtn) {
            const m = MOTIONS.find((x) => x.id === remixBtn.dataset.remix);
            const { capColor, jacketColor } = getColors();
            if (m) onRemixProject(T.presetToProject(m, capColor, jacketColor));
            return;
          }
          selectedId = card.dataset.id;
          renderStage();
        });
      });
    }

    function renderSavedList() {
      const saved = T.loadSavedMotions();
      const wrap = $('savedMotionsWrap');
      const box = $('savedMotionsBox');
      if (!saved.length) {
        if (wrap) wrap.classList.add('hidden');
        box.innerHTML = '';
        return;
      }
      if (wrap) wrap.classList.remove('hidden');
      box.innerHTML = saved.map((s) => `
        <div class="row-wrap" style="border:1px solid var(--border);border-radius:9px;padding:5px 9px;background:#FFF;">
          <strong style="font-size:12px;">${s.name}</strong>
          <span class="mono">${(s.durationMs / 1000).toFixed(1)}s</span>
          <button type="button" class="btn" style="min-height:26px;padding:0 8px;font-size:11px;" data-load-saved="${s.id}">${ico('folder', 15)}<span>Open</span></button>
          <button type="button" class="btn ghost" style="min-height:26px;padding:0 6px;font-size:11px;color:var(--danger);" data-del-saved="${s.id}">${ico('eraser', 15)}<span>Delete</span></button>
        </div>`).join('');
      box.querySelectorAll('[data-load-saved]').forEach((b) => b.addEventListener('click', () => {
        const found = T.loadSavedMotions().find((x) => x.id === b.dataset.loadSaved);
        if (found) onRemixProject(found);
      }));
      box.querySelectorAll('[data-del-saved]').forEach((b) => b.addEventListener('click', () => {
        T.deleteSavedMotion(b.dataset.delSaved);
        renderSavedList();
      }));
    }

    $('libPlayBtn').addEventListener('click', () => {
      libPlaying = !libPlaying;
      $('libPlayBtn').innerHTML = `${ico(libPlaying ? 'toggle-left' : 'send', 17)}<span>${libPlaying ? 'Pause' : 'Play'}</span>`;
      document.body.classList.toggle('paused', !libPlaying);
    });
    $('libSpeedSelect').addEventListener('change', (e) => document.documentElement.style.setProperty('--pero-speed', e.target.value));
    $('libSearch').addEventListener('input', (e) => { libFilter = e.target.value; renderGrid(); });
    $('libRemixBtn').addEventListener('click', () => {
      const m = MOTIONS.find((x) => x.id === selectedId) || MOTIONS[0];
      const { capColor, jacketColor } = getColors();
      onRemixProject(T.presetToProject(m, capColor, jacketColor));
    });
    $('libCopyBtn').addEventListener('click', async () => {
      const m = MOTIONS.find((x) => x.id === selectedId) || MOTIONS[0];
      try {
        await navigator.clipboard.writeText(buildJsxSnippet(m));
        $('libCopyBtn').innerHTML = `${ico('confetti', 17)}<span>Copied</span>`;
        setTimeout(() => { $('libCopyBtn').innerHTML = `${ico('saved', 17)}<span>Copy JSX</span>`; }, 1200);
      } catch (_) {}
    });
    $('libCapPicker').addEventListener('input', (e) => { const c = getColors(); const nextCap = e.target.value; setColors(nextCap, linkColors ? nextCap : c.jacketColor); applyColorVars(nextCap, linkColors ? nextCap : c.jacketColor); renderStage(); });
    $('libJacketPicker').addEventListener('input', (e) => { const c = getColors(); const nextJkt = e.target.value; setColors(linkColors ? nextJkt : c.capColor, nextJkt); applyColorVars(linkColors ? nextJkt : c.capColor, nextJkt); renderStage(); });
    $('libLinkColors').addEventListener('change', (e) => { linkColors = e.target.checked; });
    $('libResetColors').addEventListener('click', () => { setColors('#69BCFC', '#69BCFC'); applyColorVars('#69BCFC', '#69BCFC'); renderStage(); });

    document.querySelectorAll('#libBgDots .bg-dot').forEach((d) => d.addEventListener('click', () => { $('libStageBox').classList.remove(libBg); libBg = d.dataset.bg; $('libStageBox').classList.add(libBg); document.querySelectorAll('#libBgDots .bg-dot').forEach((x) => x.classList.toggle('active', x === d)); }));
    $('libSimChips').innerHTML = OPERO_STATES.map(([s, m, iconName]) => `<button type="button" class="btn" style="min-height:26px;padding:0 8px;font-size:11px;" data-motion="${m}">${ico(iconName, 14)}<span>${s}</span></button>`).join('');
    $('libSimChips').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { selectedId = b.dataset.motion; renderStage(); }));

    renderGrid();
    renderStage();
    renderSavedList();

    return { renderStage, renderSavedList, isLinked: () => linkColors };
  }

  global.PeroLibraryView = { initLibraryView };
})(window);
