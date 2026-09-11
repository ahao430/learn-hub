/* ═══════════════════════════════════════════════
   化学反应 · 内容组装
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, examples,
    keypoint, appGrid, viz, footer, initChrome } = TOPIC;

  TopicNav({
    title: '化学反应',
    brandSym: '⚗️',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-mole', text: '摩尔' },
      { href: '#ch-balance', text: '方程式与配平' },
      { href: '#ch-collision', text: '碰撞理论' },
      { href: '#ch-equilibrium', text: '化学平衡' },
      { href: '#ch-apps', text: '应用' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  document.body.insertBefore(hero({
    badge: '交互式化学教学',
    title: '化学反应',
    sub: '摩尔记账 · 配平守恒 · 平衡移动',
    lead: '化学家如何"数"看不见的分子？答案是<strong>摩尔</strong>——6.02×10²³ 个粒子算一摩尔。化学反应方程式像会计账本：原子不增不减（质量守恒）；而反应快慢与最终"停"在哪里，则由<strong>碰撞理论</strong>与<strong>化学平衡</strong>掌管。这个专题用配平器、碰撞模拟和平衡演示带你玩转这三件事。',
    formula: '2H₂ + O₂ → 2H₂O',
    cards: [
      { num: '01', title: '摩尔', desc: '微观世界的打', href: '#ch-mole' },
      { num: '02', title: '方程式与配平', desc: '原子守恒 · 互动配平器', href: '#ch-balance' },
      { num: '03', title: '碰撞理论', desc: '活化能 · 温度的作用', href: '#ch-collision' },
      { num: '04', title: '化学平衡', desc: '动态平衡 · 勒夏特列', href: '#ch-equilibrium' },
      { num: '05', title: '应用一瞥', desc: '合成氨 · 可乐 · 催化剂', href: '#ch-apps' },
      { num: '✎', title: '练习题', desc: '8 题 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 摩尔 ---------- */
  const ch1 = chapter({ id: 'ch-mole', no: '第一章', title: '摩尔：微观的计数单位', accent: '#0891b2', accentSoft: '#ecfeff' });
  ch1.appendChild(el('p', null, '分子太小，"个"数不动。化学家约定：<strong>0.012 kg 碳-12 里含有的碳原子数</strong>为 1 摩尔（mol），这个数就是阿伏伽德罗常数 <span class="fx">N<sub>A</sub> ≈ 6.02×10²³</span>——像"一打鸡蛋是 12 个"，一打分子是 6.02×10²³ 个。'));
  ch1.appendChild(theorem('摩尔与摩尔质量',
    '<p class="center big">n = m / M</p>' +
    '<p class="mb0">n 是物质的量（mol），m 是质量（g），M 是摩尔质量（g/mol）——数值上恰好等于相对分子质量。例：H₂O 的 M = 18 g/mol，36 g 水就是 2 mol。粒子数 = n × N<sub>A</sub>。</p>'));

  const vMole = viz({ id: 'viz-mole', title: '🔢 互动 1 · 摩尔计算器',
    desc: '选物质、输质量，自动算物质的量与粒子数。',
    controls: `<label>物质
        <select id="moleSub">
          <option value="18" selected>水 H₂O（M = 18）</option>
          <option value="44">二氧化碳 CO₂（M = 44）</option>
          <option value="32">氧气 O₂（M = 32）</option>
          <option value="58.5">氯化钠 NaCl（M = 58.5）</option>
          <option value="56">铁 Fe（M = 56）</option>
        </select></label>
      <label>质量 m = <input type="number" id="moleM" value="36" min="0.1" step="0.1"> g</label>
      <button class="btn primary" id="moleRun">计算</button>`,
    bodyHTML: `<div class="calc-out" id="moleOut"></div>` });
  ch1.appendChild(vMole);

  ch1.appendChild(keypoint('摩尔是"微观的打"：1 mol = 6.02×10²³ 个。n = m/M，粒子数 = n·N_A。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 方程式与配平 ---------- */
  const ch2 = chapter({ id: 'ch-balance', no: '第二章', title: '化学方程式与质量守恒', accent: '#0891b2', accentSoft: '#ecfeff' });
  ch2.appendChild(el('p', null, '化学方程式是化学的记账语言：反应物写在左、生成物写在右，箭头表示反应方向。配平后的<strong>系数</strong>表示参加反应的粒子个数比（也是物质的量比）。'));
  ch2.appendChild(theorem('质量守恒定律（拉瓦锡，1789）',
    '<p class="mb0">化学反应只是原子重新组合，<b>原子种类和数目都不变</b>——所以反应前后总质量相等。配平的本质：让每种原子在等式两边的数目相同。</p>'));

  const vBal = viz({ id: 'viz-bal', title: '🎬 互动 2 · 方程式配平器',
    desc: '用 ＋/− 调整每个系数，实时看到两边原子账目。全部对上即配平成功。',
    controls: `<label>反应
        <select id="balPreset">
          <option value="0" selected>H₂ + O₂ → H₂O</option>
          <option value="1">CH₄ + O₂ → CO₂ + H₂O</option>
          <option value="2">Fe + O₂ → Fe₂O₃</option>
        </select></label>
      <button class="btn" id="balAnswer">显示答案</button>
      <button class="btn" id="balReset">清零重来</button>`,
    bodyHTML: `<div class="bal-eq" id="balEq"></div>
      <div class="bal-atoms" id="balAtoms"></div>
      <div class="nl-result" id="balVerdict"></div>` });
  ch2.appendChild(vBal);

  ch2.appendChild(keypoint('配平 = 让每种原子左右相等 = 质量守恒。系数之比 = 粒子个数之比 = 物质的量之比。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 碰撞理论 ---------- */
  const ch3 = chapter({ id: 'ch-collision', no: '第三章', title: '反应速率与碰撞理论', accent: '#0891b2', accentSoft: '#ecfeff' });
  ch3.appendChild(theorem('碰撞理论',
    '<p>反应发生需要分子<strong>碰撞</strong>，且：</p>' +
    '<p>① 碰撞能量足够大（超过<b>活化能</b> E<sub>a</sub>）；② 取向合适。</p>' +
    '<p class="mb0">升温 → 分子平均动能增大 → 更多碰撞超过活化能 → <b>反应显著变快</b>。这就是"温度每升 10 °C，反应速率约翻倍"的微观解释。</p>'));

  const vCol = viz({ id: 'viz-col', title: '🎬 动画 3 · 碰撞模拟 —— 温度 vs 活化能',
    desc: '蓝球是反应物分子。只有碰撞的相对速度超过活化能（阈值）时才"反应"变绿。调高温度看绿球比例飙升。',
    controls: `<label>温度 T = <b id="colTVal">2</b>
        <input type="range" id="colT" min="1" max="4" step="0.5" value="2"></label>
      <label>活化能阈值 E<sub>a</sub> = <b id="colEVal">120</b>
        <input type="range" id="colE" min="60" max="200" step="10" value="120"></label>
      <button class="btn primary" id="colPlay">▶ 开始模拟</button>
      <button class="btn" id="colReset">重置</button>
      <span class="stat" style="padding:4px 12px"><span>已反应</span><b id="colCount" style="font-size:16px">0 / 24</b></span>`,
    bodyHTML: `<canvas id="colCanvas" height="280"></canvas>
      <div class="viz-narr" id="colNarr">开始模拟后，试着把温度拉满——绿球（已反应）会成片出现。</div>` });
  ch3.appendChild(vCol);

  ch3.appendChild(keypoint('反应快慢由"有效碰撞"频率决定：升温、增大浓度（碰撞更频繁）、加催化剂（降低活化能）都能加速。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 化学平衡 ---------- */
  const ch4 = chapter({ id: 'ch-equilibrium', no: '第四章', title: '化学平衡：动态的僵持', accent: '#0891b2', accentSoft: '#ecfeff' });
  ch4.appendChild(theorem('化学平衡状态',
    '<p>可逆反应 A ⇌ B 进行到<b>正反应速率 = 逆反应速率</b>时，各组分浓度不再改变——但两个方向仍在进行（动态平衡）。</p>' +
    '<p class="mb0"><b>勒夏特列原理</b>：改变条件（浓度/温度/压强），平衡向"削弱这种改变"的方向移动。</p>'));

  const vEq = viz({ id: 'viz-eq', title: '🎬 动画 4 · 平衡演示 —— A ⇌ B 与勒夏特列',
    desc: '20 个粒子在 A、B 两室之间按速率 k↑（A→B）、k↓（B→A）随机跳转，比例自动趋于平衡。试着"加 A"或"升温"，看平衡如何移动。',
    controls: `<button class="btn primary" id="eqPlay">▶ 开始</button>
      <button class="btn" id="eqAddA">加入 A（3 个）</button>
      <button class="btn" id="eqHeat">升温（逆向 k↓×1.6）</button>
      <button class="btn" id="eqCat">加催化剂（双向 ×2）</button>
      <button class="btn" id="eqReset">重置</button>`,
    bodyClass: 'viz-canvas-row',
    bodyHTML: `<canvas id="eqCanvas" height="300"></canvas>
      <div class="viz-side">
        <div class="stat"><span>A 室粒子</span><b id="eqNA">20</b></div>
        <div class="stat"><span>B 室粒子</span><b id="eqNB">0</b></div>
        <div class="stat hl"><span>A 占比</span><b id="eqFA">100%</b></div>
        <div class="stat"><span>理论平衡 A%</span><b id="eqTarget">50%</b></div>
        <div class="tip" id="eqTip">k↑ = 1，k↓ = 1。按"开始"看占比自动收敛到理论值。</div>
      </div>` });
  ch4.appendChild(vEq);

  ch4.appendChild(keypoint('平衡是动态的僵持：速率相等 ≠ 反应停止。外界扰动会被平衡"部分抵消"——勒夏特列原理。'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 应用 ---------- */
  const ch5 = chapter({ id: 'ch-apps', no: '第五章', title: '应用一瞥', accent: '#0891b2', accentSoft: '#ecfeff' });
  ch5.appendChild(appGrid([
    { ico: '🌾', title: '合成氨（哈伯法）',
      body: 'N₂ + 3H₂ ⇌ 2NH₃ 正反应放热、气体分子数减少。勒夏特列指导工业条件：<b>高压</b>（推向分子少的一侧）、<b>适度低温</b>配合<b>催化剂</b>（兼顾速率）。用空气合成肥料养活了半个地球。',
      note: '一个平衡移动原理，换来几十亿人的口粮。' },
    { ico: '🥤', title: '汽水与溶解平衡',
      body: 'CO₂(g) ⇌ CO₂(aq)。开瓶压力骤降，平衡左移，气泡涌出；冰镇降温让 CO₂ 更"愿意"留在水里（放热溶解）。',
      note: '摇一摇再开瓶 = 平衡原理 + 成核点，"爆沸"的日常版。' },
    { ico: '🫁', title: '血红蛋白与氧气',
      body: 'Hb + O₂ ⇌ HbO₂。肺里氧多，平衡右移载氧；组织里氧少，平衡左移放氧——一个平衡常数完成全身输氧。',
      note: '高原反应的本质：氧分母变了，平衡位置不够用。' },
    { ico: '🚗', title: '催化剂与尾气',
      body: '汽车三元催化把 CO、NOx、未燃烃转化为无害气体——催化剂降低活化能，让"室温下懒得反应"的分子在尾气温度下迅速完成使命，自身不被消耗。',
      note: '全球 90% 以上的化工产品生产依赖催化剂。' }
  ]));
  $('topicMain').appendChild(ch5);

  /* ---------- 练习场 ---------- */
  const ch6 = chapter({ id: 'ch-quiz', no: '练习场', title: '小试身手', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch6.classList.add('chapter-quiz');
  ch6.appendChild(el('p', null, '共 8 题。配平找最小公倍数，平衡问题想"削弱改变"。'));
  const qm = el('div'); qm.id = 'quizMount';
  ch6.appendChild(qm);
  $('topicMain').appendChild(ch6);

  document.body.appendChild(footer(
    '化学反应 · 纯 HTML / CSS / JavaScript 实现 · 模拟由原生 Canvas 绘制',
    '"化学是一门在分子层面改变世界的艺术。"'));
  initChrome();
})();
