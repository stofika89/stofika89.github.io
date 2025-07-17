console.log("popup.js betöltve");

(function initPopup() {
  const favoriteBtn = document.querySelector(".dropzone-favorite-btn");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupClose = document.getElementById("popup-close");

  if (favoriteBtn && popup && popupMessage && popupClose) {
    favoriteBtn.addEventListener("click", () => {
      if (window.isLoggedIn) {
        popupMessage.setAttribute("data-i18n", "popup.message.dev");
      } else {
        popupMessage.setAttribute("data-i18n", "popup.message.login");
      }
      if (typeof updateTexts === "function") updateTexts();
      popup.classList.remove("hidden");
    });

    popupClose.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
  } else {
    console.warn("Popup elemek nem találhatók.");
  }
})();
