let tsHistory = [];

function initTroubleshoot() { tsHistory = []; renderTsNode('start'); }

function renderTsNode(nodeId) {
  const flow = document.getElementById('ts-flow');
  const node = TS_TREE[nodeId];
  if (!node) return;
  if (nodeId === 'start') tsHistory = [{id:'start', label:'Start'}];
  renderBreadcrumb();
  flow.innerHTML = '';
  if (node.answer) {
    flow.innerHTML = renderAnswer(node.answer) + `<button class="ts-restart" onclick="tsRestart()">\u21a9 Start Over</button>`;
    return;
  }
  const div = document.createElement('div');
  div.className = 'ts-node';
  div.innerHTML = `<div class="ts-question">${node.q}</div><div class="ts-options">${node.opts.map(o => `<button class="ts-btn" onclick="tsChoose('${o.next}','${escAttr(o.label)}')">${o.label}</button>`).join('')}</div>`;
  flow.appendChild(div);
  flow.appendChild(createRestartBtn());
}

function tsChoose(nextId, label) {
  tsHistory.push({id:nextId, label:label});
  renderTsNode(nextId);
  document.querySelector('.content').scrollTop = 0;
}

function tsRestart() { tsHistory=[]; renderTsNode('start'); document.querySelector('.content').scrollTop=0; }

function tsJumpTo(index) { tsHistory=tsHistory.slice(0,index+1); renderTsNode(tsHistory[index].id); }

function renderBreadcrumb() {
  const bc = document.getElementById('ts-breadcrumb');
  if (tsHistory.length<=1) { bc.innerHTML=''; return; }
  bc.innerHTML = tsHistory.map((h,i) => {
    const isLast = i===tsHistory.length-1;
    const text = i===0 ? '\u27f5 Start' : truncate(h.label,20);
    return (i>0?'<span class="sep">\u203a</span>':'') +
      (isLast?`<span style="color:var(--accent)">${text}</span>`:`<span onclick="tsJumpTo(${i})">${text}</span>`);
  }).join('');
}

function renderAnswer(raw) {
  const lines = raw.split('|');
  let html = '<div class="ts-answer">';
  lines.forEach((line,i) => {
    line = line.trim();
    if (i===0) html += `<strong>${line}</strong>`;
    else if (line.startsWith('FIX:')) html += `<div class="line"><span class="fix">\u2713 ${line}</span></div>`;
    else if (line.startsWith('WARNING:')||line.startsWith('Do NOT')) html += `<div class="line"><span class="warn">\u26a0 ${line}</span></div>`;
    else if (line.startsWith('TRACE:')||line.startsWith('CHECK:')) html += `<div class="trace">${line}</div>`;
    else html += `<div class="line">${line}</div>`;
  });
  return html+'</div>';
}

function createRestartBtn() {
  const btn=document.createElement('button'); btn.className='ts-restart';
  btn.textContent='\u21a9 Start Over'; btn.onclick=tsRestart; return btn;
}

function truncate(s,n){ return s.length>n?s.slice(0,n)+'\u2026':s; }
function escAttr(s){ return s.replace(/'/g,"\\'").replace(/"/g,'&quot;'); }
