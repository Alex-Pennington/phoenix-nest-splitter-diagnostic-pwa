let installChecked = {};

function initInstall() {
  // Load saved progress from memory (not localStorage in PWA artifacts)
  installChecked = {};
  renderInstall();
}

function renderInstall() {
  const el = document.getElementById('install-content');
  const totalSteps = INSTALL_PHASES.reduce((n, p) => n + p.steps.length, 0);
  const doneSteps = Object.keys(installChecked).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);

  let html = `<div class="install-progress">
    <div class="prog-bar-wrap"><div class="prog-bar" style="width:${pct}%"></div></div>
    <div class="prog-text">${doneSteps}/${totalSteps}</div>
  </div>`;

  INSTALL_PHASES.forEach((phase, pi) => {
    const phaseStepIds = phase.steps.map(s => s.step);
    const phaseDone = phaseStepIds.every(id => installChecked[id]);
    const phaseOpen = !phaseDone && (pi === 0 || INSTALL_PHASES[pi-1].steps.every(s => installChecked[s.step]));
    const doneClass = phaseDone ? ' done' : '';
    const openClass = phaseOpen ? ' open' : '';

    html += `<div class="install-phase">
      <div class="phase-header${openClass}${doneClass}" onclick="togglePhase(this)">
        <span class="phase-icon">${phaseDone ? '✅' : phase.icon}</span>
        <span class="phase-title">${phase.phase}</span>
        <span class="phase-count">${phaseStepIds.filter(id => installChecked[id]).length}/${phaseStepIds.length}</span>
        <span class="phase-arrow">▶</span>
      </div>
      <div class="phase-steps${phaseOpen ? ' open' : ''}">`;

    phase.steps.forEach(s => {
      const checked = installChecked[s.step];
      const action = highlightWireRefs(s.action);

      html += `<div class="inst-step${checked ? ' completed' : ''}">
        <div class="step-top">
          <div class="step-check${checked ? ' checked' : ''}" onclick="toggleStep('${s.step}')">✓</div>
          <div class="step-num">${s.step}</div>
          <div class="step-action">${s.warn ? '<span class="step-warn">⚠ </span>' : ''}${action}</div>
        </div>`;

      if (s.test) {
        html += renderTestBlock(s.test);
      }

      html += `</div>`;
    });

    html += `</div></div>`;
  });

  html += `<button class="ts-restart" onclick="resetInstall()" style="margin-top:.5rem">↩ Reset All Progress</button>`;

  el.innerHTML = html;
}

function togglePhase(header) {
  header.classList.toggle('open');
  const steps = header.nextElementSibling;
  steps.classList.toggle('open');
}

function toggleStep(stepId) {
  if (installChecked[stepId]) {
    delete installChecked[stepId];
  } else {
    installChecked[stepId] = true;
  }
  renderInstall();
}

function resetInstall() {
  if (Object.keys(installChecked).length === 0) return;
  installChecked = {};
  renderInstall();
}

function renderTestBlock(raw) {
  const lines = raw.split('\n');
  let html = '<div class="step-test"><div class="test-title">⚠ TEST CHECKPOINT</div>';
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith('EXPECTED')) {
      html += `<div class="test-line expected">${line}</div>`;
    } else if (line.startsWith('If ')) {
      html += `<div class="test-line if-fail">${line}</div>`;
    } else {
      html += `<div class="test-line">${line}</div>`;
    }
  });
  html += '</div>';
  return html;
}

function highlightWireRefs(text) {
  return text.replace(/\b(W\d{2})\b/g, '<span class="wire-ref">$1</span>')
             .replace(/\b(SOL-[AB]|LS[12]|K[12]|D[1-4])\b/g, '<span class="wire-ref">$1</span>');
}
