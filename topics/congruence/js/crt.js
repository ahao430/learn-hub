/* ═══════════ crt.js · 动画6：中国剩余定理双重筛选 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const track = $('crtTrack');
  if (!track) return;

  const NMAX = 44;
  const cells = [];
  let chain = null;

  for (let x = 0; x <= NMAX; x++) {
    const c = document.createElement('div');
    c.className = 'crt-cell';
    c.textContent = x;
    track.appendChild(c);
    cells.push(c);
  }

  function clear() { cells.forEach(c => c.className = 'crt-cell'); }

  function narr(html) { $('crtNarr').innerHTML = html; }

  function stop() { if (chain) { chain.stop(); chain = null; } }

  function play() {
    stop(); clear();
    const r1 = Number($('crtR1').value);
    const r2 = Number($('crtR2').value);
    const s1 = [], s2 = [], both = [];
    for (let x = 0; x <= NMAX; x++) {
      if (x % 3 === r1) s1.push(x);
      if (x % 5 === r2) { s2.push(x); if (x % 3 === r1) both.push(x); }
    }

    const steps = [];
    narr(`目标：找同时满足 <b>x ≡ ${r1} (mod 3)</b> 和 <b>x ≡ ${r2} (mod 5)</b> 的数。`);
    steps.push({ delay: 900, run: () => narr(`🔵 第一筛：点亮 x ≡ ${r1} (mod 3) 的数——从 ${s1[0]} 开始，每 3 个一个……`) });
    s1.forEach((x, i) => steps.push({
      delay: i === 0 ? 700 : 200,
      run: () => cells[x].classList.add('f1')
    }));
    steps.push({ delay: 800, run: () => narr(`🔵 满足第一条件的有 ${s1.length} 个：${s1.join('、')}。`) });
    steps.push({ delay: 1600, run: () => narr(`🟠 第二筛：再点亮 x ≡ ${r2} (mod 5) 的数——每 5 个一个……`) });
    s2.forEach((x, i) => steps.push({
      delay: i === 0 ? 700 : 280,
      run: () => cells[x].classList.add('f2')
    }));
    steps.push({ delay: 800, run: () => {
      narr('🟠 两色光重叠的格子（边框发亮）就是同时满足两组条件的候选……');
      both.forEach(x => cells[x].classList.add('both'));
    }});
    steps.push({ delay: 2400, run: () => {
      narr(`✅ <b>筛出答案：${both.join('、')}</b>。相邻解相差 <b>15 = 3×5</b>——这正是中国剩余定理：解在模 15 下唯一。孙子算经再加上"x ≡ 2 (mod 7)"，就只剩 <b>23</b>。`);
    }});
    chain = TOPIC.VE.chain(steps);
  }

  $('crtPlay').addEventListener('click', play);
  $('crtReset').addEventListener('click', () => {
    stop(); clear();
    narr('点击"播放"开始筛选。');
  });
  ['crtR1', 'crtR2'].forEach(id => $(id).addEventListener('change', () => {
    stop(); clear();
    narr('条件已修改，点击"播放"重新筛选。');
  }));
})();
