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

    // تحديث نص الزر (لو موجود)
    const currentLangBtn = document.getElementById("currentLang");
    if (currentLangBtn) {
      currentLangBtn.textContent = lang === "ar" ? "العربية" : "Français";
    }
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
