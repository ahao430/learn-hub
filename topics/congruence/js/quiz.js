/* ═══════════ quiz.js · 分级题库 + 即时判分 ═══════════ */
(function () {
  const $ = id => document.getElementById(id);
  const listEl = $('quizList');
  if (!listEl) return;

  const QS = [
    /* ————— 入门 ————— */
    { lv: 'basic', type: 'choice',
      q: '17 ≡ ? (mod 5)，问号处应填：',
      opts: ['1', '2', '3', '4'], ans: 1,
      ex: '17 − 2 = 15 = 3×5，所以 17 ≡ 2 (mod 5)。也可以直接算：17 = 3×5 + 2，余数是 2。' },
    { lv: 'basic', type: 'fill',
      q: '现在是晚上 10 点。经过 <b>100 小时</b>后是几点？（12 小时制，只填数字）',
      ans: '2',
      ex: '10 + 100 = 110，110 = 9×12 + 2。钟面只认余数：凌晨 <b>2</b> 点。100 小时 = 4 天又 4 小时，晚上 10 点过 4 小时正是 2 点。' },
    { lv: 'basic', type: 'choice',
      q: '2026 年 9 月 10 日是星期四。再过 <b>100 天</b>是星期几？',
      opts: ['星期三', '星期四', '星期五', '星期六'], ans: 3,
      ex: '星期以 7 为周期：100 = 14×7 + 2，所以 100 ≡ 2 (mod 7)。星期四往后推 2 天 → <b>星期六</b>。' },
    { lv: 'basic', type: 'choice',
      q: '下列各数中，与 26 模 7 <b>不同余</b>的是：',
      opts: ['12', '19', '31', '40'], ans: 2,
      ex: '26 = 3×7 + 5，即 26 ≡ 5 (mod 7)。12 = 7+5、19 = 14+5、40 = 35+5 都余 5；只有 31 = 28+3 余 3，与众不同。' },
    { lv: 'basic', type: 'fill',
      q: '一个数除以 6 余 4。把这个数再加上 10，得到的新数除以 6 的余数是：',
      ans: '2',
      ex: '同余加法：余数只由 (4 + 10) mod 6 决定。14 = 2×6 + 2，所以余 <b>2</b>。不需要知道原数是什么！' },
    { lv: 'basic', type: 'choice',
      q: '下列关于同余的说法中，<b>错误</b>的是：',
      opts: ['若 a ≡ b (mod m)，则 a + c ≡ b + c (mod m)',
             '若 a ≡ b (mod m)，则 a·c ≡ b·c (mod m)',
             '若 a·c ≡ b·c (mod m)，则一定有 a ≡ b (mod m)',
             '若 a ≡ b (mod m)，则 a² ≡ b² (mod m)'], ans: 2,
      ex: 'C 是经典陷阱：约去 c 需要 gcd(c, m) = 1。反例：2·3 ≡ 4·3 (mod 6)，但 2 ≢ 4 (mod 6)。其余三条都是同余的基本运算性质。' },

    /* ————— 进阶 ————— */
    { lv: 'mid', type: 'fill',
      q: '2<sup>100</sup> 的个位数字是：',
      ans: '6',
      ex: '个位 = mod 10。2 的幂个位循环：2, 4, 8, 6，周期 4。100 ≡ 0 (mod 4) 落在循环末格 → 个位 <b>6</b>。' },
    { lv: 'mid', type: 'choice',
      q: '用弃九法：123456 × 789 的乘积的弃九值（mod 9 余数）是：',
      opts: ['0', '1', '8', '9'], ans: 0,
      ex: '123456 的数字和 1+2+3+4+5+6 = 21 → 3；789 的数字和 7+8+9 = 24 → 6。积的弃九值 ≡ 3×6 = 18 ≡ <b>0</b> (mod 9)。任何真实乘积的数字和都必须能被 9 整除。' },
    { lv: 'mid', type: 'fill',
      q: '同余方程 3x ≡ 1 (mod 7) 的最小正整数解 x = ',
      ans: '5',
      ex: '逐个试 x = 0..6：3×5 = 15 = 2×7 + 1 ✓。也可以求 3 的"模 7 逆元"：3×5 ≡ 1，所以 x ≡ <b>5</b> (mod 7)。' },
    { lv: 'mid', type: 'fill',
      q: '用费马小定理计算：2<sup>100</sup> mod 7 = ',
      ans: '2',
      ex: '7 是素数且 gcd(2,7)=1，费马小定理给出 2⁶ ≡ 1 (mod 7)。100 = 16×6 + 4，所以 2¹⁰⁰ ≡ 2⁴ = 16 ≡ <b>2</b> (mod 7)。' },
    { lv: 'mid', type: 'choice',
      q: '10<sup>100</sup> + 1 除以 11 的余数是：',
      opts: ['0', '1', '2', '10'], ans: 2,
      ex: '10 ≡ −1 (mod 11)，所以 10¹⁰⁰ ≡ (−1)¹⁰⁰ = 1，再加 1 得 <b>2</b>。这正是"11 的整除判定"背后的原理（交替和）。' },
    { lv: 'mid', type: 'choice',
      q: '已知 a ≡ b (mod m)，下列结论中<b>不一定成立</b>的是：',
      opts: ['aⁿ ≡ bⁿ (mod m)，n 为正整数',
             'a + c ≡ b + c (mod m)',
             'a ÷ c ≡ b ÷ c (mod m)',
             'a·c ≡ b·c (mod m)'], ans: 2,
      ex: '同余的世界里没有"除法"——只有当 c 与 m 互素时才能"约去"c。除以 c 之后甚至连整数都不一定是。A、B、D 都是成立的运算性质。' },

    /* ————— 挑战 ————— */
    { lv: 'adv', type: 'fill',
      q: '"今有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二。"满足条件的最小正整数是：',
      ans: '23',
      ex: 'x ≡ 2 (mod 3)、x ≡ 3 (mod 5) 的解为 x ≡ 8 (mod 15)：8, 23, 38…。再要求 x ≡ 2 (mod 7)：8 mod 7 = 1 ✗，23 mod 7 = 2 ✓ → <b>23</b>（一般解 x ≡ 23 (mod 105)）。' },
    { lv: 'adv', type: 'fill',
      q: '3<sup>2023</sup> mod 13 = ',
      ans: '3',
      ex: '不必等到费马小定理的 12 步——先算几步发现捷径：3³ = 27 = 2×13 + 1，即 3³ ≡ 1 (mod 13)。2023 = 674×3 + 1，所以 3²⁰²³ ≡ (3³)⁶⁷⁴ × 3¹ ≡ <b>3</b>。' },
    { lv: 'adv', type: 'choice',
      q: '1! + 2! + 3! + … + 2026! 除以 5 的余数是：',
      opts: ['0', '1', '2', '3'], ans: 3,
      ex: '当 n ≥ 5 时 n! 含因子 5，即 n! ≡ 0 (mod 5)。于是总和 ≡ 1! + 2! + 3! + 4! = 1 + 2 + 6 + 24 = 33 ≡ <b>3</b> (mod 5)。大项直接"清零"是同余的招牌技巧。' },
    { lv: 'adv', type: 'fill',
      q: '解方程组：x ≡ 3 (mod 4)，x ≡ 2 (mod 3)，x ≡ 1 (mod 5)。满足的最小正整数 x = ',
      ans: '11',
      ex: '设 x = 3 + 4s。代入第二式：3 + 4s ≡ 2 (mod 3) ⇒ s ≡ 2 (mod 3)，取 s = 2 得 x = 11 + 12t。代入第三式：11 + 12t ≡ 1 (mod 5) ⇒ 12t ≡ −10 ≡ 0 (mod 5) ⇒ t ≡ 0 (mod 5)。最小正解 <b>11</b>（验证：11 mod 4 = 3 ✓，11 mod 3 = 2 ✓，11 mod 5 = 1 ✓）。' }
  ];

  const answered = new Map();   // qIndex -> bool（是否答对）
  let curLv = 'basic';

  function esc(s) { return s; }   // 题面允许受控 HTML（<sup> 等）

  function progress() {
    const done = answered.size, right = [...answered.values()].filter(Boolean).length;
    $('quizCount').textContent = `已答 ${done} / ${QS.length}`;
    $('quizScore').textContent = `✓ ${right}`;
    $('quizBarFill').style.width = (done / QS.length * 100) + '%';
    $('quizDone').style.display = done === QS.length ? '' : 'none';
  }

  function render() {
    listEl.innerHTML = '';
    QS.forEach((q, qi) => {
      if (q.lv !== curLv) return;
      const card = document.createElement('div');
      card.className = 'qcard';
      const no = document.createElement('div');
      no.className = 'qhead';
      no.innerHTML = `<span class="qno">Q${qi + 1}</span><span class="qtag">${q.type === 'choice' ? '选择题' : '填空题'}</span>`;
      card.appendChild(no);

      const qt = document.createElement('div');
      qt.className = 'qtext';
      qt.innerHTML = esc(q.q);
      card.appendChild(qt);

      const ex = document.createElement('div');
      ex.className = 'qexplain';

      if (q.type === 'choice') {
        const box = document.createElement('div');
        box.className = 'qopts';
        const OL = 'ABCD';
        q.opts.forEach((op, oi) => {
          const b = document.createElement('button');
          b.className = 'qopt';
          b.innerHTML = `<span class="ol">${OL[oi]}</span><span>${op}</span>`;
          b.addEventListener('click', () => {
            if (answered.has(qi)) return;
            const right = oi === q.ans;
            answered.set(qi, right);
            box.querySelectorAll('.qopt').forEach((bb, bj) => {
              bb.disabled = true;
              if (bj === q.ans) bb.classList.add('right');
              else if (bj === oi) bb.classList.add('wrong');
            });
            ex.innerHTML = `<span class="verdict ${right ? 'ok' : 'no'}">${right ? '✓ 回答正确' : '✗ 回答错误'}</span>${q.ex}`;
            ex.classList.add('show');
            progress();
          });
          box.appendChild(b);
        });
        card.appendChild(box);
      } else {
        const box = document.createElement('div');
        box.className = 'qfill';
        const input = document.createElement('input');
        input.type = 'number'; input.placeholder = '填入答案';
        const btn = document.createElement('button');
        btn.className = 'btn primary'; btn.textContent = '提交';
        const judge = () => {
          if (answered.has(qi)) return;
          const v = input.value.trim();
          if (v === '') { input.focus(); return; }
          const right = Number(v) === Number(q.ans);
          answered.set(qi, right);
          input.disabled = true; btn.disabled = true;
          input.style.borderColor = right ? '#16a34a' : '#f87171';
          ex.innerHTML = `<span class="verdict ${right ? 'ok' : 'no'}">${right ? '✓ 回答正确' : '✗ 正确答案：' + q.ans}</span>${q.ex}`;
          ex.classList.add('show');
          progress();
        };
        btn.addEventListener('click', judge);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') judge(); });
        box.appendChild(input); box.appendChild(btn);
        card.appendChild(box);
      }

      card.appendChild(ex);
      listEl.appendChild(card);
    });
    progress();
  }

  document.querySelectorAll('#quizTabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('#quizTabs button').forEach(x => x.classList.toggle('on', x === b));
    curLv = b.dataset.level;
    render();
  }));

  render();
})();
