// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }

  bindEvents() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }
}

// Language Management
class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem("lang") || "ar";
    this.currentDir = localStorage.getItem("dir") || "rtl";
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang, this.currentDir);
    this.bindEvents();
  }

  applyLanguage(lang, dir) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem("lang", lang);
    localStorage.setItem("dir", dir);

    const cssLink = document.getElementById("lang-style");
    if (cssLink) {
      cssLink.href = lang === "fr" ? "css/style-ltr.css" : "css/style-rtl.css";
    }

    const currentLangBtn = document.getElementById("currentLang");
    if (currentLangBtn) {
      currentLangBtn.textContent = lang === "ar" ? "العربية" : "Français";
    }

    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { lang, dir }
    }));
  }

  bindEvents() {
    const langOptions = document.querySelectorAll(".dropdown-item");
    langOptions.forEach(option => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = option.getAttribute("data-lang");
        const dir = option.getAttribute("data-dir");
        this.applyLanguage(lang, dir);
      });
    });
  }
}


// Initialize both managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new LanguageManager();
});


// Slick Slider 
// Determine if page is RTL
document.addEventListener("DOMContentLoaded", () => {
  initSlider(document.documentElement.getAttribute("dir"));
});

document.addEventListener("languageChanged", (e) => {
  initSlider(e.detail.dir);
});


function initAllSliders() {
  const isRTL = $('html').attr('dir') === 'rtl';

  $('.slider').each(function () {
    const $slider = $(this);

    if ($slider.hasClass('slick-initialized')) {
      $slider.slick('unslick');
    }

    setTimeout(() => {
      $slider.slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        rtl: isRTL,
        autoplay: false,
        autoplaySpeed: 2000,
        arrows: false,
        dots: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }, 100);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAllSliders();
});

document.addEventListener("languageChanged", () => {
  initAllSliders();
});