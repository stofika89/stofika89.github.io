let translations = {};

async function loadTranslations(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    translations = await res.json();
    updateTexts();
    localStorage.setItem("language", lang);
  } catch (error) {
    console.error("Translation file loading failed:", error);
  }
}

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("language");
  const browserLang = (navigator.language || "en").slice(0, 2);
  const initialLang = savedLang || (browserLang === "hu" ? "hu" : "en");

  loadTranslations(initialLang);

  document.querySelectorAll(".flag").forEach((flag) => {
    flag.addEventListener("click", () => {
      const selectedLang = flag.getAttribute("data-lang");
      loadTranslations(selectedLang);
    });
  });
});
