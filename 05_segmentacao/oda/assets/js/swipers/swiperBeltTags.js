export const swiperBeltTags = new Swiper(".swiperBeltTags", {
  slidesPerView: 3,
  slidesPerGroup: 2,
  speed: 1500,
  preventClicks: false,
  slidesOffsetBefore: 100,
  simulateTouch: false,
  observer: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
