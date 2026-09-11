/* ═══════════════════════════════════════════════
   力学入门 · 内容组装
   ═══════════════════════════════════════════════ */
(function () {
  const { el, $, TopicNav, hero, chapter, theorem, examples,
    keypoint, appGrid, viz, footer, initChrome } = TOPIC;

  TopicNav({
    title: '力学入门',
    brandSym: '⚙️',
    homeHref: '../../index.html',
    links: [
      { href: '#ch-motion', text: '描述运动' },
      { href: '#ch-inertia', text: '惯性与第一定律' },
      { href: '#ch-fma', text: 'F = ma' },
      { href: '#ch-third', text: '作用与反作用' },
      { href: '#ch-fall', text: '自由落体' },
      { href: '#ch-quiz', text: '练习题' }
    ]
  }, 'topicNav');

  document.body.insertBefore(hero({
    badge: '交互式物理教学',
    title: '力学入门',
    sub: '描述运动，与改变运动的原因',
    lead: '力学回答两个问题：<strong>物体怎么运动</strong>（运动学：位置、速度、加速度）和<strong>为什么这样运动</strong>（动力学：力）。伽利略用斜面打开了实验物理的大门，牛顿用三条定律把天地间的运动统一起来。这个专题用频闪模拟和双车实验把这两千年的智慧演示给你看。',
    formula: 'F = m · a',
    cards: [
      { num: '01', title: '描述运动', desc: '位置 · 速度 · 加速度', href: '#ch-motion' },
      { num: '02', title: '惯性与第一定律', desc: '不受力 ≠ 不动', href: '#ch-inertia' },
      { num: '03', title: 'F = ma', desc: '第二定律 · 双车实验', href: '#ch-fma' },
      { num: '04', title: '作用与反作用', desc: '第三定律 · 冰面分离', href: '#ch-third' },
      { num: '05', title: '自由落体', desc: '伽利略 · 1:3:5:7', href: '#ch-fall' },
      { num: '✎', title: '练习题', desc: '8 题 · 即时判分', href: '#ch-quiz', quiz: true }
    ]
  }), $('topicMain'));

  /* ---------- 第一章 描述运动 ---------- */
  const ch1 = chapter({ id: 'ch-motion', no: '第一章', title: '描述运动的语言', accent: '#ea580c', accentSoft: '#fff7ed' });
  ch1.appendChild(el('p', null, '要谈运动，先学会三个量：<strong>位置 s</strong>（在哪）、<strong>速度 v</strong>（位置变化的快慢，v = Δs/Δt）、<strong>加速度 a</strong>（速度变化的快慢，a = Δv/Δt）。注意：速度大 ≠ 加速度大——高速匀速巡航的飞机 a = 0，起步的自行车速度小但 a 很大。'));
  ch1.appendChild(theorem('匀变速运动公式',
    '<p>加速度恒定时：</p>' +
    '<p class="center">v = v₀ + at　　s = v₀t + ½at²　　v² − v₀² = 2as</p>' +
    '<p class="mb0">其中最直观的是频闪照片：<b>每 0.5 秒闪一次光</b>记录位置——匀速时相邻光点等距；匀加速时相邻光点间距<b>依次增大相同的量</b>（Δd = a·Δt²）。</p>'));

  const vStrobe = viz({ id: 'viz-strobe', title: '🎬 动画 1 · 频闪照片模拟 —— 看见加速度',
    desc: '选一个预设（或自己调 v₀、a），按播放：小车出发，照相机每 0.5 s 闪一次光在地上留下光点——匀速等距，加速则间距均匀增大。',
    controls: `<label>预设
        <select id="stPreset">
          <option value="uniform">匀速（a = 0）</option>
          <option value="accel" selected>匀加速（a = 2）</option>
          <option value="free">大加速度 a = 10（类比自由落体）</option>
        </select></label>
      <label>v₀ = <b id="stV0Val">0</b> m/s
        <input type="range" id="stV0" min="0" max="10" step="1" value="0"></label>
      <label>a = <b id="stAVal">2</b> m/s²
        <input type="range" id="stA" min="0" max="10" step="1" value="2"></label>
      <button class="btn primary" id="stPlay">▶ 出发</button>
      <button class="btn" id="stReset">重置</button>`,
    bodyClass: 'viz-canvas-row',
    bodyHTML: `<canvas id="stCanvas" height="250"></canvas>
      <div class="viz-side">
        <div class="stat"><span>时间 t</span><b id="stT">0.0 s</b></div>
        <div class="stat"><span>速度 v</span><b id="stV">0 m/s</b></div>
        <div class="stat hl"><span>位移 s</span><b id="stS">0 m</b></div>
        <div class="formula-box" id="stFormula">s = v₀t + ½at²</div>
        <div class="tip" id="stGap">观察地上光点：匀速时等距；加速时间距每次增加 Δd = a·Δt²。</div>
      </div>` });
  ch1.appendChild(vStrobe);

  ch1.appendChild(keypoint('速度描述"变化多快"，加速度描述"变化的快慢在怎么变"。频闪光点的间距，就是加速度的指纹。'));
  $('topicMain').appendChild(ch1);

  /* ---------- 第二章 惯性与第一定律 ---------- */
  const ch2 = chapter({ id: 'ch-inertia', no: '第二章', title: '惯性与牛顿第一定律', accent: '#ea580c', accentSoft: '#fff7ed' });
  ch2.appendChild(theorem('牛顿第一定律（惯性定律）',
    '<p class="mb0">一切物体在<b>不受外力</b>（或合外力为零）时，保持静止或匀速直线运动状态。</p>'));
  ch2.appendChild(el('p', null, '这条定律反直觉之处在于：<strong>"不受力"不是"不动"，而是"不改变"</strong>。日常中"推车才动、不推就停"，其实是因为摩擦力在暗中推它减速。伽利略的理想斜面实验早就看穿：把摩擦去掉，小球从一个斜面滚下会爬上另一个斜面<strong>同样的高度</strong>——把对面放平，它将永远滚下去。'));
  ch2.appendChild(examples([
    { f: '急刹车时人前倾', note: '脚随车停了，身体还要"保持原来"——惯性' },
    { f: '安全带与气囊', note: '延长减速时间，减小作用力（也是第三定律的舞台）' },
    { f: '深空探测器关机滑行', note: '阻力近乎为零，无需燃料也能匀速飞几十年' }
  ]));
  ch2.appendChild(keypoint('惯性是物体的"惰性"：不想启动、不想停止、也不想拐弯。质量是惯性大小的唯一量度。'));
  $('topicMain').appendChild(ch2);

  /* ---------- 第三章 F = ma ---------- */
  const ch3 = chapter({ id: 'ch-fma', no: '第三章', title: '牛顿第二定律：F = ma', accent: '#ea580c', accentSoft: '#fff7ed' });
  ch3.appendChild(theorem('牛顿第二定律',
    '<p class="center big">F<sub>合</sub> = m · a</p>' +
    '<p class="mb0">力是改变运动状态的原因：合力加倍 → 加速度加倍；质量加倍 → 加速度减半。1 N 的定义正是"使 1 kg 物体产生 1 m/s² 加速度的力"。</p>'));

  const vRace = viz({ id: 'viz-race', title: '🎬 动画 2 · 双车实验 —— F 与 a 成正比',
    desc: '两辆同质量小车同时出发：A 车受你设定的力 F，B 车受 2F。看 B 的加速度是否恰好是 A 的两倍——频闪点间距当场对比。',
    controls: `<label>F = <b id="raceFVal">6</b> N
        <input type="range" id="raceF" min="2" max="12" step="1" value="6"></label>
      <label>m = <b id="raceMVal">2</b> kg
        <input type="range" id="raceM" min="1" max="6" step="1" value="2"></label>
      <button class="btn primary" id="racePlay">▶ 出发</button>
      <button class="btn" id="raceReset">重置</button>`,
    bodyHTML: `<canvas id="raceCanvas" height="290"></canvas>
      <div class="viz-narr" id="raceNarr">设定 F 和 m，双车同时出发。A 车受力 F，B 车受力 2F（质量相同）。</div>` });
  ch3.appendChild(vRace);

  ch3.appendChild(keypoint('F = ma 一句话：力决定加速度，不决定速度本身。质量是"抗拒加速"的程度。'));
  $('topicMain').appendChild(ch3);

  /* ---------- 第四章 作用与反作用 ---------- */
  const ch4 = chapter({ id: 'ch-third', no: '第四章', title: '牛顿第三定律：作用与反作用', accent: '#ea580c', accentSoft: '#fff7ed' });
  ch4.appendChild(theorem('牛顿第三定律',
    '<p class="mb0">两个物体之间的作用力与反作用力总是<b>大小相等、方向相反、作用在不同物体上</b>。</p>'));
  ch4.appendChild(el('p', null, '最常见的困惑："马拉车和车拉马的力一样大，车怎么还能被拉动？"——因为这两个力<b>作用在不同物体上</b>，根本不该相互抵消。车是否前进，只看<strong>车自己</strong>受到的合力（马拉车的力 vs 摩擦阻力）。'));

  const vPush = viz({ id: 'viz-push', title: '🎬 动画 3 · 冰面分离 —— 等大的力，不等的效果',
    desc: '两个冰块互相推开：力等大反向，但质量不同 → 加速度不同 → 速度与质量成反比，而动量（m·v）恰好相等。',
    controls: `<label>m<sub>A</sub> = <b id="pushMAVal">3</b> kg
        <input type="range" id="pushMA" min="1" max="6" step="1" value="3"></label>
      <label>m<sub>B</sub> = <b id="pushMBVal">2</b> kg
        <input type="range" id="pushMB" min="1" max="6" step="1" value="2"></label>
      <button class="btn primary" id="pushGo">▶ 分开！</button>
      <button class="btn" id="pushReset">重置</button>`,
    bodyHTML: `<canvas id="pushCanvas" height="220"></canvas>
      <div class="viz-narr" id="pushNarr">两块冰靠在一起，中间有一个压紧的弹簧。点"分开！"看它们如何弹开。</div>` });
  ch4.appendChild(vPush);

  ch4.appendChild(keypoint('作用力与反作用力：等大、反向、同生同灭、异体（所以不抵消）。火箭正是靠向后喷气获得向前的反作用力。'));
  $('topicMain').appendChild(ch4);

  /* ---------- 第五章 自由落体 ---------- */
  const ch5 = chapter({ id: 'ch-fall', no: '第五章', title: '自由落体：重物落得快？', accent: '#ea580c', accentSoft: '#fff7ed' });
  ch5.appendChild(el('p', null, '亚里士多德说重物落得快，这个论断统治了近两千年。伽利略的思想实验一击致命：<strong>把重石和轻石拴在一起</strong>——轻石会"拖慢"重石（整体比单块重石慢），但拴起来总量更重（应该更快）——矛盾！所以落体快慢与重量无关。'));
  ch5.appendChild(theorem('自由落体',
    '<p>真空中，一切物体下落的加速度同为 <span class="fx">g ≈ 9.8 m/s²</span>（计算常取 10）：</p>' +
    '<p class="center">v = gt　　h = ½gt²</p>' +
    '<p class="mb0">下落时间 t 依次为 0.5 s、1 s、1.5 s 时，落下的距离比是 <b>1 : 4 : 9</b>（相邻段 1:3:5）——正是第一章频闪照片 a = 10 的情形。1971 年宇航员在月球上同时放开锤子和羽毛，同时落地。</p>'));
  ch5.appendChild(el('p', null, '回到第一章动画，选预设"大加速度 a = 10"，想象画面顺时针转 90°——你看到的就是自由落体的频闪照片。'));
  ch5.appendChild(keypoint('自由落体与质量无关，h = ½gt²。日常看到"轻物飘落"是空气阻力在表演，不是重力偏心。'));
  $('topicMain').appendChild(ch5);

  /* ---------- 练习场 ---------- */
  const ch6 = chapter({ id: 'ch-quiz', no: '练习场', title: '小试身手', accent: '#16a34a', accentSoft: '#f0fdf4' });
  ch6.classList.add('chapter-quiz');
  ch6.appendChild(el('p', null, '共 8 题。区分"速度"与"加速度"、看清受力对象，是力学入门的两把钥匙。'));
  const qm = el('div'); qm.id = 'quizMount';
  ch6.appendChild(qm);
  $('topicMain').appendChild(ch6);

  document.body.appendChild(footer(
    '力学入门 · 纯 HTML / CSS / JavaScript 实现 · 动画由原生 Canvas 模拟',
    '"自然这部大书是用数学语言写成的。" —— 伽利略'));
  initChrome();
})();
