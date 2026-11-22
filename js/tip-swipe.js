/* ═══════════════════════════════════════════════
   tip-swipe.js — смахнуть подсказку над словом свайпом влево/вправо

   Общий жест для двух подсказок: в уроках (js/lesson-render.js) и в
   ридере книг/статей (js/reader-tip.js). Карточка едет за пальцем с
   лёгким наклоном; за порогом (~70px) или после быстрого флика улетает
   в сторону и закрывается, короткий сдвиг возвращает её на место.
   Вертикальный жест не трогаем — это прокрутка (touch-action: pan-y
   у .word-tip в css/lesson.css).

   TipSwipe.attach({ active, dismiss }):
     active()       → { tip, key } открытой подсказки или null;
                      key — что именно открыто (слово): если за время
                      анимации открылось другое, его не закрываем
     dismiss(key)   — закрыть подсказку

   Zero dependencies.
   ═══════════════════════════════════════════════ */

const TipSwipe = (() => {

  const SLOP = 8;          // до этого сдвига жест ещё не определён
  const DISTANCE = 70;     // сдвиг, после которого подсказка улетает
  const FLICK = 0.5;       // px/мс — быстрый флик смахивает и раньше
  const FLICK_MIN = 30;
  const FLY_MS = 180;      // = transition у .word-tip
  const STYLE = ['translate', 'rotate', 'opacity'];

  // Клик, который браузер досылает после свайпа, не должен открыть
  // подсказку заново или нажать кнопку в ней. Слушатель на window в
  // фазе захвата срабатывает раньше всех обработчиков на document.
  let clickGuard = 0;
  let guardBound = false;
  function bindGuard() {
    if (guardBound) return;
    guardBound = true;
    window.addEventListener('click', e => {
      if (Date.now() >= clickGuard) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  function reset(tip) {
    tip.classList.remove('word-tip-dragging');
    STYLE.forEach(prop => tip.style.removeProperty(prop));
  }

  function attach({ active, dismiss }) {
    bindGuard();
    let swipe = null;

    document.addEventListener('touchstart', event => {
      swipe = null;
      const open = active();
      if (!open || event.touches.length !== 1 || !open.tip.contains(event.target)) return;
      const touch = event.touches[0];
      swipe = { ...open, x: touch.clientX, y: touch.clientY, dx: 0, at: Date.now(), dragging: false };
    }, { capture: true, passive: true });

    document.addEventListener('touchmove', event => {
      if (!swipe || active()?.key !== swipe.key) return;
      const touch = event.touches[0];
      const dx = touch.clientX - swipe.x;
      const dy = touch.clientY - swipe.y;
      if (!swipe.dragging) {
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
        if (Math.abs(dy) >= Math.abs(dx)) { swipe = null; return; }
        swipe.dragging = true;
        swipe.tip.classList.add('word-tip-dragging');
      }
      swipe.dx = dx;
      swipe.tip.style.translate = `${Math.round(dx)}px 0`;
      swipe.tip.style.rotate = `${(dx / 30).toFixed(1)}deg`;
      swipe.tip.style.opacity = String(Math.max(0.25, 1 - Math.abs(dx) / 220));
    }, { capture: true, passive: true });

    function end() {
      const current = swipe;
      swipe = null;
      if (!current?.dragging) return;
      const { tip, key, dx } = current;
      clickGuard = Date.now() + 400;
      if (active()?.key !== key) { reset(tip); return; }
      tip.classList.remove('word-tip-dragging');
      const fast = Math.abs(dx) / Math.max(1, Date.now() - current.at) > FLICK;
      if (Math.abs(dx) < DISTANCE && !(fast && Math.abs(dx) > FLICK_MIN)) {
        reset(tip);
        return;
      }
      const side = Math.sign(dx);
      tip.style.translate = `${Math.round(side * (window.innerWidth + 40))}px 0`;
      tip.style.rotate = `${side * 12}deg`;
      tip.style.opacity = '0';
      setTimeout(() => {
        if (active()?.key === key) dismiss(key);
        if (swipe?.tip !== tip) reset(tip);
      }, FLY_MS);
    }
    document.addEventListener('touchend', end, { capture: true, passive: true });
    document.addEventListener('touchcancel', end, { capture: true, passive: true });
  }

  return { attach };
})();
