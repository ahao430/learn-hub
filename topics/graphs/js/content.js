/* ═══════════════════════════════════════════════
   图论入门 · 内容组装
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, examples,
    ancient, keypoint, appGrid, viz, footer, initChrome } = TOPIC;

  TopicNav({
    title: '图论入门',
    brandSym: '🕸️',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-what', text: '什么是图' },
      { href: '#ch-hand', text: '握手定理' },
      { href: '#ch-bridges', text: '七桥问题' },
      { href: '#ch-euler', text: '一笔画' },
      { href: '#ch-apps', text: '应用' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  document.body.insertBefore(hero({
    badge: '交互式数学教学',
    title: '图论入门',
    sub: '从七桥问题到你的社交网络',
    lead: '1736 年，欧拉遇到一个散步难题：哥尼斯堡的七座桥，能不能每座恰好走一次？他把陆地抽象成点、桥抽象成线——<strong>图论</strong>就此诞生。点和线简单到极致，却能描述朋友关系、道路网络、互联网……这个专题带你亲手玩图。',
    formula: '所有顶点的度数之和 = 2 × 边数',
    cards: [
      { num: '01', title: '什么是图', desc: '顶点 · 边 · 度', href: '#ch-what' },
      { num: '02', title: '握手定理', desc: '度数之和 = 2E', href: '#ch-hand' },
      { num: '03', title: '七桥问题', desc: '欧拉的千古一问', href: '#ch-bridges' },
      { num: '04', title: '一笔画', desc: '欧拉回路的判定', href: '#ch-euler' },
      { num: '05', title: '应用一瞥', desc: '导航 · 四色 · 网络', href: '#ch-apps' },
      { num: '✎', title: '练习题', desc: '8 题 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 什么是图 ---------- */
  const ch1 = chapter({ id: 'ch-what', no: '第一章', title: '什么是图', accent: '#db2777', accentSoft: '#fdf2f8' });
  ch1.appendChild(el('p', null, '数学里的"图"不是图片，而是一个超简单的抽象：<strong>一些点（顶点），和一些连接点对的线（边）</strong>。朋友关系图里，顶点是人、边是友谊；地图里，顶点是城市、边是公路。研究图，就是研究"连接"本身。'));
  ch1.appendChild(theorem('图的定义',
    '<p>图 <span class="fx">G = (V, E)</span> 由顶点集 <span class="fx">V</span> 和边集 <span class="fx">E</span> 组成，每条边连接两个顶点。顶点 <span class="fx">v</span> 的<b>度</b> <span class="fx">deg(v)</span> 是与它相连的边数。</p>' +
    '<p class="mb0">只关心"谁连谁"，不关心位置长短——地铁线路图把真实距离扭曲得面目全非，但换乘信息一点不丢，正因为它本质是一张图。</p>'));
  ch1.appendChild(examples([
    { f: '三角形图', note: 'V = 3，E = 3，每个顶点度 = 2' },
    { f: '朋友关系', note: '"认识"是双向的 → 无向图；微博"关注"有方向 → 有向图' },
    { f: 'n 顶点完全图 Kₙ', note: '任意两点都相连，E = n(n−1)/2（组合数！）' }
  ]));

  const vLab = viz({ id: 'viz-lab', title: '🎬 动画 1 · 图实验室 —— 亲手加边、实时看度',
    desc: '选一个预设图，然后依次点击两个顶点即可加/删一条边——度数、边数、度数之和实时更新，握手定理永远成立。',
    controls: `<label>预设
        <select id="labPreset">
          <option value="triangle" selected>三角形</option>
          <option value="k4">完全图 K₄</option>
          <option value="house">小房子</option>
          <option value="star">五角星</option>
          <option value="tree">树链</option>
        </select></label>
      <button class="btn" id="labReset">还原预设</button>
      <span class="tip" style="padding:4px 12px">点两个顶点 = 切换它们之间的边</span>`,
    bodyClass: 'viz-canvas-row',
    bodyHTML: `<canvas id="labCanvas" height="330"></canvas>
      <div class="viz-side">
        <div class="stat"><span>顶点数 V</span><b id="labV">3</b></div>
        <div class="stat"><span>边数 E</span><b id="labE">3</b></div>
        <div class="stat"><span>Σdeg</span><b id="labSum">6</b></div>
        <div class="stat hl"><span>= 2E？</span><b id="labCheck">6 ✓</b></div>
        <div class="stat"><span>奇度顶点</span><b id="labOdd">0 个</b></div>
        <div class="tip">度数序列：<span id="labDegs">2, 2, 2</span></div>
      </div>` });
  ch1.appendChild(vLab);

  ch1.appendChild(keypoint('图 = 顶点 + 边，只管连接不管位置。度 = 该顶点连了几条边。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 握手定理 ---------- */
  const ch2 = chapter({ id: 'ch-hand', no: '第二章', title: '度与握手定理', accent: '#db2777', accentSoft: '#fdf2f8' });
  ch2.appendChild(theorem('握手定理',
    '<p class="center big">Σ deg(v) = 2E</p>' +
    '<p class="mb0">每条边给它的两个端点各贡献 1 度——就像每场握手都占用两只手。推论：<b>奇度顶点的个数必为偶数</b>（否则总和凑不出偶数 2E）。</p>'));
  ch2.appendChild(el('p', null, '例：任何聚会里，<strong>握手次数为奇数的人必有偶数个</strong>——不需要知道谁和谁握过手！这种"不数细节也知道结论"的力量，正来自握手定理。'));
  ch2.appendChild(keypoint('Σdeg = 2E：每条边数两只手。奇度顶点永远成对出现——这是七桥问题的钥匙。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 七桥问题 ---------- */
  const ch3 = chapter({ id: 'ch-bridges', no: '第三章', title: '哥尼斯堡七桥问题', accent: '#db2777', accentSoft: '#fdf2f8' });
  ch3.appendChild(ancient('"在普雷格尔河畔的哥尼斯堡，有七座桥连接两岸与两个小岛。能否从某地出发，每座桥恰好经过一次，回到出发点？"——1736 年的散步难题'));
  ch3.appendChild(el('p', null, '无数人徒步尝试都失败了。欧拉的天才之处在于：<strong>扔掉所有无关信息</strong>——桥多长、陆地什么形状统统不重要，只留"4 块陆地（顶点）+ 7 座桥（边）"。问题变成：这张图能否一笔画成？'));
  ch3.appendChild(el('p', null, '他的观察直击要害：如果一笔画要经过某块陆地的每座桥，"进"和"出"必须配对——<strong>除了起点和终点，每块陆地的度必须是偶数</strong>。'));
  ch3.appendChild(theorem('欧拉的判据（1736）',
    '<p>一笔画（每条边恰好走一次）存在的充要条件：图连通，且</p>' +
    '<p><b>① 欧拉回路</b>（回到出发点）⇔ 所有顶点度数都是偶数（奇度顶点 = 0 个）；</p>' +
    '<p><b>② 欧拉路径</b>（不回出发点）⇔ 恰有 2 个奇度顶点（一进一出各让一）；</p>' +
    '<p class="mb0">奇度顶点 > 2 ⇒ 不可能。七桥图的四个顶点度数为 5, 3, 3, 3 —— <b>四个奇度，无解</b>。</p>'));

  const vEuler = viz({ id: 'viz-euler', title: '🎬 动画 2 · 一笔画判定 —— 数度数，见分晓',
    desc: '选一张图，点"判定"：先逐个数每个顶点的度，再给出能否一笔画的结论；能画的图会当场画给你看。',
    controls: `<label>图
        <select id="euPreset">
          <option value="triangle" selected>三角形</option>
          <option value="house">小房子（2 奇度）</option>
          <option value="pentagram">五角星</option>
          <option value="k5">完全图 K₅</option>
          <option value="bridges">七桥图（4 奇度）</option>
        </select></label>
      <button class="btn primary" id="euRun">▶ 判定一笔画</button>
      <button class="btn" id="euReset">重置</button>`,
    bodyHTML: `<canvas id="euCanvas" height="330"></canvas>
      <div class="sieve-narr" id="euNarr">选一张图，点击"判定"。</div>` });
  ch3.appendChild(vEuler);

  ch3.appendChild(keypoint('七桥无解的原因一句话：4 个奇度顶点 > 2。欧拉由此开创图论——好的抽象比蛮力尝试强大得多。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 一笔画 ---------- */
  const ch4 = chapter({ id: 'ch-euler', no: '第四章', title: '欧拉回路：一笔画的数学', accent: '#db2777', accentSoft: '#fdf2f8' });
  ch4.appendChild(el('p', null, '"一笔画"的学名是<strong>欧拉路径</strong>（每条边恰好经过一次）；如果还能回到起点，叫<strong>欧拉回路</strong>。判据已在上一章：看奇度顶点个数——0 个有回路，2 个有路径，更多则无解。'));
  ch4.appendChild(el('p', null, '直观理解 ②：恰有两个奇度顶点时，一个当起点（出比进多 1 次）、一个当终点（进比出多 1 次），其余顶点进出配对。'));
  ch4.appendChild(el('p', null, '与欧拉路径相对的是<strong>哈密顿路径</strong>（每个顶点恰好经过一次）。有趣的是：欧拉路径有秒判的充要条件，而哈密顿路径的判定是 NP 完全问题——"边恰好一次"与"点恰好一次"，难度天差地别。'));
  ch4.appendChild(keypoint('一笔画三句话：0 个奇度顶点 → 有回路；2 个 → 有路径（起终点各占一个奇度）；≥ 3 个 → 不可能。'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 应用 ---------- */
  const ch5 = chapter({ id: 'ch-apps', no: '第五章', title: '应用一瞥', accent: '#db2777', accentSoft: '#fdf2f8' });
  ch5.appendChild(appGrid([
    { ico: '🗺️', title: '导航与最短路',
      body: '地图 = 加权图（顶点路口、边道路、边长权重）。Dijkstra 算法在海量图上毫秒级找出最短路——你每次打车都在用它。',
      note: '中国快递网络的"枢纽—干线"规划也是图优化。' },
    { ico: '🌈', title: '地图四色定理',
      body: '相邻区域不同色，任何地图四种颜色就够——1976 年首个靠计算机辅助证明的大定理，本质是图的顶点染色。',
      note: '考试排期、频道分配都是"染色"问题的变体。' },
    { ico: '🌐', title: '互联网与社交',
      body: '网页 = 顶点、超链接 = 有向边（PageRank 在这张图上排名）；朋友关系图上，"六度分隔"说任意两人平均只隔约 6 个朋友。',
      note: '30 亿用户的社交图谱是人类最大的图之一。' },
    { ico: '🧬', title: '科学与工程',
      body: '分子结构图（苯环就是六边形图）、电网、神经网络、蛋白质相互作用网络……凡是"关系"，皆可成图。',
      note: '图是继微积分之后最通用的数学语言之一。' }
  ]));
  $('topicMain').appendChild(ch5);

  /* ---------- 练习场 ---------- */
  const ch6 = chapter({ id: 'ch-quiz', no: '练习场', title: '小试身手', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch6.classList.add('chapter-quiz');
  ch6.appendChild(el('p', null, '共 8 题。度数与握手定理是主力工具。'));
  const qm = el('div'); qm.id = 'quizMount';
  ch6.appendChild(qm);
  $('topicMain').appendChild(ch6);

  document.body.appendChild(footer(
    '图论入门 · 纯 HTML / CSS / JavaScript 实现 · 图由原生 Canvas 绘制',
    '"图论始于一次没能完成的散步。" —— 纪念欧拉，1736'));
  initChrome();
})();
