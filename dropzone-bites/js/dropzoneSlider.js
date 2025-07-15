document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".slider-track img");
  const leftBtn = document.querySelector(".slider-arrow.left");
  const rightBtn = document.querySelector(".slider-arrow.right");

  let current = 0;

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });
  }

  leftBtn.addEventListener("click", () => {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
  });

  rightBtn.addEventListener("click", () => {
    current = (current + 1) % images.length;
    showImage(current);
  });

  showImage(current);
});
