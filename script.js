/* ─────────────────────────────────────────────────────────
   github-contribution-chart — docs site scripts
   ───────────────────────────────────────────────────────── */

// ── Navbar scroll shadow ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Hero canvas — animated heatmap ───────────────────────
(function heroHeatmap() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  const DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const COLS = 52;
  const ROWS = 7;
  const GAP = 4;

  // Each cell holds a target level (0-4) and current animated brightness
  const cells = Array.from({ length: COLS * ROWS }, () => ({
    level: Math.floor(Math.random() * 5) * (Math.random() > 0.45 ? 1 : 0),
    glow: 0,
    nextChange: Math.random() * 400,
  }));

  let lastTime = 0;

  function resize() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  function lerpColor(a, b, t) {
    const [r1, g1, b1] = hexToRgb(a);
    const [r2, g2, b2] = hexToRgb(b);
    return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
  }

  function draw(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    resize();
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const dpr = devicePixelRatio;
    const cellW = (W / dpr - (COLS - 1) * GAP) / COLS;
    const cellH = (H / dpr - (ROWS - 1) * GAP) / ROWS;
    const cell = Math.min(cellW, cellH);
    const totalW = COLS * cell + (COLS - 1) * GAP;
    const totalH = ROWS * cell + (ROWS - 1) * GAP;
    const offsetX = (W / dpr - totalW) / 2;
    const offsetY = (H / dpr - totalH) / 2;

    cells.forEach((c, i) => {
      c.nextChange -= dt;
      if (c.nextChange <= 0) {
        c.level = Math.random() > 0.5
          ? Math.min(4, c.level + (Math.random() > 0.5 ? 1 : -1))
          : Math.floor(Math.random() * 5);
        c.level = Math.max(0, c.level);
        c.nextChange = 600 + Math.random() * 1800;
      }

      const col = Math.floor(i / ROWS);
      const row = i % ROWS;
      const x = (offsetX + col * (cell + GAP)) * dpr;
      const y = (offsetY + row * (cell + GAP)) * dpr;
      const sz = cell * dpr;

      // Glow animation for high-level cells
      c.glow = c.level >= 3
        ? c.glow + (1 - c.glow) * 0.04
        : c.glow + (0 - c.glow) * 0.06;

      // Draw cell
      ctx.beginPath();
      const r = 3 * dpr;
      ctx.roundRect(x, y, sz, sz, r);

      const color = DARK[c.level];
      ctx.fillStyle = color;
      ctx.fill();

      // Glow overlay for active cells
      if (c.glow > 0.05 && c.level >= 3) {
        ctx.save();
        ctx.globalAlpha = c.glow * 0.4;
        const gradient = ctx.createRadialGradient(
          x + sz / 2, y + sz / 2, 0,
          x + sz / 2, y + sz / 2, sz
        );
        gradient.addColorStop(0, '#39d353');
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.roundRect(x - sz * 0.5, y - sz * 0.5, sz * 2, sz * 2, r);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(draw);
})();

// ── Copy buttons ─────────────────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;

  const text = btn.dataset.copy
    || btn.closest('.hero-install')?.querySelector('code')?.textContent
    || '';

  if (!text) return;

  navigator.clipboard.writeText(text.trim()).then(() => {
    btn.classList.add('copied');
    const prev = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = prev;
    }, 1800);
  });
});

// ── Install copy button ───────────────────────────────────
const copyInstallBtn = document.getElementById('copy-install');
if (copyInstallBtn) {
  copyInstallBtn.dataset.copy = 'npm install github-contribution-chart';
}

// ── Code tabs ─────────────────────────────────────────────
document.querySelectorAll('.code-tabs').forEach((tabGroup) => {
  const tabs = tabGroup.querySelectorAll('.tab');
  const blocks = tabGroup.nextElementSibling?.querySelectorAll?.('.code-block') || [];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      blocks.forEach((b) => b.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(tab.getAttribute('aria-controls'));
      if (target) target.classList.add('active');
    });
  });
});

// ── Demo canvas chart ─────────────────────────────────────
(function demoChart() {
  const canvas = document.getElementById('demo-canvas');
  const ctx = canvas.getContext('2d');

  const DARK_PAL = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  const LIGHT_PAL = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

  let scheme = 'dark';
  let months = 6;
  let gap = 3;
  let radius = 3;

  // Build fake calendar data spanning 12 months
  function buildCalendar() {
    const weeks = [];
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
    // Align to Sunday
    start.setDate(start.getDate() - start.getDay());

    const d = new Date(start);
    while (d <= now) {
      const week = { days: [] };
      for (let i = 0; i < 7; i++) {
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const count = d > now ? 0 : Math.random() < 0.3 ? 0
          : isWeekend ? Math.floor(Math.random() * 4)
          : Math.floor(Math.random() * 12);
        week.days.push({
          date: d.toISOString().slice(0, 10),
          count,
        });
        d.setDate(d.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }

  const allWeeks = buildCalendar();

  function filterWeeks() {
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
    return allWeeks
      .map((w) => ({ days: w.days.filter((d) => new Date(d.date) >= cutoff) }))
      .filter((w) => w.days.length > 0);
  }

  function getLevel(count, max) {
    if (count === 0 || max === 0) return 0;
    const r = count / max;
    if (r <= 0.15) return 1;
    if (r <= 0.40) return 2;
    if (r <= 0.70) return 3;
    return 4;
  }

  function getDayOfWeek(dateStr) {
    return new Date(dateStr).getDay();
  }

  function render() {
    const filtered = filterWeeks();
    const palette = scheme === 'dark' ? DARK_PAL : LIGHT_PAL;

    const max = filtered.reduce((a, w) =>
      Math.max(a, w.days.reduce((b, d) => Math.max(b, d.count), 0)), 0);

    const COLS = filtered.length;
    const ROWS = 7;

    const dpr = window.devicePixelRatio || 1;
    const containerW = canvas.parentElement.clientWidth - 56; // padding
    canvas.style.width = containerW + 'px';
    canvas.style.height = Math.ceil((containerW / COLS) * ROWS + (ROWS - 1) * gap) + 'px';
    canvas.width = containerW * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background for light mode
    if (scheme === 'light') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const cellW = (canvas.width / dpr - (COLS - 1) * gap) / COLS;
    const cellH = (canvas.height / dpr - (ROWS - 1) * gap) / ROWS;
    const cell = Math.min(cellW, cellH);

    filtered.forEach((week, wi) => {
      week.days.forEach((day) => {
        const level = getLevel(day.count, max);
        const row = getDayOfWeek(day.date);
        const x = (wi * (cell + gap)) * dpr;
        const y = (row * (cell + gap)) * dpr;
        const sz = cell * dpr;
        const r = radius * dpr;

        ctx.beginPath();
        ctx.roundRect(x, y, sz, sz, r);
        ctx.fillStyle = palette[level];
        ctx.fill();
      });
    });

    updateLegend(palette);
    updateCode();
  }

  function updateLegend(palette) {
    const container = document.getElementById('legend-cells');
    container.innerHTML = '';
    palette.forEach((color) => {
      const cell = document.createElement('div');
      cell.className = 'legend-cell';
      cell.style.background = color;
      container.appendChild(cell);
    });
  }

  function updateCode() {
    const el = document.getElementById('demo-code-output');
    el.innerHTML =
      `<span class="token-tag">&lt;GitHubContributionChart</span>\n` +
      `  <span class="token-attr">calendar</span>={calendar}\n` +
      `  <span class="token-attr">colorScheme</span>=<span class="token-string">"${scheme}"</span>\n` +
      `  <span class="token-attr">months</span>={${months}}\n` +
      `  <span class="token-attr">gap</span>={${gap}}\n` +
      `  <span class="token-attr">cellRadius</span>={${radius}}\n` +
      `<span class="token-tag">/&gt;</span>`;
  }

  // Controls
  document.querySelectorAll('.toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      scheme = btn.dataset.scheme;
      // Light mode: set chart area bg
      const area = document.getElementById('demo-chart-area');
      area.style.background = scheme === 'light' ? '#ffffff' : '';
      render();
    });
  });

  const monthsSlider = document.getElementById('ctrl-months');
  const monthsVal = document.getElementById('months-val');
  monthsSlider.addEventListener('input', () => {
    months = +monthsSlider.value;
    monthsVal.textContent = months;
    render();
  });

  const gapSlider = document.getElementById('ctrl-gap');
  const gapVal = document.getElementById('gap-val');
  gapSlider.addEventListener('input', () => {
    gap = +gapSlider.value;
    gapVal.textContent = gap;
    render();
  });

  const radiusSlider = document.getElementById('ctrl-radius');
  const radiusVal = document.getElementById('radius-val');
  radiusSlider.addEventListener('input', () => {
    radius = +radiusSlider.value;
    radiusVal.textContent = radius;
    render();
  });

  // Initial render + re-render on resize
  render();
  window.addEventListener('resize', render, { passive: true });
})();

// ── Scroll reveal ────────────────────────────────────────
(function scrollReveal() {
  const targets = [
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.usage-step'),
    ...document.querySelectorAll('.api-card'),
    document.getElementById('token-card'),
    document.getElementById('demo-wrapper'),
  ].filter(Boolean);

  targets.forEach((el) => el.classList.add('reveal'));

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => obs.observe(el));
})();
