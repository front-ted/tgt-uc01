export const swiperBeltSuitcase = new Swiper(".swiperBeltSuitcase", {
  slidesPerGroup: 3,
  slidesPerView: 3,
  spaceBetween: 50,
  speed: 3500,
  preventClicks: false,
  simulateTouch: false,
  observer: true,
  navigation: {
    nextEl: ".btn-next",
    prevEl: ".btn-prev",
  },
});
