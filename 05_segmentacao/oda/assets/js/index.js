// Optei pela programação em modulos para organização e reutilização em códigos futuros
import { resizeBodyCadeia } from "./resizeWindow/index.js";
import { fadeIn, fadeOut } from "./animations/animations.js";
import { tags } from "./tags/index.js";
import { suitcases } from "./suitcases/index.js";
import { swiperBeltTags } from "./swipers/swiperBeltTags.js";
import { swiperBeltSuitcase } from "./swipers/swiperBeltSuitcase.js";
import { endGame, negative, positive } from "./feedback/index.js";

window.addEventListener("DOMContentLoaded", (e) => {
  resizeBodyCadeia();
  window.addEventListener("resize", (e) => {
    resizeBodyCadeia();
  });

  // Container importantes para o jogo e lógica
  const intro = document.querySelector(".intro");
  const airport = document.querySelector(".airport");
  const txtInfo = document.querySelector(".head .stewardess .txt");
  const btnInit = document.querySelector(".btn-init") ?? null;
  const beltTags = airport.querySelector(".swiperBeltTags");
  const beltSuitcase = airport.querySelector(".swiperBeltSuitcase");
  const popUpFeedback = document.querySelector("#feedback");
  const btn = popUpFeedback.querySelector(".btn-continue");
  const btnsNavigation = document.querySelector(".btns-endGame");
  const btnReset = document.querySelector(".btn-resetGame");
  const btnFullscreen = document.querySelector(".btn-fullscreen");
  const btnInfo = document.querySelector(".btn-info");

  // Pré-carregar os audios para ter menos delay
  const audioOk = new Audio("./assets/audios/acerto.mp3");
  const audioError = new Audio("./assets/audios/erro.mp3");
  const audioBelt = new Audio("./assets/audios/conveyor-belt.mp3");

  // Variáveis de controle para animações
  let counterFadein = 3;
  let gameInit = false;

  // Delay para animações
  const delayAnimation = 500;

  // Aplicação do som de esteira para a esteira de malas
  swiperBeltSuitcase.on("slideChange", function () {
    if (!audioBelt.ended) audioBelt.pause();
    audioBelt.play();
    setTimeout(() => audioBelt.pause(), 3000);
  });

  // Popula o carousel de Tags
  if (beltTags) {
    tags.forEach((t) => {
      beltTags.querySelector(".swiper-wrapper").insertAdjacentHTML(
        "beforeend",
        `
            <div class="swiper-slide" data-id="${t.id}">
              <img src="${t.img}" class="tagImg"  />
              <span class="txt">${t.txt}</span>
            </div>
          `
      );
    });
  }

  // Função para carregar as respostas para o final do jogo
  const chargeSolutions = () => {
    fadeOut(beltSuitcase, delayAnimation);
    if (beltSuitcase) {
      beltSuitcase.querySelector(".swiper-wrapper").innerHTML = "";

      suitcases.forEach((s) => {
        beltSuitcase.querySelector(".swiper-wrapper").insertAdjacentHTML(
          "beforeend",
          `
              <div class="swiper-slide" style="background-image: url('${
                s.img
              }');">
                <div class="containerTag suitcase0${
                  s.suitcaseID
                } rotateTag" data-id="${s.id}">
                  <img src="${
                    tags.find(({ id }) => id === parseInt(s.answer)).img
                  }" class="tagImg" />
                </div>
                <div class="containerTxt d-none">
                  <span class="txt">${s.txt}</span>
                </div>
              </div>
            `
        );
      });
      swiperBeltSuitcase.update();
      const newsTxt = document.querySelectorAll(".containerTxt");
      fadeIn(beltSuitcase, delayAnimation);
      newsTxt.forEach((ct) => fadeIn(ct, delayAnimation));
    }
  };

  // Popula o carousel de malas
  if (beltSuitcase) {
    suitcases.forEach((s) => {
      beltSuitcase.querySelector(".swiper-wrapper").insertAdjacentHTML(
        "beforeend",
        `
            <div class="swiper-slide" style="background-image: url('${s.img}');">
              <div class="containerTag suitcase0${s.suitcaseID}" data-id="${s.id}">
                <img src="./assets/imgs/tags/tag_vazia.png" class="tagImg" />
              </div>
              <div class="containerTxt d-none">
                <span class="txt">${s.txt}</span>
              </div>
            </div>
          `
      );
    });
  }
  swiperBeltSuitcase.update();

  // Containers das malas para controle do slot da tag e aparição dos textos
  const containersTxt = document.querySelectorAll(".containerTxt");
  const containersTag = document.querySelectorAll(".containerTag");

  // Executa a troca de fase
  if (btnInit)
    btnInit.addEventListener("click", (e) => {
      e.preventDefault();
      if (intro && !gameInit) {
        gameInit = true;
        fadeOut(intro, delayAnimation);
        fadeOut(btnFullscreen, delayAnimation);
        setTimeout(() => {
          fadeIn(airport, delayAnimation);
          fadeIn(btnFullscreen, delayAnimation);
        }, delayAnimation);
        setTimeout(() => {
          swiperBeltSuitcase.slideNext();
          for (let i = 0; i < counterFadein; i++) {
            const delayI = i > 0 ? 2000 + delayAnimation * i : 2000;
            setTimeout(() => fadeIn(containersTxt[i]), delayI);
          }
        }, 1000);
      } else {
        fadeOut(intro, delayAnimation);
        fadeIn(airport, delayAnimation);
      }
    });

  // Gravando os containers para usar na Lib Dragula
  const containers = [
    document.querySelector(".swiperBeltTags .swiper-wrapper"),
  ];
  containersTag.forEach((ct) => containers.push(ct));

  // Variáveis de controle para mudança de "Fases"
  let counter = 0;
  let endGameCounter = 0;
  let bool = false;

  // Inicialização da Lib Dragula
  dragula(containers, {
    revertOnSpill: true,
    direction: "vertical",
    accepts: (el, target, source, sibling) => {
      const id = el.dataset.id;
      bool = false;
      const answer = suitcases.find(({ answer }) => answer === id).id;
      if (target.dataset.id == answer) {
        bool = true;
        return true;
      } else {
        return false;
      }
    },
  })
    .on("drop", (el, source) => {
      if (bool) {
        el.remove();
        source
          .querySelector(".tagImg")
          .setAttribute("src", "./assets/imgs/tags/tag_ok.png");

        audioOk.load();
        audioOk.play();
        counter++;
        if (counter == 3) {
          counter = 0;
          counterFadein += 3;
          endGameCounter++;
          const txt = popUpFeedback.querySelector(".txt");
          txt.innerHTML = positive;
          txt.classList.add("positive");
          fadeIn(popUpFeedback, delayAnimation);
          btn.setAttribute("data-action", "nextFase");
        }
        if (endGameCounter == 4) {
          const txt = popUpFeedback.querySelector(".txt");
          txt.innerHTML = endGame;
          txt.classList.add("endGame");
          fadeIn(popUpFeedback, delayAnimation);
          btn.setAttribute("data-action", "endGame");
        }
      }
    })
    .on("cancel", (el, container, source) => {
      audioError.load();
      audioError.play();
      const txt = popUpFeedback.querySelector(".txt");
      txt.innerHTML = negative;
      txt.classList.add("negative");
      fadeIn(popUpFeedback, delayAnimation);
      btn.setAttribute("data-action", "continue");
    });

  // Função para o botão dos feedbacks, controle de redirecionamento para estado correto do jogo
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const op = btn.dataset.action;

    switch (op) {
      case "continue":
        fadeOut(popUpFeedback, delayAnimation);
        break;
      case "nextFase":
        fadeOut(popUpFeedback, delayAnimation);
        swiperBeltSuitcase.slideNext();

        let j = 0;
        for (let i = counterFadein - 3; i < counterFadein; i++) {
          const delayI = j > 0 ? 2000 + delayAnimation * j : 2000;
          setTimeout(() => fadeIn(containersTxt[i]), delayI);
          j++;
        }
        break;
      case "endGame":
        txtInfo.innerHTML = "Navegue <br /> pela esteira";
        fadeOut(popUpFeedback, delayAnimation);

        fadeOut(airport, delayAnimation);
        setTimeout(() => fadeIn(airport, delayAnimation), delayAnimation);
        fadeIn(airport, delayAnimation);
        fadeOut(beltTags, delayAnimation);
        fadeIn(btnReset, delayAnimation);
        fadeIn(btnsNavigation, delayAnimation);

        chargeSolutions();
        break;
      default:
        fadeOut(popUpFeedback, delayAnimation);
        break;
    }
    setTimeout(() => {
      popUpFeedback.querySelector(".txt").classList.remove("positive");
      popUpFeedback.querySelector(".txt").classList.remove("negative");
      popUpFeedback.querySelector(".txt").classList.remove("endGame");
    }, 1000);
  });

  // Botão para resetar o jogo
  btnReset.addEventListener("click", (e) => {
    location.reload();
  });

  // Botão para função de fullscreen
  btnFullscreen.addEventListener("click", (e) => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  });

  // Botão para voltar a tela de início com a instrução do jogo sem reiniciar o jogo em si
  btnInfo.addEventListener("click", (e) => {
    fadeOut(airport, delayAnimation);
    fadeIn(intro, delayAnimation);
  });
});
