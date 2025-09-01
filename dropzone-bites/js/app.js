// Bejelentkezési állapot
window.isLoggedIn = false;

// Fordítások
let translations = {};
window.translations = translations;

function parseRouteAndFragment() {
  const raw = window.location.hash || "#/home";
  let route = raw;
  let fragment = null;

  if (raw.startsWith("#/")) {
    const secondHash = raw.indexOf("#", 2);
    if (secondHash !== -1) {
      route = raw.slice(0, secondHash);
      fragment = raw.slice(secondHash + 1);
    } else {
      route = raw;
    }
  } else if (raw.startsWith("#") && raw.length > 1) {
    route = null;
    fragment = raw.slice(1);
  }
  return { route, fragment };
}

async function loadTranslations(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    translations = await res.json();
    window.translations = translations;
    localStorage.setItem("language", lang);
  } catch (error) {
    console.error("Translation file loading failed:", error);
  }
}

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!translations[key]) return;

    if (el.placeholder !== undefined) {
      el.placeholder = translations[key];
    } else if (el.hasAttribute("alt")) {
      el.alt = translations[key];
    } else if (el.hasAttribute("title")) {
      el.title = translations[key];
    } else {
      el.textContent = translations[key];
    }
  });
}

async function loadComponent(containerId, filePath) {
  try {
    const res = await fetch(filePath);
    const html = await res.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    } else {
      console.warn(` Element with id '${containerId}' not found.`);
    }
  } catch (error) {
    console.error(` Error loading component from ${filePath}:`, error);
  }
}

async function getPageFromHash() {
  const { route } = parseRouteAndFragment();
  const hash = route || "#/home";
  const parts = hash.split("/");
  const mainPage = parts[1] || "home";
  const subPage = parts[2] || "";

  if (mainPage === "dropzones" && subPage.startsWith("dz-")) {
    const dzPath = `./pages/dropzones/${subPage}.html`;
    const dzExists = await fetch(dzPath, { method: "HEAD" })
      .then((r) => r.ok)
      .catch(() => false);
    return dzExists ? dzPath : "./pages/404.html";
  }

  if (mainPage === "logbook") {
    const shell = "./pages/logbook.html";
    const ok = await fetch(shell, { method: "HEAD" })
      .then((r) => r.ok)
      .catch(() => false);
    return ok ? shell : "./pages/404.html";
  }

  if (mainPage === "blog") return "./pages/blog.html";

  const pagePath = `./pages/${mainPage}.html`;
  const exists = await fetch(pagePath, { method: "HEAD" })
    .then((r) => r.ok)
    .catch(() => false);
  return exists ? pagePath : "./pages/404.html";
}

async function loadLogbookSubviewIfNeeded() {
  const { route } = parseRouteAndFragment();
  if (!route || !route.startsWith("#/logbook")) return;

  const parts = route.split("/");
  const sub = parts[2] || "";

  if (!sub) return;

  let map = {
    overview: "./pages/logbook/logbook-overview.html",
    stats: "./pages/logbook-stats.html",
    entries: "./pages/logbook/entries.html",
    "add-entry": "./pages/logbook/add-entry.html",
  };
  const file = map[sub];
  if (!file) return;

  const targetId = "logbook-content";
  await loadComponent(targetId, file);

  if (typeof updateTexts === "function") updateTexts();
  if (typeof updateAuthUI === "function") updateAuthUI();

  if (
    typeof window.initLogbookOverviewDemo === "function" &&
    sub === "overview"
  ) {
    try {
      window.initLogbookOverviewDemo();
    } catch (_) {}
  }
  if (typeof window.initLogbookStats === "function" && sub === "stats") {
    try {
      window.initLogbookStats();
    } catch (_) {}
  }
  if (typeof window.initLogbookEntries === "function" && sub === "entries") {
    try {
      window.initLogbookEntries();
    } catch (_) {}
  }
  if (typeof window.initLogbookAddEntry === "function" && sub === "add-entry") {
    try {
      window.initLogbookAddEntry();
    } catch (_) {}
  }

  scrollToHashTarget();
  const shell = document.getElementById("logbook-content");
  if (shell) {
    if (sub === "overview") shell.classList.add("is-wide");
    else shell.classList.remove("is-wide");
  }
}

function scrollToHashTarget() {
  const { fragment } = parseRouteAndFragment();
  const id = fragment || null;
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

async function loadSidebarIfNeeded() {
  const hash = window.location.hash;
  const pagesWithSidebar = [
    "#/recipes",
    "#/favorites",
    "#/my-recipes",
    "#/add-recipe",
    "#/dropzones",
    "#/logbook",
    "#/logbook/entries",
    "#/logbook/stats",
    "#/logbook/add-entry",
  ];

  if (pagesWithSidebar.some((p) => hash.startsWith(p))) {
    let sidebarFile = "./components/recipes-sidebar.html";
    if (hash.startsWith("#/logbook")) {
      if (!window.isLoggedIn) return;
      sidebarFile = "./components/logbook-sidebar.html";
    }

    await loadComponent("sidebar-container", sidebarFile);

    document.querySelectorAll(".auth-only").forEach((el) => {
      el.style.display = window.isLoggedIn ? "block" : "none";
    });
    document.querySelectorAll(".guest-only").forEach((el) => {
      el.style.display = window.isLoggedIn ? "none" : "block";
    });
    updateTexts();
  } else {
    const container = document.getElementById("sidebar-container");
    if (container) container.innerHTML = "";
  }
}

function loadDynamicScripts() {
  const hash = window.location.hash;

  if (hash.startsWith("#/recipes")) {
    const existing = document.getElementById("recipes-script");
    if (existing) existing.remove();

    requestAnimationFrame(() => {
      const script = document.createElement("script");
      script.src = `./js/recipes.js?t=${Date.now()}`;
      script.id = "recipes-script";
      document.body.appendChild(script);
    });
  } else if (hash.startsWith("#/logbook")) {
    const existing = document.getElementById("logbook-script");
    if (existing) existing.remove();

    requestAnimationFrame(() => {
      const script = document.createElement("script");
      script.src = `./js/logbook.js?t=${Date.now()}`;
      script.id = "logbook-script";
      document.body.appendChild(script);
      script.onload = () => {
        if (typeof buildLogbookForm === "function" && window.isLoggedIn) {
          buildLogbookForm();
        }
        loadLogbookSubviewIfNeeded();
      };
    });
  } else if (hash.startsWith("#/blog")) {
    const existing = document.getElementById("blog-script");
    if (!existing) {
      const script = document.createElement("script");
      script.src = "./js/blog.js";
      script.id = "blog-script";
      document.body.appendChild(script);
    } else {
      if (typeof handleBlogRouting === "function") {
        handleBlogRouting();
      }
    }
  } else if (hash.startsWith("#/dropzones/dz-")) {
    const existing = document.getElementById("popup-script");
    if (existing) existing.remove();

    requestAnimationFrame(() => {
      const script = document.createElement("script");
      script.src = `./js/popup.js?t=${Date.now()}`;
      script.id = "popup-script";
      document.body.appendChild(script);
    });
  }
}

async function loadPageContent() {
  const pagePath = await getPageFromHash();
  await loadComponent("app", pagePath);
  await loadSidebarIfNeeded();
  updateTexts();
  loadDynamicScripts();
  await loadLogbookSubviewIfNeeded();
  updateAuthUI();
}

// Curtain menü (mobil)
function activateCurtainMenu() {
  const hamburger = document.getElementById("hamburger-menu");
  const curtain = document.getElementById("curtain-menu");
  const closeBtn = document.getElementById("close-curtain");

  if (!hamburger || !curtain || !closeBtn) {
    return setTimeout(activateCurtainMenu, 100);
  }

  hamburger.addEventListener("click", () => curtain.classList.add("show"));
  closeBtn.addEventListener("click", () => curtain.classList.remove("show"));

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 769) {
      curtain.classList.remove("show");
    }
  });
}

// Login váltás
function updateAuthUI() {
  document.querySelectorAll(".auth-only").forEach((el) => {
    el.style.display = window.isLoggedIn ? "block" : "none";
  });
  document.querySelectorAll(".guest-only").forEach((el) => {
    el.style.display = window.isLoggedIn ? "none" : "block";
  });
}

let currentRoute = null;

// DOM betöltés után
document.addEventListener("DOMContentLoaded", async () => {
  const savedLang = localStorage.getItem("language") || "en";
  await loadTranslations(savedLang);

  await loadComponent("navbar-container", "./components/navbar.html");
  await loadComponent("footer-container", "./components/footer.html");

  activateCurtainMenu();
  updateAuthUI();

  // Nyelvváltás
  document.addEventListener("click", async (e) => {
    const flag = e.target.closest(".flag");
    if (flag) {
      const selectedLang = flag.getAttribute("data-lang");
      await loadTranslations(selectedLang);
      await loadPageContent();
    }
  });

  // Bejelentkezés gomb
  document.addEventListener("click", async (e) => {
    if (e.target.id === "button-auth") {
      window.isLoggedIn = !window.isLoggedIn;
      alert(
        `Kamu backend mód: ${
          window.isLoggedIn ? "Bejelentkezve" : "Vendégként"
        }`
      );
      await loadComponent("navbar-container", "./components/navbar.html");
      activateCurtainMenu();
      await loadPageContent();
    }
  });

  await loadPageContent();
  currentRoute = parseRouteAndFragment().route || "#/home";
});

window.addEventListener("hashchange", async () => {
  const { route, fragment } = parseRouteAndFragment();
  const wasLogbook = currentRoute && currentRoute.startsWith("#/logbook");
  const isLogbook = route && route.startsWith("#/logbook");

  if (!route) {
    scrollToHashTarget();
    return;
  }

  if (isLogbook && wasLogbook) {
    await loadLogbookSubviewIfNeeded();
    currentRoute = route;
    if (fragment) scrollToHashTarget();
    return;
  }

  if (route !== currentRoute) {
    await loadPageContent();
    currentRoute = route;
    if (fragment) scrollToHashTarget();
  } else {
    scrollToHashTarget();
  }
});
