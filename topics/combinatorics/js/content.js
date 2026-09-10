/* ═══════════════════════════════════════════════
   组合计数 · 内容组装
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, examples,
    keypoint, appGrid, viz, footer, initChrome } = TOPIC;

  TopicNav({
    title: '组合计数',
    brandSym: '🎲',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-mul', text: '加乘原理' },
      { href: '#ch-perm', text: '排列' },
      { href: '#ch-comb', text: '组合' },
      { href: '#ch-pig', text: '鸽笼原理' },
      { href: '#ch-pascal', text: '杨辉三角' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  document.body.insertBefore(hero({
    badge: '交互式数学教学',
    title: '组合计数',
    sub: '不重不漏，数清所有的可能',
    lead: '早餐有 3 种主食、2 种饮品，有多少种搭配？5 个人排队有多少种排法？"计数"看似天生，却有严谨的方法论：分类用加、分步用乘、有序是排列、无序是组合。这个专题用动画把这些原理演示给你看。',
    formula: '3 × 2 × 2 = 12',
    cards: [
      { num: '01', title: '加法与乘法原理', desc: '分类相加 · 分步相乘', href: '#ch-mul' },
      { num: '02', title: '排列', desc: '排队的问题 · 排列树', href: '#ch-perm' },
      { num: '03', title: '组合', desc: '选代表 · 与排列的关系', href: '#ch-comb' },
      { num: '04', title: '鸽笼原理', desc: '抽屉里的必然', href: '#ch-pig' },
      { num: '05', title: '杨辉三角', desc: '组合数的家谱', href: '#ch-pascal' },
      { num: '✎', title: '练习题', desc: '8 题 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 加乘原理 ---------- */
  const ch1 = chapter({ id: 'ch-mul', no: '第一章', title: '加法原理与乘法原理', accent: '#7c3aed', accentSoft: '#f5f3ff' });
  ch1.appendChild(el('p', null, '从家到学校：坐地铁有 3 条路线，坐公交有 2 条路线——一共 <strong>3 + 2 = 5</strong> 种走法（<em>分类</em>，用加）。穿衣服：3 件上衣配 2 条裤子——一共 <strong>3 × 2 = 6</strong> 种穿法（<em>分步</em>，用乘）。'));
  ch1.appendChild(theorem('两大计数原理',
    '<p><b>加法原理</b>（分类）：做一件事有 k 类办法，第 i 类有 n<sub>i</sub> 种方法，各类互不重叠，则共有 n₁ + n₂ + … + n_k 种方法。</p>' +
    '<p class="mb0"><b>乘法原理</b>（分步）：做一件事分 k 步，第 i 步有 n<sub>i</sub> 种选择，则共有 n₁ × n₂ × … × n_k 种方法。</p>'));
  ch1.appendChild(el('p', null, '判断用加还是乘，只问一句：<strong>这些选择是"或者"关系（任选其一）还是"并且"关系（都要做）？</strong>或者 → 加；并且 → 乘。'));

  const vOutfit = viz({ id: 'viz-outfit', title: '🎬 动画 1 · 穿搭生成器 —— 乘法原理具象化',
    desc: '3 件上衣 × 2 条裤子 × 2 双鞋。每"走完三步"生成一套穿搭——分步相乘，一套不漏。',
    controls: `<button class="btn primary" id="outfitPlay">▶ 生成全部穿搭</button>
      <button class="btn" id="outfitStep">单步 ›</button>
      <button class="btn" id="outfitReset">重置</button>
      <span class="stat" style="padding:4px 12px"><span>已生成</span><b id="outfitCount" style="font-size:16px">0 / 12</b></span>`,
    bodyHTML: `<div class="outfit-stage">
        <div class="outfit-now" id="outfitNow"></div>
        <div class="outfit-grid" id="outfitGrid"></div>
      </div>
      <div class="formula-box" id="outfitFormula">3 件上衣 × 2 条裤子 × 2 双鞋 = 12 套</div>` });
  ch1.appendChild(vOutfit);

  ch1.appendChild(keypoint('分类用加（或者），分步用乘（并且）。乘法原理是排列组合的发动机。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 排列 ---------- */
  const ch2 = chapter({ id: 'ch-perm', no: '第二章', title: '排列：排队的问题', accent: '#7c3aed', accentSoft: '#f5f3ff' });
  ch2.appendChild(el('p', null, 'A、B、C 三人站成一排照相，有多少种站法？位置有先后——<strong>顺序重要</strong>。第一位 3 种选法，第二位剩 2 种，第三位只剩 1 种：3 × 2 × 1 = 6 种。'));
  ch2.appendChild(theorem('排列数',
    '<p>从 n 个不同元素中取 k 个排成一列（<b>有序</b>），排列数</p>' +
    '<p class="center big">P(n, k) = n × (n−1) × … × (n−k+1) = n! / (n−k)!</p>' +
    '<p class="mb0">特别地 P(n, n) = n!（全排列）。例：P(4, 2) = 4×3 = 12；5! = 120。</p>'));
  ch2.appendChild(el('p', null, '排列树把"先选谁、再选谁"的每条路径画出来——每片叶子就是一个排列：<strong>叶子的数量 = 排列数</strong>。看动画——'));

  const vPerm = viz({ id: 'viz-perm', title: '🎬 动画 2 · 排列树 —— 每片叶子是一种排法',
    desc: '选 n = 3 或 4，看决策树逐层展开；每走到一片叶子，就得到一个排列（加入下方清单）。',
    controls: `<label>n =
        <select id="permN"><option value="3" selected>3（6 种）</option><option value="4">4（24 种）</option></select></label>
      <button class="btn primary" id="permPlay">▶ 展开</button>
      <button class="btn" id="permStep">单步 ›</button>
      <button class="btn" id="permReset">重置</button>
      <span class="stat" style="padding:4px 12px"><span>已得排列</span><b id="permCount" style="font-size:16px">0</b></span>`,
    bodyHTML: `<canvas id="permCanvas" height="320"></canvas>
      <div class="perm-list" id="permList"></div>` });
  ch2.appendChild(vPerm);

  ch2.appendChild(keypoint('排列 = 有序选取。P(n,k) 就是从 n 开始连乘 k 个递减的数。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 组合 ---------- */
  const ch3 = chapter({ id: 'ch-comb', no: '第三章', title: '组合：选代表', accent: '#7c3aed', accentSoft: '#f5f3ff' });
  ch3.appendChild(el('p', null, '从 5 人中选 2 人当代表——选"谁"重要，选的先后不重要：<strong>无序</strong>。A、B 和 B、A 是同一种选法。'));
  ch3.appendChild(theorem('组合数',
    '<p>从 n 个不同元素中取 k 个组成一组（<b>无序</b>），组合数</p>' +
    '<p class="center big">C(n, k) = P(n, k) / k! = n! / (k!(n−k)!)</p>' +
    '<p class="mb0">直觉：先把 k 个人"排好序"（P(n,k) 种），每种组合恰好被数了 k! 次——除掉重复。例：C(5, 2) = (5×4)/2 = 10。</p>'));
  ch3.appendChild(el('p', null, '排列与组合的关系就像"排队"与"分组"：<strong>同一批人，排队看顺序，分组不看</strong>。判断口诀：交换两个元素后结果是否变化——变了是排列，没变是组合。'));
  ch3.appendChild(keypoint('组合 = 无序选取 = 排列数除以 k!。C(5,2)=10，C(10,2)=45，C(n,2)=n(n−1)/2。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 鸽笼原理 ---------- */
  const ch4 = chapter({ id: 'ch-pig', no: '第四章', title: '鸽笼原理', accent: '#7c3aed', accentSoft: '#f5f3ff' });
  ch4.appendChild(el('p', null, '4 只鸽子飞进 3 个笼子——不用看也知道，<strong>至少有一个笼子里有两只鸽子</strong>。简单到像废话，却是组合数学里最锋利的存在性工具：它不告诉你"是哪一个"，只保证"必然存在"。'));
  ch4.appendChild(theorem('鸽笼原理（抽屉原理）',
    '<p>把 n + 1 个物体放入 n 个盒子，则<b>至少有一个盒子</b>含有不少于 2 个物体。</p>' +
    '<p class="mb0"><b>推广</b>：把 kn + 1 个物体放入 n 个盒子，则至少有一个盒子含有 ≥ k + 1 个物体。</p>'));
  ch4.appendChild(examples([
    { f: '13 人中必有两人同月生日', note: '13 个"物体"放进 12 个月份"盒子"' },
    { f: '抽屉里 3 双不同袜子，闭眼拿 4 只必有一双', note: '3 种颜色 × 2 = 至多 3 只都不同' },
    { f: '上海约 2500 万人，头发数不超过 15 万种', note: '人数远多于"发丝数"盒子 → 必有两人头发根数相同' }
  ]));

  const vPig = viz({ id: 'viz-pig', title: '🎬 动画 3 · 鸽笼演示 —— 多一必重',
    desc: 'm 个盒子放入 m+1 个球：调整盒数，看"必然的相遇"如何发生。',
    controls: `<label>盒子数 m = <b id="pigBoxVal">5</b>
        <input type="range" id="pigBox" min="2" max="10" step="1" value="5"></label>
      <button class="btn primary" id="pigPlay">▶ 投球</button>
      <button class="btn" id="pigReset">重置</button>`,
    bodyHTML: `<div class="pig-stage" id="pigStage"></div>
      <div class="sieve-narr" id="pigNarr">点击"投球"，看 ${'5'}+1 = 6 个球飞进 5 个盒子。</div>` });
  ch4.appendChild(vPig);

  ch4.appendChild(keypoint('鸽笼原理：物体比盒子多，必有挤在一起的。它是"存在性证明"的瑞士军刀——不找出来，也能断定存在。'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 杨辉三角 ---------- */
  const ch5 = chapter({ id: 'ch-pascal', no: '第五章', title: '杨辉三角：组合数的家谱', accent: '#7c3aed', accentSoft: '#f5f3ff' });
  ch5.appendChild(el('p', null, '把组合数按行列好：第 n 行是 C(n,0), C(n,1), …, C(n,n)。每个数等于它"肩上"两数之和——这就是杨辉三角（西方称帕斯卡三角，但杨辉在 1261 年就记载了它）。'));
  ch5.appendChild(theorem('递推关系',
    '<p class="center big">C(n, k) = C(n−1, k−1) + C(n−1, k)</p>' +
    '<p class="mb0">直觉：从 n 人里选 k 人，盯住"某人甲"——选甲（再从剩下 n−1 选 k−1）或不选甲（从剩下 n−1 选 k），两类不重不漏。</p>'));

  const vPascal = viz({ id: 'viz-pascal', title: '🎬 动画 4 · 杨辉三角 —— 生长与隐藏图案',
    desc: '播放看三角逐行长出来（每格由肩上两数相加而得）；切到"奇偶染色"，你会看到谢尔宾斯基三角形——组合数里藏着分形。',
    controls: `<label>行数 n = <b id="pascalRowVal">8</b>
        <input type="range" id="pascalRow" min="1" max="12" step="1" value="8"></label>
      <div class="seg" id="pascalMode">
        <button data-mode="num" class="on">数字</button>
        <button data-mode="par">奇偶染色</button>
      </div>
      <button class="btn primary" id="pascalPlay">▶ 逐行生长</button>`,
    bodyHTML: `<div class="pascal-wrap" id="pascalWrap"></div>
      <div class="sieve-narr" id="pascalNarr">点击格子可查看它对应的组合数。第 n 行第 k 个数 = C(n, k)。</div>` });
  ch5.appendChild(vPascal);

  ch5.appendChild(el('p', null, '杨辉三角还是<b>二项式定理</b>的系数表：(a+b)ⁿ 展开的系数正是第 n 行：(a+b)² = 1a² + 2ab + 1b²，(a+b)³ = 1a³ + 3a²b + 3ab² + 1b³……一行管一个幂。'));
  ch5.appendChild(keypoint('杨辉三角：每个数 = 肩上两数之和。它是组合数的家谱、二项式系数的仓库，染色后还藏着分形。'));
  $('topicMain').appendChild(ch5);

  /* ---------- 练习场 ---------- */
  const ch6 = chapter({ id: 'ch-quiz', no: '练习场', title: '小试身手', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch6.classList.add('chapter-quiz');
  ch6.appendChild(el('p', null, '共 8 题。先判断"有序还是无序、或者还是并且"，再套公式。'));
  const qm = el('div'); qm.id = 'quizMount';
  ch6.appendChild(qm);
  $('topicMain').appendChild(ch6);

  document.body.appendChild(footer(
    '组合计数 · 纯 HTML / CSS / JavaScript 实现 · 动画由原生 Canvas 与 DOM 绘制',
    '"计数是数学最古老的分支，也是一切概率的地基。"'));
  initChrome();
})();
