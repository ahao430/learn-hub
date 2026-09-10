/* ═══════════════════════════════════════════════
   同余定理专题 · 内容组装
   用 TOPIC 组件函数拼出导航、首屏、六章、练习场、页脚，
   再挂载到 #topicMain。动画/题目脚本在各自文件里，
   它们引用 TOPIC.VE（原 window.VE）。
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, triview, examples,
    propRow, cycleStrip, stepList, ancient, keypoint, appGrid, viz, quizShell, footer, initChrome } = TOPIC;

  /* ---------- 导航 ---------- */
  TopicNav({
    title: '同余定理',
    brandHref: '#hero',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-intro', text: '什么是同余' },
      { href: '#ch-props', text: '基本性质' },
      { href: '#ch-nines', text: '弃九法' },
      { href: '#ch-power', text: '幂与循环' },
      { href: '#ch-crt', text: '中国剩余定理' },
      { href: '#ch-apps', text: '应用' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  /* ---------- 首屏 ---------- */
  document.body.insertBefore(hero({
    badge: '交互式数学教学',
    title: '同余定理',
    sub: '从时钟里的数学，到现代密码学的基石',
    lead: '当你看着钟盘计算"再过 100 小时是几点"时，你已经在使用<strong>同余</strong>——一种只关心余数、不关心数值本身的数学语言。这个网站用动画和交互，带你从零理解它，一路走到费马小定理与中国剩余定理。',
    formula: '17 ≡ 5 <span class="mod">(mod 12)</span>',
    cards: [
      { num: '01', title: '什么是同余', desc: '定义 · 时钟 · 数轴卷圆', href: '#ch-intro' },
      { num: '02', title: '基本性质', desc: '加减乘 · 除法陷阱 · 染色网格', href: '#ch-props' },
      { num: '03', title: '弃九法', desc: '数字和 · 验算 · 整除判定', href: '#ch-nines' },
      { num: '04', title: '幂与循环', desc: '循环节 · 费马小定理', href: '#ch-power' },
      { num: '05', title: '中国剩余定理', desc: '物不知数 · 双筛动画', href: '#ch-crt' },
      { num: '06', title: '应用一瞥', desc: 'RSA · 校验码 · 哈希', href: '#ch-apps' },
      { num: '✎', title: '练习题', desc: '16 题 · 三级难度 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 什么是同余 ---------- */
  const ch1 = chapter({ id: 'ch-intro', no: '第一章', title: '什么是同余', accent: '#4f46e5', accentSoft: '#eef2ff' });
  ch1.appendChild(el('p', null, '晚上十点，你设了一个 <strong>100 小时</strong>后响的闹钟。100 小时后钟面指向几点？你脱口而出"凌晨两点"——尽管 10 + 100 = 110，而钟面上从来没有 110。你本能地完成了一次<strong>模运算</strong>：110 除以 12 余 <strong>2</strong>，所以指针落在 2 点的位置。'));
  ch1.appendChild(el('p', null, '钟面把所有的小时数"卷"进了 12 个格子：13 点和 1 点重合、14 点和 2 点重合……数学家卡尔·高斯（Carl Friedrich Gauss）在 1801 年的《算术研究》中，给这种关系起了一个名字——<strong>同余</strong>。'));
  ch1.appendChild(theorem('定义',
    '<p>设 <span class="fx">m</span> 是正整数。<span class="fx">a</span> 与 <span class="fx">b</span> 模 <span class="fx">m</span> 同余，记作</p>' +
    '<p class="center big">a ≡ b (mod m)</p>' +
    '<p>当且仅当 <span class="fx">m</span> 整除 <span class="fx">a − b</span>（即 <span class="fx">a − b = km</span>，k 为整数）。</p>'));
  ch1.appendChild(triview([
    { ico: '➗', title: '整除视角', body: '<span class="fx">m | (a − b)</span><br>差是 m 的倍数' },
    { ico: '∇', title: '余数视角', body: '<span class="fx">a mod m = b mod m</span><br>除以 m 余数相同' },
    { ico: '⟳', title: '换算视角', body: '<span class="fx">a = b + km</span><br>在同一格子里转圈' }
  ]));
  ch1.appendChild(examples([
    { f: '17 ≡ 5 (mod 12)', note: '因为 17 − 5 = 12 = 1×12' },
    { f: '23 ≡ 3 (mod 10)', note: '因为 23 − 3 = 20 = 2×10' },
    { f: '−1 ≡ 11 (mod 12)', note: '因为 −1 − 11 = −12 = (−1)×12' },
    { f: '8 ≡ 0 (mod 4)', note: '因为 8 − 0 = 8 = 2×4' }
  ]));
  ch1.appendChild(el('p', null, '<span class="k">余数</span>：按定义，每个整数除以 m 的余数只能是 0, 1, …, m−1。这 m 个余数把所有整数分成 m 个"圈子"，称为<strong>同余类</strong>——下面两个动画把它演给你看。'));

  // 动画1：时钟
  const vClock = viz({ id: 'viz-clock', title: '🎬 动画 1 · 时钟模型 —— 模 12 的世界',
    desc: '设定起点和要经过的小时数，看指针一格一格转：每转满一圈（12 小时），钟面就"忘记"了一圈，只留下余数。',
    controls: `<label>起点 <input type="number" id="clockStart" value="10" min="0" max="23" step="1"></label>
      <label>经过 <input type="number" id="clockAdd" value="100" min="1" max="500" step="1"> 小时</label>
      <label>表盘
        <select id="clockMod">
          <option value="12" selected>12 小时制（mod 12）</option>
          <option value="24">24 小时制（mod 24）</option>
          <option value="7">星期盘（mod 7）</option>
        </select></label>
      <button class="btn primary" id="clockPlay">▶ 播放</button>
      <button class="btn" id="clockReset">重置</button>`,
    bodyClass: 'viz-canvas-row',
    bodyHTML: `<canvas id="clockCanvas" height="380"></canvas>
      <div class="viz-side">
        <div class="stat"><span>累计小时</span><b id="clockCur">10</b></div>
        <div class="stat"><span>转满圈数</span><b id="clockQ">—</b></div>
        <div class="stat hl"><span>钟面指示</span><b id="clockR">—</b></div>
        <div class="formula-box" id="clockFormula">10 + 0 = 10 = 0×12 + 10</div>
        <div class="tip">模 7 的"星期盘"：把 0~6 想象成周日~周六，经过任意多天，星期几就看余数。</div>
      </div>` });
  ch1.appendChild(vClock);

  // 动画2：数轴卷圆
  const vCircle = viz({ id: 'viz-circle', title: '🎬 动画 2 · 数轴卷圆 —— 看见"同余类"',
    desc: '左边的数轴被卷到右边周长为 m 的圆上：每个数字落在 <em>它除以 m 的余数</em>那个位置。落在同一根辐条上的数，彼此同余、共用一种颜色。',
    controls: `<label>模数 m = <b id="circleModVal">6</b>
        <input type="range" id="circleMod" min="2" max="12" step="1" value="6"></label>
      <label>数字个数 <input type="number" id="circleMax" value="30" min="10" max="60" step="1"></label>
      <button class="btn primary" id="circlePlay">▶ 卷起来</button>
      <button class="btn" id="circleReset">重置</button>`,
    bodyHTML: `<canvas id="circleCanvas" height="340"></canvas>
      <div class="legend" id="circleLegend"></div>` });
  ch1.appendChild(vCircle);

  ch1.appendChild(keypoint('同余就是"在模 m 的世界里，只关心你落在哪个格子"。数值可以无限大，格子永远只有 m 个。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 基本性质 ---------- */
  const ch2 = chapter({ id: 'ch-props', no: '第二章', title: '同余的基本性质', accent: '#0d9488', accentSoft: '#f0fdfa' });
  ch2.appendChild(el('h3', null, '① 它是一种"相等关系"'));
  ch2.appendChild(el('p', null, '同余把整数分圈归类，它满足等价关系的三条公理（对任意 <span class="fx">a, b, c</span>）：'));
  ch2.appendChild(propRow([
    { title: '自反', f: 'a ≡ a (mod m)' },
    { title: '对称', f: 'a ≡ b ⇒ b ≡ a' },
    { title: '传递', f: 'a ≡ b, b ≡ c ⇒ a ≡ c' }
  ]));
  ch2.appendChild(el('p', null, '所以"≡"读起来很像"="：同余类内部互相等同，类与类之间泾渭分明。'));
  ch2.appendChild(el('h3', null, '② 加减乘都能"穿透" ≡ 号'));
  ch2.appendChild(theorem('运算性质',
    '<p>若 <span class="fx">a ≡ b (mod m)</span> 且 <span class="fx">c ≡ d (mod m)</span>，则</p>' +
    '<p class="center">a + c ≡ b + d　　a − c ≡ b − d　　<span class="hl">a·c ≡ b·d (mod m)</span></p>'));
  ch2.appendChild(el('p', null, '<strong>乘法同余</strong>是数论的主力工具：个位数只由个位数决定（mod 10），因为 23 ≡ 3、45 ≡ 5，所以 23 × 45 ≡ 3 × 5 = 15 ≡ <strong>5</strong> (mod 10)——大数的个位乘法被"压缩"成了一位数乘法。'));
  ch2.appendChild(el('p', null, '更有用的是<strong>降幂</strong>：若 a ≡ b (mod m)，则 <span class="fx">a<sup>k</sup> ≡ b<sup>k</sup> (mod m)</span>。第四章求 2<sup>100</sup> 的个位就靠它。'));
  ch2.appendChild(el('h3', null, '③ ⚠️ 除法不行！'));
  ch2.appendChild(theorem('陷阱',
    '<p>由 <span class="fx">ac ≡ bc (mod m)</span> <u>不能</u>随便约去 c 得到 <span class="fx">a ≡ b</span>。</p>' +
    '<p>反例：6 ≡ 12 (mod 6)？成立（差为 6）。约去公因子 2：3 ≡ 6 (mod 6)？❌ 差是 3，不成立。</p>' +
    '<p class="mb0"><b>正确规则</b>：ac ≡ bc (mod m) ⇒ a ≡ b (mod m / gcd(c, m))。特别地，当 gcd(c, m) = 1（c 与 m 互素）时才可完整约去。</p>',
    true));

  // 动画3：染色网格
  const vGrid = viz({ id: 'viz-grid', title: '🎬 动画 3 · 余数染色百数表 —— 图案里读性质',
    desc: '把 0~99 按"除以 n 的余数"上色：同余的数颜色相同，你会看到漂亮的斜条纹——因为每往右走 1 格余数 +1，每往下走 10 格余数 +10 ≡ +10 (mod n)。',
    controls: `<label>模数 n = <b id="gridModVal">7</b>
        <input type="range" id="gridMod" min="2" max="12" step="1" value="7"></label>
      <div class="seg" id="gridMode">
        <button data-mode="rem" class="on">余数染色</button>
        <button data-mode="mul">乘法表 mod n</button>
      </div>
      <button class="btn primary" id="gridPlay">▶ 逐格染色</button>`,
    bodyClass: 'grid-body',
    bodyHTML: `<div class="numgrid" id="gridRem"></div>
      <div class="numgrid mulgrid" id="gridMul"></div>
      <div class="legend" id="gridLegend"></div>
      <div class="tip" id="gridHint">切到"乘法表"模式看看：n = 7 时除第 0 行第 0 列外没有一格是 0（素数无零因子）；n = 8 时 2×4 ≡ 0——两个非零数相乘得到了 0！</div>` });
  ch2.appendChild(vGrid);

  // 计算器
  const vCalc = viz({ id: 'viz-calc', title: '🔢 动手试 · 同余运算验证器',
    desc: '输入两个数和模数，验证加、减、乘三种运算前后同余关系是否保持。',
    controls: `<label>a = <input type="number" id="calcA" value="23" step="1"></label>
      <label>b = <input type="number" id="calcB" value="45" step="1"></label>
      <label>mod m, m = <input type="number" id="calcM" value="10" min="2" step="1"></label>
      <button class="btn primary" id="calcRun">验证</button>`,
    bodyHTML: `<div class="calc-out" id="calcOut"></div>` });
  ch2.appendChild(vCalc);

  ch2.appendChild(keypoint('同余式可以像等式一样加减乘、可以代入、可以降幂——唯独"约分"要先检查 gcd(c, m) = 1。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 弃九法 ---------- */
  const ch3 = chapter({ id: 'ch-nines', no: '第三章', title: '弃九法与整除判定', accent: '#d97706', accentSoft: '#fffbeb' });
  ch3.appendChild(el('p', null, '同余最古老、最实用的应用之一：不用做除法，快速判断一个大数除以 9（或 3）的余数。'));
  ch3.appendChild(theorem('关键引理',
    '<p>因为 <span class="fx">10 ≡ 1 (mod 9)</span>，所以 <span class="fx">10<sup>k</sup> ≡ 1 (mod 9)</span>，于是任何正整数</p>' +
    '<p class="center big">N = d<sub>k</sub>10<sup>k</sup> + … + d<sub>1</sub>10 + d<sub>0</sub> ≡ d<sub>k</sub> + … + d<sub>1</sub> + d<sub>0</sub> (mod 9)</p>' +
    '<p class="mb0">即：<strong>N 与它的各位数字之和对 9 同余</strong>。对 3 也成立（因为 10 ≡ 1 (mod 3)）。</p>'));
  ch3.appendChild(examples([
    { f: '987 ≡ 9 + 8 + 7 = 24 ≡ 6 (mod 9)', note: '验证：987 = 109×9 + 6 ✓' },
    { f: '数字和能被 3 整除 ⇔ 原数能被 3 整除', note: '9 同理' }
  ]));
  ch3.appendChild(el('h3', null, '用弃九法验算乘法'));
  ch3.appendChild(el('p', null, '假设要验算 <span class="fx">A × B = C</span>。由乘法同余：<span class="fx">A 的弃九值 × B 的弃九值 ≡ C 的弃九值 (mod 9)</span>。若两边不相等，乘法一定算错了（若相等，则"大概率"对——这是验算不是证明）。'));
  ch3.appendChild(el('p', null, '看动画：验算 <span class="fx">98765 × 4321</span>。正确结果 <span class="fx">426763565</span> 能通过检验；而把结果抄错成 <span class="fx">426842565</span>，会被弃九法当场识破。'));

  // 动画4：弃九法
  const vNines = viz({ id: 'viz-nines', title: '🎬 动画 4 · 弃九验算 —— 逐步分解',
    desc: '按"播放"看完整流程：逐位求和 → 化归到一位 → 两边相乘再化归 → 对比。也可以用按钮单步控制。',
    controls: `<div class="seg" id="ninesMode">
        <button data-case="good" class="on">正确结果 426763565</button>
        <button data-case="bad">错误结果 426842565</button>
      </div>
      <button class="btn primary" id="ninesPlay">▶ 播放</button>
      <button class="btn" id="ninesStep">单步 ›</button>
      <button class="btn" id="ninesReset">重置</button>`,
    bodyHTML: `<div class="nines-stage" id="ninesStage"></div>
      <div class="nines-narr" id="ninesNarr">选择一种情形，点击"播放"。</div>` });
  ch3.appendChild(vNines);

  ch3.appendChild(el('h3', null, '顺便：11 的整除判定'));
  ch3.appendChild(el('p', null, '因为 <span class="fx">10 ≡ −1 (mod 11)</span>，所以 <span class="fx">10<sup>k</sup> ≡ (−1)<sup>k</sup></span>：把数字<strong>从右往左</strong>交替加减（个位 +、十位 −、百位 +……），结果能被 11 整除 ⇔ 原数能被 11 整除。例：<span class="fx">473 → 3 − 7 + 4 = 0</span>，所以 473 = 43×11 ✓。'));
  ch3.appendChild(keypoint('10 ≡ 1 (mod 9) 让"数字和"接管了整个数——大数的余数问题，常常先换成小数的同余问题。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 幂与循环 ---------- */
  const ch4 = chapter({ id: 'ch-power', no: '第四章', title: '幂的循环与费马小定理', accent: '#e11d48', accentSoft: '#fff1f2' });
  ch4.appendChild(el('p', null, '经典问题：<strong>2<sup>100</sup> 的个位数字是多少？</strong>当然不能真算出这个 31 位数——在 mod 10 的世界里观察它的旅程：'));
  ch4.appendChild(cycleStrip(
    ['2¹→2', '2²→4', '2³→8', '2⁴→6', '2⁵→<b>2</b>', '2⁶→<b>4</b>'],
    '…循环，周期 4'));
  ch4.appendChild(el('p', null, '2 的幂在 mod 10 下走出周期为 4 的循环。100 = 25×4 + 0，落在循环的第 4 格：<strong>个位是 6</strong>。这不是巧合——在模 m 下，a 的幂迟早必然循环（余数只有 m 种， pigeonhole 原理保证重复，而一旦重复就永远重复）。'));
  ch4.appendChild(el('p', null, '当模数是<strong>素数</strong> p 时，循环有一段格外优雅的规律：'));
  ch4.appendChild(theorem('费马小定理（1640）',
    '<p>设 p 为素数，a 与 p 互素，则</p>' +
    '<p class="center big">a<sup>p−1</sup> ≡ 1 (mod p)</p>' +
    '<p class="mb0">例：2<sup>6</sup> = 64 = 63 + 1 ≡ 1 (mod 7)；3<sup>10</sup> = 59049 = 5904×10 + 9？不必硬算——定理保证 3<sup>10</sup> ≡ 1 (mod 11)。</p>'));
  ch4.appendChild(el('p', null, '<strong>应用示范</strong>：求 2<sup>100</sup> mod 7。由 2<sup>6</sup> ≡ 1 (mod 7)：100 = 16×6 + 4，所以 2<sup>100</sup> ≡ (2<sup>6</sup>)<sup>16</sup> · 2<sup>4</sup> ≡ 2<sup>4</sup> = 16 ≡ <strong>2</strong> (mod 7)。大指数瞬间塌缩成小指数。'));

  // 动画5：幂循环节转盘
  const vPower = viz({ id: 'viz-power', title: '🎬 动画 5 · 幂循环节转盘 —— a<sup>k</sup> mod n 的旅程',
    desc: '从 1 出发，每一步乘 a 再 mod n，在圆环上跳出轨迹。当轨迹回到 1 时，走过的步数就是循环节长度。',
    controls: `<label>底数 a
        <select id="powerBase">
          <option>2</option><option>3</option><option>4</option><option selected>5</option>
          <option>6</option><option>7</option><option>8</option><option>9</option><option>10</option>
        </select></label>
      <label>模数 n
        <select id="powerMod">
          <option>3</option><option>4</option><option>5</option><option>6</option>
          <option selected>7</option><option>8</option><option>9</option><option>10</option>
          <option>11</option><option>12</option><option>13</option><option>14</option><option>15</option><option>16</option><option>17</option><option>18</option>
        </select></label>
      <button class="btn primary" id="powerPlay">▶ 播放</button>
      <button class="btn" id="powerStep">单步 ›</button>
      <button class="btn" id="powerReset">重置</button>`,
    bodyClass: 'viz-canvas-row',
    bodyHTML: `<canvas id="powerCanvas" height="360"></canvas>
      <div class="viz-side">
        <div class="stat"><span>当前 k</span><b id="powerK">0</b></div>
        <div class="stat"><span>a<sup>k</sup> mod n</span><b id="powerVal">1</b></div>
        <div class="stat hl"><span>循环节长度</span><b id="powerCycle">—</b></div>
        <div class="power-seq" id="powerSeq"></div>
        <div class="tip" id="powerTip">试试 a=2, n=7：6 步回到 1 —— 这正是费马小定理 (7−1=6)。再试试 a=2, n=8：永远停在 0 之前先卡在 4？观察"不互素"时定理为何失效。</div>
      </div>` });
  ch4.appendChild(vPower);

  ch4.appendChild(keypoint('模 m 下幂必然循环；模素数 p 时，与 p 互素的底数恰好在 p−1 步（或其约数步）回到 1。求巨大幂的余数 = 用循环把指数缩小。'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 中国剩余定理 ---------- */
  const ch5 = chapter({ id: 'ch-crt', no: '第五章', title: '中国剩余定理（CRT）', accent: '#0284c7', accentSoft: '#f0f9ff' });
  ch5.appendChild(ancient('"今有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二。问物几何？"——《孙子算经》（约公元 4 世纪）'));
  ch5.appendChild(el('p', null, '翻译成同余语言，就是解方程组：'));
  ch5.appendChild(el('p', 'center big', 'x ≡ 2 (mod 3)　　x ≡ 3 (mod 5)　　x ≡ 2 (mod 7)'));
  ch5.appendChild(el('p', null, '答案：最小是 <strong>23</strong>（一般解为 x ≡ 23 (mod 105)）。宋代秦九韶在《数书九章》中给出系统解法"大衍求一术"，比西方早了五百多年。'));
  ch5.appendChild(el('h3', null, '手把手解一遍（先解前两个条件）'));
  ch5.appendChild(stepList([
    { no: '①', body: '满足第一个条件的数都长成 <span class="fx">x = 2 + 3s</span>（s 为整数）' },
    { no: '②', body: '代入第二个条件：<span class="fx">2 + 3s ≡ 3 (mod 5)</span> ⇒ <span class="fx">3s ≡ 1 (mod 5)</span>' },
    { no: '③', body: '解这个同余方程（试 s = 0..4）：<span class="fx">s = 2</span> 时 3×2 = 6 ≡ 1 ✓，所以 <span class="fx">s ≡ 2 (mod 5)</span>' },
    { no: '④', body: '回代：<span class="fx">s = 2 + 5t</span> ⇒ <span class="fx">x = 2 + 3(2 + 5t) = 8 + 15t</span>' },
    { no: '⑤', body: '结论：<span class="fx hl">x ≡ 8 (mod 15)</span> —— 每隔 15 出现一个解。再套上 mod 7 的条件，就从 8, 23, 38, … 中筛出 <span class="fx hl">23</span>' }
  ]));
  ch5.appendChild(theorem('中国剩余定理',
    '<p>设 <span class="fx">m₁, m₂, …, m_k</span> 两两互素，M = m₁m₂⋯m_k，则对任意余数组合 <span class="fx">a₁, …, a_k</span>，方程组</p>' +
    '<p class="center">x ≡ a₁ (mod m₁)，x ≡ a₂ (mod m₂)，…，x ≡ a_k (mod m_k)</p>' +
    '<p class="mb0">在模 M 意义下<strong>有解且恰有一解</strong>。两组条件看似纠缠，其实"独立守控"各管各的周期——这正是它能同时筛出唯一答案的原因。</p>'));

  // 动画6：CRT 双筛
  const vCrt = viz({ id: 'viz-crt', title: '🎬 动画 6 · 双重筛选 —— 眼看答案被筛出来',
    desc: '数轴 0~44 上：先点亮满足 x ≡ r₁ (mod 3) 的数，再点亮满足 x ≡ r₂ (mod 5) 的数，两种光重叠的格子就是同时满足两组条件的解。',
    controls: `<label>r₁ = x mod 3
        <select id="crtR1"><option>0</option><option selected>2</option><option>1</option></select></label>
      <label>r₂ = x mod 5
        <select id="crtR2"><option>0</option><option>1</option><option>2</option><option selected>3</option><option>4</option></select></label>
      <button class="btn primary" id="crtPlay">▶ 播放筛选</button>
      <button class="btn" id="crtReset">重置</button>`,
    bodyHTML: `<div class="crt-track" id="crtTrack"></div>
      <div class="crt-narr" id="crtNarr">点击"播放"开始筛选。</div>
      <div class="tip">默认 r₁=2, r₂=3（即"三三数之剩二，五五数之剩三"）：解是 8, 23, 38，相邻解恰好相差 15 = 3×5。孙子算经再加上"x ≡ 2 (mod 7)"，就只剩 23。</div>` });
  ch5.appendChild(vCrt);

  ch5.appendChild(keypoint('CRT 说的是"互素模数的条件彼此独立"——知道一个数除以 3、5、7 各余多少，就唯一确定了它除以 105 余多少。'));
  $('topicMain').appendChild(ch5);

  /* ---------- 第六章 应用 ---------- */
  const ch6 = chapter({ id: 'ch-apps', no: '第六章', title: '应用一瞥', accent: '#7c3aed', accentSoft: '#f5f3ff' });
  ch6.appendChild(appGrid([
    { ico: '🔐', title: 'RSA 加密',
      body: '现代互联网的HTTPS基石。取大素数 p、q，令 n = pq。选 e 并求 <span class="fx">d ≡ e<sup>−1</sup> (mod (p−1)(q−1))</span>。加密 <span class="fx">c = m<sup>e</sup> mod n</span>，解密 <span class="fx">m = c<sup>d</sup> mod n</span>——由费马小定理（的推广欧拉定理）保证还原。',
      note: '破解它需要分解几百位的大数 n，目前人类算不动——你的网银安全正押在同余上。' },
    { ico: '🪪', title: '校验码',
      body: '身份证第 18 位：前 17 位分别乘 7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2 再求和，模 11 的余数查表（余 10 记作 X）。ISBN 书号同理用 mod 11 加权校验，防止抄错一位。',
      note: '抄错任何一位，加权和的余数就会变——错误无处遁形。' },
    { ico: '🗂️', title: '哈希与分桶',
      body: '哈希表用 <span class="fx">h(k) = k mod m</span> 把任意键分进 m 个桶；循环数组、轮询调度、一致性哈希都靠取模实现"无限数据 → 有限格子"。',
      note: '第一章的时钟不过是 m=12 的哈希：无限的小时数装进 12 个格子。' },
    { ico: '🎲', title: '密码学与随机性',
      body: '线性同余生成器 <span class="fx">x ← (ax + c) mod m</span> 曾是主流伪随机数算法；一次性密码本、秘密分享、零知识证明里，mod 算术无处不在。',
      note: '同余类是个"有限的世界"，很多无限问题（如大幂）进去后立刻变得可计算。' }
  ]));
  $('topicMain').appendChild(ch6);

  /* ---------- 练习场 ---------- */
  const ch7 = chapter({ id: 'ch-quiz', no: '练习场', title: '过关斩将 · 分级练习', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch7.classList.add('chapter-quiz');
  ch7.appendChild(el('p', null, '共 16 题，分三级难度。选择题点击选项即判分；填空题输入答案后点"提交"。每题都配详细解析——做错也不要紧，看懂解析再回头做动画。'));
  ch7.appendChild(quizShell({
    total: 16,
    tabs: [
      { level: 'basic', label: '🌱 入门 · 6 题' },
      { level: 'mid', label: '🚀 进阶 · 6 题' },
      { level: 'adv', label: '🔥 挑战 · 4 题' }
    ]
  }));
  const done = el('div', 'keypoint', '<b>🎉 全部完成！</b>你已走完从时钟到中国剩余定理的旅程。想继续深入，可以了解：欧拉定理与 φ 函数、二次剩余、模逆元与扩展欧几里得算法。');
  done.id = 'quizDone'; done.style.display = 'none';
  ch7.appendChild(done);
  $('topicMain').appendChild(ch7);

  /* ---------- 页脚 ---------- */
  document.body.appendChild(footer(
    '同余定理交互教学站 · 纯 HTML / CSS / JavaScript 实现，无任何外部依赖 · 动画均由原生 Canvas 绘制',
    '"数学是科学的皇后，数论是数学的皇后。" —— 高斯'));

  /* ---------- 计算器逻辑（原 main.js 的一部分） ---------- */
  (function () {
    const out = $('calcOut');
    function render() {
      const a = Math.trunc(Number($('calcA').value));
      const b = Math.trunc(Number($('calcB').value));
      const m = Math.trunc(Number($('calcM').value));
      out.innerHTML = '';
      if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(m) || m < 2 ||
          Math.abs(a) > 1e12 || Math.abs(b) > 1e12) {
        out.innerHTML = '<div class="calc-row"><span>请输入合理的整数（|a|,|b| ≤ 10¹²，m ≥ 2）。</span></div>';
        return;
      }
      const ra = TOPIC.VE.mod(a, m), rb = TOPIC.VE.mod(b, m);
      const rows = [
        { f: `a mod m = ${a} mod ${m}`, v: ra, note: `a ≡ ${ra} (mod ${m})` },
        { f: `b mod m = ${b} mod ${m}`, v: rb, note: `b ≡ ${rb} (mod ${m})` },
        { f: `(a + b) mod ${m}`, v: TOPIC.VE.mod(ra + rb, m), note: `≡ ${ra} + ${rb} (mod ${m})` },
        { f: `(a − b) mod ${m}`, v: TOPIC.VE.mod(ra - rb, m), note: `≡ ${ra} − ${rb} (mod ${m})` },
        { f: `(a × b) mod ${m}`, v: TOPIC.VE.mod(ra * rb, m), note: `≡ ${ra} × ${rb} (mod ${m})` }
      ];
      rows.forEach((r, i) => {
        const div = el('div', 'calc-row');
        div.style.animationDelay = (i * 0.07) + 's';
        div.innerHTML = `<span class="f">${r.f}</span><span class="v">${r.v}</span><span class="eq">✓ ${r.note}</span>`;
        out.appendChild(div);
      });
      const note = el('div', 'calc-row',
        '<span style="font-size:13px;color:#64748b">✅ 同余式在加、减、乘下都完好保持——先把大数换成余数再运算，结果不变。</span>');
      out.appendChild(note);
    }
    $('calcRun').addEventListener('click', render);
    ['calcA', 'calcB', 'calcM'].forEach(id => $(id).addEventListener('keydown', e => { if (e.key === 'Enter') render(); }));
    render();
  })();

  /* ---------- 启动 chrome（菜单/显现/导航高亮） ---------- */
  initChrome();
})();
