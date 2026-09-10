/* ═══════════════════════════════════════════════
   质数与算术基本定理 · 内容组装
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, examples,
    propRow, ancient, keypoint, appGrid, viz, footer, initChrome } = TOPIC;

  TopicNav({
    title: '质数',
    brandSym: '🧱',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-what', text: '什么是质数' },
      { href: '#ch-sieve', text: '筛法' },
      { href: '#ch-fta', text: '算术基本定理' },
      { href: '#ch-inf', text: '无穷多' },
      { href: '#ch-apps', text: '应用' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  document.body.insertBefore(hero({
    badge: '交互式数学教学',
    title: '质数与算术基本定理',
    sub: '整数世界的原子，与拼出万物的唯一配方',
    lead: '质数是只能被 1 和自身整除的大于 1 的整数。它们像化学里的元素——任何整数都能"分解"成质数的乘积，而且配方唯一。这个专题用筛法动画、分解树和质数检测器，带你亲手触摸这些"原子"。',
    formula: '84 = 2 × 2 × 3 × 7',
    cards: [
      { num: '01', title: '什么是质数', desc: '定义 · 为什么 1 不是', href: '#ch-what' },
      { num: '02', title: '埃氏筛法', desc: '两千年前的高效算法', href: '#ch-sieve' },
      { num: '03', title: '算术基本定理', desc: '分解唯一 · 分解树动画', href: '#ch-fta' },
      { num: '04', title: '质数无穷多', desc: '欧几里得的反证法', href: '#ch-inf' },
      { num: '05', title: '应用一瞥', desc: 'RSA · 周期蝉 · 梅森', href: '#ch-apps' },
      { num: '✎', title: '练习题', desc: '8 题 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 什么是质数 ---------- */
  const ch1 = chapter({ id: 'ch-what', no: '第一章', title: '什么是质数', accent: '#0d9488', accentSoft: '#f0fdfa' });
  ch1.appendChild(el('p', null, '把 12 颗豆子分成几堆，让每堆一样多：可以分成 2 堆、3 堆、4 堆、6 堆——12 有很多"分法"。但 7 颗豆子呢？只能分成 7 堆（每堆 1 颗）或 1 堆。<strong>没有别的分法的数，就是质数</strong>——它们不可再分。'));
  ch1.appendChild(theorem('定义',
    '<p>大于 1 的整数 <span class="fx">p</span>，若只有 1 和 p 两个正因数，则 <span class="fx">p</span> 称为<b>质数</b>（素数）。大于 1 且不是质数的整数称为<b>合数</b>。</p>' +
    '<p class="mb0">开头的 20 个质数：2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71。</p>'));
  ch1.appendChild(triviewLike());
  function triviewLike() {
    const t = el('div', 'triview');
    [['🧱', '像原子', '不能再分解的"建筑材料"'], ['🚫', '排除法', '不是质数 = 有其他因数（合数）'], ['1️⃣', '特殊的 1', '既非质数也非合数——见下']].forEach(([i, ti, b]) => {
      t.appendChild(el('div', 'tv-item', `<span class="tv-ico">${i}</span><b>${ti}</b><br>${b}`));
    });
    return t;
  }
  ch1.appendChild(el('h3', null, '为什么 1 不算质数？'));
  ch1.appendChild(el('p', null, '如果 1 是质数，分解就不唯一了：6 = 2×3 = 1×2×3 = 1×1×2×3 = ……。把 1 排除在外，正是为了保住下面这章的主角——<strong>分解的唯一性</strong>。这是数学家"定义服务于定理"的经典范例。'));
  ch1.appendChild(keypoint('质数 = 大于 1 且只有 1 和自身两个因数的整数。1 被排除在质数之外，是为了让分解唯一性成立。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 筛法 ---------- */
  const ch2 = chapter({ id: 'ch-sieve', no: '第二章', title: '埃拉托斯特尼筛法', accent: '#0d9488', accentSoft: '#f0fdfa' });
  ch2.appendChild(el('p', null, '怎么找出 100 以内的所有质数？公元前 3 世纪，古希腊数学家埃拉托斯特尼给出了一个优雅的算法：<strong>从 2 开始，把每个质数的倍数划掉，剩下的就是质数</strong>——像用筛子筛沙子。'));
  ch2.appendChild(stepListLike([
    { no: '①', body: '写下 2~100 的所有数' },
    { no: '②', body: '最小的未划掉数是 <b>2</b>——它是质数；划掉所有 2 的倍数（4, 6, 8, …）' },
    { no: '③', body: '下一个未划掉数是 <b>3</b>——质数；划掉所有 3 的倍数' },
    { no: '④', body: '下一个是 <b>5</b>、再下一个 <b>7</b>……划到 <b>√100 = 10</b> 为止即可' },
    { no: '⑤', body: '剩下的 25 个数就是 100 以内的全部质数' }
  ]));
  function stepListLike(items) {
    const s = el('div', 'step-list');
    items.forEach(it => s.appendChild(el('div', 'step-item', `<b>${it.no}</b> ${it.body}`)));
    return s;
  }
  ch2.appendChild(el('p', null, '为什么划到 √n 就够？如果 n = a×b 且 a ≤ b，那么 a ≤ √n——<strong>合数必有不超过 √n 的因数</strong>。这个小观察是筛法（也是下面的质数检测）效率的来源。'));

  const vSieve = viz({ id: 'viz-sieve', title: '🎬 动画 1 · 埃氏筛法 —— 眼看质数被筛出来',
    desc: '点击"开始筛"，看 2、3、5、7 的倍数被逐个划掉，最后留下 25 个质数。',
    controls: `<button class="btn primary" id="sievePlay">▶ 开始筛</button>
      <button class="btn" id="sieveStep">单步 ›</button>
      <button class="btn" id="sieveReset">重置</button>
      <span class="stat" style="padding:4px 12px"><span>剩余</span><b id="sieveCount" style="font-size:16px">99</b></span>`,
    bodyClass: 'sieve-body',
    bodyHTML: `<div class="sieve-grid" id="sieveGrid"></div>
      <div class="sieve-narr" id="sieveNarr">点击"开始筛"。</div>` });
  ch2.appendChild(vSieve);

  ch2.appendChild(keypoint('筛法的本质：合数必有 ≤ √n 的因数，所以只需用 ≤ √n 的质数去筛。这个"试到平方根"的思想贯穿所有质数判断。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 算术基本定理 ---------- */
  const ch3 = chapter({ id: 'ch-fta', no: '第三章', title: '算术基本定理', accent: '#0d9488', accentSoft: '#f0fdfa' });
  ch3.appendChild(theorem('算术基本定理（高斯，1801）',
    '<p>每个大于 1 的整数都可以写成有限个质数的乘积，并且在不计顺序的意义下<b>写法唯一</b>：</p>' +
    '<p class="center big">n = p₁<sup>a₁</sup> · p₂<sup>a₂</sup> · … · p_k<sup>a_k</sup></p>' +
    '<p class="mb0">例：360 = 2³ × 3² × 5；100 = 2² × 5²；97 本身是质数。就像每个分子由唯一配方的原子组成——<strong>质数是乘法世界的原子</strong>。</p>'));
  ch3.appendChild(el('p', null, '分解的过程像剥洋葱：每次剥下最小的质因数。看动画——'));

  const vTree = viz({ id: 'viz-tree', title: '🎬 动画 2 · 分解树 —— 剥开一个数',
    desc: '选一个数，看它一步步分裂：每次用最小的质因数剥开，直到全部变成质数（叶子）。',
    controls: `<label>要分解的数
        <select id="treeNum">
          <option value="84" selected>84</option>
          <option value="360">360</option>
          <option value="100">100</option>
          <option value="2026">2026</option>
          <option value="97">97（质数）</option>
        </select></label>
      <button class="btn primary" id="treePlay">▶ 分解</button>
      <button class="btn" id="treeStep">单步 ›</button>
      <button class="btn" id="treeReset">重置</button>`,
    bodyHTML: `<canvas id="treeCanvas" height="330"></canvas>
      <div class="formula-box" id="treeFormula">选一个数，点击"分解"</div>` });
  ch3.appendChild(vTree);

  ch3.appendChild(el('h3', null, '亲手检测一个数'));
  ch3.appendChild(el('p', null, '判断 n 是不是质数，只需用 2, 3, 4, … 一直试除到 √n：中途除尽了就是合数（找到了因数）；一路除不尽就是质数。'));

  const vTest = viz({ id: 'viz-test', title: '🔢 动画 3 · 质数检测器 —— 试除到平方根',
    desc: '输入一个 2 ~ 999983 的整数，看试除法一步步判定它是质数还是合数。',
    controls: `<label>n = <input type="number" id="testN" value="97" min="2" max="999983" step="1"></label>
      <button class="btn primary" id="testRun">▶ 检测</button>
      <button class="btn" id="testStop">停止</button>`,
    bodyHTML: `<div class="test-log" id="testLog"><span class="dim">输入 n，点击"检测"。</span></div>
      <div class="nl-result" id="testVerdict"></div>` });
  ch3.appendChild(vTest);

  ch3.appendChild(keypoint('每个大于 1 的整数都有唯一的质因数分解。分解方法：反复用最小的质因数去除（剥洋葱）。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 质数无穷多 ---------- */
  const ch4 = chapter({ id: 'ch-inf', no: '第四章', title: '质数有无穷多个', accent: '#0d9488', accentSoft: '#f0fdfa' });
  ch4.appendChild(el('p', null, '质数会不会"用完"？两千三百年前欧几里得在《几何原本》里给出了数学史上最美的证明之一——只用一句话就说明质数无穷多。'));
  ch4.appendChild(theorem('欧几里得的证明（反证法）',
    '<p>假设质数只有有限个：<span class="fx">p₁, p₂, …, p_k</span>。构造数</p>' +
    '<p class="center big">N = p₁ × p₂ × … × p_k + 1</p>' +
    '<p>N 除以任何 p<sub>i</sub> 都余 1（除不尽）。于是 N 的质因数不在列表里——与"列表包含所有质数"矛盾。所以<strong>质数有无穷多个</strong>。</p>' +
    '<p class="mb0">注意：N 本身不一定是质数（如 2×3×5×7×11×13+1 = 30031 = 59×509），但它的质因数一定是"新"的。</p>'));
  ch4.appendChild(examples([
    { f: '2+1=3', note: '前 1 个质数之积 + 1 = 3，是质数' },
    { f: '2×3×5+1=31', note: '前 3 个质数之积 + 1 = 31，是质数' },
    { f: '2×3×5×7+1=211', note: '211 也是质数' },
    { f: '2×3×5×7×11×13+1=30031', note: '= 59×509，合数——但 59、509 都是新质数！' }
  ]));
  ch4.appendChild(el('p', null, '现代人仍在这个方向上前进：已知的最大质数是梅森质数 <span class="fx">2<sup>136279841</sup> − 1</span>（2024 年发现，超过 4100 万位）。找大质数本身成了分布式计算的经典项目（GIMPS）。'));
  ch4.appendChild(keypoint('质数无穷多：欧几里得用"所有质数之积 + 1"构造出矛盾，反证法一击致命。'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 应用 ---------- */
  const ch5 = chapter({ id: 'ch-apps', no: '第五章', title: '应用一瞥', accent: '#0d9488', accentSoft: '#f0fdfa' });
  ch5.appendChild(appGrid([
    { ico: '🔐', title: 'RSA 加密',
      body: '同余专题讲过 RSA：其安全性依赖"大数分解难"——把两个几百位质数的乘积 n 分解回去，目前人类算不动。质数的"易乘难分"正是现代密码学的地基。',
      note: '找两个大质数容易，把它们的乘积分解开极难——单向陷门。' },
    { ico: '🦗', title: '周期蝉',
      body: '北美周期蝉的生命周期是 13 年或 17 年——都是质数。质数周期让蝉与天敌的周期重叠次数最少（重叠周期 = 最小公倍数，质数让它最大化）。',
      note: '进化"学会"了数论：13/17 年蝉几乎不与 2~12 年周期的捕食者同步爆发。' },
    { ico: '🎲', title: '哈希与随机',
      body: '哈希表常选质数个桶以减少冲突；线性同余随机数生成器的参数也依赖质数性质。第一章"时钟"的模数世界在这里和质数世界会师。',
      note: '质数让"取模"更像均匀洗牌。' },
    { ico: '🌐', title: 'CRC 校验与编码',
      body: '循环冗余校验（CRC）、纠错码、里德-所罗门码（CD/QR 码）都建立在多项式除法与伽罗瓦域上——那里的"质数"是不可再分解的多项式。',
      note: '你扫的每个二维码背后都有"质多项式"在工作。' }
  ]));
  $('topicMain').appendChild(ch5);

  /* ---------- 练习场 ---------- */
  const ch6 = chapter({ id: 'ch-quiz', no: '练习场', title: '小试身手', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch6.classList.add('chapter-quiz');
  ch6.appendChild(el('p', null, '共 8 题。选择题点击选项即判分；填空题输入答案后点"提交"。做错看解析，再回头看动画。'));
  const qm = el('div'); qm.id = 'quizMount';
  ch6.appendChild(qm);
  $('topicMain').appendChild(ch6);

  document.body.appendChild(footer(
    '质数与算术基本定理 · 纯 HTML / CSS / JavaScript 实现 · 动画由原生 Canvas 与 DOM 绘制',
    '"质数是数学中最任性又最迷人的对象。" —— 哈代《一个数学家的辩白》'));

  initChrome();
})();
