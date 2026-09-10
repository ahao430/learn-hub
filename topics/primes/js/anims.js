/* ═══════════ primes/anims.js · 筛法 / 分解树 / 质数检测 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const VE = TOPIC.VE, el = TOPIC.el;

  const isPrime = n => {
    if (n < 2) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  };

  /* ═══════════ 动画1：埃氏筛法 ═══════════ */
  (function () {
    const grid = $('sieveGrid');
    if (!grid) return;
    const cells = [];
    for (let n = 1; n <= 100; n++) {
      const c = el('div', 'sg-cell', n);
      if (n === 1) c.classList.add('one');
      grid.appendChild(c);
      cells.push(c);
    }
    let steps = [], idx = 0, chain = null, timer = null;

    const narr = t => $('sieveNarr').innerHTML = t;
    const count = () => {
      let c = 0;
      cells.forEach((x, i) => { if (i > 0 && !x.classList.contains('out')) c++; });
      $('sieveCount').textContent = c;
    };
    const markPrime = n => cells[n - 1].classList.add('prime');
    const cross = n => { cells[n - 1].classList.add('out'); count(); };

    function build() {
      steps = [];
      narr('从 2 开始：它是质数（最小的质数）。');
      steps.push({ run: () => { markPrime(2); narr('<b>2</b> 是质数 —— 划掉它的倍数（保留 2 本身）……'); } });
      [2, 3, 5, 7].forEach(p => {
        for (let m = p * p; m <= 100; m += p) {
          if (cells[m - 1].classList.contains('out')) continue;
          steps.push({ run: () => { cross(m); narr(`划掉 ${p} 的倍数：<b>${m}</b> = ${p}×${m / p}`); } });
        }
        if (p < 7) {
          const next = [2, 3, 5, 7][[2, 3, 5, 7].indexOf(p) + 1];
          steps.push({ run: () => { markPrime(p); narr(`<b>${p}</b> 的倍数清完。下一个幸存者是 <b>${next}</b> —— 质数，继续划它的倍数（从 ${next}² = ${next * next} 开始）。`); } });
        }
      });
      steps.push({ run: () => {
        markPrime(7);
        narr('7² = 49 < 100，但 11² = 121 > 100 —— 筛到 √100 为止就够了！');
      } });
      steps.push({ run: () => {
        let ps = [];
        cells.forEach((c, i) => { if (i > 0 && !c.classList.contains('out')) { c.classList.add('prime'); ps.push(i + 1); } });
        narr(`✅ 筛完！100 以内共 <b>${ps.length}</b> 个质数。它们是：${ps.join('、')}。`);
      } });
      idx = 0;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } if (chain) { chain.stop(); chain = null; } $('sievePlay').textContent = '▶ 开始筛'; }

    $('sievePlay').addEventListener('click', () => {
      if (timer) { stop(); return; }
      reset();
      $('sievePlay').textContent = '⏸ 暂停';
      timer = setInterval(() => {
        if (idx >= steps.length) { stop(); return; }
        steps[idx++].run();
      }, 420);
    });
    $('sieveStep').addEventListener('click', () => {
      stop();
      if (idx >= steps.length) return;
      steps[idx++].run();
    });
    function reset() {
      stop();
      cells.forEach(c => c.className = 'sg-cell' + (c.textContent === '1' ? ' one' : ''));
      count();
      narr('点击"开始筛"。');
      build();
    }
    $('sieveReset').addEventListener('click', reset);
    count(); build();
  })();

  /* ═══════════ 动画2：分解树（Canvas） ═══════════ */
  (function () {
    const canvas = $('treeCanvas');
    if (!canvas) return;
    let env = null;
    let nodes = [], edges = [], revealSet = new Set();
    let steps = [], idx = 0, timer = null;

    function buildTree(n) {
      nodes = []; edges = [];
      let leafX = 0;
      function rec(val, depth, parent) {
        const node = { val, depth, id: nodes.length, parent, children: [], leafVal: null };
        nodes.push(node);
        if (parent !== null) edges.push([parent, node.id]);
        if (isPrime(val)) {
          node.x = ++leafX;
          node.leafVal = val;
        } else {
          let p = 2;
          while (val % p !== 0) p++;
          const c1 = rec(p, depth + 1, node.id);
          const c2 = rec(val / p, depth + 1, node.id);
          node.children = [c1, c2];
          node.x = (c1.x + c2.x) / 2;
        }
        return node;
      }
      rec(n, 0, null);
      const maxDepth = Math.max(...nodes.map(nd => nd.depth));
      return { leafCount: leafX, maxDepth };
    }

    function buildSteps() {
      steps = [];
      const n = Number($('treeNum').value);
      const { leafCount, maxDepth } = buildTree(n);
      const geom = { leafCount, maxDepth };
      revealSet = new Set([0]);
      steps.push({ run: () => { setFormula(n, geom); } });
      // 逐层分裂：找第一个"已显示但未分裂"的合数节点
      while (true) {
        const target = nodes.find(nd => revealSet.has(nd.id) && nd.children.length && !revealSet.has(nd.children[0].id));
        if (!target) break;
        steps.push({
          run: () => {
            revealSet.add(target.children[0].id);
            revealSet.add(target.children[1].id);
            setFormula(n, geom);
          }
        });
      }
      steps.push({ run: () => { setFormula(n, geom, true); } });
      idx = 0;
    }

    function leavesDisplayed() {
      const out = [];
      (function walk(id) {
        const nd = nodes[id];
        if (nd.children.length && revealSet.has(nd.children[0].id)) {
          walk(nd.children[0].id); walk(nd.children[1].id);
        } else out.push(nd.val);
      })(0);
      return out;
    }

    function fmtExp(fs) {
      const cnt = {};
      fs.forEach(p => cnt[p] = (cnt[p] || 0) + 1);
      return Object.keys(cnt).map(p => cnt[p] > 1 ? `${p}<sup>${cnt[p]}</sup>` : p).join(' × ');
    }

    function setFormula(n, geom, final) {
      const fs = leavesDisplayed();
      const done = fs.every(isPrime);
      $('treeFormula').innerHTML = final || done
        ? `${n} = ${fmtExp(fs)}　✅ 全是质数，分解完成`
        : `${n} = ${fs.join(' × ')}　……继续剥`;
      draw();
    }

    function positions() {
      const { w, h } = env;
      const leafCount = Math.max(...nodes.map(() => 0)) || 1;
      let lc = 0;
      nodes.forEach(nd => { if (!nd.children.length) lc++; });
      const rowH = Math.min(58, (h - 70) / (Math.max(...nodes.map(nd => nd.depth)) + 1));
      nodes.forEach(nd => {
        nd.px = (nd.x / (lc + 1)) * w;
        nd.py = 36 + nd.depth * rowH;
      });
    }

    function draw() {
      if (!env) env = VE.setupCanvas(canvas, 330);
      positions();
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const acc = '#0d9488';
      edges.forEach(([a, b]) => {
        if (!revealSet.has(a) || !revealSet.has(b)) return;
        const A = nodes[a], B = nodes[b];
        ctx.beginPath(); ctx.moveTo(A.px, A.py); ctx.lineTo(B.px, B.py);
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();
      });
      nodes.forEach(nd => {
        if (!revealSet.has(nd.id)) return;
        const isLeaf = !nd.children.length || !revealSet.has(nd.children[0].id);
        const fullySplit = nd.children.length && revealSet.has(nd.children[0].id);
        ctx.beginPath(); ctx.arc(nd.px, nd.py, 17, 0, Math.PI * 2);
        ctx.fillStyle = fullySplit ? '#f0fdfa' : (isLeaf ? acc : '#fef3c7');
        ctx.strokeStyle = fullySplit ? '#99f6e4' : (isLeaf ? acc : '#f59e0b');
        ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
        ctx.fillStyle = fullySplit ? '#0f766e' : '#0f172a';
        ctx.font = '700 13px Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(nd.val, nd.px, nd.py + 0.5);
      });
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } $('treePlay').textContent = '▶ 分解'; }

    function start(auto) {
      stop();
      buildSteps();
      if (!auto) { if (idx < steps.length) steps[idx++].run(); return; }
      $('treePlay').textContent = '⏸ 暂停';
      timer = setInterval(() => {
        if (idx >= steps.length) { stop(); return; }
        steps[idx++].run();
      }, 1000);
    }

    $('treePlay').addEventListener('click', () => { if (timer) { stop(); return; } start(true); });
    $('treeStep').addEventListener('click', () => start(false));
    $('treeReset').addEventListener('click', () => {
      stop();
      revealSet = new Set([0]);
      $('treeFormula').textContent = '选一个数，点击"分解"';
      env = VE.setupCanvas(canvas, 330);
      draw();
    });
    $('treeNum').addEventListener('change', () => $('treeReset').click());

    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 330); draw(); });
    $('treeReset').click();
  })();

  /* ═══════════ 动画3：质数检测器 ═══════════ */
  (function () {
    if (!$('testLog')) return;
    let timer = null;

    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    function run() {
      stop();
      const log = $('testLog'), verdict = $('testVerdict');
      const n = Math.trunc(Number($('testN').value));
      log.innerHTML = ''; verdict.className = 'nl-result'; verdict.textContent = '';
      if (!Number.isFinite(n) || n < 2 || n > 999983) {
        log.innerHTML = '<span class="dim">请输入 2 ~ 999983 之间的整数。</span>';
        return;
      }
      const rows = [];
      rows.push({ t: `判定 <b>${n}</b>：只需试除到 √${n} ≈ ${Math.sqrt(n).toFixed(1)}`, cls: 'dim' });
      let found = 0;
      for (let d = 2; d * d <= n; d++) {
        const r = n % d;
        if (r === 0) { rows.push({ t: `${n} ÷ ${d} 余 <b>0</b> —— 整除！${n} = ${d} × ${n / d}`, cls: 'hit' }); found = d; break; }
        rows.push({ t: `${n} ÷ ${d} 余 ${r}，不整除`, cls: 'miss' });
      }
      if (!found) rows.push({ t: `试到 d² > ${n} 为止，没有任何因数 → <b>${n} 是质数</b>`, cls: 'done' });
      else rows.push({ t: `找到因数 ${found} → <b>${n} 是合数</b>`, cls: 'done' });

      const interval = Math.max(60, Math.min(700, 25000 / rows.length));
      let i = 0;
      timer = setInterval(() => {
        if (i >= rows.length) {
          stop();
          verdict.classList.add('on', found ? 'bad' : 'ok');
          verdict.textContent = found ? `❌ ${n} 是合数（= ${found} × ${n / found}）` : `✅ ${n} 是质数`;
          return;
        }
        const r = rows[i++];
        const div = el('div', 'tl-row ' + r.cls, r.t);
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
      }, interval);
    }

    $('testRun').addEventListener('click', run);
    $('testStop').addEventListener('click', stop);
    $('testN').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  })();
})();
