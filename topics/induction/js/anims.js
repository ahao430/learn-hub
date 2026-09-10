/* ═══════════ induction/anims.js · 多米诺 / 求和验证 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const VE = TOPIC.VE;

  /* ═══════════ 动画1：多米诺骨牌 ═══════════ */
  (function () {
    const canvas = $('domCanvas');
    if (!canvas) return;
    const N = 10, GAP_INDEX = 5;   // 缺口模式：第 5 与第 6 块之间有空隙
    let env = null, mode = 'ok';
    let angles = new Array(N).fill(0);  // 每块骨牌的倒下进度 0..1
    let timer = null, current = -1;

    function dominoRect(i, ang) {
      const { w, h } = env;
      const spacing = w / (N + 1);
      const x = spacing * (i + 1);
      const baseY = h - 34;
      const H = 74, Wd = 13;
      // 以底部支点旋转
      return { x, baseY, H, Wd, ang };
    }

    function draw() {
      if (!env) env = VE.setupCanvas(canvas, 240);
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      /* 地面 */
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, h - 30, w, 8);

      for (let i = 0; i < N; i++) {
        const d = dominoRect(i, angles[i]);
        const isGapBefore = mode === 'gap' && i === GAP_INDEX;
        const fallen = angles[i] >= 1;
        const falling = angles[i] > 0 && angles[i] < 1;

        ctx.save();
        ctx.translate(d.x, d.baseY);
        ctx.rotate(angles[i] * (Math.PI / 2.15));   // 倒向右侧
        /* 骨牌身体 */
        ctx.fillStyle = fallen ? '#93c5fd' : (falling ? '#3b82f6' : '#1d4ed8');
        if (i === 0) ctx.fillStyle = fallen ? '#fcd34d' : '#f59e0b';   // 第一块：奠基（琥珀色）
        if (mode === 'gap' && i === GAP_INDEX) ctx.fillStyle = fallen ? '#fecaca' : '#ef4444'; // 缺口后的第一块：红色
        ctx.beginPath();
        ctx.roundRect(-d.Wd / 2, -d.H, d.Wd, d.H, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.restore();

        /* 编号 */
        ctx.fillStyle = fallen ? '#64748b' : '#94a3b8';
        ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(i + 1, d.x, d.baseY + 16);
      }

      /* 缺口标记 */
      if (mode === 'gap') {
        const x1 = dominoRect(GAP_INDEX - 1).x, x2 = dominoRect(GAP_INDEX).x;
        ctx.fillStyle = '#ef4444'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('缺口！', (x1 + x2) / 2, h - 44);
      }
    }

    function reset() {
      if (timer) { clearInterval(timer); timer = null; }
      angles = new Array(N).fill(0);
      current = -1;
      $('domNarr').innerHTML = mode === 'ok'
        ? '完好链条：每块都碰得到下一块。推倒第 1 块（奠基）试试。'
        : '链条中段有缺口：第 5 块倒下也够不到第 6 块（递推断裂）。推倒第 1 块试试。';
      env = VE.setupCanvas(canvas, 240);
      draw();
    }

    $('domPlay').addEventListener('click', () => {
      if (timer) { clearInterval(timer); timer = null; }
      angles = new Array(N).fill(0);
      current = 0;
      angles[0] = 0.001;
      $('domNarr').innerHTML = '🔨 <b>奠基</b>：推倒第 1 块……';
      timer = setInterval(() => {
        let anyMoving = false;
        angles = angles.map((a, i) => {
          if (a > 0 && a < 1) { anyMoving = true; return Math.min(1, a + 0.09); }
          return a;
        });
        /* 传递：第 i 块完全倒下且与 i+1 相邻 → 触发 i+1 */
        for (let i = 0; i < N - 1; i++) {
          if (angles[i] >= 1 && angles[i + 1] === 0) {
            if (mode === 'gap' && i + 1 === GAP_INDEX) {
              $('domNarr').innerHTML = `💥 第 ${i + 1} 块倒了，但<b>够不到第 ${i + 2} 块</b>——递推在 k = ${i + 1} → ${i + 2} 处断裂！后面的骨牌永远不会倒（就像"只有递推没有奠基/递推在某处失效"的归纳证明）。`;
              clearInterval(timer); timer = null;
              draw();
              return;
            }
            angles[i + 1] = 0.001;
            $('domNarr').innerHTML = `🁢 <b>递推生效</b>：第 ${i + 1} 块推倒第 ${i + 2} 块（k = ${i + 1} → ${i + 2}）……`;
          }
        }
        draw();
        if (!anyMoving && angles[N - 1] >= 1) {
          clearInterval(timer); timer = null;
          $('domNarr').innerHTML = mode === 'ok'
            ? '✅ 全部倒下！奠基 + 递推 ⟹ 对所有 n 成立。这就是数学归纳法。'
            : '……';
        } else if (!anyMoving && angles[0] >= 1 && angles[1] === 0) {
          clearInterval(timer); timer = null;
          $('domNarr').innerHTML = '💥 第 1 块倒了，但没有触发第 2 块——递推完全失效。';
        }
      }, 40);
    });

    document.querySelectorAll('#domMode button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#domMode button').forEach(x => x.classList.toggle('on', x === b));
      mode = b.dataset.mode;
      reset();
    }));
    $('domReset').addEventListener('click', reset);
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 240); draw(); });
    reset();
  })();

  /* ═══════════ 动画2：求和公式验证 ═══════════ */
  (function () {
    const canvas = $('sumCanvas');
    if (!canvas) return;
    let env = null, n = 5, reveal = 5;

    function draw() {
      if (!env) env = VE.setupCanvas(canvas, 280);
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const dotR = Math.max(3, Math.min(9, 150 / (n + 4)));
      const rowH = dotR * 2.4;
      const total = n * (n + 1) / 2;
      const scale = Math.min((w - 130) / n, (h - 40) / (n * rowH / dotR / 2.4 || 1));
      const stepX = Math.min((w - 140) / n, 26);
      const stepY = Math.min((h - 50) / n, 24);

      for (let r = 1; r <= n; r++) {
        const shown = r <= reveal;
        const isNew = r === reveal && r > 1;
        for (let c = 0; c < r; c++) {
          const x = 60 + c * stepX + (n - r) * stepX / 2;
          const y = h - 26 - (r - 1) * stepY - ((r - 1) * 0);
          if (!shown) continue;
          ctx.beginPath(); ctx.arc(x, y - (h - 30 - n * stepY) * 0, dotR, 0, Math.PI * 2);
          ctx.fillStyle = isNew ? '#f59e0b' : (r === reveal ? '#60a5fa' : '#2563eb');
          ctx.fill();
        }
        /* 行号 */
        ctx.fillStyle = isNew ? '#b45309' : '#64748b';
        ctx.font = `${isNew ? '700' : ''} 11px Georgia, serif`;
        ctx.textAlign = 'right';
        ctx.fillText(r, 48, h - 26 - (r - 1) * stepY + 4);
      }
      /* 右侧大括号合计 */
      ctx.fillStyle = '#0f172a'; ctx.font = '700 20px Georgia, serif'; ctx.textAlign = 'left';
      const shownSum = reveal * (reveal + 1) / 2;
      ctx.fillText(`= ${shownSum}`, w - 76, h / 2 - 12);
      ctx.fillStyle = '#2563eb'; ctx.font = '15px Georgia, serif';
      ctx.fillText(`= ${reveal}×${reveal + 1}/2`, w - 76, h / 2 + 16);
    }

    function formula() {
      const s = n * (n + 1) / 2;
      $('sumFormula').innerHTML = `1 + 2 + … + ${n} = ${s} = ${n}×${n + 1}/2 ✓`;
    }

    $('sumN').addEventListener('input', e => {
      n = Number(e.target.value);
      $('sumNVal').textContent = n;
      reveal = n;
      formula();
      draw();
    });
    $('sumStep').addEventListener('click', () => {
      if (reveal < n) {
        reveal++;
        const s = reveal * (reveal + 1) / 2, sPrev = (reveal - 1) * reveal / 2;
        $('sumFormula').innerHTML =
          `加上第 <b style="color:#b45309">${reveal}</b> 行：${sPrev} + ${reveal} = ${s} = ${reveal}×(${reveal - 1}+2)/2 = ${reveal}×${reveal + 1}/2 ✓ <span style="color:#94a3b8">—— 这就是 k → k+1 的递推！</span>`;
        draw();
      } else {
        $('sumFormula').innerHTML = `已到第 ${n} 行。拉动滑块换一个 n，再按"下一步"重看递推。`;
      }
    });
    $('sumReset').addEventListener('click', () => {
      reveal = 1;
      $('sumFormula').innerHTML = '从第 1 行开始，按"下一步"逐行加上去。';
      draw();
    });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 280); draw(); });
    formula(); draw();
  })();
})();
