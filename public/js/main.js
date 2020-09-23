



TweenLite.from(".index-page .navbar-header", 0.5, {xPercent:50, scale:1.3, autoAlpha:0})

function imgError(image) {
  image.onerror = "";
  image.src = "/images/404.svg";
  return true;
}