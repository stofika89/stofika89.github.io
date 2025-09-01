(() => {
const keys = new Map();
document.querySelectorAll("[data-i18n]").forEach((el) => {
const key = el.getAttribute("data-i18n");
if (key && !keys.has(key)) {

const originalText = el.textContent.trim();
keys.set(key, originalText);
}
});

const obj = {};
keys.forEach((value, key) => {
obj[key] = value;
});

const json = JSON.stringify(obj, null, 2);

console.log("Extracted data-i18n keys with original text as values:\n", json);

if (navigator.clipboard) {
navigator.clipboard.writeText(json).then(() => {
console.log(" Kulcsok az eredeti szövegekkel kimásolva a vágólapra!");
}, () => {
console.warn("Nem sikerült kimásolni a vágólapra.");
});
}
})();
