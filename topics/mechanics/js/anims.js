/* ═══════════ mechanics/anims.js · 频闪 / 双车 / 冰面分离 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const VE = TOPIC.VE;

  /* ═══════════ 动画1：频闪照片模拟 ═══════════ */
  (function () {
    const canvas = $('stCanvas');
    if (!canvas) return;
    const SCALE = 12;          // 1 m = 12 px
    const X0 = 46;             // 出发点
    const DT = 0.5;            // 闪光间隔（秒）
    let env = null, raf = null, last = null;
    let st = { v0: 0, a: 2, t: 0, dots: [], lastFlash: 0, playing: false };

    function readSliders() {
      st.v0 = Number($('stV0').value);
      st.a = Number($('stA').value);
      $('stV0Val').textContent = st.v0;
      $('stAVal').textContent = st.a;
    }

    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      readSliders();
      st.t = 0; st.lastFlash = 0;
      st.dots = [{ s: 0, label: '0' }];
      st.playing = false;
      $('stPlay').textContent = '▶ 出发';
      env = env || VE.setupCanvas(canvas, 250);
      stats();
      draw();
    }

    function stats() {
      const v = st.v0 + st.a * st.t;
      const s = st.v0 * st.t + 0.5 * st.a * st.t * st.t;
      $('stT').textContent = st.t.toFixed(1) + ' s';
      $('stV').textContent = v.toFixed(1) + ' m/s';
      $('stS').textContent = s.toFixed(1) + ' m';
      $('stFormula').innerHTML =
        `s = ${st.v0}×${st.t.toFixed(1)} + ½×${st.a}×${st.t.toFixed(1)}² = <b>${s.toFixed(1)} m</b>`;
    }

    function gapInfo() {
      if (st.dots.length < 3) return;
      const gaps = [];
      for (let i = 1; i < st.dots.length; i++) gaps.push(st.dots[i].s - st.dots[i - 1].s);
      const diffs = [];
      for (let i = 1; i < gaps.length; i++) diffs.push(gaps[i] - gaps[i - 1]);
      const theo = st.a * DT * DT;
      if (st.a === 0) {
        $('stGap').innerHTML = `相邻光点间距：${gaps.map(g => g.toFixed(1)).join(', ')} m —— <b>全部相等</b>（匀速指纹）。`;
      } else if (diffs.length) {
        $('stGap').innerHTML = `间距依次为 ${gaps.map(g => g.toFixed(1)).join(', ')} m<br>相邻间距之差：${diffs.map(d => d.toFixed(2)).join(', ')} ≈ a·Δt² = ${theo.toFixed(2)} m —— <b>恒定</b>（匀加速指纹）。`;
      }
    }

    function draw() {
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const groundY = h - 52;
      /* 地面 */
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, groundY + 20); ctx.lineTo(w, groundY + 20); ctx.stroke();
      /* 闪光点 */
      st.dots.forEach(d => {
        const x = X0 + d.s * SCALE;
        ctx.beginPath(); ctx.arc(x, groundY + 20, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ea580c'; ctx.fill();
        ctx.fillStyle = '#c2410c'; ctx.font = '10.5px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.label + 's', x, groundY + 38);
      });
      /* 小车 */
      const s = st.v0 * st.t + 0.5 * st.a * st.t * st.t;
      const x = Math.min(X0 + s * SCALE, w - 40);
      const v = st.v0 + st.a * st.t;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x - 17, groundY - 16, 34, 14);
      ctx.beginPath(); ctx.arc(x - 10, groundY, 5, 0, Math.PI * 2);
      ctx.arc(x + 10, groundY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#475569'; ctx.fill();
      /* 速度箭头 */
      ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      const arrow = Math.min(90, v * 7);
      if (arrow > 2) {
        ctx.beginPath(); ctx.moveTo(x, groundY - 34); ctx.lineTo(x + arrow, groundY - 34);
        ctx.moveTo(x + arrow - 8, groundY - 39); ctx.lineTo(x + arrow, groundY - 34);
        ctx.lineTo(x + arrow - 8, groundY - 29); ctx.stroke();
        ctx.fillStyle = '#ea580c'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('v', x + arrow / 2, groundY - 40);
      }
      /* 起点标记 */
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('出发', X0 - 14, groundY - 46);
    }

    function step(now) {
      if (!st.playing) return;
      if (last == null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000) * 0.7;   // 0.7 倍慢放
      last = now;
      st.t += dt;
      const k = Math.floor(st.t / DT + 1e-9);
      if (k > st.lastFlash) {
        st.lastFlash = k;
        const s = st.v0 * st.t + 0.5 * st.a * st.t * st.t;
        st.dots.push({ s, label: (k * DT).toFixed(1).replace(/\.0$/, '') });
        gapInfo();
      }
      stats(); draw();
      const sNow = st.v0 * st.t + 0.5 * st.a * st.t * st.t;
      if (X0 + sNow * SCALE > env.w - 30) {
        st.playing = false;
        $('stPlay').textContent = '▶ 出发';
        gapInfo();
        return;
      }
      raf = requestAnimationFrame(step);
    }

    $('stPlay').addEventListener('click', () => {
      if (st.playing) { st.playing = false; $('stPlay').textContent = '▶ 继续'; return; }
      st.playing = true; last = null;
      $('stPlay').textContent = '⏸ 暂停';
      raf = requestAnimationFrame(step);
    });
    $('stReset').addEventListener('click', reset);
    $('stV0').addEventListener('input', () => { readSliders(); if (!st.playing) { reset(); } });
    $('stA').addEventListener('input', () => { readSliders(); if (!st.playing) { reset(); } });
    $('stPreset').addEventListener('change', e => {
      const p = e.target.value;
      $('stV0').value = p === 'uniform' ? 4 : 0;
      $('stA').value = p === 'uniform' ? 0 : (p === 'accel' ? 2 : 10);
      reset();
    });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 250); draw(); });
    reset();
  })();

  /* ═══════════ 动画2：双车实验（F=ma） ═══════════ */
  (function () {
    const canvas = $('raceCanvas');
    if (!canvas) return;
    const X0 = 60;
    let env = null, raf = null, last = null;
    let st = { F: 6, m: 2, t: 0, playing: false };

    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      st.F = Number($('raceF').value); st.m = Number($('raceM').value);
      st.t = 0; st.playing = false;
      $('raceFVal').textContent = st.F; $('raceMVal').textContent = st.m;
      $('raceNarr').innerHTML = `A 车：a = F/m = ${st.F}/${st.m} = <b>${(st.F / st.m).toFixed(2)} m/s²</b>；B 车：a = 2F/m = <b>${(2 * st.F / st.m).toFixed(2)} m/s²</b>（恰好两倍）。点击"出发"。`;
      env = env || VE.setupCanvas(canvas, 290);
      draw();
    }

    function lane(y, label) {
      const { ctx, w } = env;
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, y + 26); ctx.lineTo(w, y + 26); ctx.stroke();
      ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(label, 10, y - 8);
    }

    function drawCar(ctx, x, y, color, forceN, aVal) {
      ctx.fillStyle = color;
      ctx.fillRect(x - 16, y - 2, 32, 13);
      ctx.beginPath(); ctx.arc(x - 9, y + 12, 4.5, 0, Math.PI * 2);
      ctx.arc(x + 9, y + 12, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#475569'; ctx.fill();
      /* 力箭头（长度∝F） */
      const L = 12 + forceN * 4;
      ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x + 18, y + 4); ctx.lineTo(x + 18 + L, y + 4);
      ctx.moveTo(x + 18 + L - 7, y); ctx.lineTo(x + 18 + L, y + 4); ctx.lineTo(x + 18 + L - 7, y + 8);
      ctx.stroke();
      ctx.fillStyle = color; ctx.font = '10.5px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`${forceN}N`, x + 20, y - 6);
      ctx.font = '700 11px Georgia, serif';
      ctx.fillText(`a=${aVal.toFixed(2)}`, x - 30, y - 8);
    }

    function draw() {
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const yA = 60, yB = 170;
      lane(yA, 'A 车（受 F）');
      lane(yB, 'B 车（受 2F，同质量）');
      const aA = st.F / st.m, aB = 2 * st.F / st.m;
      const sA = 0.5 * aA * st.t * st.t, sB = 0.5 * aB * st.t * st.t;
      const scale = 40;
      const xA = Math.min(X0 + sA * scale, w - 90);
      const xB = Math.min(X0 + sB * scale, w - 90);
      drawCar(ctx, xA, yA, '#ea580c', st.F, aA);
      drawCar(ctx, xB, yB, '#0284c7', 2 * st.F, aB);
      /* 频闪点：每 0.5s */
      for (let k = 0; k * 0.5 <= st.t; k++) {
        const tk = k * 0.5;
        ctx.beginPath(); ctx.arc(X0 + 0.5 * aA * tk * tk * scale, yA + 42, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fdba74'; ctx.fill();
        ctx.beginPath(); ctx.arc(X0 + 0.5 * aB * tk * tk * scale, yB + 42, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#7dd3fc'; ctx.fill();
      }
    }

    function step(now) {
      if (!st.playing) return;
      if (last == null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000) * 0.8;
      last = now;
      st.t += dt;
      draw();
      const aB = 2 * st.F / st.m;
      if (X0 + 0.5 * aB * st.t * st.t * 40 > env.w - 90) {
        st.playing = false;
        $('racePlay').textContent = '▶ 出发';
        $('raceNarr').innerHTML = `🏁 B 车先到！同时间内 B 走的距离是 A 的 <b>2 倍</b>（s = ½at²，a 加倍则 s 加倍）。这就是"F 与 a 成正比"的直观版本。再试试增大 m：两车同时变慢，但 2 倍关系不变。`;
        return;
      }
      raf = requestAnimationFrame(step);
    }

    $('racePlay').addEventListener('click', () => {
      if (st.playing) { st.playing = false; $('racePlay').textContent = '▶ 继续'; return; }
      if (st.t > 0 && X0 + 0.5 * (2 * st.F / st.m) * st.t * st.t * 40 > env.w - 90) reset();
      st.playing = true; last = null;
      $('racePlay').textContent = '⏸ 暂停';
      raf = requestAnimationFrame(step);
    });
    $('raceReset').addEventListener('click', reset);
    $('raceF').addEventListener('input', () => { $('raceFVal').textContent = $('raceF').value; if (!st.playing) reset(); });
    $('raceM').addEventListener('input', () => { $('raceMVal').textContent = $('raceM').value; if (!st.playing) reset(); });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 290); draw(); });
    reset();
  })();

  /* ═══════════ 动画3：冰面分离（第三定律） ═══════════ */
  (function () {
    const canvas = $('pushCanvas');
    if (!canvas) return;
    const J = 12;   // 冲量 kg·m/s
    let env = null, raf = null, last = null;
    let st = { mA: 3, mB: 2, t: 0, playing: false, launched: false };

    function reset() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      st.mA = Number($('pushMA').value); st.mB = Number($('pushMB').value);
      st.t = 0; st.playing = false; st.launched = false;
      $('pushMAVal').textContent = st.mA; $('pushMBVal').textContent = st.mB;
      $('pushNarr').innerHTML = `弹簧释放时对两块冰的力<b>等大反向</b>（第三定律），作用时间相同 → 冲量 J = ${J} 相同 →<br>v<sub>A</sub> = J/m<sub>A</sub> = ${(J / st.mA).toFixed(1)} m/s，v<sub>B</sub> = J/m<sub>B</sub> = ${(J / st.mB).toFixed(1)} m/s。点击"分开！"`;
      env = env || VE.setupCanvas(canvas, 220);
      draw();
    }

    function drawBlock(ctx, x, y, w, color, label) {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.roundRect(x - w / 2, y - 18, w, 36, 5); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '700 12px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }

    function draw() {
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const cy = h / 2 - 6;
      const scale = 26;
      const vA = J / st.mA, vB = J / st.mB;
      const sA = st.launched ? vA * st.t : 0, sB = st.launched ? vB * st.t : 0;
      const cx = w / 2;
      const xA = Math.max(40, cx - 34 - sA * scale);
      const xB = Math.min(w - 40, cx + 34 + sB * scale);
      /* 冰面 */
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(0, cy + 26, w, 10);
      if (!st.launched) {
        /* 弹簧 */
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
          const x = cx - 20 + i * 5;
          ctx.lineTo(x, cy + (i % 2 ? -8 : 8) * 0.9);
        }
        ctx.stroke();
      }
      drawBlock(ctx, xA, cy, 46, '#ea580c', `A ${st.mA}kg`);
      drawBlock(ctx, xB, cy, 46, '#0284c7', `B ${st.mB}kg`);
      /* 速度标注 */
      if (st.launched) {
        ctx.fillStyle = '#ea580c'; ctx.font = '700 12px Georgia, serif'; ctx.textAlign = 'center';
        ctx.fillText(`v = ${vA.toFixed(1)}`, xA, cy - 40);
        ctx.fillStyle = '#0284c7';
        ctx.fillText(`v = ${vB.toFixed(1)}`, xB, cy - 40);
        ctx.fillStyle = '#475569'; ctx.font = '11px sans-serif';
        ctx.fillText(`动量 ${st.mA}×${vA.toFixed(1)} = ${(st.mA * vA).toFixed(0)}`, xA, cy + 52);
        ctx.fillText(`动量 ${st.mB}×${vB.toFixed(1)} = ${(st.mB * vB).toFixed(0)}`, xB, cy + 52);
      }
    }

    function step(now) {
      if (!st.playing) return;
      if (last == null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000) * 0.55;
      last = now;
      st.t += dt;
      draw();
      const vB = J / st.mB, vA = J / st.mA;
      const cx = env.w / 2, scale = 26;
      if (cx - 34 - vA * st.t * scale < 44 || cx + 34 + vB * st.t * scale > env.w - 44) {
        st.playing = false;
        $('pushNarr').innerHTML = `✅ 分离完成：两块冰的<b>动量大小相等、方向相反</b>（${(J).toFixed(0)} 与 ${(J).toFixed(0)} kg·m/s），总动量保持为零——这就是"作用力反作用力等大反向"的直接后果，也是动量守恒的雏形。质量小的 B 速度大，恰好与质量成反比。`;
        return;
      }
      raf = requestAnimationFrame(step);
    }

    $('pushGo').addEventListener('click', () => {
      if (st.playing) return;
      st.t = 0; st.launched = true; st.playing = true; last = null;
      raf = requestAnimationFrame(step);
    });
    $('pushReset').addEventListener('click', reset);
    $('pushMA').addEventListener('input', () => { $('pushMAVal').textContent = $('pushMA').value; reset(); });
    $('pushMB').addEventListener('input', () => { $('pushMBVal').textContent = $('pushMB').value; reset(); });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 220); draw(); });
    reset();
  })();
})();
