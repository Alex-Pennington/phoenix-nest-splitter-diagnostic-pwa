function initWiring() {
  buildWireTable('');
  document.getElementById('wire-search').addEventListener('input', e => buildWireTable(e.target.value));
}

function buildWireTable(filter) {
  const tbody = document.querySelector('#wire-table tbody');
  const f = filter.toLowerCase();
  const rows = WIRES.filter(w =>
    !f || w.id.toLowerCase().includes(f) || w.desc.toLowerCase().includes(f) ||
    w.from.toLowerCase().includes(f) || w.to.toLowerCase().includes(f) ||
    w.color.toLowerCase().includes(f)
  );
  tbody.innerHTML = rows.map(w => {
    const cc = w.color === 'RED' ? 'wire-red' : w.color === 'GRN' ? 'wire-grn' : 'wire-blk';
    const colorName = w.color === 'BLK' ? 'BLACK' : w.color === 'GRN' ? 'GREEN' : 'RED';
    return `<tr><td class="wire-id">${w.id}</td><td class="${cc}">${colorName}</td><td>${w.awg}</td><td>${w.from} \u2192 ${w.to}</td></tr>`;
  }).join('');
}

function buildRelayTable(el, relayKey) {
  const r = RELAY_PINS[relayKey];
  el.innerHTML = `<table class="tbl"><thead><tr><th>Terminal</th><th>Wire</th><th>Connection</th></tr></thead><tbody>` +
    r.pins.map(p => {
      const unused = p.wire === '\u2014';
      return `<tr><td class="wire-id">${p.pin}</td><td>${unused ? '<span class="unused">\u2014</span>' : p.wire}</td><td${unused ? ' class="unused"' : ''}>${p.conn}</td></tr>`;
    }).join('') + '</tbody></table>';
}
