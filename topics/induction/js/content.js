/* ═══════════════════════════════════════════════
   数学归纳法 · 内容组装
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, examples,
    keypoint, appGrid, viz, footer, initChrome } = TOPIC;

  TopicNav({
    title: '数学归纳法',
    brandSym: '🪜',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-domino', text: '多米诺的启示' },
      { href: '#ch-stmt', text: '归纳法陈述' },
      { href: '#ch-worked', text: '手把手证一遍' },
      { href: '#ch-traps', text: '陷阱' },
      { href: '#ch-apps', text: '更多应用' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  document.body.insertBefore(hero({
    badge: '交互式数学教学',
    title: '数学归纳法',
    sub: '推倒一块，信不信能推倒一万块？',
    lead: '怎么证明一个命题对<strong>所有</strong>自然数成立？自然数无穷多个，总不能一个一个验证。数学归纳法用两步搞定无穷：证明第一块骨牌倒下（奠基），再证明每块倒下必推倒下一块（递推）——于是全部倒下。这个专题用动画让你亲眼看到这个过程。',
    formula: '1 + 2 + … + n = n(n+1)/2',
    cards: [
      { num: '01', title: '多米诺的启示', desc: '奠基 + 递推 = 全倒', href: '#ch-domino' },
      { num: '02', title: '归纳法陈述', desc: '两步走的无穷证明', href: '#ch-stmt' },
      { num: '03', title: '手把手证一遍', desc: '求和公式完整证明', href: '#ch-worked' },
      { num: '04', title: '陷阱与悖论', desc: '缺奠基 · 所有马同色', href: '#ch-traps' },
      { num: '05', title: '更多应用', desc: '不等式 · 整除 · 递归', href: '#ch-apps' },
      { num: '✎', title: '练习题', desc: '6 题 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 多米诺的启示 ---------- */
  const ch1 = chapter({ id: 'ch-domino', no: '第一章', title: '多米诺骨牌的启示', accent: '#2563eb', accentSoft: '#eff6ff' });
  ch1.appendChild(el('p', null, '想象一排立好的多米诺骨牌，一直排到天边。想让它们全部倒下，需要保证几件事？'));
  ch1.appendChild(el('p', null, '只需要两件：<strong>第一，推倒第一块</strong>；<strong>第二，每块倒下时都碰得到下一块</strong>。满足了这两条，无论排了十万块还是无穷块，都会全部倒下——这就是数学归纳法的全部直觉。'));

  const vDomino = viz({ id: 'viz-domino', title: '🎬 动画 1 · 多米诺骨牌 —— 奠基与递推',
    desc: '推倒第一块，看链条如何传递。切换"链条有缺口"模式：递推在中间断裂，后面的骨牌就永远不会倒——两个条件缺一不可。',
    controls: `<div class="seg" id="domMode">
        <button data-mode="ok" class="on">完好链条（递推成立）</button>
        <button data-mode="gap">链条有缺口（递推断裂）</button>
      </div>
      <button class="btn primary" id="domPlay">▶ 推倒第一块</button>
      <button class="btn" id="domReset">重置</button>`,
    bodyHTML: `<canvas id="domCanvas" height="240"></canvas>
      <div class="sieve-narr" id="domNarr">选择模式，推倒第一块骨牌（奠基）。</div>` });
  ch1.appendChild(vDomino);

  ch1.appendChild(keypoint('全部倒下 ⇔ 第一块被推倒（奠基） + 每块都能碰倒下一块（递推）。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 归纳法陈述 ---------- */
  const ch2 = chapter({ id: 'ch-stmt', no: '第二章', title: '数学归纳法的陈述', accent: '#2563eb', accentSoft: '#eff6ff' });
  ch2.appendChild(theorem('第一数学归纳法',
    '<p>要证明命题 P(n) 对所有 n ≥ n₀ 成立，只需两步：</p>' +
    '<p><b>① 奠基（Base）</b>：验证 P(n₀) 成立——推倒第一块骨牌；</p>' +
    '<p><b>② 递推（Step）</b>：证明"若 P(k) 成立，则 P(k+1) 成立"——每块倒下必推倒下一块；</p>' +
    '<p class="mb0">两步齐备 ⟹ P(n) 对一切 n ≥ n₀ 成立。（②中的"若 P(k)"称为<b>归纳假设</b>，是证明中必须真正用到的拐杖。）</p>'));
  ch2.appendChild(el('p', null, '注意递推步的方向：不是"从 P(k) 证明 P(k+1)"这样从已知推未知——而是"<strong>假设</strong> P(k) 成立（归纳假设），在此假设下<strong>推出</strong> P(k+1)"。假设本身不需要先被证明，它像多米诺的"如果这块倒了"。'));
  ch2.appendChild(keypoint('归纳法 = 奠基（P(n₀) 真） + 递推（P(k) ⇒ P(k+1)） ⟹ 对一切 n ≥ n₀ 成立。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 手把手证一遍 ---------- */
  const ch3 = chapter({ id: 'ch-worked', no: '第三章', title: '手把手证一遍', accent: '#2563eb', accentSoft: '#eff6ff' });
  ch3.appendChild(el('p', null, '经典例题：证明 <span class="fx">1 + 2 + … + n = n(n+1)/2</span>。'));
  ch3.appendChild(el('div', 'step-list',
    `<div class="step-item"><b>①</b> <b>奠基</b>：n = 1 时，左边 = 1，右边 = 1×2/2 = 1。左边 = 右边 ✓</div>
     <div class="step-item"><b>②</b> <b>归纳假设</b>：设 n = k 时等式成立：1 + 2 + … + k = k(k+1)/2</div>
     <div class="step-item"><b>③</b> <b>递推</b>：看 n = k+1：1 + 2 + … + k + (k+1) = <span class="hl">k(k+1)/2</span> + (k+1)</div>
     <div class="step-item"><b>④</b> 右边提出公因式 (k+1)：= (k+1)(k/2 + 1) = (k+1)(k+2)/2 —— 正是 n = k+1 时的右边！✓</div>
     <div class="step-item"><b>⑤</b> 由归纳法，等式对一切 n ≥ 1 成立。∎</div>`));
  ch3.appendChild(el('p', null, '高斯小时候口算 1+…+100 = 5050 用的是配对技巧；归纳法则给了这个公式一个<b>覆盖所有 n 的证明</b>。下面把它"看见"——'));

  const vSum = viz({ id: 'viz-sum', title: '🎬 动画 2 · 见证求和公式 —— 从 k 到 k+1',
    desc: '滑块选 n，点阵会堆出一个三角形：第 k 行 k 个点，总点数 = 1+2+…+n，而公式 n(n+1)/2 永远相等。按"下一步"看第 k+1 行如何加上去、公式如何从 k(k+1)/2 变形到 (k+1)(k+2)/2。',
    controls: `<label>n = <b id="sumNVal">5</b>
        <input type="range" id="sumN" min="1" max="20" step="1" value="5"></label>
      <button class="btn primary" id="sumStep">下一步（k → k+1）›</button>
      <button class="btn" id="sumReset">重置</button>`,
    bodyHTML: `<canvas id="sumCanvas" height="280"></canvas>
      <div class="formula-box" id="sumFormula">1 + 2 + 3 + 4 + 5 = 15 = 5×6/2 ✓</div>` });
  ch3.appendChild(vSum);

  ch3.appendChild(keypoint('归纳证明的心脏在第 ③④ 步：把归纳假设 k(k+1)/2 真正"用"进去，再整理成 k+1 的形状。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 陷阱与悖论 ---------- */
  const ch4 = chapter({ id: 'ch-traps', no: '第四章', title: '陷阱与悖论', accent: '#2563eb', accentSoft: '#eff6ff' });
  ch4.appendChild(theorem('陷阱一：只有递推、没有奠基', 
    '<p>命题 P(n)："n = n + 1"。递推居然成立：若 k = k+1，两边加 1 得 k+1 = k+2，即 P(k+1) 成立！</p>' +
    '<p class="mb0">但奠基 P(1)：1 = 2 显然为假。链条"每块都能推倒下一块"，可第一块从来没倒——<b>一块也不会倒</b>。递推方向正确 ≠ 命题成立。</p>', true));
  ch4.appendChild(theorem('陷阱二：所有马同色悖论',
    '<p>"用归纳法证明：所有马的颜色都相同。"n = 1：一匹马当然与自己同色 ✓。设任意 k 匹马同色，看 k+1 匹：去掉第 1 匹，剩 k 匹由假设同色；去掉最后 1 匹，剩下含第 1 匹的 k 匹也同色——所以 k+1 匹同色？</p>' +
    '<p class="mb0">漏洞藏在 <b>k = 1 → 2</b>：去掉第一匹剩 {2}，去掉最后一匹剩 {1}，两个集合<b>没有交集</b>，"桥梁"断了。递推必须在<b>每一个</b> k 上成立，尤其要检查小 k。</p>', true));
  ch4.appendChild(el('p', null, '两个陷阱一个共同教训：<strong>奠基和递推是一体的，缺一不可，且递推要对所有 k ≥ n₀ 逐个成立</strong>——包括最不起眼的 k = 1。'));
  ch4.appendChild(keypoint('检查归纳证明：奠基真的验证了吗？递推在每个 k（尤其 k=1→2）都成立吗？归纳假设真的被用上了吗？'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 更多应用 ---------- */
  const ch5 = chapter({ id: 'ch-apps', no: '第五章', title: '更多应用', accent: '#2563eb', accentSoft: '#eff6ff' });
  ch5.appendChild(appGrid([
    { ico: '📈', title: '不等式',
      body: '证 2ⁿ > n（n ≥ 1）：奠基 2¹ = 2 > 1 ✓；设 2ᵏ > k，则 2ᵏ⁺¹ = 2·2ᵏ > 2k ≥ k+1（k ≥ 1）✓。',
      note: '归纳假设是"已知情报"，递推是"用情报打下一仗"。' },
    { ico: '➗', title: '整除性',
      body: '证 3 | n³ − n：奠基 n=1 时 0 ✓；设 k³ − k 被3整除，则 (k+1)³ − (k+1) = (k³ − k) + 3k(k+1)，两项都被 3 整除 ✓。',
      note: '把 k+1 的式子"拆"出 k 的式子 + 整齐的余项，是递推的常用手法。' },
    { ico: ' Towers of Hanoi'.trim(), title: '汉诺塔',
      body: 'n 层汉诺塔最少 2ⁿ − 1 步：n=1 时 1 步 ✓；n+1 层 = 先搬上面 n 层（2ⁿ−1）+ 最大盘 1 步 + 再搬 n 层（2ⁿ−1）= 2ⁿ⁺¹−1 ✓。',
      note: '递归算法的正确性与步数上界，天然适合归纳。' },
    { ico: '🏢', title: '计算机科学',
      body: '循环不变式、递归函数终止性、数据结构性质（如"红黑树高度 ≤ 2log n"）……程序验证的支柱就是归纳法。',
      note: '对"结构"归纳（树、表、图）称为结构归纳法，是数学归纳法的推广。' }
  ]));
  $('topicMain').appendChild(ch5);

  /* ---------- 练习场 ---------- */
  const ch6 = chapter({ id: 'ch-quiz', no: '练习场', title: '小试身手', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch6.classList.add('chapter-quiz');
  ch6.appendChild(el('p', null, '共 6 题。做完回去看看多米诺动画，体会每个选项对应哪块骨牌。'));
  const qm = el('div'); qm.id = 'quizMount';
  ch6.appendChild(qm);
  $('topicMain').appendChild(ch6);

  document.body.appendChild(footer(
    '数学归纳法 · 纯 HTML / CSS / JavaScript 实现 · 动画由原生 Canvas 绘制',
    '"归纳法是数学里最接近魔法的时刻：两步征服无穷。"'));
  initChrome();
})();
