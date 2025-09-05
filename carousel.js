// --- Simple, robust carousel for multiple .slider blocks ---
// Features: arrows, dots, autoplay (3–5s), pause on hover, swipe on touch,
// per-slider interval via data-interval, visibility pause, safety guards.

(function () {
  const SLIDER_SELECTOR = '.slider';
  const DEFAULT_INTERVAL = 4000; // ms (change globally if you want)

  document.querySelectorAll(SLIDER_SELECTOR).forEach(initSlider);

  function initSlider(slider) {
    const images = Array.from(slider.querySelectorAll('img'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsContainer = slider.querySelector('.dots');

    if (!images.length) return;

    // If less than 2 images, disable controls/autoplay
    const hasMultiple = images.length > 1;

    // Build dots dynamically if container exists
    let dots = [];
    if (dotsContainer && hasMultiple) {
      dotsContainer.innerHTML = '';
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          index = i;
          render();
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
      dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    }

    // State
    let index = images.findIndex(img => img.classList.contains('active'));
    if (index < 0) index = 0;

    // Helpers
    function render() {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      if (dots.length) {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      }
      if (slider.classList.contains('fill')) {
        slider.style.setProperty('--slider-bg', `url("${images[index].src}")`);
      }
    }

    function next() {
      if (!hasMultiple) return;
      index = (index + 1) % images.length;
      render();
    }

    function prev() {
      if (!hasMultiple) return;
      index = (index - 1 + images.length) % images.length;
      render();
    }

    // Wire arrows
    if (nextBtn) {
      nextBtn.type = 'button';
      nextBtn.addEventListener('click', () => {
        next();
        restartAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.type = 'button';
      prevBtn.addEventListener('click', () => {
        prev();
        restartAutoplay();
      });
    }

    // Autoplay (per-slider via data-interval="3000" or "5000")
    const intervalAttr = parseInt(slider.getAttribute('data-interval'), 10);
    const AUTOPLAY_MS = Number.isFinite(intervalAttr) ? intervalAttr : DEFAULT_INTERVAL;

    let timer = null;
    function startAutoplay() {
      if (!hasMultiple || AUTOPLAY_MS <= 0) return;
      stopAutoplay();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Pause on hover/focus (desktop)
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // Touch swipe (mobile)
    let touchStartX = 0;
    let touchDeltaX = 0;
    const SWIPE_THRESHOLD = 40;

    slider.addEventListener('touchstart', (e) => {
      if (!hasMultiple) return;
      stopAutoplay();
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!hasMultiple) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      if (!hasMultiple) return;
      if (Math.abs(touchDeltaX) > SWIPE_THRESHOLD) {
        if (touchDeltaX < 0) next(); else prev();
      }
      startAutoplay();
    });

    // Initial paint
    render();
    startAutoplay();
  }
})();
