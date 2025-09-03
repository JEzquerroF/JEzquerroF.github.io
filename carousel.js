<script>
document.querySelectorAll('.slider').forEach(slider => {
  const images = slider.querySelectorAll('img');
  const dotsContainer = slider.querySelector('.dots');
  let index = 0;

  // crear dots dinámicamente
  images.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      index = i;
      showImage(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function showImage(i) {
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    images[i].classList.add('active');
    dots[i].classList.add('active');
  }

  function nextImage() {
    index = (index + 1) % images.length;
    showImage(index);
  }

  function prevImage() {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  }

  // flechas
  slider.querySelector('.next').addEventListener('click', nextImage);
  slider.querySelector('.prev').addEventListener('click', prevImage);

  // autoplay
  setInterval(nextImage, 4000);
});
</script>
