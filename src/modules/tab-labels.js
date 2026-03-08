var wireLabels = {};

function initLabels() {
  try { wireLabels = JSON.parse(localStorage.getItem('pn-ls-002-labels') || '{}'); } catch(e) { wireLabels = {}; }
  renderLabels();
}

function saveLabels() {
  try { localStorage.setItem('pn-ls-002-labels', JSON.stringify(wireLabels)); } catch(e) {}
}

function renderLabels() {
  var el = document.getElementById('label-content');
  var total = WIRES.length;
  var done = Object.keys(wireLabels).filter(function(k){ return wireLabels[k] && wireLabels[k].trim(); }).length;
  var pct = Math.round((done/total)*100);
  var html = '<div class="install-progress"><div class="prog-bar-wrap"><div class="prog-bar" style="width:'+pct+'%"></div></div><div class="prog-text">'+done+'/'+total+'</div></div>';
  html += '<div class="card" style="margin-bottom:.8rem"><div style="font-size:.72rem;color:var(--fg2);line-height:1.6">Record the physical wire color, stripe, label, or marker used for each wire ID. This data is stored locally on this device.</div></div>';
  WIRES.forEach(function(w) {
    var val = wireLabels[w.id] || '';
    var cc = w.color === 'RED' ? 'wire-red' : w.color === 'GRN' ? 'wire-grn' : 'wire-blk';
    var colorName = w.color === 'BLK' ? 'BLACK' : w.color === 'GRN' ? 'GREEN' : 'RED';
    html += '<div class="label-row'+(val?' has-label':'')+'">';
    html += '<div class="label-wire"><span class="wire-id">'+w.id+'</span> <span class="'+cc+'">'+colorName+' '+w.awg+'</span></div>';
    html += '<div class="label-desc">'+w.from+' \u2192 '+w.to+'</div>';
    html += '<input class="label-input" data-wire="'+w.id+'" placeholder="e.g. red w/ blue stripe, terminal 3" value="'+val.replace(/"/g,'&quot;')+'">';
    html += '</div>';
  });
  html += '<button class="ts-restart" onclick="clearLabels()" style="margin-top:.5rem">\u21a9 Clear All Labels</button>';
  el.innerHTML = html;
  el.querySelectorAll('.label-input').forEach(function(inp) {
    inp.addEventListener('input', function() {
      wireLabels[this.dataset.wire] = this.value;
      saveLabels();
      this.closest('.label-row').className = 'label-row' + (this.value.trim() ? ' has-label' : '');
      var total = WIRES.length;
      var done = Object.keys(wireLabels).filter(function(k){ return wireLabels[k] && wireLabels[k].trim(); }).length;
      var pct = Math.round((done/total)*100);
      el.querySelector('.prog-bar').style.width = pct+'%';
      el.querySelector('.prog-text').textContent = done+'/'+total;
    });
  });
}

function clearLabels() {
  if (!Object.keys(wireLabels).some(function(k){ return wireLabels[k]; })) return;
  wireLabels = {};
  saveLabels();
  renderLabels();
}
