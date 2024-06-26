// Audio play pause functions
function toggleAudio(audioId) {
  let audio = document.getElementById(audioId);

  if (audio.paused) {
      audio.play();
  } else {
      audio.pause();
      audio.currentTime = 0;
  }
}


// Functions for back to top button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  let backToTopBtn = document.getElementById("backToTopBtn");

  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      backToTopBtn.style.visibility = "visible";
  } else {
      backToTopBtn.style.visibility = "hidden";
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Nav functions

function openMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const openBtn = document.getElementById("open");
  const closeBtn = document.getElementById("close");

  mobileMenu.classList.toggle("active");

  openBtn.classList.toggle("hide-icon");
  closeBtn.classList.toggle("hide-icon");
}


// Change logo when the browser is small
function updateImgSrc() {
  const logo = document.getElementById("logo");
  let windowWidth = window.innerWidth;

  if (windowWidth < 1025) {
      logo.src = './assets/img/logo/RSLogo.webp';
  } else {
      logo.src = './assets/img/logo/RSVisionLogo.webp';
  }
}

updateImgSrc();

window.addEventListener('resize', updateImgSrc);


// ==================================
// Logic for the languages
// ==================================
const languageBtn = document.getElementById("changeLangBtn");
const languagePopup = document.getElementById("langOptions");
let language = document.getElementById("language");

let currentLanguage = "EN";
// Start loading translations immediately
loadTranslations();


languageBtn.addEventListener("click", function () {
  languagePopup.classList.toggle("active");
});

// Set the local storage
function setLanguageLocalStorage(lang) {
  localStorage.setItem("userLanguage", lang);
}

// Get the local storage
function getLanguageLocalStorage() {
  return localStorage.getItem("userLanguage");
}

let translations = null;

function loadTranslations() {
  return fetch('./assets/scripts/data.json')
    .then(resposne => {
      if (!resposne.ok) {
        throw new Error('Network response was not ok.');
      }
      return resposne.json();
    })
    .catch( err => {
      console.error('Error loading translations:', err);
      throw err;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the currentLanguage from local storage
  currentLanguage = getLanguageLocalStorage() || "en";

  // Load translation from JSON file
  loadTranslations()
      .then((loadedTranslations) => {
          translations = loadedTranslations;
          applyLanguage(currentLanguage);
      })
      .catch((error) => {
          console.error("Error loading translations:", error);
      });
});

function applyLanguage(lang) {
  currentLanguage = lang;

  setLanguageLocalStorage(lang);

  if (!translations) {
      // If translations are not loaded yet, load them first
      loadTranslations()
          .then((loadedTranslations) => {
              translations = loadedTranslations;
              applyLanguage(currentLanguage);
          })
          .catch((error) => {
              console.error("Error loading translations:", error);
          });
      return;
  }

  const lan = document.getElementsByClassName("lang");
  language.innerText = currentLanguage.toUpperCase();

  for (let i = 0; i < lan.length; i++) {
      const element = lan[i];
      const translationKey = element.getAttribute("data-translation-key");
      // Fetch translation or update content based on JSON data
      element.textContent = getTranslation(lang, translationKey);
  }

  if (languagePopup.classList.contains("active")) {
      languagePopup.classList.remove("active");
  }
}

function changeLang(lang) {
  currentLanguage = lang;
  setLanguageLocalStorage(lang);
  applyLanguage(currentLanguage);
}

function getTranslation(lang, key) {
  if (!translations || !translations[lang]) {
      return key;
  }

  const keys = key.split(".");
  let currentTranslation = translations[lang];

  // Traverse the keys to access the nested translation
  for (const k of keys) {
      if (currentTranslation[k]) {
          currentTranslation = currentTranslation[k];
      } else {
          console.warn(`Translation key '${key}' not found for language '${lang}'.`);
          return key;
      }
  }

  return currentTranslation || key;
}
