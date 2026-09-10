/* ═══════════ combinatorics/anims.js · 穿搭 / 排列树 / 鸽笼 / 杨辉三角 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const VE = TOPIC.VE, el = TOPIC.el;

  /* ═══════════ 动画1：穿搭生成器 ═══════════ */
  (function () {
    if (!$('outfitGrid')) return;
    const SHIRTS = [
      { name: '红', color: '#ef4444' }, { name: '蓝', color: '#3b82f6' }, { name: '绿', color: '#22c55e' }
    ];
    const PANTS = [{ name: '黑', color: '#1e293b' }, { name: '米', color: '#d6b98c' }];
    const SHOES = [{ name: '运动', color: '#f59e0b' }, { name: '皮', color: '#78350f' }];

    const combos = [];
    SHIRTS.forEach(s => PANTS.forEach(p => SHOES.forEach(h => combos.push([s, p, h]))));

    let timer = null, idx = 0;
    const grid = $('outfitGrid'), now = $('outfitNow');

    function comboCard(c, i) {
      return `<div class="of-card" data-i="${i}">
        <span class="of-dot" style="background:${c[0].color}"></span>
        <span class="of-dot" style="background:${c[1].color}"></span>
        <span class="of-dot" style="background:${c[2].color}"></span>
      </div>`;
    }
    grid.innerHTML = combos.map(comboCard).join('');

    function stop() { if (timer) { clearInterval(timer); timer = null; } $('outfitPlay').textContent = '▶ 生成全部穿搭'; }

    function showStep(i) {
      const cards = grid.querySelectorAll('.of-card');
      cards[i].classList.add('on');
      cards[i].scrollIntoView({ block: 'nearest' });
      const c = combos[i];
      now.innerHTML = `
        <span class="of-big" style="background:${c[0].color}"></span>上衣${c[0].name}
        <b>×</b><span class="of-big" style="background:${c[1].color}"></span>裤子${c[1].name}
        <b>×</b><span class="of-big" style="background:${c[2].color}"></span>鞋${c[2].name}`;
      $('outfitCount').textContent = `${i + 1} / 12`;
    }

    function reset() {
      stop();
      grid.querySelectorAll('.of-card').forEach(c => c.classList.remove('on'));
      now.innerHTML = '<span class="dim">三步各选一样 —— 3 × 2 × 2 套穿搭即将生成</span>';
      $('outfitCount').textContent = '0 / 12';
      idx = 0;
    }

    $('outfitPlay').addEventListener('click', () => {
      if (timer) { stop(); return; }
      reset();
      $('outfitPlay').textContent = '⏸ 暂停';
      timer = setInterval(() => {
        if (idx >= combos.length) { stop(); return; }
        showStep(idx++);
      }, 900);
    });
    $('outfitStep').addEventListener('click', () => { stop(); if (idx < combos.length) showStep(idx++); });
    $('outfitReset').addEventListener('click', reset);
    reset();
  })();

  /* ═══════════ 动画2：排列树（Canvas） ═══════════ */
  (function () {
    const canvas = $('permCanvas');
    if (!canvas) return;
    const LETTERS = 'ABCD';
    let env = null, n = 3, nodes = [], edges = [], reveal = new Set(), permOrder = [];
    let steps = [], idx = 0, timer = null;

    function build() {
      nodes = []; edges = []; permOrder = [];
      function rec(used, rest, depth, parent, prefix) {
        const id = nodes.length;
        nodes.push({ label: used, depth, parent, kids: [], prefix });
        if (parent !== null) { edges.push([parent, id]); nodes[parent].kids.push(id); }
        if (!rest.length) { nodes[id].leaf = true; permOrder.push(prefix); return; }
        for (const ch of rest) {
          rec(ch, rest.filter(x => x !== ch), depth + 1, id, prefix + ch);
        }
      }
      rec('', LETTERS.slice(0, n).split(''), 0, null, '');
      layout();
    }

    function layout() {
      const counts = {};
      nodes.forEach(nd => { counts[nd.depth] = (counts[nd.depth] || 0) + 1; });
      const seen = {};
      nodes.forEach(nd => {
        seen[nd.depth] = (seen[nd.depth] || 0) + 1;
        nd.ci = seen[nd.depth]; nd.cn = counts[nd.depth];
      });
    }

    function draw() {
      if (!env) env = VE.setupCanvas(canvas, 320);
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const maxD = Math.max(...nodes.map(nd => nd.depth));
      const rowH = (h - 50) / maxD;
      const pos = nd => ({ x: (nd.ci / (nd.cn + 1)) * w, y: 30 + nd.depth * rowH });
      edges.forEach(([a, b]) => {
        if (!reveal.has(a) || !reveal.has(b)) return;
        const A = pos(nodes[a]), B = pos(nodes[b]);
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = nodes[b].leaf ? '#a78bfa' : '#ddd6fe';
        ctx.lineWidth = nodes[b].leaf ? 2 : 1.5; ctx.stroke();
      });
      nodes.forEach(nd => {
        if (!reveal.has(nd.id)) return;
        const P = pos(nd);
        const isLeaf = !!nd.leaf;
        ctx.beginPath(); ctx.arc(P.x, P.y, isLeaf ? 11 : 13, 0, Math.PI * 2);
        ctx.fillStyle = isLeaf ? '#7c3aed' : (nd.depth === 0 ? '#fef3c7' : '#fff');
        ctx.strokeStyle = isLeaf ? '#7c3aed' : (nd.depth === 0 ? '#f59e0b' : '#ddd6fe');
        ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
        if (!isLeaf || n === 3) {
          ctx.fillStyle = isLeaf ? '#fff' : '#4c1d95';
          ctx.font = `700 ${isLeaf ? 10 : 12}px Georgia, serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(nd.label, P.x, P.y + 0.5);
        }
      });
      if (n === 4) {
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('第 4 层 24 片叶子已收入下方清单 ▾', w - 8, 16);
      }
    }

    function addPermChip(p) {
      const chip = el('span', 'ps-item' + ' now', p);
      $('permList').appendChild(chip);
      $('permList').scrollTop = $('permList').scrollHeight;
      $('permCount').textContent = $('permList').children.length;
    }

    function buildSteps() {
      steps = []; idx = 0;
      reveal = new Set([0]);
      // BFS 揭示：按深度逐层
      const byDepth = {};
      nodes.forEach(nd => { (byDepth[nd.depth] = byDepth[nd.depth] || []).push(nd); });
      for (let d = 1; d <= Math.max(...nodes.map(nd => nd.depth)); d++) {
        byDepth[d].forEach(nd => steps.push({ run: () => reveal.add(nd.id) }));
      }
      permOrder.forEach(p => steps.push({ run: () => addPermChip(p) }));
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } $('permPlay').textContent = '▶ 展开'; }

    function reset() {
      stop();
      n = Number($('permN').value);
      build();
      reveal = new Set([0]);
      $('permList').innerHTML = '';
      $('permCount').textContent = '0';
      env = VE.setupCanvas(canvas, 320);
      draw();
    }

    $('permPlay').addEventListener('click', () => {
      if (timer) { stop(); return; }
      buildSteps();
      $('permPlay').textContent = '⏸ 暂停';
      const perStep = n === 3 ? 380 : 140;
      timer = setInterval(() => {
        if (idx >= steps.length) { stop(); return; }
        steps[idx++].run();
        if (idx % 3 === 0 || idx >= steps.length) draw();
      }, perStep);
    });
    $('permStep').addEventListener('click', () => {
      stop();
      if (!steps.length) buildSteps();
      if (idx < steps.length) { steps[idx++].run(); draw(); }
    });
    $('permReset').addEventListener('click', reset);
    $('permN').addEventListener('change', reset);
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 320); draw(); });
    reset();
  })();

  /* ═══════════ 动画3：鸽笼演示 ═══════════ */
  (function () {
    if (!$('pigStage')) return;
    let timer = null, m = 5;

    function build() {
      m = Number($('pigBox').value);
      $('pigBoxVal').textContent = m;
      const st = $('pigStage');
      st.innerHTML = '';
      for (let i = 0; i < m; i++) {
        const box = el('div', 'pig-box', `<div class="pig-slots"></div><div class="pig-label">盒 ${i + 1}</div>`);
        st.appendChild(box);
      }
      $('pigNarr').innerHTML = `准备 ${m} 个盒子。将投进 <b>${m + 1}</b> 个球——多一个，必有盒子 ≥ 2 球。`;
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } $('pigPlay').textContent = '▶ 投球'; }

    function drop(i) {
      const boxes = $('pigStage').querySelectorAll('.pig-box');
      // 贪心放当前最空的盒子（演示"即使尽量分散也躲不开"）
      let target = 0, minC = Infinity;
      boxes.forEach((b, bi) => {
        const c = b.querySelectorAll('.pig-ball').length;
        if (c < minC) { minC = c; target = bi; }
      });
      const slots = boxes[target].querySelector('.pig-slots');
      const ball = el('span', 'pig-ball', '');
      slots.appendChild(ball);
      const cnt = slots.children.length;
      if (cnt === 2) {
        boxes[target].classList.add('hit');
        $('pigNarr').innerHTML = `第 ${i + 1} 个球落下：<b>盒子 ${target + 1} 已有 2 球</b> —— 相遇不可避免（这已是"最分散"的放法）。`;
      }
    }

    $('pigPlay').addEventListener('click', () => {
      if (timer) { stop(); return; }
      build();
      $('pigPlay').textContent = '⏸ 暂停';
      let i = 0;
      timer = setInterval(() => {
        if (i >= m + 1) {
          stop();
          $('pigNarr').innerHTML = `✅ ${m + 1} 个球全部落定：<b>至少一个盒子有 2 个球</b>。这就是鸽笼原理——多 1 就躲不开。`;
          return;
        }
        drop(i++);
      }, 850);
    });
    $('pigReset').addEventListener('click', () => { stop(); build(); });
    $('pigBox').addEventListener('input', () => { stop(); build(); });
    build();
  })();

  /* ═══════════ 动画4：杨辉三角 ═══════════ */
  (function () {
    if (!$('pascalWrap')) return;
    let rows = 8, mode = 'num', timer = null;

    const C = (n, k) => {
      if (k < 0 || k > n) return 0;
      let r = 1;
      for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
      return Math.round(r);
    };

    function renderRow(n) {
      const row = el('div', 'pa-row');
      for (let k = 0; k <= n; k++) {
        const v = C(n, k);
        const cell = el('span', 'pa-cell' + (mode === 'par' ? (v % 2 ? ' odd' : ' even') : ''), mode === 'par' ? (v % 2 ? '' : '') : v);
        cell.title = `C(${n},${k}) = ${v}`;
        cell.addEventListener('click', () => {
          $('pascalNarr').innerHTML = `第 ${n} 行第 ${k} 个数 = <b>C(${n}, ${k}) = ${v}</b>（从 ${n} 个里选 ${k} 个的方案数）。它等于肩上两数 C(${n - 1},${k - 1}) + C(${n - 1},${k}) 之和。`;
        });
        row.appendChild(cell);
      }
      return row;
    }

    function renderAll() {
      const w = $('pascalWrap');
      w.innerHTML = '';
      for (let n = 0; n < rows; n++) w.appendChild(renderRow(n));
      const size = Math.max(24, Math.min(34, 340 / (rows + 2)));
      w.style.setProperty('--pa-size', size + 'px');
    }

    $('pascalPlay').addEventListener('click', () => {
      if (timer) { clearInterval(timer); timer = null; $('pascalPlay').textContent = '▶ 逐行生长'; return; }
      const w = $('pascalWrap');
      w.innerHTML = '';
      let n = 0;
      $('pascalPlay').textContent = '⏸ 暂停';
      timer = setInterval(() => {
        if (n >= rows) {
          clearInterval(timer); timer = null;
          $('pascalPlay').textContent = '▶ 逐行生长';
          $('pascalNarr').innerHTML = mode === 'par'
            ? '🎭 奇数格着色后浮现的图案是<b>谢尔宾斯基三角形</b>——组合数的奇偶性里藏着分形！'
            : `✅ 长出 ${rows} 行。第 n 行所有数之和 = 2<sup>n</sup>（从 n 个元素的子集个数）。`;
          return;
        }
        const row = renderRow(n);
        w.appendChild(row);
        row.querySelectorAll('.pa-cell').forEach((c, i) => {
          c.style.animationDelay = (i * 70) + 'ms';
          c.classList.add('grow');
        });
        w.scrollTop = w.scrollHeight;
        n++;
      }, 1100);
    });

    $('pascalRow').addEventListener('input', e => {
      rows = Number(e.target.value);
      $('pascalRowVal').textContent = rows;
      if (timer) { clearInterval(timer); timer = null; $('pascalPlay').textContent = '▶ 逐行生长'; }
      renderAll();
    });
    document.querySelectorAll('#pascalMode button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#pascalMode button').forEach(x => x.classList.toggle('on', x === b));
      mode = b.dataset.mode;
      renderAll();
    }));
    renderAll();
  })();
})();
