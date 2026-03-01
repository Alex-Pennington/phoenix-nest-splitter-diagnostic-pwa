let sim = {
  pos: 0, k1: false, k2: false, k3: false,
  solA: false, solB: false,
  extLim: false, retLim: true,
  estop: false, jogging: null,
  cycling: false, phase: 'idle',
  animFrame: null, lastTime: 0,
};
const SIM_SPEED = 40;

function initSimulator() { simReset(); simRender(); }

function simReset() {
  sim.pos=0; sim.k1=false; sim.k2=false; sim.k3=false;
  sim.solA=false; sim.solB=false;
  sim.extLim=false; sim.retLim=true;
  sim.estop=false; sim.jogging=null;
  sim.cycling=false; sim.phase='idle';
  if(sim.animFrame) cancelAnimationFrame(sim.animFrame);
  sim.animFrame=null;
}

function simJog(dir, pressed) {
  if(sim.estop) return;
  if(pressed) {
    sim.jogging=dir;
    sim.solA=(dir==='fwd'); sim.solB=(dir==='bwd');
    startSimLoop();
  } else {
    if(sim.jogging===dir) {
      sim.jogging=null;
      if(!sim.cycling) { sim.solA=false; sim.solB=false; sim.phase='idle'; }
    }
  }
  simRender();
}

function simCycle() {
  if(sim.estop) return;
  if(sim.cycling) return;
  if(sim.retLim) {
    simSetStatus('\u26a0 Tap FWD to nudge off home first, then CYCLE');
    return;
  }
  sim.cycling=true; sim.k1=true; sim.k2=true; sim.k3=false;
  sim.solA=true; sim.solB=false; sim.phase='extending';
  startSimLoop(); simRender();
}

function simEstop() {
  sim.estop=true; sim.k1=false; sim.k2=false; sim.k3=false;
  sim.solA=false; sim.solB=false; sim.cycling=false; sim.jogging=null;
  sim.phase='estop'; simRender();
  setTimeout(()=>{ sim.estop=false; sim.phase='idle'; simRender(); }, 2000);
}

function startSimLoop() {
  if(sim.animFrame) return;
  sim.lastTime=performance.now();
  sim.animFrame=requestAnimationFrame(simTick);
}

function simTick(now) {
  const dt=(now-sim.lastTime)/1000; sim.lastTime=now;
  if(sim.estop){ sim.animFrame=null; return; }
  let moving=false;

  if(sim.jogging==='fwd'&&sim.pos<100){ sim.pos=Math.min(100,sim.pos+SIM_SPEED*dt); moving=true; }
  if(sim.jogging==='bwd'&&sim.pos>0){ sim.pos=Math.max(0,sim.pos-SIM_SPEED*dt); moving=true; }

  if(sim.cycling) {
    if(sim.phase==='extending'&&sim.solA){ sim.pos=Math.min(100,sim.pos+SIM_SPEED*dt); moving=true; }
    if(sim.phase==='retracting'&&sim.solB){ sim.pos=Math.max(0,sim.pos-SIM_SPEED*dt); moving=true; }
  }

  sim.extLim=(sim.pos>=98);
  sim.retLim=(sim.pos<=2);

  if(sim.cycling) {
    // K3 latches when extend limit closes, stays latched via seal
    if(sim.extLim && !sim.k3) {
      sim.k3=true; // K3 latches
      sim.k2=false; // K3 NC opens, killing K2
      sim.solA=false; sim.solB=true;
      sim.phase='retracting';
    }
    // K2 stays off because K3 is latched (seal holds K3 on)
    // No bounce possible

    if(sim.phase==='retracting'&&sim.retLim) {
      sim.k1=false; sim.k2=false; sim.k3=false;
      sim.solA=false; sim.solB=false;
      sim.cycling=false; sim.phase='idle';
    }
  }

  simRender();
  if(moving||sim.cycling) sim.animFrame=requestAnimationFrame(simTick);
  else sim.animFrame=null;
}

function simRender() {
  document.getElementById('sim-fwd').className='sim-btn'+(sim.jogging==='fwd'?' active-fwd':'');
  document.getElementById('sim-bwd').className='sim-btn'+(sim.jogging==='bwd'?' active-bwd':'');
  document.getElementById('sim-cycle').className='sim-btn'+(sim.cycling?' active-cycle':'');
  document.getElementById('sim-estop').className='sim-btn'+(sim.estop?' active-estop':'');

  const statusMap = {
    idle:'<span class="state">IDLE</span> \u2014 Ready',
    extending:'<span class="state">EXTENDING</span> \u2014 K1+K2 on, SOL-A firing',
    retracting:'<span class="state">RETRACTING</span> \u2014 K1+K3 on, K2 locked off, SOL-B firing',
    estop:'<span class="state" style="color:var(--red)">E-STOP</span> \u2014 All power killed',
  };
  let st=statusMap[sim.phase]||'';
  if(sim.jogging==='fwd'&&!sim.cycling) st='<span class="state">JOG FWD</span> \u2014 Manual extend';
  if(sim.jogging==='bwd'&&!sim.cycling) st='<span class="state">JOG BWD</span> \u2014 Manual retract';
  document.getElementById('sim-status').innerHTML=st;

  setSimItem('si-k1',sim.k1); setSimItem('si-k2',sim.k2); setSimItem('si-k3',sim.k3);
  setSimItem('si-sola',sim.solA); setSimItem('si-solb',sim.solB);
  setSimItem('si-extlim',sim.extLim); setSimItem('si-retlim',sim.retLim);

  document.getElementById('cyl-rod').style.width=Math.max(10,sim.pos)+'%';
  document.getElementById('cyl-retlim').className='cyl-ls'+(sim.retLim?' active':'');
  document.getElementById('cyl-extlim').className='cyl-ls'+(sim.extLim?' active':'');
}

function setSimItem(id,on){ document.getElementById(id).className='sim-item '+(on?'on':'off'); }
function simSetStatus(msg){ document.getElementById('sim-status').innerHTML=msg; }
