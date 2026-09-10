/* ═══════════ grid.js · 动画3：余数染色百数表 / 乘法表 mod n ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const remGrid = $('gridRem'), mulGrid = $('gridMul');
  if (!remGrid || !mulGrid) return;

  let mode = 'rem';
  let n = 7;

  function color(r) { return TOPIC.VE.residueColor(r, n); }

  function legend() {
    const el = $('gridLegend');
    el.innerHTML = '';
    for (let r = 0; r < n; r++) {
      const it = document.createElement('span');
      it.className = 'legend-item';
      it.innerHTML = `<i style="background:${color(r)}"></i>余 ${r}`;
      el.appendChild(it);
    }
  }

  /* —— 余数染色百数表 —— */
  function paintRem(animate) {
    remGrid.innerHTML = '';
    const cells = [];
    for (let i = 0; i < 100; i++) {
      const c = document.createElement('div');
      c.className = 'ng-cell';
      c.textContent = i;
      remGrid.appendChild(c);
      cells.push(c);
    }
    cells.forEach((c, i) => {
      const r = i % n;
      if (!animate) {
        c.classList.add('lit');
        c.style.background = color(r);
        c.style.transitionDelay = '0ms';
      } else {
        c.style.transitionDelay = (i * 30) + 'ms';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          c.classList.add('lit');
          c.style.background = color(r);
        }));
      }
    });
    /* 动画结束后清掉逐格延迟，避免切模数时拖慢 */
    if (animate) setTimeout(() => cells.forEach(c => c.style.transitionDelay = '0ms'), 100 * 30 + 600);
  }

  /* —— 乘法表 mod n（含表头，(n+1)×(n+1)） —— */
  function paintMul() {
    mulGrid.style.gridTemplateColumns = `repeat(${n + 1}, 1fr)`;
    mulGrid.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'ng-cell head'; head.textContent = '×';
    mulGrid.appendChild(head);
    for (let j = 0; j < n; j++) {
      const h = document.createElement('div');
      h.className = 'ng-cell head'; h.textContent = j;
      mulGrid.appendChild(h);
    }
    for (let i = 0; i < n; i++) {
      const h = document.createElement('div');
      h.className = 'ng-cell head'; h.textContent = i;
      mulGrid.appendChild(h);
      for (let j = 0; j < n; j++) {
        const c = document.createElement('div');
        const r = (i * j) % n;
        c.className = 'ng-cell lit';
        c.textContent = r;
        c.style.background = color(r);
        c.style.transitionDelay = ((i * n + j) * 26) + 'ms';
        mulGrid.appendChild(c);
      }
    }
  }

  function setMode(m) {
    mode = m;
    document.querySelectorAll('#gridMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
    remGrid.classList.toggle('show', m === 'rem');
    remGrid.classList.toggle('remgrid', true);
    mulGrid.classList.toggle('show', m === 'mul');
    if (m === 'mul') paintMul(); else paintRem(false);
  }

  function setN(v) {
    n = Number(v);
    $('gridModVal').textContent = n;
    legend();
    if (mode === 'rem') paintRem(false); else paintMul();
  }

  $('gridMod').addEventListener('input', e => setN(e.target.value));
  $('gridPlay').addEventListener('click', () => {
    if (mode === 'rem') paintRem(true);
    else paintMul();
  });
  document.querySelectorAll('#gridMode button').forEach(b =>
    b.addEventListener('click', () => setMode(b.dataset.mode)));

  setN(7);
})();
