/* Shared theme helpers for all static shells. */
function applyTheme(theme) {
  theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('dm_theme', theme); } catch (_) {}
  document.querySelectorAll('#themeToggle,#themeToggle2').forEach(btn => { btn.textContent = theme === 'dark' ? '☀️' : '🌙'; });
}
function initTheme() {
  let saved = 'dark';
  try { saved = localStorage.getItem('dm_theme') || saved; } catch (_) {}
  applyTheme(saved);
}
function toggleTheme() { applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
