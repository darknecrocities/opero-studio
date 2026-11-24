/**
 * OPERO Tactile Cursor-Navigation Sound & Jiggicons Spring Playback Controller.
 * Triggers official Jiggicons spatial Web Audio + spring Web Animations on hover and click.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'opero_ui_sound';
  const INTERACTIVE_SEL = 'button, a[href], .m-card, .token-card, .doc-tab-link, .toc-link, .bone-pill, .doc-article-head, .doc-subsec, .doc-ref-card';

  let enabled = true;
  let lastHoverAt = 0;
  let lastHoverEl = null;
  let initialized = false;

  try {
    const saved = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
    if (saved === 'false') enabled = false;
  } catch (_) {}

  function applyAudioVolume() {
    if (global.JiggiconsAudio) global.JiggiconsAudio.setVolume(enabled ? 0.65 : 0);
  }

  function unlockAudio() {
    if (global.JiggiconsAudio && global.JiggiconsAudio.context) {
      const live = global.JiggiconsAudio.context();
      if (live && live.audio && live.audio.state === 'suspended') live.audio.resume().catch(() => {});
    }
  }

  function triggerForElement(el, withSound, isHover) {
    if (!el) return;
    const svgs = el.querySelectorAll ? el.querySelectorAll('.jigg-free[data-jiggicon]') : [];
    const svg = svgs[0] || null;
    if (svg && global.PeroIcons) {
      global.PeroIcons.playSvg(svg, false);
    }
    if (!withSound || !enabled) return;
    if (isHover) {
      const now = performance.now();
      if (now - lastHoverAt < 75) return;
      lastHoverAt = now;
    }
    const id = svg ? svg.getAttribute('data-jiggicon') : 'toggle-left';
    const def = global.PeroIcons ? global.PeroIcons.resolveIcon(id) : null;
    if (def && global.JiggiconsAudio) {
      global.JiggiconsAudio.playSound(def, { variant: 'duotone', volume: isHover ? 0.55 : 0.85, overlap: !isHover });
    }
  }

  function syncToggleButton() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;
    const ico = global.PeroIcons ? global.PeroIcons.icon(enabled ? 'music-note-2' : 'bell', { size: 17 }) : '';
    btn.innerHTML = `${ico}<span>${enabled ? 'Sound' : 'Muted'}</span>`;
    btn.classList.toggle('active', enabled);
    btn.setAttribute('aria-pressed', String(enabled));
  }

  function setEnabled(next) {
    enabled = !!next;
    try { if (global.localStorage) global.localStorage.setItem(STORAGE_KEY, String(enabled)); } catch (_) {}
    applyAudioVolume();
    if (enabled) {
      unlockAudio();
      const btn = document.getElementById('soundToggleBtn');
      syncToggleButton();
      triggerForElement(btn, true, false);
      return;
    }
    syncToggleButton();
  }

  function initSound() {
    applyAudioVolume();
    if (initialized) { syncToggleButton(); return; }
    initialized = true;
    syncToggleButton();

    document.addEventListener('pointerdown', unlockAudio, { passive: true });
    document.addEventListener('keydown', unlockAudio, { passive: true });

    document.addEventListener('mouseover', (e) => {
      const target = e.target && e.target.closest ? e.target.closest(INTERACTIVE_SEL) : null;
      if (!target) { lastHoverEl = null; return; }
      if (target === lastHoverEl) return;
      lastHoverEl = target;
      triggerForElement(target, true, true);
    }, { passive: true });

    document.addEventListener('click', (e) => {
      const toggle = e.target && e.target.closest ? e.target.closest('#soundToggleBtn') : null;
      if (toggle) { setEnabled(!enabled); return; }
      const target = e.target && e.target.closest ? e.target.closest(INTERACTIVE_SEL) : null;
      if (target) triggerForElement(target, true, false);
    });
  }

  global.PeroSound = { initSound, isEnabled: () => enabled, setEnabled };
})(window);
