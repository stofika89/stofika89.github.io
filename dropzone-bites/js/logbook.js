// Segédfüggvények
function formatSecondsToMMSS(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.round(totalSeconds % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + "m " + seconds + "s";
}

function formatSecondsToHHMM(totalSeconds) {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours + "h " + minutes + "m";
}
// Őrlap készítés
function buildLogbookForm() {
  let isOnAddEntryPage =
    window.location.hash.indexOf("#/logbook/add-entry") === 0;
  if (!window.isLoggedIn || !isOnAddEntryPage) {
    return;
  }

  let logbookContentContainer = document.getElementById("logbook-content");
  if (!logbookContentContainer) {
    return;
  }

  logbookContentContainer.innerHTML = "";

  let formElement = document.createElement("form");
  formElement.id = "logbook-form";
  formElement.addEventListener("submit", function (evt) {
    evt.preventDefault();
  });

  let fieldDefinitions = [
    { id: "jumpDate", type: "date", labelKey: "logbook.jumpDate" },
    { id: "location", type: "text", labelKey: "logbook.location" },
    { id: "chuteType", type: "text", labelKey: "logbook.chuteType" },
    { id: "planeType", type: "text", labelKey: "logbook.plane" },
    { id: "jumpNumber", type: "number", labelKey: "logbook.jumpNumber" },
    { id: "freefallTime", type: "number", labelKey: "logbook.freefallTime" },
  ];

  for (let i = 0; i < fieldDefinitions.length; i++) {
    let oneField = fieldDefinitions[i];

    let labelEl = document.createElement("label");
    labelEl.htmlFor = oneField.id;
    labelEl.setAttribute("data-i18n", oneField.labelKey);

    let inputEl = document.createElement("input");
    inputEl.type = oneField.type;
    inputEl.id = oneField.id;
    inputEl.name = oneField.id;

    formElement.appendChild(labelEl);
    formElement.appendChild(inputEl);
  }

  let notesLabel = document.createElement("label");
  notesLabel.htmlFor = "notes";
  notesLabel.setAttribute("data-i18n", "logbook.notes");

  let notesTextarea = document.createElement("textarea");
  notesTextarea.id = "notes";
  notesTextarea.name = "notes";

  formElement.appendChild(notesLabel);
  formElement.appendChild(notesTextarea);

  let addButton = document.createElement("button");
  addButton.type = "button";
  addButton.setAttribute("data-i18n", "logbook.addEntry");

  let infoParagraph = document.createElement("p");
  infoParagraph.setAttribute("data-i18n", "logbook.infoMsg");
  infoParagraph.textContent =
    "Form submission is disabled in this demo version.";

  formElement.appendChild(addButton);
  formElement.appendChild(infoParagraph);

  logbookContentContainer.appendChild(formElement);

  if (typeof window.updateTexts === "function") {
    window.updateTexts();
  }
}

// Demo a logbookhoz
function initLogbookOverviewDemo() {
  let overviewRoot = document.getElementById("logbook-overview");
  if (!overviewRoot) {
    return false;
  }

  let demoData = {
    profile: {
      name: "Stofi",
      license: "B",
      totalJumps: 128,
      freefallTotalSec: 8 * 3600 + 12 * 60 + 30,
      lastJump: "2025-08-10",
      homeDZ: "Pink Klatovy",
    },
    equipment: {
      container: "Javelin J4",
      main: "Sabre2 170",
      reserve: "PD Optimum 176",
      aad: "CYPRES 2",
      wingLoading: 1.05,
    },
    aircraft: [
      { type: "Cessna 182", count: 54 },
      { type: "PAC750XL", count: 38 },
      { type: "Skyvan", count: 24 },
      { type: "C-208 Caravan", count: 12 },
    ],
    jumps: [
      {
        date: "2025-08-10",
        dz: "Skydive Pink Klatovy",
        aircraft: "Skyvan",
        exitAlt: 12500,
        freefallSec: 55,
        canopyMin: 5.0,
        exitType: "Tracking",
        notes: "3-way track, clean breakoff.",
      },
      {
        date: "2025-08-03",
        dz: "Skydive Wiener Neustadt",
        aircraft: "C-208 Caravan",
        exitAlt: 13000,
        freefallSec: 60,
        canopyMin: 5.5,
        exitType: "Solo FS",
        notes: "Practice turns, good arch.",
      },
      {
        date: "2025-07-21",
        dz: "Flachau Dropzone (demo)",
        aircraft: "Cessna 182",
        exitAlt: 10000,
        freefallSec: 35,
        canopyMin: 6.0,
        exitType: "Hop-n-pop",
        notes: "Opening at 4,500 ft.",
      },
      {
        date: "2025-07-05",
        dz: "Skydive Pink Klatovy",
        aircraft: "PAC750XL",
        exitAlt: 13500,
        freefallSec: 62,
        canopyMin: 5.2,
        exitType: "2-way FS",
        notes: "Docked twice.",
      },
    ],
    best: { highestAlt: 13500 },
  };

  let statTotalJumps = document.getElementById("stat-totalJumps");
  if (statTotalJumps) {
    statTotalJumps.textContent = demoData.profile.totalJumps;
  }

  let statTotalFF = document.getElementById("stat-totalFF");
  if (statTotalFF) {
    statTotalFF.textContent = formatSecondsToHHMM(
      demoData.profile.freefallTotalSec
    );
  }

  let statLastJump = document.getElementById("stat-lastJump");
  if (statLastJump) {
    let lastJumpDate = new Date(demoData.profile.lastJump).toLocaleDateString(
      "hu-HU"
    );
    statLastJump.textContent = lastJumpDate;
  }

  let statHighestAlt = document.getElementById("stat-highestAlt");
  if (statHighestAlt) {
    statHighestAlt.textContent =
      demoData.best.highestAlt.toLocaleString() + " ft";
  }

  let recentCardsContainer = document.getElementById("recent-cards");
  if (recentCardsContainer) {
    recentCardsContainer.innerHTML = "";
    for (let i = 0; i < demoData.jumps.length; i++) {
      let oneJump = demoData.jumps[i];

      let card = document.createElement("article");
      card.className = "entry-card";

      let title = document.createElement("h3");
      title.setAttribute("style", "color:#f7e488;margin-bottom:.25rem;");
      let niceDate = new Date(oneJump.date).toLocaleDateString("hu-HU");
      title.textContent = niceDate + " · " + oneJump.dz;

      let meta = document.createElement("div");
      meta.className = "entry-meta";

      let m1 = document.createElement("span");
      m1.innerHTML = "<strong>Aircraft:</strong> " + oneJump.aircraft;

      let m2 = document.createElement("span");
      m2.innerHTML =
        "<strong>Exit:</strong> " + oneJump.exitAlt.toLocaleString() + " ft";

      let m3 = document.createElement("span");
      m3.innerHTML =
        "<strong>Freefall:</strong> " +
        formatSecondsToMMSS(oneJump.freefallSec);

      let m4 = document.createElement("span");
      m4.innerHTML =
        "<strong>Canopy:</strong> " + oneJump.canopyMin.toFixed(1) + " min";

      let m5 = document.createElement("span");
      m5.innerHTML = "<strong>Type:</strong> " + oneJump.exitType;

      meta.appendChild(m1);
      meta.appendChild(m2);
      meta.appendChild(m3);
      meta.appendChild(m4);
      meta.appendChild(m5);

      let notesP = document.createElement("p");
      notesP.className = "entry-notes";
      notesP.textContent = oneJump.notes;

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(notesP);

      recentCardsContainer.appendChild(card);
    }
  }

  let aircraftList = document.getElementById("aircraft-list");
  if (aircraftList) {
    aircraftList.innerHTML = "";
    for (let a = 0; a < demoData.aircraft.length; a++) {
      let planeItem = demoData.aircraft[a];
      let li = document.createElement("li");
      li.style.padding = ".25rem 0";
      li.innerHTML =
        "<strong>" +
        planeItem.type +
        "</strong> — " +
        planeItem.count +
        " jumps";
      aircraftList.appendChild(li);
    }
  }

  let eqContainer = document.getElementById("eq-container");
  if (eqContainer) {
    eqContainer.textContent = demoData.equipment.container;
  }

  let eqMain = document.getElementById("eq-main");
  if (eqMain) {
    eqMain.textContent = demoData.equipment.main;
  }

  let eqReserve = document.getElementById("eq-reserve");
  if (eqReserve) {
    eqReserve.textContent = demoData.equipment.reserve;
  }

  let eqAad = document.getElementById("eq-aad");
  if (eqAad) {
    eqAad.textContent = demoData.equipment.aad;
  }

  let eqWL = document.getElementById("eq-wingLoading");
  if (eqWL) {
    eqWL.textContent = demoData.equipment.wingLoading.toFixed(2);
  }

  if (typeof window.updateTexts === "function") {
    window.updateTexts();
  }

  // --- Aircraft Usage chart (Chart.js) ---
  let chartCanvas = document.getElementById("aircraftChart");
  if (chartCanvas && window.Chart) {
    if (
      window.aircraftChartInstance &&
      typeof window.aircraftChartInstance.destroy === "function"
    ) {
      window.aircraftChartInstance.destroy();
    }

    let ctx = chartCanvas.getContext("2d");
    window.aircraftChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: demoData.aircraft.map((a) => a.type),
        datasets: [
          {
            label: "Jumps",
            data: demoData.aircraft.map((a) => a.count),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      },
    });
  }

  return true;
}

// ===== EGYSZERŰ ROUTER-KAPCSOLÁS =====
function runLogbookByHash() {
  let hasOverviewHost = !!document.getElementById("logbook-overview");
  if (hasOverviewHost) {
    initLogbookOverviewDemo();
  }

  let isOnAddEntryPage =
    window.location.hash.indexOf("#/logbook/add-entry") === 0;
  let formAlreadyExists = !!document.getElementById("logbook-form");
  if (isOnAddEntryPage && window.isLoggedIn && !formAlreadyExists) {
    buildLogbookForm();
  }
}

window.addEventListener("DOMContentLoaded", runLogbookByHash);
window.addEventListener("hashchange", runLogbookByHash);

// ===== TÚLBIZTOSÍTOTT AUTO-MOUNT (SPA-hoz) =====
(function startWatchingLogbookHostCarefully() {
  let targetHashWeCareAbout = "#/logbook/add-entry";
  let hostElementId = "logbook-content";
  let sentinelFormId = "logbook-form";
  let rebuildTimeoutId = null;
  let hostContentObserver = null;

  function scheduleFormRebuildSoon() {
    if (rebuildTimeoutId) {
      clearTimeout(rebuildTimeoutId);
    }
    rebuildTimeoutId = setTimeout(tryToBuildForm, 50);
  }

  function waitUntilElementExists(elementId, onFound, timeoutMs) {
    let startedAt = Date.now();
    let intervalId = setInterval(function () {
      let el = document.getElementById(elementId);
      let timedOut = Date.now() - startedAt > timeoutMs;
      if (el) {
        clearInterval(intervalId);
        onFound();
      } else if (timedOut) {
        clearInterval(intervalId);
      }
    }, 50);
  }

  function tryToBuildForm() {
    let onRightHash = window.location.hash.indexOf(targetHashWeCareAbout) === 0;
    if (!onRightHash) {
      return;
    }
    if (!window.isLoggedIn) {
      return;
    }

    let hostNow = document.getElementById(hostElementId);
    if (!hostNow) {
      waitUntilElementExists(
        hostElementId,
        function () {
          actuallyBuildFormIfMissing();
        },
        7000
      );
      return;
    }

    actuallyBuildFormIfMissing();
  }

  function actuallyBuildFormIfMissing() {
    let host = document.getElementById(hostElementId);
    if (!host) {
      return;
    }

    let formExists = !!document.getElementById(sentinelFormId);
    if (formExists) {
      return;
    }

    setTimeout(function () {
      let hostStillHere = document.getElementById(hostElementId);
      let formStillMissing = !document.getElementById(sentinelFormId);
      if (hostStillHere && formStillMissing) {
        try {
          buildLogbookForm();
        } catch (ignore) {}
      }
    }, 0);
  }

  function startObservingHostForOverwrites() {
    let host = document.getElementById(hostElementId);
    if (!host) {
      return;
    }

    if (hostContentObserver) {
      hostContentObserver.disconnect();
    }

    hostContentObserver = new MutationObserver(function () {
      let correctHash =
        window.location.hash.indexOf(targetHashWeCareAbout) === 0;
      let loggedIn = !!window.isLoggedIn;
      let formGone = !document.getElementById(sentinelFormId);
      if (correctHash && loggedIn && formGone) {
        scheduleFormRebuildSoon();
      }
    });

    hostContentObserver.observe(host, { childList: true, subtree: false });
  }

  window.addEventListener("DOMContentLoaded", function () {
    scheduleFormRebuildSoon();

    let globalObserver = new MutationObserver(function () {
      let hostAppeared = !!document.getElementById(hostElementId);
      if (hostAppeared) {
        startObservingHostForOverwrites();
        globalObserver.disconnect();
      }
    });

    globalObserver.observe(document, { childList: true, subtree: true });
  });

  window.addEventListener("hashchange", function () {
    let weCare = window.location.hash.indexOf(targetHashWeCareAbout) === 0;
    if (weCare) {
      scheduleFormRebuildSoon();
      setTimeout(startObservingHostForOverwrites, 0);
    }
  });

  let alreadyThereAndLoggedIn =
    window.location.hash.indexOf(targetHashWeCareAbout) === 0 &&
    !!window.isLoggedIn;

  if (alreadyThereAndLoggedIn) {
    scheduleFormRebuildSoon();
    setTimeout(startObservingHostForOverwrites, 0);
  }
})();
