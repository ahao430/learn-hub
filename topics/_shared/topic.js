/* ═══════════════════════════════════════════════
   学习馆 · 专题通用脚本（topics/_shared/topic.js）
   挂在 window.TOPIC 上，提供：
     · VE 工具（gcd / mod / setupCanvas / residueColor / chain）
     · TopicNav(config)  —— 注入顶部导航
     · 组件函数：hero / chapter / theorem / examples / triview /
       propRow / keypoint / ancient / appGrid / stepList / cycleStrip /
       viz / quizShell —— 从 JS 生成 DOM，省掉重复 HTML
     · 移动菜单、滚动显现、导航高亮
   专题页只需 <script src="../_shared/topic.js"></script>，
   再写自己的内容脚本即可。
   ═══════════════════════════════════════════════ */
(function () {
  const TOPIC = {};

  /* ---------- 通用工具 ---------- */
  TOPIC.VE = {
    gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; },
    mod(a, m) { return ((a % m) + m) % m; },
    setupCanvas(canvas, cssHeight) {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      const w = Math.max(280, Math.min(parent.clientWidth - 2, parent.clientWidth || 600));
      canvas.style.width = w + 'px';
      canvas.style.height = cssHeight + 'px';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h: cssHeight };
    },
    residueColor(r, m) {
      const hue = Math.round((r / m) * 340);
      return `hsl(${hue}, 68%, 52%)`;
    },
    chain(steps, onDone) {
      let i = 0, timer = null, stopped = false;
      function next() {
        if (stopped) return;
        if (i >= steps.length) { onDone && onDone(); return; }
        const s = steps[i++];
        timer = setTimeout(() => { s.run(); next(); }, s.delay);
      }
      next();
      return { stop() { stopped = true; if (timer) clearTimeout(timer); }, get stopped() { return stopped; } };
    }
  };

  /* ---------- DOM 小工具 ---------- */
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const $ = id => document.getElementById(id);
  TOPIC.el = el; TOPIC.$ = $;

  /* ---------- 顶部导航注入 ----------
     config = { title, brandHref, homeHref, links:[{href,text}] }
     在 <body> 顶部放 <div id="topicNav" data-config='...'></div>，
     或直接调用 TOPIC.TopicNav(config, mountId)。 */
  TOPIC.TopicNav = function (cfg, mountId) {
    const mount = $(mountId || 'topicNav');
    if (!mount) return;
    const brandSym = cfg.brandSym || '≡';
    const links = (cfg.links || []).map(l => `<a href="${l.href}">${l.text}</a>`).join('');
    mount.className = 'topnav';
    mount.id = 'topnav';
    mount.innerHTML = `
      <a href="${cfg.brandHref || '#hero'}" class="brand">${brandSym} ${cfg.title}</a>
      <div class="navlinks" id="navlinks">
        <a href="${cfg.homeHref || '../../index.html'}" class="homelink">⌂ 学习馆</a>
        ${links}
      </div>
      <button class="navtoggle" id="navtoggle" aria-label="展开菜单">☰</button>`;
  };

  /* ---------- 组件函数：返回 DOM 元素，调用者负责挂载 ---------- */

  // 首屏 hero
  TOPIC.hero = function (cfg) {
    const h = el('header', 'hero');
    h.id = 'hero';
    const cards = (cfg.cards || []).map(c =>
      `<a class="hero-card${c.quiz ? ' hero-card-quiz' : ''}" href="${c.href}">
        <span class="hc-num">${c.num}</span>
        <span class="hc-title">${c.title}</span>
        <span class="hc-desc">${c.desc}</span></a>`).join('');
    h.innerHTML = `
      <div class="hero-inner">
        <div class="hero-badge">${cfg.badge || '交互式教学'}</div>
        <h1>${cfg.title}</h1>
        <p class="hero-sub">${cfg.sub || ''}</p>
        ${cfg.lead ? `<p class="hero-lead">${cfg.lead}</p>` : ''}
        ${cfg.formula ? `<div class="hero-formula">${cfg.formula}</div>` : ''}
        <div class="hero-cards">${cards}</div>
      </div>`;
    return h;
  };

  // 章节容器：返回 section，accent 通过 style 注入
  TOPIC.chapter = function (cfg) {
    const s = el('section', 'chapter');
    s.id = cfg.id;
    if (cfg.accent) s.style.setProperty('--accent', cfg.accent);
    if (cfg.accentSoft) s.style.setProperty('--accent-soft', cfg.accentSoft);
    const head = el('div', 'chap-head',
      `<span class="chap-no">${cfg.no}</span><h2>${cfg.title}</h2>`);
    s.appendChild(head);
    return s;
  };

  // 定理 / 定义框
  TOPIC.theorem = function (tag, innerHTML, warn) {
    return el('div', 'theorem' + (warn ? ' warn' : ''),
      `<div class="theorem-tag">${tag}</div>${innerHTML}`);
  };

  // 三视角卡
  TOPIC.triview = function (items) {
    const t = el('div', 'triview');
    items.forEach(it => {
      t.appendChild(el('div', 'tv-item',
        `<span class="tv-ico">${it.ico}</span><b>${it.title}</b><br>${it.body}`));
    });
    return t;
  };

  // 例子条
  TOPIC.examples = function (items) {
    const e = el('div', 'examples');
    items.forEach(it => e.appendChild(el('div', 'ex', `<span>${it.f}</span>${it.note}`)));
    return e;
  };

  // 性质三连卡
  TOPIC.propRow = function (items) {
    const p = el('div', 'prop-row');
    items.forEach(it => p.appendChild(el('div', 'prop', `<b>${it.title}</b><span class="fx">${it.f}</span>`)));
    return p;
  };

  // 幂循环条
  TOPIC.cycleStrip = function (cells, arrow) {
    const c = el('div', 'cycle-strip');
    cells.forEach(s => c.appendChild(el('span', 'cs-cell', s)));
    if (arrow) c.appendChild(el('span', 'cs-arrow', arrow));
    return c;
  };

  // 步骤列表（CRT 求解等）
  TOPIC.stepList = function (items) {
    const s = el('div', 'step-list');
    items.forEach((it, i) => s.appendChild(el('div', 'step-item', `<b>${it.no || '①②③④⑤⑥⑦⑧⑨⑩'[i]}</b> ${it.body}`)));
    return s;
  };

  // 古文引用
  TOPIC.ancient = function (html) { return el('blockquote', 'ancient', html); };

  // 一句话总结
  TOPIC.keypoint = function (html) { return el('div', 'keypoint', `<b>一句话总结</b>：${html}`); };

  // 应用卡片网格
  TOPIC.appGrid = function (cards) {
    const g = el('div', 'app-grid');
    cards.forEach(c => g.appendChild(el('div', 'app-card',
      `<div class="app-ico">${c.ico}</div><h3>${c.title}</h3><p>${c.body}</p><p class="app-note">${c.note}</p>`)));
    return g;
  };

  // 可视化容器壳：返回带 title/desc 的 .viz，.viz-body 内容由 bodyHTML 填充
  TOPIC.viz = function (cfg) {
    const v = el('div', 'viz');
    v.id = cfg.id;
    v.innerHTML = `
      <div class="viz-title">${cfg.title}</div>
      ${cfg.desc ? `<p class="viz-desc">${cfg.desc}</p>` : ''}
      ${cfg.controls ? `<div class="viz-controls">${cfg.controls}</div>` : ''}
      <div class="viz-body${cfg.bodyClass ? ' ' + cfg.bodyClass : ''}">${cfg.bodyHTML || ''}</div>`;
    return v;
  };

  // 练习题外壳（tabs + 进度条 + 题目容器）
  TOPIC.quizShell = function (cfg) {
    const q = el('div');
    q.innerHTML = `
      <div class="quiz-bar">
        <div class="quiz-tabs" id="quizTabs">
          ${cfg.tabs.map((t, i) => `<button data-level="${t.level}"${i === 0 ? ' class="on"' : ''}>${t.label}</button>`).join('')}
        </div>
        <div class="quiz-progress">
          <span id="quizCount">已答 0 / ${cfg.total}</span>
          <div class="qbar"><div class="qbar-fill" id="quizBarFill"></div></div>
          <span id="quizScore">✓ 0</span>
        </div>
      </div>
      <div id="quizList"></div>`;
    return q;
  };

  // 页脚
  TOPIC.footer = function (note, quote) {
    const f = el('footer');
    f.innerHTML = `<p>${note}</p>${quote ? `<p class="foot-quote">${quote}</p>` : ''}`;
    return f;
  };

  /* ---------- 移动菜单 + 滚动显现 + 导航高亮（不依赖 IntersectionObserver） ---------- */
  TOPIC.initChrome = function () {
    const toggle = $('navtoggle');
    const links = $('navlinks');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
    }

    const secs = Array.from(document.querySelectorAll('section.chapter, header.hero'));
    const navAs = links ? Array.from(links.querySelectorAll('a')) : [];
    let revealEls = Array.from(document.querySelectorAll(
      '.viz, .theorem, .keypoint, .app-card, .examples, .triview, .prop-row, .step-list, .ancient'));
    revealEls.forEach(e => e.classList.add('reveal'));

    function onScroll() {
      const vh = window.innerHeight;
      let current = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top <= vh * 0.35) current = s;
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
      if (revealEls.length) {
        revealEls = revealEls.filter(el => {
          if (el.getBoundingClientRect().top < vh * 0.92) { el.classList.add('in'); return false; }
          return true;
        });
      }
    }
    let ticking = false;
    function schedule() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; onScroll(); });
      setTimeout(() => { if (ticking) { ticking = false; onScroll(); } }, 200);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // 首次执行延后一帧，确保 DOM 布局完成
    requestAnimationFrame(() => requestAnimationFrame(onScroll));
    setTimeout(onScroll, 300);
  };

  window.TOPIC = TOPIC;
})();
