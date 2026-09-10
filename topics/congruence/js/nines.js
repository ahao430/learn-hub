/* ═══════════ nines.js · 动画4：弃九法验算（步骤动画） ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const stage = $('ninesStage'), narrEl = $('ninesNarr');
  if (!stage) return;
  const narr = html => { narrEl.innerHTML = html; };

  const A = 98765, B = 4321;
  const CASES = {
    good: { C: 426763565, label: '正确结果' },
    bad:  { C: 426842565, label: '错误结果' }
  };

  let steps = [], idx = 0, timer = null;

  const dsum = n => String(n).split('').reduce((s, d) => s + Number(d), 0);
  const reduce9 = n => { while (n > 9) n = dsum(n); return n; };

  function digitsLine(label, num, flyClass) {
    const line = document.createElement('div');
    line.className = 'nines-line';
    line.innerHTML = `<span class="nl-label">${label}</span>`;
    String(num).split('').forEach(d => {
      const el = document.createElement('div');
      el.className = 'digit ' + flyClass;
      el.textContent = d;
      line.appendChild(el);
    });
    const sum = document.createElement('div');
    sum.className = 'nl-sum';
    line.appendChild(sum);
    return { line, sum, digits: line.querySelectorAll('.digit') };
  }

  function build(kase) {
    const { C } = CASES[kase];
    const sa = dsum(A), ra = reduce9(A);
    const sb = dsum(B), rb = reduce9(B);
    const prod = ra * rb, rp = reduce9(prod);
    const sc = dsum(C), rc = reduce9(C);
    const ok = rc === rp;
    const ds = n => String(n).split('').join(' + ');

    stage.innerHTML = '';
    narrEl.textContent = '点击"播放"观看完整流程，或用"单步"逐格推进。';

    const LA = digitsLine(`${A} 的各位数字`, A, 'fly');
    const LB = digitsLine(`${B} 的各位数字`, B, 'fly2');
    const LP = document.createElement('div');
    LP.className = 'nines-line';
    LP.innerHTML = `<span class="nl-label">弃九值相乘（同余乘法）</span>
      <span class="nl-sum">${ra} × ${rb} = ${prod}${prod > 9 ? ' → ' + ds(prod) + ' = ' + rp : ''}</span>`;
    const LC = digitsLine(`候选结果 ${C} 的各位数字`, C, 'fly');
    const LR = document.createElement('div');
    LR.className = `nl-result ${ok ? 'ok' : 'bad'}`;
    LR.innerHTML = ok
      ? `✅ ${rp} = ${rc}　弃九验算通过：${CASES[kase].label} ${C} 大概率正确`
      : `❌ ${rp} ≠ ${rc}　弃九法识破错误：${A} × ${B} 不可能等于 ${C}！`;
    stage.appendChild(LA.line);
    stage.appendChild(LB.line);
    stage.appendChild(LP);
    stage.appendChild(LC.line);
    stage.appendChild(LR);

    const digitsHTML = n => ds(n);

    steps = [
      { run: () => { LA.line.classList.add('on'); narr(`第一步：把 ${A} 逐位拆开——"数字和"即将接管这个数。`); } },
      { run: () => { LA.digits.forEach(d => d.classList.add('fly')); narr(`把每一位加起来：${digitsHTML(A)} = ${sa}。`); } },
      { run: () => { LA.sum.classList.add('on'); LA.sum.innerHTML = `${sa} → ${digitsHTML(sa)} = <b>${ra}</b>`; narr(`${sa} 还比 9 大？再化归一次：${digitsHTML(sa)} = ${ra}。<b>${A} 的弃九值是 ${ra}</b>（即 ${A} ≡ ${ra} (mod 9)）。`); } },
      { run: () => { LB.line.classList.add('on'); LB.digits.forEach(d => d.classList.add('fly2')); narr(`同样处理乘数 ${B}：${digitsHTML(B)} = ${sb} → ${digitsHTML(sb)} = <b>${rb}</b>。`); } },
      { run: () => { LB.sum.classList.add('on'); LB.sum.innerHTML = `${sb} → ${digitsHTML(sb)} = <b>${rb}</b>`; narr(`<b>${B} 的弃九值是 ${rb}</b>。`); } },
      { run: () => { LP.classList.add('on'); narr(`同余乘法：积的弃九值必须等于弃九值的积——${ra} × ${rb} = ${prod}${prod > 9 ? ' → ' + rp : ''}。所以 <b>${A} × ${B} 的弃九值必须是 ${rp}</b>。`); } },
      { run: () => { LC.line.classList.add('on'); narr(`现在检查候选结果 ${C}：${digitsHTML(C)} = ${sc}。`); } },
      { run: () => { LC.sum.classList.add('on'); LC.sum.innerHTML = `${sc} → ${digitsHTML(sc)} = <b>${rc}</b>`; narr(`化归到底：候选结果的弃九值是 <b>${rc}</b>。`); } },
      { run: () => { LR.classList.add('on'); narr(ok
        ? `✅ 左边 ${rp} = 右边 ${rc}，验算通过。（注意：弃九法只能"证伪"不能"证真"——一致说明大概率没错。）`
        : `❌ 左边 ${rp} ≠ 右边 ${rc}：被弃九法当场识破！${A} × ${B} 真正等于 426763565，抄错几个数字就露出马脚。`); } }
    ];
    idx = 0;
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } $('ninesPlay').textContent = '▶ 播放'; }

  function doStep() {
    if (idx >= steps.length) { stop(); return false; }
    steps[idx++].run();
    return true;
  }

  $('ninesPlay').addEventListener('click', () => {
    if (timer) { stop(); return; }
    const kase = document.querySelector('#ninesMode button.on').dataset.case;
    build(kase);
    $('ninesPlay').textContent = '⏸ 暂停';
    doStep();
    timer = setInterval(() => { if (!doStep()) stop(); }, 1800);
  });
  $('ninesStep').addEventListener('click', () => {
    stop();
    const kase = document.querySelector('#ninesMode button.on').dataset.case;
    if (idx >= steps.length) build(kase);
    doStep();
  });
  $('ninesReset').addEventListener('click', () => {
    stop();
    build(document.querySelector('#ninesMode button.on').dataset.case);
  });
  document.querySelectorAll('#ninesMode button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('#ninesMode button').forEach(x => x.classList.toggle('on', x === b));
    stop();
    build(b.dataset.case);
  }));

  build('good');
})();
