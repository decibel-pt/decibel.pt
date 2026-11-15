// Browser preference on first visit; an explicit selection takes precedence.
const supportedLanguages = ["pt", "es", "en"];
const storageKey = "decibel-language";
const languagePicker = document.getElementById("language");
const portuguese = new WeakMap();

function translatedText(element, language, attribute = "") {
  // Capture each original field before its first replacement; Portuguese lives only in HTML.
  if (!portuguese.has(element)) portuguese.set(element, {});
  const original = portuguese.get(element);
  if (!(attribute in original)) {
    original[attribute] = attribute
      ? element.getAttribute(attribute)
      : element.hasAttribute("data-translate-html")
        ? element.innerHTML
        : element.textContent;
  }
  if (language === "pt") return original[attribute];
  const suffix = attribute ? `-${attribute}` : "";
  return (
    element.getAttribute(`data-${language}${suffix}`) ??
    element.getAttribute(`data-en${suffix}`)
  );
}

function setLanguage(language) {
  if (!supportedLanguages.includes(language)) language = "en";

  document.documentElement.lang = language;
  document.querySelectorAll("[data-es], [data-en]").forEach((element) => {
    const text = translatedText(element, language);
    if (typeof text !== "string") return; // Preserve the static fallback.

    if (element.hasAttribute("data-translate-html")) {
      // Only explicitly marked headings contain trusted HTML from this page.
      element.innerHTML = text;
    } else {
      element.textContent = text;
    }
  });

  ["alt", "aria-label", "content"].forEach((attribute) => {
    document
      .querySelectorAll(`[data-es-${attribute}], [data-en-${attribute}]`)
      .forEach((element) => {
        const text = translatedText(element, language, attribute);
        if (typeof text === "string") element.setAttribute(attribute, text);
      });
  });
  languagePicker.value = language;
}

function initialLanguage() {
  try {
    const savedLanguage = localStorage.getItem(storageKey);
    if (supportedLanguages.includes(savedLanguage)) return savedLanguage;
  } catch {
    // Language switching still works when browser storage is unavailable.
  }
  const browserLanguage = (navigator.language || "en")
    .toLowerCase()
    .split(/[-_]/)[0];
  return supportedLanguages.includes(browserLanguage) ? browserLanguage : "en";
}

setLanguage(initialLanguage());
languagePicker.addEventListener("change", (event) => {
  const language = event.target.value;
  setLanguage(language);
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // The current selection still applies without persistence.
  }
});
