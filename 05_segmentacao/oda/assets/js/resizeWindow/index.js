const proportionScale = (width, height) => {
  const widthScreen = window.visualViewport.width;
  const heightScreen = window.visualViewport.height;
  const proporcaoHeight = (heightScreen * 100) / height;
  const proporcaoWidth = (widthScreen * 100) / width;

  if (proporcaoHeight < proporcaoWidth) {
    return [proporcaoHeight / 100, "height", "width"];
  } else {
    return [proporcaoWidth / 100, "width", "height"];
  }
};

export const resizeBodyCadeia = (selector = ".game") => {
  const proporcao1920 = proportionScale(1920, 1080)[0];

  document.querySelector(selector).style.transform = `scale(${proporcao1920})`;
};
