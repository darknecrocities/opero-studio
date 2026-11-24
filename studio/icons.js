/**
 * OPERO Official Free Jiggicons Adapter.
 * Renders the 80-free Jiggicons set (duotone / outline) with default ambient motion
 * and triggers official Web Animations API spring choreography via JiggiconsMotion.
 */
(function (global) {
  'use strict';

  const ALIASES = {
    library: 'cube',
    animate: 'windmill',
    book: 'book',
    palette: 'palette',
    plus: 'star',
    upload: 'upload',
    download: 'download',
    copy: 'bookmark',
    check: 'saved',
    search: 'flashlight',
    printer: 'receipt',
    play: 'send',
    pause: 'toggle-left',
    stop: 'anchor',
    'chevron-left': 'feather',
    'chevron-right': 'send',
    undo: 'windmill',
    redo: 'rocket',
    sliders: 'toggle-left',
    sparkles: 'confetti',
    layers: 'diamond',
    compass: 'map',
    box: 'cube',
    pen: 'feather',
    workflow: 'windmill',
    monitor: 'laptop',
    cpu: 'bot',
    globe: 'globe',
    mic: 'headphones',
    shield: 'lock',
    calendar: 'calendar',
    code: 'laptop',
    plug: 'puzzle-piece',
    flask: 'bug',
    loop: 'windmill',
    external: 'send',
    image: 'camera',
    film: 'camera',
    hash: 'pin',
    'arrow-up-right': 'send',
    square: 'cube',
    eye: 'eye',
    crop: 'lasso',
    tag: 'bookmark',
    sun: 'lightbulb',
    lock: 'lock',
    trash: 'eraser',
    'rotate-ccw': 'broom',
    'rotate-cw': 'windmill',
    move: 'lasso',
    x: 'eraser',
    link: 'magnet',
    type: 'book',
    database: 'folder',
    'file-text': 'book',
    zap: 'flash',
    users: 'handshake',
    terminal: 'laptop',
    'volume-2': 'music-note-2',
    'volume-x': 'bell',
  };

  let uidCounter = 0;

  function resolveIcon(name) {
    const pack = global.JIGGICONS_PACK || {};
    const id = pack[name] ? name : (ALIASES[name] || 'sparkles');
    return pack[id] || pack.confetti || pack.book || Object.values(pack)[0] || null;
  }

  function icon(name, opts) {
    const o = opts || {};
    const size = o.size || 18;
    const def = resolveIcon(name);
    const M = global.JiggiconsMotion;
    if (!def || !M) return '';
    const cls = o.className ? `jigg-icon jigg-free ${o.className}` : 'jigg-icon jigg-free';
    return M.toSvg(def, {
      variant: o.variant || 'duotone',
      size,
      className: cls,
      uid: `op${++uidCounter}`,
    });
  }

  function playSvg(svgEl, withSound) {
    if (!svgEl || !global.JiggiconsMotion) return;
    const id = svgEl.getAttribute('data-jiggicon');
    const def = resolveIcon(id);
    if (def) global.JiggiconsMotion.play(svgEl, def, { sound: !!withSound });
  }

  function hydrateIcons(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-jigg-icon]').forEach((el) => {
      const name = el.getAttribute('data-jigg-icon');
      const size = parseInt(el.getAttribute('data-jigg-size') || '18', 10);
      const variant = el.getAttribute('data-jigg-variant') || 'duotone';
      el.innerHTML = icon(name, { size, variant });
    });
    animateVisibleBurst(scope);
  }

  function animateVisibleBurst(root) {
    const scope = root || document;
    const svgs = scope.querySelectorAll('.jigg-free[data-jiggicon]');
    svgs.forEach((svg, idx) => {
      if (idx < 28) {
        setTimeout(() => playSvg(svg, false), idx * 45);
      }
    });
  }

  global.PeroIcons = { icon, hydrateIcons, resolveIcon, playSvg, animateVisibleBurst };
})(window);
