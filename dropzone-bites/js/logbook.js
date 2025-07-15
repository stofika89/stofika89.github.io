function buildLogbookForm() {
  // Csak bejelentkezve és csak az add-entry hash-nél
  if (
    !window.isLoggedIn ||
    !window.location.hash.startsWith("#/logbook/add-entry")
  ) {
    console.warn(
      "Form not shown – either not logged in or not on add-entry page."
    );
    return;
  }

  const content = document.getElementById("logbook-content");
  if (!content) return;

  content.innerHTML = "";

  const form = document.createElement("form");
  form.id = "logbook-form";
  form.addEventListener("submit", (e) => e.preventDefault());

  const fields = [
    { id: "jumpDate", type: "date", label: "logbook.jumpDate" },
    { id: "location", type: "text", label: "logbook.location" },
    { id: "chuteType", type: "text", label: "logbook.chuteType" },
    { id: "planeType", type: "text", label: "logbook.plane" },
    { id: "jumpNumber", type: "number", label: "logbook.jumpNumber" },
    { id: "freefallTime", type: "number", label: "logbook.freefallTime" },
  ];

  fields.forEach(({ id, type, label }) => {
    const labelEl = document.createElement("label");
    labelEl.htmlFor = id;
    labelEl.setAttribute("data-i18n", label);

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = id;

    form.append(labelEl, input);
  });

  const labelNotes = document.createElement("label");
  labelNotes.htmlFor = "notes";
  labelNotes.setAttribute("data-i18n", "logbook.notes");

  const textarea = document.createElement("textarea");
  textarea.id = "notes";
  textarea.name = "notes";

  form.append(labelNotes, textarea);

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("data-i18n", "logbook.addEntry");

  const infoMsg = document.createElement("p");
  infoMsg.setAttribute("data-i18n", "logbook.infoMsg");
  infoMsg.textContent = "Form submission is disabled in this demo version.";

  form.appendChild(button);
  form.appendChild(infoMsg);

  content.appendChild(form);

  if (typeof updateTexts === "function") {
    updateTexts();
  }
}
