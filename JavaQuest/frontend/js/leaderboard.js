/* ═══════════════════════════════════════════════
   JavaQuest — leaderboard.js
   Features: sorted display, podium top-3,
             level filter, rank column, accuracy
═══════════════════════════════════════════════ */

const BASE_URL = "http://localhost:8081";
const TOTAL_PER_LEVEL = 10; // ✅ Fixed: was 8, now 10 (matches game)

// ── DOM ───────────────────────────────────────
const tbody      = document.getElementById("leaderboardBody");
const podium     = document.getElementById("lbPodium");
const lbEmpty    = document.getElementById("lbEmpty");
const filterBtns = document.querySelectorAll(".filter-btn");

// ── Background canvas (reuse same logic) ─────
(function initBg() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, dots;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    dots = [];
    for (let x = 0; x < W; x += 40)
      for (let y = 0; y < H; y += 40)
        dots.push({ x, y, r: Math.random() * .8 + .3, alpha: Math.random() * .4 + .1 });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(88,212,240,${d.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  resize(); draw();
})();

// ── State ─────────────────────────────────────
let allScores    = [];
let activeFilter = "all";

// ── Fetch scores ──────────────────────────────
fetch(`${BASE_URL}/api/score/scores`)
  .then(r => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  })
  .then(data => {
    allScores = data;
    render("all");
  })
  .catch(() => {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--red);font-family:var(--font-mono);font-size:.78rem;padding:24px">
      ⚠ Could not reach backend. Is the server running on port 8081?
    </td></tr>`;
  });

// ── Filter buttons ────────────────────────────
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render(activeFilter);
  });
});

// ── Render ────────────────────────────────────
function render(filter) {
  const filtered = filter === "all"
    ? [...allScores]
    : allScores.filter(s => s.level === filter);

  // Sort by score descending
  filtered.sort((a, b) => b.score - a.score);

  // ✅ Fixed: Podium now shows on ALL filters (not just "all")
  renderPodium(filtered.slice(0, 3));

  if (filtered.length === 0) {
    tbody.innerHTML = "";
    lbEmpty.classList.remove("hidden");
    return;
  }
  lbEmpty.classList.add("hidden");

  tbody.innerHTML = filtered.map((s, i) => {
    const accuracy = Math.round((s.score / TOTAL_PER_LEVEL) * 100);
    const initials = (s.playerName || "?").slice(0, 2).toUpperCase();
    const rankMedal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;
    return `
      <tr style="animation-delay:${i * 0.04}s">
        <td class="rank-cell">${rankMedal}</td>
        <td>${escHtml(s.playerName)}</td>
        <td><span class="badge-level badge-${s.level}">${s.level}</span></td>
        <td class="score-cell">${s.score}</td>
        <td style="color:var(--text-muted)">${accuracy}%</td>
      </tr>`;
  }).join("");
}

// ── Podium ────────────────────────────────────
function renderPodium(top3) {
  if (top3.length < 1) { podium.innerHTML = ""; return; }

  // Reorder: 2nd, 1st, 3rd for visual podium effect
  const ordered = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3.length === 2
    ? [top3[1], top3[0]]
    : [top3[0]];

  const originalRanks = top3.length >= 3 ? [2, 1, 3]
    : top3.length === 2 ? [2, 1] : [1];

  podium.innerHTML = ordered.map((s, i) => {
    const rank = originalRanks[i];
    const initials = (s.playerName || "?").slice(0, 2).toUpperCase();
    return `
      <div class="podium-card" data-rank="${rank}">
        <div class="podium-name">${escHtml(s.playerName)}</div>
        <div class="podium-score">${s.score}</div>
        <div class="podium-avatar">${initials}</div>
        <div class="podium-bar"><span class="podium-rank-num">${rank}</span></div>
      </div>`;
  }).join("");
}

// ── Util ──────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}