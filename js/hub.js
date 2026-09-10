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
    // 卡片配色（顶部彩条 / 图标底色）
    c1: '#4f46e5', c2: '#0ea5e9',
    c1s: '#eef2ff', c2s: '#e0f2fe', cline: '#c7d2fe',
    tags: ['数论', '入门 → 进阶', '6 章', '6 动画', '16 题'],
    date: '2026-09-10 上架'
  }
  /* 新专题在这里追加，例如：
  , {
    id: 'primes',
    title: '质数与算术基本定理',
    sub: '整数世界的原子',
    desc: '……',
    url: 'topics/primes/index.html',
    icon: '🧱',
    c1: '#0d9488', c2: '#22c55e', c1s: '#f0fdfa', c2s: '#f0fdf4', cline: '#99f6e4',
    tags: ['数论', '入门', 'x 章', 'x 动画', 'x 题'],
    date: '2026-xx-xx 上架'
  }
  */
];

/* ───────── 规划中的占位（未上架） ───────── */
const PLANNED = [
  { icon: '🧱', title: '质数与算术基本定理', desc: '分解唯一性 · 筛法 · 无穷性证明' },
  { icon: '🎲', title: '组合计数', desc: '加乘原理 · 鸽笼原理 · 排列组合' },
  { icon: '🪜', title: '数学归纳法', desc: '多米诺骨牌的艺术' },
  { icon: '🕸️', title: '图论入门', desc: '哥尼斯堡七桥 · 欧拉回路' }
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
