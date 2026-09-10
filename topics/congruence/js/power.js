/* ═══════════ power.js · 动画5：幂循环节转盘 a^k mod n ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const canvas = $('powerCanvas');
  if (!canvas) return;

  let env = null;
  let state = {
    a: 5, n: 7,
    seq: [1],        // 依次访问的余数序列，seq[0] = 1 (k=0)
    cur: 0,          // 当前 k
    cycleStart: -1,  // 循环起点（首次出现的下标）
    anim: null,      // {from,to,p01,k}
    timer: null
  };
  let rAFon = false;

  function value() { return state.seq[state.seq.length - 1]; }
  function cycleLen() { return state.cycleStart < 0 ? null : state.seq.length - 1 - state.cycleStart; }

  function slotPos(r, g) {
    const ang = (r / state.n) * Math.PI * 2 - Math.PI / 2;
    return { x: g.cx + Math.cos(ang) * g.R, y: g.cy + Math.sin(ang) * g.R, ang };
  }
  function geometry() {
    const { w, h } = env;
    const cx = w / 2, cy = h / 2 + 4;
    const R = Math.min(w, h) / 2 - 44;
    return { cx, cy, R };
  }

  function chordColor(k) {
    if (state.cycleStart >= 0 && k >= state.cycleStart) return 'rgba(225,29,72,.75)';
    return 'rgba(100,116,139,.45)';
  }

  function draw() {
    if (!env) env = TOPIC.VE.setupCanvas(canvas, 360);
    const { ctx, w, h } = env;
    const g = geometry();
    ctx.clearRect(0, 0, w, h);

    /* 外圈 */
    ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.stroke();

    /* 数字槽 */
    for (let r = 0; r < state.n; r++) {
      const s = slotPos(r, g);
      const inSeq = state.seq.includes(r);
      const isCur = r === value() && !state.anim;
      ctx.beginPath(); ctx.arc(s.x, s.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = isCur ? '#e11d48' : (inSeq ? '#fff1f2' : '#ffffff');
      ctx.strokeStyle = inSeq ? '#fda4af' : '#cbd5e1';
      ctx.lineWidth = isCur ? 3 : 1.5;
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = isCur ? '#fff' : (inSeq ? '#be123c' : '#94a3b8');
      ctx.font = (isCur ? '700 14px' : '12.5px') + ' Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(r, s.x, s.y + 0.5);
    }

    /* 已走弦线 */
    for (let k = 1; k < state.seq.length; k++) {
      const p1 = slotPos(state.seq[k - 1], g), p2 = slotPos(state.seq[k], g);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = chordColor(k);
      ctx.lineWidth = k === state.seq.length - 1 ? 2.6 : 1.8;
      ctx.stroke();
    }

    /* 起点标记 */
    const s0 = slotPos(1, g);
    ctx.fillStyle = '#334155'; ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('起点 1', s0.x, s0.y - 24);

    /* 飞行动点 */
    if (state.anim) {
      const { from, to, p01 } = state.anim;
      const p1 = slotPos(from, g), p2 = slotPos(to, g);
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const lift = Math.min(46, d * 0.25);
      const nx = -(p2.y - p1.y) / (d || 1), ny = (p2.x - p1.x) / (d || 1);
      const cxq = mx + nx * lift, cyq = my + ny * lift;
      const x = (1 - p01) ** 2 * p1.x + 2 * (1 - p01) * p01 * cxq + p01 ** 2 * p2.x;
      const y = (1 - p01) ** 2 * p1.y + 2 * (1 - p01) * p01 * cyq + p01 ** 2 * p2.y;
      ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#e11d48'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    }

    /* 中心标注 */
    ctx.fillStyle = '#0f172a'; ctx.font = '800 22px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`${state.a}^${state.cur}`, g.cx, g.cy - 10);
    ctx.fillStyle = '#e11d48'; ctx.font = '800 17px Georgia, serif';
    ctx.fillText('mod ' + state.n, g.cx, g.cy + 16);
  }

  function loop() {
    if (rAFon) return;
    rAFon = true;
    const step = () => {
      if (state.anim) {
        state.anim.p01 = Math.min(1, state.anim.p01 + 0.025);
        if (state.anim.p01 >= 1) { state.anim = null; syncSide(); }
      }
      draw();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function syncSide() {
    $('powerK').textContent = state.cur;
    $('powerVal').textContent = value();
    const L = cycleLen();
    $('powerCycle').textContent = L === null ? '—' : L;
    const seqEl = $('powerSeq');
    seqEl.innerHTML = '';
    state.seq.forEach((v, k) => {
      const it = document.createElement('span');
      it.className = 'ps-item' + (state.cycleStart >= 0 && k >= state.cycleStart ? ' cycle' : '') +
        (k === state.seq.length - 1 ? ' now' : '');
      it.innerHTML = `<span class="e">${k}:</span>${v}`;
      seqEl.appendChild(it);
    });
    seqEl.scrollTop = seqEl.scrollHeight;
  }

  /* 前进一步：v ← v·a mod n；检测重复即锁定循环节 */
  function advance() {
    if (state.cycleStart >= 0) return false;
    const from = value();
    const to = (from * state.a) % state.n;
    state.cur++;
    state.anim = { from, to, p01: 0 };
    state.seq.push(to);
    const first = state.seq.indexOf(to);
    if (first !== state.seq.length - 1) state.cycleStart = first;
    syncSide();
    return true;
  }

  function stop() { if (state.timer) { clearInterval(state.timer); state.timer = null; } $('powerPlay').textContent = '▶ 播放'; }

  function reset() {
    stop();
    state.a = Number($('powerBase').value);
    state.n = Number($('powerMod').value);
    state.seq = [1]; state.cur = 0; state.cycleStart = -1; state.anim = null;
    env = TOPIC.VE.setupCanvas(canvas, 360);
    syncSide(); loop();
  }

  $('powerPlay').addEventListener('click', () => {
    if (state.timer) { stop(); return; }
    if (state.cycleStart >= 0) reset();
    $('powerPlay').textContent = '⏸ 暂停';
    state.timer = setInterval(() => {
      const more = advance();
      if (!more) {
        stop();
        const L = cycleLen();
        const v0 = state.seq[state.cycleStart];
        $('powerTip').innerHTML = L && v0 === 1 && state.cycleStart === 0
          ? `🎉 转盘转了 <b>${L}</b> 步回到 1 —— 费马小定理说：当 n 是素数且 gcd(a,n)=1 时，步数一定是 n−1 的约数（此处 n=${state.n}${state.n > 2 && isPrime(state.n) ? ' 是素数' : ' 不是素数，别被巧合骗了'}）。`
          : `序列最终进入循环：尾巴之后卡在 <b>${state.seq.slice(state.cycleStart)}</b> 打转（循环节长 ${L}）。试试换互素的 a 与 n，看能否整圈回到 1。`;
      }
    }, 1300);
  });
  $('powerStep').addEventListener('click', () => { stop(); advance(); });
  $('powerReset').addEventListener('click', reset);
  $('powerBase').addEventListener('change', reset);
  $('powerMod').addEventListener('change', reset);

  function isPrime(x) {
    if (x < 2) return false;
    for (let i = 2; i * i <= x; i++) if (x % i === 0) return false;
    return true;
  }

  window.addEventListener('resize', () => { env = TOPIC.VE.setupCanvas(canvas, 360); });
  reset();
})();
