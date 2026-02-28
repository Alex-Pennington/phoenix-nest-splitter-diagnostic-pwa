let sim = {
  pos: 0,         // 0=home, 100=full extend
  k1: false,
  k2: false,
  solA: false,
  solB: false,
  ls1: false,      // true = actuated (circuit open)
  ls2: true,       // true = actuated (at home, circuit open)
  estop: false,
  jogging: null,   // 'fwd' or 'bwd' or null
  cycling: false,
  phase: 'idle',   // idle, extending, retracting, estop
  animFrame: null,
  lastTime: 0,
};

const SIM_SPEED = 40; // % per second

function initSimulator() {
  simReset();
  simRender();
}

function simReset() {
  sim.pos = 0; sim.k1 = false; sim.k2 = false;
  sim.solA = false; sim.solB = false;
  sim.ls1 = false; sim.ls2 = true;
  sim.estop = false; sim.jogging = null;
  sim.cycling = false; sim.phase = 'idle';
  if (sim.animFrame) cancelAnimationFrame(sim.animFrame);
  sim.animFrame = null;
}

function simJog(dir, pressed) {
  if (sim.estop) return;
  if (pressed) {
    sim.jogging = dir;
    sim.solA = (dir === 'fwd');
    sim.solB = (dir === 'bwd');
    startSimLoop();
  } else {
    if (sim.jogging === dir) {
      sim.jogging = null;
      if (!sim.cycling) {
        sim.solA = false;
        sim.solB = false;
        sim.phase = 'idle';
      }
    }
  }
  simRender();
}

function simCycle() {
  if (sim.estop) return;
  if (sim.cycling) return;
  if (sim.pos > 5) {
    simSetStatus('⚠ Jog to HOME first (use BWD)');
    return;
  }
  sim.cycling = true;
  sim.k1 = true;
  sim.k2 = true;
  sim.solA = true;
  sim.solB = false;
  sim.phase = 'extending';
  startSimLoop();
  simRender();
}

function simEstop() {
  sim.estop = true;
  sim.k1 = false; sim.k2 = false;
  sim.solA = false; sim.solB = false;
  sim.cycling = false; sim.jogging = null;
  sim.phase = 'estop';
  simRender();
  // Auto-release after 2s for demo
  setTimeout(() => {
    sim.estop = false;
    sim.phase = 'idle';
    simRender();
  }, 2000);
}

function startSimLoop() {
  if (sim.animFrame) return;
  sim.lastTime = performance.now();
  sim.animFrame = requestAnimationFrame(simTick);
}

function simTick(now) {
  const dt = (now - sim.lastTime) / 1000;
  sim.lastTime = now;

  if (sim.estop) {
    sim.animFrame = null;
    return;
  }

  let moving = false;

  // Jog movement
  if (sim.jogging === 'fwd' && sim.pos < 100) {
    sim.pos = Math.min(100, sim.pos + SIM_SPEED * dt);
    moving = true;
  }
  if (sim.jogging === 'bwd' && sim.pos > 0) {
    sim.pos = Math.max(0, sim.pos - SIM_SPEED * dt);
    moving = true;
  }

  // Cycle movement
  if (sim.cycling) {
    if (sim.phase === 'extending' && sim.solA) {
      sim.pos = Math.min(100, sim.pos + SIM_SPEED * dt);
      moving = true;
    }
    if (sim.phase === 'retracting' && sim.solB) {
      sim.pos = Math.max(0, sim.pos - SIM_SPEED * dt);
      moving = true;
    }
  }

  // Limit switch logic
  sim.ls1 = (sim.pos >= 98);
  sim.ls2 = (sim.pos <= 2);

  // Auto-cycle state transitions
  if (sim.cycling) {
    if (sim.phase === 'extending' && sim.ls1) {
      // LS1 opens → K2 drops → changeover → retract
      sim.k2 = false;
      sim.solA = false;
      sim.solB = true;
      sim.phase = 'retracting';
    }
    if (sim.phase === 'retracting' && sim.ls2) {
      // LS2 opens → K1 drops → cycle complete
      sim.k1 = false; sim.k2 = false;
      sim.solA = false; sim.solB = false;
      sim.cycling = false;
      sim.phase = 'idle';
    }
  }

  // Update jog limit switches
  if (sim.jogging === 'fwd' && sim.pos >= 100) moving = false;
  if (sim.jogging === 'bwd' && sim.pos <= 0) moving = false;

  simRender();

  if (moving || sim.cycling) {
    sim.animFrame = requestAnimationFrame(simTick);
  } else {
    sim.animFrame = null;
  }
}

function simRender() {
  // Buttons
  document.getElementById('sim-fwd').className = 'sim-btn' + (sim.jogging === 'fwd' ? ' active-fwd' : '');
  document.getElementById('sim-bwd').className = 'sim-btn' + (sim.jogging === 'bwd' ? ' active-bwd' : '');
  document.getElementById('sim-cycle').className = 'sim-btn' + (sim.cycling ? ' active-cycle' : '');
  document.getElementById('sim-estop').className = 'sim-btn' + (sim.estop ? ' active-estop' : '');

  // Status
  const statusMap = {
    idle: '<span class="state">IDLE</span> — Ready',
    extending: '<span class="state">EXTENDING</span> — K1 latched, K2 on, SOL-A firing',
    retracting: '<span class="state">RETRACTING</span> — K1 latched, K2 off, SOL-B firing',
    estop: '<span class="state" style="color:var(--red)">E-STOP</span> — All power killed',
  };
  let statusText = statusMap[sim.phase] || '';
  if (sim.jogging === 'fwd' && !sim.cycling) statusText = '<span class="state">JOG FWD</span> — Manual extend';
  if (sim.jogging === 'bwd' && !sim.cycling) statusText = '<span class="state">JOG BWD</span> — Manual retract';
  document.getElementById('sim-status').innerHTML = statusText;

  // Component grid
  setSimItem('si-k1', sim.k1);
  setSimItem('si-k2', sim.k2);
  setSimItem('si-sola', sim.solA);
  setSimItem('si-solb', sim.solB);
  setSimItem('si-ls1', sim.ls1);
  setSimItem('si-ls2', sim.ls2);

  // Cylinder
  const pct = Math.max(10, sim.pos);
  document.getElementById('cyl-rod').style.width = pct + '%';
  document.getElementById('cyl-ls2').className = 'cyl-ls' + (sim.ls2 ? ' active' : '');
  document.getElementById('cyl-ls1').className = 'cyl-ls' + (sim.ls1 ? ' active' : '');
}

function setSimItem(id, on) {
  const el = document.getElementById(id);
  el.className = 'sim-item ' + (on ? 'on' : 'off');
}

function simSetStatus(msg) {
  document.getElementById('sim-status').innerHTML = msg;
}
