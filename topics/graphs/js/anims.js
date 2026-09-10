/* ═══════════ graphs/anims.js · 图实验室 / 一笔画判定 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const VE = TOPIC.VE;

  /* 预设：坐标为 0~1 的相对值，绘制时按画布缩放 */
  const PRESETS = {
    triangle: {
      verts: [[0.5, 0.18], [0.22, 0.82], [0.78, 0.82]],
      edges: [[0, 1], [1, 2], [2, 0]]
    },
    k4: {
      verts: [[0.5, 0.16], [0.2, 0.48], [0.8, 0.48], [0.5, 0.86]],
      edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
    },
    house: {
      verts: [[0.5, 0.12], [0.28, 0.42], [0.72, 0.42], [0.28, 0.85], [0.72, 0.85]],
      edges: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]]
    },
    pentagram: {
      verts: [...Array(5)].map((_, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
        return [0.5 + 0.38 * Math.cos(a), 0.5 + 0.38 * Math.sin(a)];
      }),
      edges: [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]]
    },
    tree: {
      verts: [[0.12, 0.5], [0.32, 0.28], [0.32, 0.72], [0.58, 0.28], [0.58, 0.72], [0.85, 0.5]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]]
    }
  };
  /* 七桥图（多重图）：A-B 河岸，C-D 岛 */
  const BRIDGES = {
    verts: [[0.18, 0.5], [0.82, 0.5], [0.42, 0.3], [0.58, 0.72]],
    labels: ['A', 'B', 'C', 'D'],
    edges: [
      { a: 0, b: 2, off: -14 }, { a: 0, b: 2, off: 14 },
      { a: 1, b: 2, off: -14 }, { a: 1, b: 2, off: 14 },
      { a: 0, b: 3, off: 0 }, { a: 1, b: 3, off: 0 }, { a: 2, b: 3, off: 0 }
    ]
  };

  /* 顶点度数 */
  function degrees(nV, edges) {
    const deg = new Array(nV).fill(0);
    edges.forEach(e => {
      const a = Array.isArray(e) ? e[0] : e.a, b = Array.isArray(e) ? e[1] : e.b;
      deg[a]++; deg[b]++;
    });
    return deg;
  }

  function edgePts(e, pts) {
    const a = Array.isArray(e) ? e[0] : e.a, b = Array.isArray(e) ? e[1] : e.b;
    const off = Array.isArray(e) ? 0 : (e.off || 0);
    return { A: pts[a], B: pts[b], off };
  }

  function drawEdge(ctx, A, B, off, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    if (off) {
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
      const d = Math.hypot(B.x - A.x, B.y - A.y) || 1;
      const nx = -(B.y - A.y) / d, ny = (B.x - A.x) / d;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(mx + nx * off, my + ny * off, B.x, B.y);
      ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    }
  }

  function drawVertex(ctx, P, r, fill, stroke, label, labelColor) {
    ctx.beginPath(); ctx.arc(P.x, P.y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 2.5;
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = labelColor || '#fff';
    ctx.font = '700 13px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, P.x, P.y + 0.5);
  }

  /* ═══════════ 动画1：图实验室 ═══════════ */
  (function () {
    const canvas = $('labCanvas');
    if (!canvas) return;
    let env = null, verts = [], edges = [], selected = -1;

    function load(preset) {
      const p = PRESETS[preset];
      verts = p.verts.map(v => [...v]);
      edges = p.edges.map(e => [...e]);
      selected = -1;
    }

    function pts() {
      const { w, h } = env;
      return verts.map(([x, y]) => ({ x: 30 + x * (w - 60), y: 30 + y * (h - 60) }));
    }

    function draw() {
      if (!env) env = VE.setupCanvas(canvas, 330);
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      const P = pts();
      const deg = degrees(verts.length, edges);
      edges.forEach(e => {
        const { A, B, off } = edgePts(e, P);
        drawEdge(ctx, A, B, off, '#f9a8d4', 3);
      });
      P.forEach((p, i) => {
        const isSel = i === selected;
        drawVertex(ctx, p, isSel ? 20 : 17,
          isSel ? '#db2777' : '#fff', isSel ? '#db2777' : '#db2777',
          String.fromCharCode(65 + i), isSel ? '#fff' : '#9d174d');
        /* 度数角标 */
        ctx.beginPath(); ctx.arc(p.x + 15, p.y - 15, 9, 0, Math.PI * 2);
        ctx.fillStyle = deg[i] % 2 ? '#f59e0b' : '#0d9488'; ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '700 10px Georgia, serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(deg[i], p.x + 15, p.y - 14.5);
      });
      if (selected >= 0) {
        ctx.fillStyle = '#db2777'; ctx.font = '12.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`已选 ${String.fromCharCode(65 + selected)}，再点一个顶点加/删边`, 12, 20);
      }
      updateStats(deg);
    }

    function updateStats(deg) {
      $('labV').textContent = verts.length;
      $('labE').textContent = edges.length;
      const sum = deg.reduce((s, d) => s + d, 0);
      $('labSum').textContent = sum;
      $('labCheck').textContent = `${sum} ${sum === 2 * edges.length ? '✓' : '✗'} (2E = ${2 * edges.length})`;
      const odd = deg.filter(d => d % 2).length;
      $('labOdd').textContent = odd + ' 个';
      $('labDegs').textContent = deg.join(', ');
    }

    function click(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const P = pts();
      let hit = -1;
      P.forEach((p, i) => { if (Math.hypot(p.x - x, p.y - y) < 24) hit = i; });
      if (hit < 0) { selected = -1; draw(); return; }
      if (selected < 0) { selected = hit; draw(); return; }
      if (selected === hit) { selected = -1; draw(); return; }
      const a = Math.min(selected, hit), b = Math.max(selected, hit);
      const idx = edges.findIndex(e => e[0] === a && e[1] === b);
      if (idx >= 0) edges.splice(idx, 1);
      else edges.push([a, b]);
      selected = -1;
      draw();
    }

    canvas.addEventListener('click', click);
    $('labPreset').addEventListener('change', e => { load(e.target.value); draw(); });
    $('labReset').addEventListener('click', () => { load($('labPreset').value); draw(); });
    window.addEventListener('resize', () => { env = VE.setupCanvas(canvas, 330); draw(); });
    load('triangle');
    env = VE.setupCanvas(canvas, 330);
    draw();
  })();

  /* ═══════════ 动画2：一笔画判定 ═══════════ */
  (function () {
    const canvas = $('euCanvas');
    if (!canvas) return;
    let env = null, chain = null, animRAF = null;

    /* 欧拉路径（预先硬编码，避免实现 Hierholzer） */
    const EU_PATHS = {
      triangle: [0, 1, 2, 0],
      house: [1, 0, 2, 4, 3, 1, 2],
      pentagram: [0, 2, 4, 1, 3, 0],
      k5: [0, 1, 2, 3, 4, 0, 2, 4, 1, 3, 0],
      bridges: null
    };

    function getGraph(name) {
      if (name === 'bridges') {
        return { verts: BRIDGES.verts.map(v => [...v]), edges: BRIDGES.edges.map(e => ({ ...e })), labels: BRIDGES.labels };
      }
      const p = PRESETS[name];
      return { verts: p.verts.map(v => [...v]), edges: p.edges.map(e => ({ a: e[0], b: e[1] })), labels: null };
    }

    function pts(g) {
      const { w, h } = env;
      return g.verts.map(([x, y]) => ({ x: 30 + x * (w - 60), y: 28 + y * (h - 56) }));
    }

    function drawStatic(g, P, deg, lit) {
      const { ctx, w, h } = env;
      ctx.clearRect(0, 0, w, h);
      /* 河流背景（七桥图） */
      if (g.labels) {
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, h * 0.44, w, h * 0.12);
        ctx.fillStyle = '#7dd3fc'; ctx.font = '11px sans-serif';
        ctx.fillText('普雷格尔河', 10, h * 0.51);
      }
      g.edges.forEach(e => drawEdge(ctx, P[e.a], P[e.b], e.off, '#e2e8f0', 4));
      g.verts.forEach((_, i) => {
        drawVertex(ctx, P[i], 19, '#fff', '#db2777',
          g.labels ? g.labels[i] : String.fromCharCode(65 + i), '#9d174d');
      });
      void deg; void lit;
    }

    function drawWithProgress(g, P, pathEdges, progressIdx, t) {
      drawStatic(g, P);
      /* 已走完的边 */
      for (let i = 0; i < progressIdx; i++) {
        const s = pathEdges[i];
        drawEdge(ctx2, P[s.a], P[s.b], s.off, '#db2777', 5);
      }
      /* 当前边动画 */
      const cur = pathEdges[progressIdx];
      if (cur && t < 1) {
        const A = P[cur.a], B = P[cur.b];
        const x = A.x + (B.x - A.x) * t, y = A.y + (B.y - A.y) * t;
        drawEdge(ctx2, A, { x, y }, cur.off, '#f472b6', 5);
        drawVertex(ctx2, { x, y }, 8, '#db2777', '#fff');
      }
    }
    let ctx2 = null;

    function stop() { if (chain) { chain.stop(); chain = null; } if (animRAF) { cancelAnimationFrame(animRAF); animRAF = null; } }

    function run() {
      stop();
      const name = $('euPreset').value;
      const g = getGraph(name);
      env = VE.setupCanvas(canvas, 330);
      ctx2 = env.ctx;
      const P = pts(g);
      const deg = degrees(g.verts.length, g.edges);
      const oddIdx = deg.map((d, i) => d % 2 ? i : -1).filter(i => i >= 0);

      drawStatic(g, P, deg);

      const steps = [];
      /* 逐个数度数 */
      g.verts.forEach((_, i) => steps.push({
        delay: 1100,
        run: () => {
          drawStatic(g, P, deg);
          const isOdd = deg[i] % 2;
          /* 高亮当前顶点 */
          drawVertex(env.ctx, P[i], 22, isOdd ? '#f59e0b' : '#0d9488', isOdd ? '#b45309' : '#0f766e',
            g.labels ? g.labels[i] : String.fromCharCode(65 + i));
          $('euNarr').innerHTML = `数度数：顶点 <b>${g.labels ? g.labels[i] : String.fromCharCode(65 + i)}</b> 连了 <b>${deg[i]}</b> 条边 ${isOdd ? '→ <b style="color:#b45309">奇度</b>' : '→ 偶度'}`;
        }
      }));

      steps.push({
        delay: 1400,
        run: () => {
          drawStatic(g, P, deg);
          const verdict = oddIdx.length === 0
            ? `✅ 奇度顶点 <b>0</b> 个 —— 存在<b>欧拉回路</b>（从任一点出发一笔画回原点）。看笔！`
            : oddIdx.length === 2
              ? `✅ 奇度顶点恰 <b>2</b> 个 —— 存在<b>欧拉路径</b>（从一个奇度点出发、另一个收尾）。看笔！`
              : `❌ 奇度顶点有 <b>${oddIdx.length}</b> 个（> 2）—— <b>不可能一笔画</b>！这正是 1736 年欧拉对七桥问题的判决。`;
          $('euNarr').innerHTML = verdict + `<br><span style="color:#64748b;font-size:13px">度数序列：${deg.join(', ')}（握手定理：Σ = ${deg.reduce((s, d) => s + d, 0)} = 2×${g.edges.length} ✓）</span>`;
        }
      });

      /* 有解的图：动画描路径 */
      const path = EU_PATHS[name];
      if (path) {
        const pathEdges = [];
        for (let i = 0; i < path.length - 1; i++) {
          const a = path[i], b = path[i + 1];
          const e = g.edges.find(e =>
            (e.a === a && e.b === b) || (e.a === b && e.b === a));
          pathEdges.push(e);
        }
        steps.push({
          delay: 1200,
          run: () => {
            let i = 0;
            function stepEdge() {
              if (i >= pathEdges.length) {
                $('euNarr').innerHTML += '<br>🖊️ 一笔画完成！每条边恰好经过一次。';
                return;
              }
              const start = performance.now();
              const dur = 750;
              function frame(now) {
                const t = Math.min(1, (now - start) / dur);
                drawWithProgress(g, P, pathEdges, i, t);
                if (t < 1) animRAF = requestAnimationFrame(frame);
                else { i++; stepEdge(); }
              }
              animRAF = requestAnimationFrame(frame);
            }
            stepEdge();
          }
        });
      }

      chain = VE.chain(steps);
    }

    $('euRun').addEventListener('click', run);
    $('euReset').addEventListener('click', () => {
      stop();
      $('euNarr').textContent = '选一张图，点击"判定"。';
      $('euRun').click();
    });
    $('euPreset').addEventListener('change', () => {
      stop();
      $('euNarr').textContent = '选一张图，点击"判定"。';
      const g = getGraph($('euPreset').value);
      env = VE.setupCanvas(canvas, 330);
      ctx2 = env.ctx;
      drawStatic(g, pts(g));
    });
    window.addEventListener('resize', () => {
      stop();
      const g = getGraph($('euPreset').value);
      env = VE.setupCanvas(canvas, 330);
      ctx2 = env.ctx;
      drawStatic(g, pts(g));
    });

    /* 初始画三角形 */
    env = VE.setupCanvas(canvas, 330);
    ctx2 = env.ctx;
    const g0 = getGraph('triangle');
    drawStatic(g0, pts(g0));
  })();
})();
