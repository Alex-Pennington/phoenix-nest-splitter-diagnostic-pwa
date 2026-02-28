function initTracer() {
  const sel = document.getElementById('trace-select');
  const wireGroup = document.getElementById('trace-wire-opts');
  WIRES.forEach(w => {
    const opt = document.createElement('option');
    opt.value = 'wire_' + w.id;
    opt.textContent = w.id + ' — ' + w.desc;
    wireGroup.appendChild(opt);
  });
  sel.addEventListener('change', () => renderTrace(sel.value));
  renderTrace('power');
}

function renderTrace(key) {
  const el = document.getElementById('trace-result');

  if (key.startsWith('wire_')) {
    renderSingleWire(el, key.replace('wire_', ''));
    return;
  }

  const c = CIRCUITS[key];
  if (!c) { el.innerHTML = ''; return; }

  let html = `<div class="trace-path"><div class="trace-label">${c.label}</div><div class="trace-flow">${pathToHTML(c.path)}</div>`;
  if (c.note) html += `<div class="trace-note">ℹ ${c.note}</div>`;
  html += '</div>';

  if (c.alt) {
    html += `<div class="trace-path" style="opacity:.85"><div class="trace-label">${c.alt.label}</div><div class="trace-flow">${pathToHTML(c.alt.path)}</div></div>`;
  }
  el.innerHTML = html;
}

function renderSingleWire(el, wireId) {
  const w = WIRES.find(x => x.id === wireId);
  if (!w) { el.innerHTML = ''; return; }
  const cls = w.color === 'RED' ? 'comp-power' : w.color === 'GRN' ? 'comp-solenoid' : 'comp-ground';
  const colorName = w.color === 'BLK' ? 'BLACK' : w.color === 'GRN' ? 'GREEN' : 'RED';
  const circuits = findCircuitsForWire(wireId);
  el.innerHTML = `
    <div class="trace-path">
      <div class="trace-label">${w.id} — ${w.desc}</div>
      <div class="trace-flow" style="margin-top:.4rem">
        <span class="trace-component ${cls}">${w.from}</span>
        <span class="trace-arrow">—</span>
        <span class="trace-wire">${w.id} · ${colorName} ${w.awg}AWG</span>
        <span class="trace-arrow">→</span>
        <span class="trace-component ${cls}">${w.to}</span>
      </div>
    </div>
    ${circuits.length ? `<div class="card"><div class="trace-circuits"><strong>Part of:</strong> ${circuits.join(', ')}</div></div>` : ''}`;
}

function pathToHTML(path) {
  return path.map(seg => {
    if (seg.wire) {
      return `<span class="trace-arrow">→</span><span class="trace-wire">${seg.wire}</span><span class="trace-arrow">→</span>`;
    }
    const cls = 'comp-' + seg.type;
    return `<span class="trace-component ${cls}">${seg.name}</span>`;
  }).join('');
}
