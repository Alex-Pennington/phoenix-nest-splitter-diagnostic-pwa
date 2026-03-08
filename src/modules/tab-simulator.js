const SIM_SPEED = 45;
let sim = {
  pos:0, k1:false, k2:false, k3:false, nodeX:false,
  solA:false, solB:false, extLim:false, retLim:true,
  estop:false, jogging:null, cycling:false, cycleButtonHeld:false,
  phase:'idle', animFrame:null, lastTime:0,
};

function initSimulator() {
  simRender();
}

function simUpdateLimits() {
  sim.extLim = (sim.pos >= 98);
  sim.retLim = (sim.pos <= 2);
}

function simEvaluate() {
  if (sim.estop) {
    sim.k1=false; sim.k2=false; sim.k3=false; sim.nodeX=false;
    sim.solA=false; sim.solB=false; sim.cycling=false; sim.jogging=null;
    sim.phase='estop'; return;
  }
  var fwdNC = (sim.jogging !== 'fwd');
  var bwdNC = (sim.jogging !== 'bwd');
  var retLimNC = !sim.retLim;
  var sealIntact = sim.k1 && fwdNC && bwdNC && retLimNC;
  sim.k1 = sim.cycleButtonHeld || sealIntact;
  sim.nodeX = sim.k1;
  if (sim.nodeX && sim.extLim && !sim.k3) { sim.k3 = true; }
  if (!sim.nodeX) { sim.k3 = false; }
  var k3NC = !sim.k3;
  sim.k2 = sim.nodeX && k3NC;
  var autoExtend = sim.k1 && sim.nodeX && sim.k2;
  var autoRetract = sim.k1 && sim.nodeX && !sim.k2 && sim.k3;
  var jogSolA = (sim.jogging === 'fwd');
  var jogSolB = (sim.jogging === 'bwd');
  sim.solA = autoExtend || jogSolA;
  sim.solB = autoRetract || jogSolB;
  if (sim.k1 && sim.k2 && !sim.k3) {
    sim.phase = 'extending'; sim.cycling = true;
  } else if (sim.k1 && sim.k3 && !sim.k2) {
    sim.phase = 'retracting';
  } else if (!sim.k1 && !sim.k2 && !sim.k3) {
    sim.cycling = false;
    if (sim.jogging) sim.phase = sim.jogging === 'fwd' ? 'jog_fwd' : 'jog_bwd';
    else sim.phase = 'idle';
  }
}

function simJog(dir, pressed) {
  if (sim.estop) return;
  if (pressed) { sim.jogging = dir; startSimLoop(); }
  else { if (sim.jogging === dir) sim.jogging = null; }
  simEvaluate(); simRender();
}

function simCycle(pressed) {
  if (sim.estop) return;
  sim.cycleButtonHeld = pressed;
  if (pressed && !sim.cycling) startSimLoop();
  simEvaluate(); simRender();
}

function simEstop() {
  sim.estop = true; sim.cycleButtonHeld = false;
  simEvaluate(); simRender();
  setTimeout(function() {
    sim.estop = false; sim.phase = 'idle';
    simUpdateLimits(); simEvaluate(); simRender();
  }, 2000);
}

function startSimLoop() {
  if (sim.animFrame) return;
  sim.lastTime = performance.now();
  sim.animFrame = requestAnimationFrame(simTick);
}

function simTick(now) {
  var dt = (now - sim.lastTime) / 1000; sim.lastTime = now;
  if (sim.estop) { sim.animFrame = null; return; }
  var moving = false;
  if (sim.solA && sim.pos < 100) { sim.pos = Math.min(100, sim.pos + SIM_SPEED * dt); moving = true; }
  if (sim.solB && sim.pos > 0) { sim.pos = Math.max(0, sim.pos - SIM_SPEED * dt); moving = true; }
  simUpdateLimits(); simEvaluate(); simRender();
  if (moving || sim.cycling || sim.jogging) sim.animFrame = requestAnimationFrame(simTick);
  else sim.animFrame = null;
}

function simRender() {
  document.getElementById('sim-fwd').className='sim-btn'+(sim.jogging==='fwd'?' active-fwd':'');
  document.getElementById('sim-bwd').className='sim-btn'+(sim.jogging==='bwd'?' active-bwd':'');
  document.getElementById('sim-cycle').className='sim-btn'+(sim.cycling?' active-cycle':'');
  document.getElementById('sim-estop').className='sim-btn'+(sim.estop?' active-estop':'');
  var statusMap = {
    idle:'<span class="state">IDLE</span> \u2014 Ready',
    extending:'<span class="state">EXTENDING</span> \u2014 K1+K2 on, SOL-A firing',
    retracting:'<span class="state">RETRACTING</span> \u2014 K1+K3 on, K2 locked off, SOL-B firing',
    jog_fwd:'<span class="state">JOG FWD</span> \u2014 Manual extend (cycle killed)',
    jog_bwd:'<span class="state">JOG BWD</span> \u2014 Manual retract (cycle killed)',
    estop:'<span class="state" style="color:var(--red)">E-STOP</span> \u2014 All power killed',
  };
  document.getElementById('sim-status').innerHTML=statusMap[sim.phase]||'';
  setSimItem('si-k1',sim.k1); setSimItem('si-k2',sim.k2); setSimItem('si-k3',sim.k3);
  setSimItem('si-sola',sim.solA); setSimItem('si-solb',sim.solB);
  setSimItem('si-extlim',sim.extLim); setSimItem('si-retlim',sim.retLim);
  document.getElementById('cyl-rod').style.width=Math.max(10,sim.pos)+'%';
  document.getElementById('cyl-retlim').className='cyl-ls'+(sim.retLim?' active':'');
  document.getElementById('cyl-extlim').className='cyl-ls'+(sim.extLim?' active':'');
}

function setSimItem(id,on){ document.getElementById(id).className='sim-item '+(on?'on':'off'); }
