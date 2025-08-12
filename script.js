// script.js (stable)
// - działa niezależnie od momentu dołączenia skryptu
// - bezpieczne sprawdzanie elementów
// - synchronizacja flagi z biblioteką flag-icons

(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(() => {
    const $ = (id) => document.getElementById(id);

    const langSwitch = $("lang-switch");
    const flagEl = $("lang-flag");
    const btnDownload = $("btn-download");

    // Mapowanie język -> klasa flagi (flag-icons)
    const langToFlag = Object.freeze({
      en: "fi-gb", // EN → flaga UK
      de: "fi-de",
      fr: "fi-fr",
      pl: "fi-pl",
    });

    function applyLanguage(code) {
      const lang = (code || "en").toLowerCase();
      document.documentElement.lang = lang;

      // zaktualizuj flagę (jeśli element istnieje)
      if (flagEl) {
        const cls = langToFlag[lang] || "fi-gb";
        flagEl.className = `fi ${cls}`;
      }
      // TODO: w Kroku 2 dojdzie loader i18n (fetch /i18n/cv.${lang}.json)
    }

    // Inicjalizacja i nasłuchiwanie zmian
    if (langSwitch) {
      applyLanguage(langSwitch.value);
      langSwitch.addEventListener("change", (e) => {
        applyLanguage(e.target.value);
      });
    } else {
      console.warn("[cv] #lang-switch not found");
      applyLanguage("en"); // fallback, aby nie blokować reszty
    }

    // Download PDF (stub — do wdrożenia później)
    if (btnDownload) {
      btnDownload.addEventListener("click", () => {
        alert("PDF export will be added in a later step.");
      });
    }
  });
})();
