// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme(this.currentTheme)
    this.bindEvents()
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
    this.currentTheme = theme
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme(newTheme)
  }

  bindEvents() {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const themeManager = new ThemeManager()
})
