/**
 * Pero Animate Studio UI Controller (4-Mode Switcher + 4-DOF Rig Animator).
 */
(function (global) {
  'use strict';

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function initStudio(MOTIONS, SVG_MAP) {
    const E = global.PeroRigEngine;
    const T = global.PeroTimelineEditor;
    const X = global.PeroExporters;
    const I = global.PeroStudioInspector;

    let mode = 'library';
    let capColor = '#69BCFC';
    let jacketColor = '#69BCFC';
    let history = T.createHistoryStack(T.presetToProject(MOTIONS[2], capColor, jacketColor));
    let studioTime = 0;
    let studioPlaying = false;
    let studioSpeed = 1;
    let loopMode = 'loop';
    let pingDir = 1;
    let studioRaf = null;
    let lastTs = 0;
    let selectedBone = 'head';
    let toolMode = 'smart';
    let selectedKfIndex = 0;
    let showGizmos = true;
    let showOnion = true;
    let studioBg = 'bg-white';
    let dragState = null;
    let copiedPose = null;

    const $ = (id) => document.getElementById(id);

    function applyColorVars(capHex, jktHex) {
      const cap = I.deriveScheme(capHex || '#69BCFC');
      const jkt = I.deriveScheme(jktHex || '#69BCFC');
      const r = document.documentElement.style;
      r.setProperty('--pero-cap-highlight', cap.highlight); r.setProperty('--pero-cap-light', cap.light);
      r.setProperty('--pero-cap-main', cap.main); r.setProperty('--pero-cap-shade', cap.shade);
      r.setProperty('--pero-cap-seam', cap.seam); r.setProperty('--pero-cap-button', cap.accent);
      r.setProperty('--pero-jacket-highlight', jkt.highlight); r.setProperty('--pero-jacket-light', jkt.light);
      r.setProperty('--pero-jacket-main', jkt.main); r.setProperty('--pero-jacket-shade', jkt.shade);
      r.setProperty('--pero-jacket-accent', jkt.accent);
      $('libCapPicker').value = cap.main;
      $('libJacketPicker').value = jkt.main;
      $('stCapPicker').value = cap.main;
      $('stJacketPicker').value = jkt.main;
    }

    const libCtrl = global.PeroLibraryView.initLibraryView({
      MOTIONS,
      SVG_MAP,
      T,
      applyColorVars,
      onRemixProject: (proj) => loadProjectIntoStudio(proj),
      getColors: () => ({ capColor, jacketColor }),
      setColors: (c, j) => { capColor = c; jacketColor = j; },
    });

    function setMode(nextMode) {
      mode = nextMode;
      $('libraryView').classList.toggle('hidden', mode !== 'library');
      $('animateView').classList.toggle('hidden', mode !== 'animate');
      if ($('designView')) $('designView').classList.toggle('hidden', mode !== 'design');
      if ($('docsView')) $('docsView').classList.toggle('hidden', mode !== 'docs');
      $('modeLibBtn').classList.toggle('active', mode === 'library');
      $('modeAnimBtn').classList.toggle('active', mode === 'animate');
      if ($('modeDesignBtn')) $('modeDesignBtn').classList.toggle('active', mode === 'design');
      if ($('modeDocsBtn')) $('modeDocsBtn').classList.toggle('active', mode === 'docs');
      if (global.history && global.history.replaceState) global.history.replaceState(null, '', `#${mode}`);
      if (global.PeroIcons) {
        const viewId = mode === 'animate' ? 'animateView' : mode === 'design' ? 'designView' : mode === 'docs' ? 'docsView' : 'libraryView';
        global.PeroIcons.animateVisibleBurst($(viewId));
      }
      if (mode === 'animate') {
        const proj = history.get();
        applyColorVars(proj.capColor, proj.jacketColor);
        renderStudioAll();
      } else {
        stopStudioLoop();
        applyColorVars(capColor, jacketColor);
        if (mode === 'library') libCtrl.renderSavedList();
      }
    }

    function loadProjectIntoStudio(project) {
      history = T.createHistoryStack(project);
      studioTime = 0;
      selectedKfIndex = 0;
      stopStudioLoop();
      setMode('animate');
    }

    function getCurrentPoseForEdit() {
      return E.interpolatePose(history.get().keyframes, studioTime);
    }

    function getOrCreateKeyframeAtCurrentTime() {
      const proj = JSON.parse(JSON.stringify(history.get()));
      const sorted = [...proj.keyframes].sort((a, b) => a.t - b.t);
      const hitIdx = sorted.findIndex((k) => Math.abs(k.t - studioTime) < 0.025);
      if (hitIdx >= 0) { selectedKfIndex = hitIdx; return { proj, kf: sorted[hitIdx] }; }
      const newKf = { id: `kf-${Date.now()}`, t: Number(studioTime.toFixed(3)), easing: 'easeInOut', pose: E.interpolatePose(sorted, studioTime) };
      sorted.push(newKf);
      sorted.sort((a, b) => a.t - b.t);
      proj.keyframes = sorted;
      selectedKfIndex = sorted.findIndex((k) => k.id === newKf.id);
      return { proj, kf: newKf };
    }

    function commitPoseMutation(mutatorFn, pushHistory) {
      const { proj, kf } = getOrCreateKeyframeAtCurrentTime();
      mutatorFn(kf.pose, proj);
      kf.pose = E.clampPose(kf.pose);
      if (pushHistory) history.push(proj);
      else history.get().keyframes = proj.keyframes;
      renderStudioStage();
      renderTimeline();
      renderBoneInspectorPanel();
    }

    function renderBoneInspectorPanel() {
      I.renderBoneInspector({
        selectedBone,
        pose: getCurrentPoseForEdit(),
        commitPoseMutation,
        pushHistorySnapshot: () => history.push(JSON.parse(JSON.stringify(history.get()))),
        hasCopiedPose: !!copiedPose,
        onCopyPose: () => { copiedPose = E.clonePose(getCurrentPoseForEdit()); renderBoneInspectorPanel(); },
        onPastePose: () => { if (copiedPose) commitPoseMutation((pose) => Object.assign(pose, E.clonePose(copiedPose)), true); },
        onResetPose: () => commitPoseMutation((pose) => Object.assign(pose, E.createDefaultPose()), true),
        onResetBone: () => commitPoseMutation((pose) => {
          const def = E.createDefaultPose();
          if (selectedBone === 'prop') pose.propTransform = def.propTransform;
          else if (selectedBone === 'face') { pose.face.tx = 0; pose.face.ty = 0; pose.face.gazeX = 0; pose.face.gazeY = 0; }
          else pose[selectedBone] = def[selectedBone];
        }, true),
      });
    }

    function renderStudioStage() {
      const proj = history.get();
      const sorted = [...proj.keyframes].sort((a, b) => a.t - b.t);
      const pose = E.interpolatePose(sorted, studioTime);
      let onionPrev = null, onionNext = null;
      if (showOnion && !studioPlaying && sorted.length > 1) {
        const prevs = sorted.filter((k) => k.t < studioTime - 0.01);
        const nexts = sorted.filter((k) => k.t > studioTime + 0.01);
        if (prevs.length) onionPrev = prevs[prevs.length - 1].pose;
        if (nexts.length) onionNext = nexts[0].pose;
      }
      $('studioStageWrap').innerHTML = E.renderRigSvg(pose, {
        prefix: 'st-pero',
        interactive: !studioPlaying,
        showGizmos: showGizmos && !studioPlaying,
        selectedBone,
        onionPrev,
        onionNext,
      });
      attachCanvasDragHandlers();
      $('studioHudMeta').textContent = `${Math.round(studioTime * 100)}% · ${(studioTime * proj.durationMs / 1000).toFixed(2)}s`;
    }

    function attachCanvasDragHandlers() {
      const svg = $('studioStageWrap').querySelector('svg');
      if (!svg) return;
      svg.querySelectorAll('[data-bone]').forEach((el) => {
        el.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          selectedBone = el.dataset.bone;
          renderBoneTree();
          renderBoneInspectorPanel();
          const rect = svg.getBoundingClientRect();
          const pt = { x: ((e.clientX - rect.left) / rect.width) * 512, y: ((e.clientY - rect.top) / rect.height) * 512 };
          dragState = { bone: selectedBone, startPt: pt, startPose: E.clonePose(getCurrentPoseForEdit()), rect };
          svg.setPointerCapture(e.pointerId);
        });
      });

      svg.addEventListener('pointermove', (e) => {
        if (!dragState) return;
        const { bone, startPt, startPose, rect } = dragState;
        const curPt = { x: ((e.clientX - rect.left) / rect.width) * 512, y: ((e.clientY - rect.top) / rect.height) * 512 };
        const dx = curPt.x - startPt.x;
        const dy = curPt.y - startPt.y;
        const activeTool = e.shiftKey ? 'rotate' : toolMode;
        commitPoseMutation((pose) => {
          const target = bone === 'prop' ? pose.propTransform : pose[bone];
          const base = bone === 'prop' ? startPose.propTransform : startPose[bone];
          if (activeTool === 'move') {
            if (typeof target.tx === 'number') target.tx = (base.tx || 0) + dx * 0.55;
            if (typeof target.ty === 'number') target.ty = (base.ty || 0) + dy * 0.55;
          } else if (activeTool === 'rotate' && typeof target.rot === 'number') {
            target.rot = (base.rot || 0) + (dx - dy * 0.45) * 0.4;
          } else if (bone === 'root' || bone === 'footLeft' || bone === 'footRight' || bone === 'prop') {
            target.tx = (base.tx || 0) + dx * 0.5;
            target.ty = (base.ty || 0) + dy * 0.55;
          } else if (bone === 'cap' || bone === 'head') {
            target.tx = (base.tx || 0) + dx * 0.3;
            target.ty = (base.ty || 0) + dy * 0.35;
            target.rot = (base.rot || 0) + dx * 0.22;
          } else if (bone === 'face') {
            pose.face.tx = (startPose.face.tx || 0) + dx * 0.22;
            pose.face.ty = (startPose.face.ty || 0) + dy * 0.22;
            pose.face.gazeX = (startPose.face.gazeX || 0) + dx * 0.06;
            pose.face.gazeY = (startPose.face.gazeY || 0) + dy * 0.06;
          } else {
            target.tx = (base.tx || 0) + dx * 0.2;
            target.ty = (base.ty || 0) + dy * 0.2;
            target.rot = (base.rot || 0) + (dx - dy * 0.45) * 0.35;
          }
        }, false);
      });

      const endDrag = () => {
        if (!dragState) return;
        history.push(JSON.parse(JSON.stringify(history.get())));
        dragState = null;
        renderStudioAll();
      };
      svg.addEventListener('pointerup', endDrag);
      svg.addEventListener('pointercancel', endDrag);
    }

    function renderBoneTree() {
      $('boneGrid').innerHTML = Object.keys(E.BONE_META).map((k) => `<button type="button" class="bone-pill ${k === selectedBone ? 'active' : ''}" data-bone-sel="${k}">${E.BONE_META[k].label}</button>`).join('');
      $('boneGrid').querySelectorAll('[data-bone-sel]').forEach((b) => b.addEventListener('click', () => {
        selectedBone = b.dataset.boneSel;
        renderBoneTree(); renderBoneInspectorPanel(); renderStudioStage();
      }));
    }

    function renderTimeline() {
      const proj = history.get();
      const sorted = [...proj.keyframes].sort((a, b) => a.t - b.t);
      $('projNameInput').value = proj.name;
      $('durRange').value = proj.durationMs;
      $('durLabel').textContent = `${(proj.durationMs / 1000).toFixed(1)}s`;
      $('tlPlayhead').style.left = `${studioTime * 100}%`;
      $('tlDiamonds').innerHTML = sorted.map((k, i) => `<button type="button" class="kf-diamond ${Math.abs(k.t - studioTime) < 0.025 ? 'active' : ''}" data-kf-idx="${i}" style="left:${k.t * 100}%;" title="${Math.round(k.t * 100)}% (${k.easing})"></button>`).join('');
      $('tlDiamonds').querySelectorAll('[data-kf-idx]').forEach((d) => d.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedKfIndex = parseInt(d.dataset.kfIdx, 10);
        studioTime = sorted[selectedKfIndex].t;
        stopStudioLoop();
        renderStudioAll();
      }));
      const curKf = sorted.find((k) => Math.abs(k.t - studioTime) < 0.025) || sorted[selectedKfIndex] || sorted[0];
      if (curKf) $('selEasing').value = curKf.easing || 'easeInOut';
      $('undoBtn').disabled = !history.canUndo();
      $('redoBtn').disabled = !history.canRedo();
    }

    function renderStudioAll() {
      const proj = history.get();
      applyColorVars(proj.capColor, proj.jacketColor);
      renderBoneTree(); renderBoneInspectorPanel(); renderTimeline(); renderStudioStage();
    }

    const ico = (n, s) => (global.PeroIcons ? global.PeroIcons.icon(n, { size: s || 17 }) : '');

    function stopStudioLoop() {
      studioPlaying = false;
      if (studioRaf) cancelAnimationFrame(studioRaf);
      studioRaf = null;
      $('stPlayBtn').innerHTML = `${ico('send', 17)}<span>Play</span>`;
    }

    function startStudioLoop() {
      studioPlaying = true;
      $('stPlayBtn').innerHTML = `${ico('toggle-left', 17)}<span>Pause</span>`;
      lastTs = performance.now();
      const step = (now) => {
        if (!studioPlaying) return;
        const proj = history.get();
        const delta = ((now - lastTs) / 1000 / (proj.durationMs / 1000)) * studioSpeed;
        if (loopMode === 'pingpong') {
          let next = studioTime + delta * pingDir;
          if (next >= 1) { next = 1 - (next - 1); pingDir = -1; }
          else if (next <= 0) { next = Math.abs(next); pingDir = 1; }
          studioTime = clamp(next, 0, 1);
        } else {
          studioTime = (studioTime + delta) % 1;
        }
        lastTs = now;
        renderStudioStage();
        $('tlPlayhead').style.left = `${studioTime * 100}%`;
        studioRaf = requestAnimationFrame(step);
      };
      studioRaf = requestAnimationFrame(step);
    }

    $('modeLibBtn').addEventListener('click', () => setMode('library'));
    $('modeAnimBtn').addEventListener('click', () => setMode('animate'));
    if ($('modeDesignBtn')) $('modeDesignBtn').addEventListener('click', () => setMode('design'));
    if ($('modeDocsBtn')) $('modeDocsBtn').addEventListener('click', () => setMode('docs'));
    $('newBlankBtn').addEventListener('click', () => loadProjectIntoStudio(T.createBlankProject(capColor, jacketColor)));

    function buildColorSwatches(boxId, isCap, isStudio) {
      const box = $(boxId);
      box.innerHTML = I.PRESET_COLORS.map(([n, hex]) => `<button type="button" class="c-dot" data-hex="${hex}" style="background:${hex}" title="${n}"></button>`).join('');
      box.querySelectorAll('.c-dot').forEach((btn) => btn.addEventListener('click', () => {
        const hex = btn.dataset.hex;
        if (isStudio) {
          const proj = JSON.parse(JSON.stringify(history.get()));
          if (isCap) proj.capColor = hex; else proj.jacketColor = hex;
          history.push(proj);
          applyColorVars(proj.capColor, proj.jacketColor);
        } else {
          const linked = libCtrl.isLinked();
          if (isCap) { capColor = hex; if (linked) jacketColor = hex; } else { jacketColor = hex; if (linked) capColor = hex; }
          applyColorVars(capColor, jacketColor); libCtrl.renderStage();
        }
      }));
    }
    buildColorSwatches('libCapSwatches', true, false);
    buildColorSwatches('libJacketSwatches', false, false);
    buildColorSwatches('stCapSwatches', true, true);
    buildColorSwatches('stJacketSwatches', false, true);

    $('stCapPicker').addEventListener('input', (e) => { const proj = history.get(); proj.capColor = e.target.value; applyColorVars(proj.capColor, proj.jacketColor); });
    $('stJacketPicker').addEventListener('input', (e) => { const proj = history.get(); proj.jacketColor = e.target.value; applyColorVars(proj.capColor, proj.jacketColor); });
    document.querySelectorAll('#stBgDots .bg-dot').forEach((d) => d.addEventListener('click', () => { $('studioStageWrap').classList.remove(studioBg); studioBg = d.dataset.bg; $('studioStageWrap').classList.add(studioBg); document.querySelectorAll('#stBgDots .bg-dot').forEach((x) => x.classList.toggle('active', x === d)); }));

    $('stPlayBtn').addEventListener('click', () => (studioPlaying ? stopStudioLoop() : startStudioLoop()));
    if ($('stStopBtn')) $('stStopBtn').addEventListener('click', () => { stopStudioLoop(); studioTime = 0; pingDir = 1; renderStudioAll(); });
    if ($('stPrevFrameBtn')) $('stPrevFrameBtn').addEventListener('click', () => { stopStudioLoop(); studioTime = clamp(studioTime - 0.05, 0, 1); renderStudioAll(); });
    if ($('stNextFrameBtn')) $('stNextFrameBtn').addEventListener('click', () => { stopStudioLoop(); studioTime = clamp(studioTime + 0.05, 0, 1); renderStudioAll(); });
    if ($('stSpeedSel')) $('stSpeedSel').addEventListener('change', (e) => { studioSpeed = parseFloat(e.target.value) || 1; });
    if ($('stLoopModeBtn')) $('stLoopModeBtn').addEventListener('click', () => { loopMode = loopMode === 'loop' ? 'pingpong' : 'loop'; $('stLoopModeBtn').innerHTML = `${ico('windmill', 17)}<span>${loopMode === 'loop' ? 'Loop' : 'Ping-Pong'}</span>`; $('stLoopModeBtn').classList.toggle('active', loopMode === 'pingpong'); });
    document.querySelectorAll('[data-tool]').forEach((btn) => btn.addEventListener('click', () => { toolMode = btn.dataset.tool; document.querySelectorAll('[data-tool]').forEach((b) => b.classList.toggle('active', b === btn)); }));

    if ($('stStarterSel')) {
      $('stStarterSel').innerHTML = '<option value="">Load Starter Motion...</option><option value="__blank__">Blank Neutral Pose</option>' + MOTIONS.map((m) => `<option value="${m.id}">${m.number} • ${m.name}</option>`).join('');
      $('stStarterSel').addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        loadProjectIntoStudio(val === '__blank__' ? T.createBlankProject(capColor, jacketColor) : T.presetToProject(MOTIONS.find((x) => x.id === val) || MOTIONS[0], capColor, jacketColor));
        e.target.value = '';
      });
    }

    let tlScrubbing = false;
    const scrubTimeline = (e) => { const r = $('tlRail').getBoundingClientRect(); studioTime = clamp((e.clientX - r.left) / r.width, 0, 1); stopStudioLoop(); renderStudioAll(); };
    $('tlTrack').addEventListener('pointerdown', (e) => { if (e.target.closest('.kf-diamond')) return; tlScrubbing = true; $('tlTrack').setPointerCapture(e.pointerId); scrubTimeline(e); });
    $('tlTrack').addEventListener('pointermove', (e) => { if (tlScrubbing) scrubTimeline(e); });
    $('tlTrack').addEventListener('pointerup', () => { tlScrubbing = false; });

    $('addKfBtn').addEventListener('click', () => { history.push(getOrCreateKeyframeAtCurrentTime().proj); renderStudioAll(); });
    $('delKfBtn').addEventListener('click', () => {
      const proj = JSON.parse(JSON.stringify(history.get()));
      if (proj.keyframes.length <= 2) return;
      const idx = proj.keyframes.findIndex((k) => Math.abs(k.t - studioTime) < 0.025);
      if (idx >= 0) { proj.keyframes.splice(idx, 1); history.push(proj); studioTime = proj.keyframes[0].t; renderStudioAll(); }
    });
    $('mirrorLoopBtn').addEventListener('click', () => {
      const proj = JSON.parse(JSON.stringify(history.get()));
      const sorted = [...proj.keyframes].sort((a, b) => a.t - b.t);
      const startPose = E.clonePose(sorted[0].pose);
      const endIdx = sorted.findIndex((k) => Math.abs(k.t - 1) < 0.01);
      if (endIdx >= 0) sorted[endIdx].pose = startPose; else sorted.push({ id: `kf-${Date.now()}`, t: 1, easing: 'easeInOut', pose: startPose });
      proj.keyframes = sorted; history.push(proj); renderStudioAll();
    });
    $('followThroughBtn').addEventListener('click', () => { const proj = JSON.parse(JSON.stringify(history.get())); proj.keyframes = E.applyAutoFollowThrough(proj.keyframes); history.push(proj); renderStudioAll(); });
    $('selEasing').addEventListener('change', (e) => { const { proj, kf } = getOrCreateKeyframeAtCurrentTime(); kf.easing = e.target.value; history.push(proj); renderTimeline(); });
    $('durRange').addEventListener('input', (e) => { history.get().durationMs = parseInt(e.target.value, 10); $('durLabel').textContent = `${(history.get().durationMs / 1000).toFixed(1)}s`; });
    $('projNameInput').addEventListener('input', (e) => { history.get().name = e.target.value; });
    $('undoBtn').addEventListener('click', () => { if (history.undo()) renderStudioAll(); });
    $('redoBtn').addEventListener('click', () => { if (history.redo()) renderStudioAll(); });
    $('gizmoToggleBtn').addEventListener('click', (e) => { showGizmos = !showGizmos; e.target.classList.toggle('active', showGizmos); renderStudioStage(); });
    $('onionToggleBtn').addEventListener('click', (e) => { showOnion = !showOnion; e.target.classList.toggle('active', showOnion); renderStudioStage(); });
    $('saveMotionBtn').addEventListener('click', () => { T.saveMotionToLibrary(history.get()); $('saveMotionBtn').innerHTML = `${ico('confetti', 16)}<span>Saved</span>`; setTimeout(() => { $('saveMotionBtn').innerHTML = `${ico('saved', 16)}<span>Save</span>`; }, 1200); });

    $('openExportBtn').addEventListener('click', () => $('exportModal').classList.remove('hidden'));
    $('closeExportBtn').addEventListener('click', () => $('exportModal').classList.add('hidden'));
    const setStatus = (msg) => { $('exportStatus').textContent = msg; };
    const getProjSchemes = () => { const p = history.get(); return { proj: p, cap: I.deriveScheme(p.capColor), jkt: I.deriveScheme(p.jacketColor) }; };

    $('expGifBtn').addEventListener('click', async () => { setStatus('Rendering GIF89a frames...'); const { proj, cap, jkt } = getProjSchemes(); const blob = await X.exportGif(proj, { size: parseInt($('expSizeSel').value, 10), fps: 20, background: $('expBgSel').value }, cap, jkt); X.downloadBlob(blob, `${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.gif`); setStatus(`Exported ${(blob.size / 1024).toFixed(1)} KB GIF!`); });
    $('expSvgBtn').addEventListener('click', () => { const { proj, cap, jkt } = getProjSchemes(); X.downloadBlob(new Blob([X.exportAnimatedSvg(proj, cap, jkt)], { type: 'image/svg+xml' }), `${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`); setStatus('Exported standalone Animated Vector SVG!'); });
    $('expLottieBtn').addEventListener('click', () => { const { proj, cap, jkt } = getProjSchemes(); X.downloadBlob(new Blob([X.exportLottieJson(proj, cap, jkt)], { type: 'application/json' }), `${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.lottie.json`); setStatus('Exported Lottie v5 JSON (import into Rive Editor for .riv)!'); });
    $('expSpriteBtn').addEventListener('click', async () => { setStatus('Building PNG sprite sheet...'); const { proj, cap, jkt } = getProjSchemes(); const blob = await X.exportSpriteSheet(proj, { size: 256, fps: 12, background: 'transparent' }, cap, jkt); X.downloadBlob(blob, `${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-sheet.png`); setStatus('Exported PNG Sprite Sheet!'); });
    $('expWebmBtn').addEventListener('click', async () => { try { setStatus('Recording WebM video...'); const { proj, cap, jkt } = getProjSchemes(); const blob = await X.exportWebm(proj, { size: 512, fps: 24, background: '#FFFFFF' }, cap, jkt); X.downloadBlob(blob, `${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.webm`); setStatus('Exported WebM video!'); } catch (err) { setStatus(String(err.message || err)); } });
    $('expProjBtn').addEventListener('click', () => { const { proj } = getProjSchemes(); X.downloadBlob(new Blob([JSON.stringify(proj, null, 2)], { type: 'application/json' }), `${proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pero.json`); setStatus('Exported .pero.json project file!'); });
    $('expReactBtn').addEventListener('click', async () => { const { proj } = getProjSchemes(); try { await navigator.clipboard.writeText(X.generateOperoAppCode(proj)); setStatus('Copied React <PeroMascot /> snippet!'); } catch (_) {} });
    $('importProjInput').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; const obj = JSON.parse(await f.text()); if (obj && Array.isArray(obj.keyframes)) loadProjectIntoStudio(obj); e.target.value = ''; });

    global.addEventListener('keydown', (e) => { if (mode === 'animate' && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey ? history.redo() : history.undo()) renderStudioAll(); } });

    global.__PERO_STUDIO__ = {
      setMode,
      loadProjectIntoStudio,
      getHistory: () => history,
      getStudioTime: () => studioTime,
      setStudioTime: (t) => { studioTime = clamp(t, 0, 1); renderStudioAll(); },
      exportGifTest: (opts) => { const { proj, cap, jkt } = getProjSchemes(); return X.exportGif(proj, opts || { size: 256, fps: 12 }, cap, jkt); },
      exportSvgTest: () => { const { proj, cap, jkt } = getProjSchemes(); return X.exportAnimatedSvg(proj, cap, jkt); },
      exportLottieTest: () => { const { proj, cap, jkt } = getProjSchemes(); return X.exportLottieJson(proj, cap, jkt); },
    };

    applyColorVars(capColor, jacketColor);
    if (global.PeroDesignSection) global.PeroDesignSection.initDesignSection(SVG_MAP);
    if (global.PeroDocsSection) global.PeroDocsSection.initDocsSection();
    const initHash = (global.location.hash || '').replace('#', '');
    if (['library', 'animate', 'design', 'docs'].includes(initHash)) setMode(initHash);
  }

  global.PeroStudioUI = { initStudio };
})(window);
