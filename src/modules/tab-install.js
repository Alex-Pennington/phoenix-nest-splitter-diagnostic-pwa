let installChecked = {};

function initInstall() { installChecked = {}; renderInstall(); }

function renderInstall() {
  const el = document.getElementById('install-content');
  const totalSteps = INSTALL_PHASES.reduce((n,p) => n+p.steps.length, 0);
  const doneSteps = Object.keys(installChecked).length;
  const pct = Math.round((doneSteps/totalSteps)*100);

  let html = `<div class="install-progress"><div class="prog-bar-wrap"><div class="prog-bar" style="width:${pct}%"></div></div><div class="prog-text">${doneSteps}/${totalSteps}</div></div>`;

  INSTALL_PHASES.forEach((phase,pi) => {
    const ids=phase.steps.map(s=>s.step);
    const phaseDone=ids.every(id=>installChecked[id]);
    const phaseOpen=!phaseDone&&(pi===0||INSTALL_PHASES[pi-1].steps.every(s=>installChecked[s.step]));
    html += `<div class="install-phase"><div class="phase-header${phaseOpen?' open':''}${phaseDone?' done':''}" onclick="togglePhase(this)"><span class="phase-icon">${phaseDone?'\u2705':phase.icon}</span><span class="phase-title">${phase.phase}</span><span class="phase-count">${ids.filter(id=>installChecked[id]).length}/${ids.length}</span><span class="phase-arrow">\u25b6</span></div><div class="phase-steps${phaseOpen?' open':''}">`;
    phase.steps.forEach(s => {
      const checked=installChecked[s.step];
      const action=highlightWireRefs(s.action);
      html += `<div class="inst-step${checked?' completed':''}"><div class="step-top"><div class="step-check${checked?' checked':''}" onclick="toggleStep('${s.step}')">\u2713</div><div class="step-num">${s.step}</div><div class="step-action">${s.warn?'<span class="step-warn">\u26a0 </span>':''}${action}</div></div>`;
      if(s.test) html += renderTestBlock(s.test);
      html += '</div>';
    });
    html += '</div></div>';
  });
  html += `<button class="ts-restart" onclick="resetInstall()" style="margin-top:.5rem">\u21a9 Reset All Progress</button>`;
  el.innerHTML = html;
}

function togglePhase(h){ h.classList.toggle('open'); h.nextElementSibling.classList.toggle('open'); }
function toggleStep(id){ if(installChecked[id]) delete installChecked[id]; else installChecked[id]=true; renderInstall(); }
function resetInstall(){ if(!Object.keys(installChecked).length) return; installChecked={}; renderInstall(); }

function renderTestBlock(raw) {
  const lines=raw.split('\n');
  let html='<div class="step-test"><div class="test-title">\u26a0 TEST CHECKPOINT</div>';
  lines.forEach(line => { line=line.trim(); if(!line) return;
    if(line.startsWith('EXPECTED')) html+=`<div class="test-line expected">${line}</div>`;
    else if(line.startsWith('If')) html+=`<div class="test-line if-fail">${line}</div>`;
    else html+=`<div class="test-line">${line}</div>`;
  });
  return html+'</div>';
}

function highlightWireRefs(text) {
  return text.replace(/\b(W\d{2})\b/g,'<span class="wire-ref">$1</span>')
    .replace(/\b(SOL-[AB]|K[123]|D[1-5])\b/g,'<span class="wire-ref">$1</span>');
}
