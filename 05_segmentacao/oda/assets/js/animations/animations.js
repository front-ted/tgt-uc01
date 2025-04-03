export const fadeIn = (el, delay = 500) => {
  el.style.animationDuration = `${delay}ms`;
  el.classList.add("fadeIn");
  el.classList.remove("d-none");
  setTimeout(() => {
    el.classList.remove("d-none");
    el.classList.remove("fadeIn");
  }, delay);
};
export const fadeOut = (el, delay = 500) => {
  el.style.animationDuration = `${delay}ms`;
  el.classList.add("fadeOut");
  el.classList.remove("d-none");
  setTimeout(() => {
    el.classList.add("d-none");
    el.classList.remove("fadeOut");
  }, delay);
};
