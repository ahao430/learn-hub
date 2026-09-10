/* ═══════════ circle.js · 动画2：数轴卷圆（看见同余类） ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const canvas = $('circleCanvas');
  if (!canvas) return;

  let env = null;
  let state = { m: 6, N: 30, n: -1, flying: null, timer: null, done: false };
  let rAFon = false;

  function geometry() {
    const { w, h } = env;
    const lineY = h / 2;
    const lineX0 = 16, lineX1 = w * 0.52;
    const cx = w * 0.755, cy = h / 2;
    const R = Math.min(w * 0.20, h / 2 - 42);
    return { lineY, lineX0, lineX1, cx, cy, R };
  }
  function linePos(n, g) {
    const t = state.N <= 0 ? 0 : n / state.N;
    return { x: g.lineX0 + (g.lineX1 - g.lineX0) * t, y: g.lineY };
  }
  function slotPos(r, g) {
    const ang = (r / state.m) * Math.PI * 2 - Math.PI / 2;
    return { x: g.cx + Math.cos(ang) * g.R, y: g.cy + Math.sin(ang) * g.R, ang };
  }

  function draw() {
    if (!env) env = TOPIC.VE.setupCanvas(canvas, 340);
    const { ctx, w, h } = env;
    const g = geometry();
    ctx.clearRect(0, 0, w, h);

    /* 数轴 */
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(g.lineX0 - 8, g.lineY); ctx.lineTo(g.lineX1 + 8, g.lineY); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11.5px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText('数轴 0 … ' + state.N, g.lineX0, g.lineY - 26);

    for (let n = 0; n <= state.N; n++) {
      const p = linePos(n, g);
      const lit = n <= state.n;
      const col = TOPIC.VE.residueColor(n % state.m, state.m);
      ctx.beginPath(); ctx.arc(p.x, p.y, lit ? 7 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = lit ? col : '#e2e8f0';
      ctx.fill();
      if (n % Math.ceil((state.N + 1) / 16) === 0 || n === state.N) {
        ctx.fillStyle = lit ? col : '#94a3b8';
        ctx.font = (n === state.n ? '700 12.5px' : '11px') + ' Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(n, p.x, p.y + 9);
      }
    }

    /* 卷曲箭头 */
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo((g.lineX1 + g.cx) / 2, g.lineY - 8);
    ctx.quadraticCurveTo(g.cx, g.lineY - 52, g.cx + g.R + 26, g.cy - 10);
    ctx.stroke(); ctx.setLineDash([]);

    /* 圆与辐条 */
    ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, 0, Math.PI * 2);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R - 13, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1; ctx.stroke();

    /* 各余数槽：辐条 + 槽号 + 堆叠点 */
    for (let r = 0; r < state.m; r++) {
      const s = slotPos(r, g);
      ctx.beginPath(); ctx.moveTo(g.cx, g.cy); ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = TOPIC.VE.residueColor(r, state.m) + '66'; ctx.lineWidth = 2; ctx.stroke();

      ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, s.ang - Math.PI / state.m + 0.03, s.ang + Math.PI / state.m - 0.03);
      ctx.strokeStyle = TOPIC.VE.residueColor(r, state.m); ctx.lineWidth = 5; ctx.stroke();

      const lx = g.cx + Math.cos(s.ang) * (g.R + 20), ly = g.cy + Math.sin(s.ang) * (g.R + 20);
      ctx.beginPath(); ctx.arc(lx, ly, 13, 0, Math.PI * 2);
      ctx.fillStyle = TOPIC.VE.residueColor(r, state.m); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 13px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(r, lx, ly + 0.5);

      /* 堆叠计数点（沿辐条向内排布） */
      let c = 0;
      for (let n = r === 0 ? 0 : r; n <= state.n; n += state.m) c++;
      if (c > 0) {
        for (let i = 0; i < Math.min(c, 9); i++) {
          const off = 15 + i * 7;
          const px = g.cx + Math.cos(s.ang) * (g.R - off), py = g.cy + Math.sin(s.ang) * (g.R - off);
          ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = TOPIC.VE.residueColor(r, state.m); ctx.fill();
        }
        if (c > 9) {
          const px = g.cx + Math.cos(s.ang) * (g.R - 15 - 9 * 7), py = g.cy + Math.sin(s.ang) * (g.R - 15 - 9 * 7);
          ctx.fillStyle = TOPIC.VE.residueColor(r, state.m); ctx.font = '700 10px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('+' + (c - 9), px, py);
        }
      }
    }

    /* 飞行中的数字（贝塞尔） */
    if (state.flying) {
      const { n, p01 } = state.flying;
      const from = linePos(n, g);
      const to = slotPos(n % state.m, g);
      const mx = (from.x + to.x) / 2 + 30, my = Math.min(from.y, to.y) - 80;
      const x = (1 - p01) ** 2 * from.x + 2 * (1 - p01) * p01 * mx + p01 ** 2 * to.x;
      const y = (1 - p01) ** 2 * from.y + 2 * (1 - p01) * p01 * my + p01 ** 2 * to.y;
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = TOPIC.VE.residueColor(n % state.m, state.m); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#0f172a'; ctx.font = '700 11px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n, x, y + 0.5);
    }
  }

  function loop() {
    if (rAFon) return;
    rAFon = true;
    const step = () => {
      if (state.flying) {
        state.flying.p01 = Math.min(1, state.flying.p01 + 0.028);
        if (state.flying.p01 >= 1) state.flying = null;
      }
      draw();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function legend() {
    const el = $('circleLegend');
    el.innerHTML = '';
    if (state.n < 0) { el.innerHTML = '<span class="legend-item">点击"卷起来"，看数字飞到自己的余数槽里</span>'; return; }
    for (let r = 0; r < state.m; r++) {
      const members = [];
      for (let n = r; n <= state.n; n += state.m) members.push(n === 0 && r === 0 ? 0 : n);
      if (!members.length) continue;
      const item = document.createElement('span');
      item.className = 'legend-item';
      item.innerHTML = `<i style="background:${TOPIC.VE.residueColor(r, state.m)}"></i>余 ${r}：${members.join(', ')}${state.done ? '' : ' …'}`;
      el.appendChild(item);
    }
  }

  function stop() { if (state.timer) { clearInterval(state.timer); state.timer = null; } }

  function reset() {
    stop();
    state.n = -1; state.flying = null; state.done = false;
    env = TOPIC.VE.setupCanvas(canvas, 340);
    draw(); legend(); loop();
  }

  $('circlePlay').addEventListener('click', () => {
    reset();
    const interval = Math.max(160, Math.min(520, 13000 / (state.N + 1)));
    state.timer = setInterval(() => {
      if (state.n >= state.N) {
        stop(); state.done = true; legend();
        return;
      }
      state.n++;
      state.flying = { n: state.n, p01: 0 };
      if (state.n % Math.max(1, Math.floor(state.N / 6)) === 0) legend();
    }, interval);
  });

  $('circleReset').addEventListener('click', reset);
  $('circleMod').addEventListener('input', () => {
    $('circleModVal').textContent = $('circleMod').value;
    state.m = Number($('circleMod').value);
    reset();
  });
  $('circleMax').addEventListener('change', () => {
    state.N = Math.max(10, Math.min(60, Math.trunc(Number($('circleMax').value) || 30)));
    $('circleMax').value = state.N;
    reset();
  });

  window.addEventListener('resize', () => { env = TOPIC.VE.setupCanvas(canvas, 340); });
  reset();
})();
