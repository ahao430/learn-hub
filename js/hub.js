/* ═══════════════════════════════════════════════
   学习馆 · 主界面逻辑
   TOPICS 是专题登记表：上架新专题只需在这里加一条，
   主页卡片与顶部统计数字会自动更新。
   ═══════════════════════════════════════════════ */

/* ───────── 专题登记表（已上架） ───────── */
const TOPICS = [
  {
    id: 'congruence',
    title: '同余定理',
    sub: '从时钟到密码学',
    desc: '什么是同余、基本性质、弃九法、幂与循环、费马小定理、中国剩余定理，配 6 个交互动画、1 个运算验证器和 16 道分级练习。',
    url: 'topics/congruence/index.html',
    icon: '🕐',
    c1: '#4f46e5', c2: '#0ea5e9',
    c1s: '#eef2ff', c2s: '#e0f2fe', cline: '#c7d2fe',
    tags: ['数论', '入门 → 进阶', '6 章', '6 动画', '16 题'],
    date: '2026-09-10 上架'
  },
  {
    id: 'primes',
    title: '质数与算术基本定理',
    sub: '整数世界的原子',
    desc: '什么是质数、埃拉托斯特尼筛法、分解唯一性、质数无穷多的欧几里得证明，配筛法、分解树、质数检测器 3 个交互动画。',
    url: 'topics/primes/index.html',
    icon: '🧱',
    c1: '#0d9488', c2: '#14b8a6',
    c1s: '#f0fdfa', c2s: '#ccfbf1', cline: '#99f6e4',
    tags: ['数论', '入门', '5 章', '3 动画', '8 题'],
    date: '2026-09-10 上架'
  },
  {
    id: 'combinatorics',
    title: '组合计数',
    sub: '数清所有的可能',
    desc: '加法与乘法原理、排列、组合、鸽笼原理、杨辉三角，配穿搭生成器、排列树、鸽笼演示、杨辉三角生长 4 个交互动画。',
    url: 'topics/combinatorics/index.html',
    icon: '🎲',
    c1: '#7c3aed', c2: '#a855f7',
    c1s: '#f5f3ff', c2s: '#ede9fe', cline: '#ddd6fe',
    tags: ['组合数学', '入门', '5 章', '4 动画', '8 题'],
    date: '2026-09-10 上架'
  },
  {
    id: 'induction',
    title: '数学归纳法',
    sub: '多米诺骨牌的艺术',
    desc: '奠基与递推、求和公式的完整证明、缺奠基与"所有马同色"两大陷阱，配多米诺推倒与求和点阵 2 个交互动画。',
    url: 'topics/induction/index.html',
    icon: '🪜',
    c1: '#2563eb', c2: '#3b82f6',
    c1s: '#eff6ff', c2s: '#dbeafe', cline: '#bfdbfe',
    tags: ['证明方法', '入门', '5 章', '2 动画', '6 题'],
    date: '2026-09-10 上架'
  },
  {
    id: 'graphs',
    title: '图论入门',
    sub: '从七桥问题开始',
    desc: '顶点与边、握手定理、哥尼斯堡七桥、欧拉回路与一笔画判定，配可交互的图实验室（点两顶点加删边）与一笔画演示动画。',
    url: 'topics/graphs/index.html',
    icon: '🕸️',
    c1: '#db2777', c2: '#ec4899',
    c1s: '#fdf2f8', c2s: '#fce7f3', cline: '#f9a8d4',
    tags: ['图论', '入门', '5 章', '2 动画', '8 题'],
    date: '2026-09-10 上架'
  },
  {
    id: 'mechanics',
    title: '力学入门',
    sub: '描述运动与改变运动',
    desc: '运动学三量、牛顿三定律、自由落体，配频闪照片模拟（看见加速度）、双车 F=ma 实验、冰面分离动量演示。',
    url: 'topics/mechanics/index.html',
    icon: '⚙️',
    c1: '#ea580c', c2: '#f97316',
    c1s: '#fff7ed', c2s: '#ffedd5', cline: '#fed7aa',
    tags: ['物理 · 力学', '入门', '5 章', '3 动画', '8 题'],
    date: '2026-09-11 上架'
  },
  {
    id: 'chemistry',
    title: '化学反应',
    sub: '摩尔、配平与平衡',
    desc: '摩尔计算、质量守恒与方程式配平、碰撞理论与活化能、化学平衡与勒夏特列原理，配互动配平器、碰撞模拟、平衡演示。',
    url: 'topics/chemistry/index.html',
    icon: '⚗️',
    c1: '#0891b2', c2: '#06b6d4',
    c1s: '#ecfeff', c2s: '#cffafe', cline: '#a5f3fc',
    tags: ['化学 · 反应原理', '入门', '5 章', '4 交互', '8 题'],
    date: '2026-09-11 上架'
  }
];

/* ───────── 规划中的占位（未上架） ───────── */
const PLANNED = [
  { icon: '⚡', title: '电与磁', desc: '场 · 感应 · 电路' },
  { icon: '🌈', title: '波动与光', desc: '干涉 · 衍射 · 光谱' },
  { icon: '🎯', title: '概率入门', desc: '随机 · 期望 · 大数定律' },
  { icon: '∫', title: '微积分初步', desc: '极限 · 导数 · 面积' }
];

/* ───────── 渲染 ───────── */
(function () {
  const shelf = document.getElementById('shelf');
  const planned = document.getElementById('planned');
  const stats = document.getElementById('hubstats');

  let sumChapters = 0, sumAnims = 0, sumQuiz = 0;

  TOPICS.forEach(t => {
    const a = document.createElement('a');
    a.className = 'topic-card';
    a.href = t.url;
    a.style.setProperty('--tc1', t.c1);
    a.style.setProperty('--tc2', t.c2);
    a.style.setProperty('--tc1-soft', t.c1s);
    a.style.setProperty('--tc2-soft', t.c2s);
    a.style.setProperty('--tc-line', t.cline);
    a.innerHTML = `
      <div class="tc-top">
        <div class="tc-icon">${t.icon}</div>
        <div class="tc-title-wrap">
          <div class="tc-title">${t.title}</div>
          <div class="tc-sub">${t.sub}</div>
        </div>
      </div>
      <div class="tc-desc">${t.desc}</div>
      <div class="tc-tags">${t.tags.map(x => `<span class="tc-tag">${x}</span>`).join('')}</div>
      <div class="tc-foot">
        <span class="tc-date">${t.date}</span>
        <span class="tc-enter">进入学习</span>
      </div>`;
    shelf.appendChild(a);

    // 从标签里提取统计（约定：标签包含 "N 章 / N 动画 / N 题"）
    const pick = re => { const m = t.tags.find(x => re.test(x)); return m ? Number(m.match(/\d+/)[0]) : 0; };
    sumChapters += pick(/章/);
    sumAnims += pick(/动画/);
    sumQuiz += pick(/题/);
  });

  PLANNED.forEach(p => {
    const d = document.createElement('div');
    d.className = 'plan-card';
    d.innerHTML = `
      <div class="plan-ico">${p.icon}</div>
      <div>
        <div class="plan-title">${p.title}</div>
        <div class="plan-desc">${p.desc}</div>
      </div>
      <span class="plan-badge">规划中</span>`;
    planned.appendChild(d);
  });

  [['已上架专题', TOPICS.length], ['教学章节', sumChapters], ['交互动画', sumAnims], ['练习题', sumQuiz]]
    .forEach(([label, n]) => {
      const s = document.createElement('div');
      s.className = 'hubstat';
      s.innerHTML = `<b>${n}</b><span>${label}</span>`;
      stats.appendChild(s);
    });
})();
