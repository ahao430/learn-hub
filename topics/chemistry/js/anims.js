/* ═══════════ chemistry/anims.js · 摩尔 / 配平 / 碰撞 / 平衡 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const VE = TOPIC.VE, el = TOPIC.el;

  /* ═══════════ 互动1：摩尔计算器 ═══════════ */
  (function () {
    if (!$('moleOut')) return;
    const NAMES = { 18: 'H₂O', 44: 'CO₂', 32: 'O₂', 58.5: 'NaCl', 56: 'Fe' };
    function run() {
      const M = Number($('moleSub').value);
      const m = Number($('moleM').value);
      const out = $('moleOut');
      out.innerHTML = '';
      if (!Number.isFinite(m) || m <= 0 || m > 1e6) {
        out.innerHTML = '<div class="calc-row"><span>请输入合理的质量（0 ~ 10⁶ g）。</span></div>';
        return;
      }
      const n = m / M;
      const particles = n * 6.02;
      const rows = [
        { f: `物质`, v: `${NAMES[M]}　M = ${M} g/mol` },
        { f: `n = m / M = ${m} / ${M}`, v: `${n.toFixed(3)} mol` },
        { f: `粒子数 = n × 6.02×10²³`, v: `${particles.toFixed(2)}×10²³ 个` }
      ];
      rows.forEach((r, i) => {
        const d = el('div', 'calc-row');
        d.style.animationDelay = (i * 0.08) + 's';
        d.innerHTML = `<span class="f">${r.f}</span><span class="v">${r.v}</span>`;
        out.appendChild(d);
      });
      const note = el('div', 'calc-row',
        `<span style="font-size:13px;color:#64748b">✅ 例：36 g 水 = 2 mol = 约 1.2×10²⁴ 个水分子——两杯水里的分子数就比地球上所有沙粒还多。</span>`);
      out.appendChild(note);
    }
    $('moleRun').addEventListener('click', run);
    $('moleM').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    run();
  })();

  /* ═══════════ 互动2：方程式配平器 ═══════════ */
  (function () {
    if (!$('balEq')) return;
    /* comp: 每种物质的原子组成；target: 正确系数 */
    const REACTIONS = [
      {
        species: ['H₂', 'O₂', 'H₂O'],
        comp: [{ H: 2 }, { O: 2 }, { H: 2, O: 1 }],
        target: [2, 1, 2],
        nLeft: 2
      },
      {
        species: ['CH₄', 'O₂', 'CO₂', 'H₂O'],
        comp: [{ C: 1, H: 4 }, { O: 2 }, { C: 1, O: 2 }, { H: 2, O: 1 }],
        target: [1, 2, 1, 2],
        nLeft: 2
      },
      {
        species: ['Fe', 'O₂', 'Fe₂O₃'],
        comp: [{ Fe: 1 }, { O: 2 }, { Fe: 2, O: 3 }],
        target: [4, 3, 2],
        nLeft: 2
      }
    ];
    let ri = 0, coefs = [];

    function render() {
      const R = REACTIONS[ri];
      coefs = coefs.map(c => c);
      const eq = $('balEq');
      eq.innerHTML = '';
      R.species.forEach((sp, i) => {
        if (i === R.nLeft) {
          eq.appendChild(el('span', 'bal-arrow', '→'));
        } else if (i > 0 && i !== R.nLeft) {
          eq.appendChild(el('span', 'bal-plus', '+'));
        }
        const w = el('span', 'bal-term');
        w.innerHTML = `
          <button class="bal-btn" data-i="${i}" data-d="-1">−</button>
          <b class="bal-coef">${coefs[i] || ' '}</b>
          <button class="bal-btn" data-i="${i}" data-d="1">＋</button>
          <span class="bal-name">${sp}</span>`;
        eq.appendChild(w);
      });
      eq.querySelectorAll('.bal-btn').forEach(b => b.addEventListener('click', () => {
        const i = Number(b.dataset.i), d = Number(b.dataset.d);
        coefs[i] = Math.max(1, Math.min(9, (coefs[i] || 1) + d));
        render();
      }));
      tally();
    }

    function tally() {
      const R = REACTIONS[ri];
      const atoms = {};
      R.comp.forEach(c => Object.keys(c).forEach(a => atoms[a] = true));
      const box = $('balAtoms');
      box.innerHTML = '';
      let allEqual = true;
      Object.keys(atoms).sort().forEach(a => {
        let L = 0, Rt = 0;
        R.comp.forEach((c, i) => {
          const n = (c[a] || 0) * (coefs[i] || 0);
          if (i < R.nLeft) L += n; else Rt += n;
        });
        const eq = L === Rt && L > 0;
        if (!eq) allEqual = false;
        const d = el('div', 'bal-atom' + (eq ? ' ok' : ''));
        const pct = Math.max(L, Rt) ? Math.min(100, 100 * Math.max(L, Rt) / Math.max(Math.max(L, Rt), 6)) : 0;
        d.innerHTML = `
          <div class="ba-head"><b>${a}</b> 左 ${L} vs 右 ${Rt} ${eq ? '✓' : '✗'}</div>
          <div class="ba-bar"><span style="width:${pct ? 100 * L / Math.max(L, Rt, 1) : 0}%" class="l"></span><span style="width:${pct ? 100 * Rt / Math.max(L, Rt, 1) : 0}%" class="r"></span></div>`;
        box.appendChild(d);
      });
      const v = $('balVerdict');
      if (allEqual) {
        const segs = R.species.map((s, i) => (coefs[i] > 1 ? coefs[i] : '') + s);
        let eqStr = '';
        segs.forEach((seg, i) => {
          if (i > 0) eqStr += (i === R.nLeft ? ' → ' : ' + ');
          eqStr += seg;
        });
        v.className = 'nl-result on ok';
        v.innerHTML = `✅ 配平成功：${eqStr} —— 每种原子左右相等，质量守恒！`;
      } else {
        v.className = 'nl-result';
        v.innerHTML = '';
      }
    }

    function load(idx) {
      ri = idx;
      coefs = REACTIONS[ri].species.map(() => 1);
      $('balVerdict').className = 'nl-result';
      render();
    }
    $('balPreset').addEventListener('change', e => load(Number(e.target.value)));
    $('balAnswer').addEventListener('click', () => {
      coefs = [...REACTIONS[ri].target];
      render();
    });
    $('balReset').addEventListener('click', () => load(ri));
    load(0);
  })();

  /* ═══════════ 动画3：碰撞模拟 ═══════════ */
  (function () {
    const canvas = $('colCanvas');
    if (!canvas) return;
    const N = 24, R = 8;
    let env = null, raf = null, last = null;
    let ps = [], running = false, T = 2, Ea = 120;

    function init() {
      ps = [];
      for (let i = 0; i < N; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 55 + Math.random() * 30;
        ps.push({
          x: 30 + Math.random() * (env.w - 60),
          y: 30 + Math.random() * (env.h - 60),
          vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
          reacted: false
        });
      }
      $('colCount').textContent = `0 / ${N}`;
    }

    function draw() {
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, w - 12, h - 12);
      ps.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
        ctx.fillStyle = p.reacted ? '#16a34a' : '#38bdf8';
        ctx.fill();
      });
      /* 温度计示意 */
      ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(`T = ${T}　Ea = ${Ea}`, w - 14, h - 14);
    }

    function step(now) {
      if (!running) return;
      if (last == null) last = now;
      let dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      const vScale = 0.5 + T * 0.45;
      ps.forEach(p => {
        p.x += p.vx * dt * vScale;
        p.y += p.vy * dt * vScale;
        if (p.x < R + 6 || p.x > env.w - R - 6) p.vx *= -1;
        if (p.y < R + 6 || p.y > env.h - R - 6) p.vy *= -1;
      });
      /* 碰撞检测 */
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = ps[i], b = ps[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d < 2 * R && d > 0.01) {
          /* 交换速度（等质量弹性近似） */
          const tvx = a.vx, tvy = a.vy;
          a.vx = b.vx; a.vy = b.vy;
          b.vx = tvx; b.vy = tvy;
          /* 活化能判定：相对速度超过阈值才反应 */
          const relSpeed = (Math.hypot(a.vx, a.vy) + Math.hypot(b.vx, b.vy)) * vScale;
          if (!a.reacted && !b.reacted && relSpeed > Ea) {
            a.reacted = b.reacted = true;
            const cnt = ps.filter(p => p.reacted).length;
            $('colCount').textContent = `${cnt} / ${N}`;
            $('colNarr').innerHTML = `💥 一次有效碰撞！相对速度 ${relSpeed.toFixed(0)} > Ea = ${Ea} → 两个分子都反应（变绿）。温度越高，这样的碰撞越常见。`;
          }
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    $('colPlay').addEventListener('click', () => {
      if (running) { running = false; $('colPlay').textContent = '▶ 继续'; return; }
      running = true; last = null;
      $('colPlay').textContent = '⏸ 暂停';
      raf = requestAnimationFrame(step);
    });
    $('colReset').addEventListener('click', () => {
      running = false; $('colPlay').textContent = '▶ 开始模拟';
      init(); draw();
      $('colNarr').textContent = '已重置。开始后调温度试试。';
    });
    $('colT').addEventListener('input', e => { T = Number(e.target.value); $('colTVal').textContent = T; });
    $('colE').addEventListener('input', e => { Ea = Number(e.target.value); $('colEVal').textContent = Ea; });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 280); draw(); });
    env = VE.setupCanvas(canvas, 280);
    init(); draw();
  })();

  /* ═══════════ 动画4：平衡演示 A ⇌ B ═══════════ */
  (function () {
    const canvas = $('eqCanvas');
    if (!canvas) return;
    const N = 20;
    let env = null, raf = null, last = null;
    let parts = [];           // {side: 'A'|'B', x, y}
    let kF = 1, kr = 1;       // A→B、B→A 每秒跳转概率
    let running = false, hist = [], lastHist = 0, t = 0;

    function init() {
      parts = [];
      for (let i = 0; i < N; i++) parts.push({ side: 'A', x: Math.random(), y: Math.random() });
      kF = 1; kr = 1; hist = []; lastHist = 0; t = 0;
      stats();
      $('eqTip').innerHTML = 'k↑ = 1，k↓ = 1。按"开始"看 A 占比自动收敛到理论值 50%。';
    }

    function stats() {
      const nA = parts.filter(p => p.side === 'A').length;
      const nB = N - nA;
      $('eqNA').textContent = nA;
      $('eqNB').textContent = nB;
      $('eqFA').textContent = Math.round(100 * nA / N) + '%';
      $('eqTarget').textContent = Math.round(100 * kr / (kF + kr)) + '%';
      return nA;
    }

    function draw() {
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const boxH = h - 80, gap = 14, bw = (w - 40 - gap) / 2;
      /* 两室 */
      ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 34, bw, boxH);
      ctx.strokeRect(20 + bw + gap, 34, bw, boxH);
      ctx.fillStyle = '#0e7490'; ctx.font = '700 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A 室', 20 + bw / 2, 24);
      ctx.fillText('B 室', 20 + bw + gap + bw / 2, 24);
      ctx.font = '11px sans-serif'; ctx.fillStyle = '#64748b';
      ctx.fillText('⇌ 正反应 A→B（k↑=' + kF.toFixed(1) + '）', w / 2, 46 + boxH);
      ctx.fillText('逆反应 B→A（k↓=' + kr.toFixed(1) + '）', w / 2, 62 + boxH);
      /* 粒子 */
      parts.forEach(p => {
        const left = p.side === 'A';
        const x = 20 + 12 + (left ? 0 : bw + gap) + p.x * (bw - 24);
        const y = 46 + p.y * (boxH - 24);
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = left ? '#0891b2' : '#f59e0b';
        ctx.fill();
      });
      /* 历史曲线 */
      if (hist.length > 1) {
        const gx = 20, gy = h - 14, gw = w - 40, gh = 40;
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy - gh, gw, gh);
        ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 2;
        ctx.beginPath();
        hist.forEach((f, i) => {
          const x = gx + i * (gw / (hist.length - 1));
          const y = gy - f * gh;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('A% 随时间', gx + 4, gy - gh - 4);
      }
    }

    function step(now) {
      if (!running) return;
      if (last == null) last = now;
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      t += dt;
      parts.forEach(p => {
        if (p.side === 'A' && Math.random() < kF * dt) { p.side = 'B'; p.x = Math.random(); p.y = Math.random(); }
        else if (p.side === 'B' && Math.random() < kr * dt) { p.side = 'A'; p.x = Math.random(); p.y = Math.random(); }
      });
      if (t - lastHist > 0.18) {
        lastHist = t;
        hist.push(parts.filter(p => p.side === 'A').length / N);
        if (hist.length > 160) hist.shift();
      }
      stats(); draw();
      raf = requestAnimationFrame(step);
    }

    $('eqPlay').addEventListener('click', () => {
      if (running) { running = false; $('eqPlay').textContent = '▶ 继续'; return; }
      running = true; last = null;
      $('eqPlay').textContent = '⏸ 暂停';
      raf = requestAnimationFrame(step);
    });
    $('eqAddA').addEventListener('click', () => {
      let moved = 0;
      for (const p of parts) {
        if (moved >= 3) break;
        if (p.side === 'B') { p.side = 'A'; p.x = Math.random(); p.y = Math.random(); moved++; }
      }
      $('eqTip').innerHTML = '➕ 突然加入 A → 浓度增大 → 正反应速率暂时占优 → 平衡<b>右移</b>消耗多余的 A，直到新的平衡。观察曲线的"扰动—回落"。';
      stats(); draw();
    });
    $('eqHeat').addEventListener('click', () => {
      kr *= 1.6;
      $('eqTip').innerHTML = `🔥 升温：假设逆反应 B→A 吸热，其速率 k↓ 增至 ${kr.toFixed(1)} → 平衡向 A 移动（新理论 A% = ${Math.round(100 * kr / (kF + kr))}%）。勒夏特列：升温削弱"加热"，平衡移向吸热方向。`;
      stats(); draw();
    });
    $('eqCat').addEventListener('click', () => {
      kF *= 2; kr *= 2;
      $('eqTip').innerHTML = `⚡ 催化剂把 k↑、k↓ <b>同时加倍</b> → 到达平衡更快，但<b>平衡位置不变</b>（比值 k↓/(k↑+k↓) 不变）——催化剂只加速，不改结局。`;
      stats(); draw();
    });
    $('eqReset').addEventListener('click', () => {
      running = false; $('eqPlay').textContent = '▶ 开始';
      init(); draw();
    });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 300); draw(); });
    env = VE.setupCanvas(canvas, 300);
    init(); draw();
  })();
})();
