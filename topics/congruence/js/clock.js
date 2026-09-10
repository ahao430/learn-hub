/* ═══════════ clock.js · 动画1：时钟模型 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const canvas = $('clockCanvas');
  if (!canvas) return;

  const DIAL_HOURS = { 12: null, 24: null, 7: null };   // 支持的表盘
  let env = null;            // {ctx, w, h}
  let state = {
    m: 12, start: 10, elapsed: 0, playing: false,
    timer: null, dispRot: 0  // 指针平滑显示角度（圈数）
  };

  function readControls() {
    state.m = Number($('clockMod').value);
    state.start = Math.max(0, Math.min(23, Math.trunc(Number($('clockStart').value) || 0)));
    const add = Math.max(1, Math.min(500, Math.trunc(Number($('clockAdd').value) || 1)));
    return add;
  }

  function total() { return state.start + state.elapsed; }
  function residue() { return TOPIC.VE.mod(total(), state.m); }
  function quotient() { return Math.floor(TOPIC.VE.mod(total(), state.m * 400) / state.m); }

  function tickLabel(r) {
    if (state.m === 12) return r === 0 ? 12 : r;
    if (state.m === 24) return r === 0 ? 24 : r;
    return r; // 星期盘 0..6
  }
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  function draw() {
    if (!env) env = TOPIC.VE.setupCanvas(canvas, 380);
    const { ctx, w, h } = env;
    const cx = w / 2, cy = h / 2 + 6;
    const R = Math.min(w, h) / 2 - 46;
    ctx.clearRect(0, 0, w, h);

    const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#4f46e5';

    /* 表盘底 */
    ctx.beginPath(); ctx.arc(cx, cy, R + 24, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc'; ctx.fill();
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.stroke();

    /* 刻度与数字 */
    const rNow = residue();
    for (let r = 0; r < state.m; r++) {
      const ang = (r / state.m) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + Math.cos(ang) * (R - 2), y1 = cy + Math.sin(ang) * (R - 2);
      const x2 = cx + Math.cos(ang) * R, y2 = cy + Math.sin(ang) * R;
      const isNow = !state.playing && state.elapsed > 0 && r === rNow;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = isNow ? '#f59e0b' : '#cbd5e1';
      ctx.lineWidth = isNow ? 5 : 2.5; ctx.stroke();

      const lr = R - 26;
      const lx = cx + Math.cos(ang) * lr, ly = cy + Math.sin(ang) * lr;
      ctx.beginPath(); ctx.arc(lx, ly, state.m === 24 ? 13 : 16, 0, Math.PI * 2);
      ctx.fillStyle = isNow ? '#fde68a' : '#ffffff';
      ctx.strokeStyle = isNow ? '#f59e0b' : '#e2e8f0'; ctx.lineWidth = isNow ? 2.5 : 1.5;
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = isNow ? '#b45309' : '#475569';
      ctx.font = `600 ${state.m === 24 ? 12 : 14.5}px Georgia, serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(tickLabel(r), lx, ly + 0.5);
      if (state.m === 7) {
        const wx = cx + Math.cos(ang) * (R + 12), wy = cy + Math.sin(ang) * (R + 12);
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif';
        ctx.fillText('周' + WEEK[r], wx, wy);
      }
    }

    /* 指针（平滑连续旋转，累计圈数） */
    const targetRot = total() / state.m;
    state.dispRot += (targetRot - state.dispRot) * 0.18;
    if (Math.abs(targetRot - state.dispRot) < 0.001) state.dispRot = targetRot;
    const pAng = state.dispRot * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(pAng) * 18, cy - Math.sin(pAng) * 18);
    ctx.lineTo(cx + Math.cos(pAng) * (R - 44), cy + Math.sin(pAng) * (R - 44));
    ctx.strokeStyle = acc.trim(); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = acc.trim(); ctx.fill();

    /* 中心数字 */
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 26px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(state.elapsed === 0 ? String(state.start) : String(residue()), cx, cy - R * 0.45);
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif';
    ctx.fillText(state.elapsed === 0 ? '起点' : '钟面指示', cx, cy - R * 0.45 + 24);
  }

  let rAF = null;
  function loop() { rAF = requestAnimationFrame(loop); draw(); }

  function updateStats(final) {
    $('clockCur').textContent = total();
    if (state.elapsed === 0) {
      $('clockQ').textContent = '—'; $('clockR').textContent = '—';
      $('clockFormula').innerHTML = `${state.start} + 0 = ${state.start} = 0×${state.m} + ${TOPIC.VE.mod(state.start, state.m)}`;
      return;
    }
    const q = Math.floor(total() / state.m), r = residue();
    $('clockQ').textContent = q;
    $('clockR').textContent = r;
    $('clockFormula').innerHTML =
      `${state.start} + <span class="q">${state.elapsed}</span> = ${total()} = <span class="q">${q}×${state.m}</span> + <span style="color:#fbbf24">${r}</span>`;
  }

  function stop() {
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    if (rAF) { cancelAnimationFrame(rAF); rAF = null; }
    $('clockPlay').textContent = '▶ 播放';
  }

  function reset() {
    stop();
    state.elapsed = 0;
    state.dispRot = 0;
    env = TOPIC.VE.setupCanvas(canvas, 380);
    updateStats(false);
    loop();
  }

  $('clockPlay').addEventListener('click', () => {
    if (state.playing) { stop(); loop(); return; }
    const add = readControls();
    reset();
    state.playing = true;
    $('clockPlay').textContent = '⏸ 暂停';
    const interval = Math.max(120, Math.min(700, 10000 / add));
    state.timer = setInterval(() => {
      if (state.elapsed >= add) {
        stop(); loop();
        $('clockFormula').innerHTML += `　→　答：${residue()} 点`;
        return;
      }
      state.elapsed++;
      updateStats();
    }, interval);
  });

  $('clockReset').addEventListener('click', reset);
  ['clockStart', 'clockAdd', 'clockMod'].forEach(id =>
    $(id).addEventListener('change', reset));

  window.addEventListener('resize', () => { env = TOPIC.VE.setupCanvas(canvas, 380); });
  readControls();
  reset();
})();
