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

    const slidesToShow = parseInt($slider.data('slides-to-show')) || 4;
    const slidesToScroll = parseInt($slider.data('slides-to-scroll')) || slidesToShow;

    setTimeout(() => {
      $slider.slick({
        slidesToShow,
        slidesToScroll,
        rtl: isRTL,
        autoplay: false,
        autoplaySpeed: 2000,
        arrows: false,
        dots: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: Math.min(2, slidesToShow),
              slidesToScroll: Math.min(2, slidesToScroll)
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














const group = document.getElementById("type-group");
const localContent = document.getElementById("local-content");
const foreignContent = document.getElementById("foreign-content");
const parentOptionCount = document.getElementById("parent-option__count");

const formStep1 = document.getElementById("form-step1");
const formStep2 = document.getElementById("form-step2");
const formStep3 = document.getElementById("form-step3");

const step1 = document.getElementById("step1-egy");
const step2 = document.getElementById("step2-egy");
const step3 = document.getElementById("step3-egy");

const sendButton = document.querySelector("#form-step1 button[type='submit']");
const verifyButton = document.querySelector("#form-step2 button[type='submit']");
const registerButton = document.querySelector("#form-step3 button[type='submit']");

const show = (el) => el.classList.remove("d-none");
const hide = (el) => el.classList.add("d-none");
const markInvalid = (input, invalid) => input.classList.toggle("is-invalid", invalid);

let stepCounter = 1;
const counterEl = document.getElementById("counter");

const egyptianCount = document.getElementById("egyptianCount");
const foreignCount = document.getElementById("foreignCount");

function updateCounter(value) {
  stepCounter = value;
  counterEl.textContent = stepCounter;
}

function resetCounter() {
  stepCounter = 1;
  counterEl.textContent = stepCounter;
}

group.addEventListener("change", (e) => {
  if (e.target.name === "type") {
    resetCounter();

    if (e.target.value === "local") {
      localContent.classList.remove("d-none");
      foreignContent.classList.add("d-none");
      egyptianCount.classList.remove("d-none");
      foreignCount.classList.add("d-none");
    } else if (e.target.value === "foreign") {
      foreignContent.classList.remove("d-none");
      localContent.classList.add("d-none");
      foreignCount.classList.remove("d-none");
      egyptianCount.classList.add("d-none");
    }
  }
});

/*** ------- Step1 ------- ***/
const nationalId = {
  input: document.getElementById("nationalId"),
  errors: {
    required: document.getElementById("id-required"),
    length: document.getElementById("id-length"),
    exists: document.getElementById("id-exists")
  },
  touched: false
};

const mobile = {
  input: document.getElementById("mobileNumber2"),
  errors: {
    required: document.getElementById("mobile-required"),
    incomplete: document.getElementById("mobile-incomplete")
  },
  touched: false
};

function isNationalIdValid(value) {
  if (!value) return "required";
  if (!/^\d{14}$/.test(value)) return "length";
  if (value === "12345678901234") return "exists"; // مثال
  return null;
}

function isMobileValid(value) {
  if (!value) return "required";
  if (value.length < 10) return "incomplete";
  return null;
}

function validateNationalId() {
  const value = nationalId.input.value.trim();
  const error = isNationalIdValid(value);

  Object.values(nationalId.errors).forEach(hide);
  markInvalid(nationalId.input, !!error);

  if (error && nationalId.touched) show(nationalId.errors[error]);
  return !error;
}

function validateMobile() {
  const digitsOnly = mobile.input.value.replace(/\D/g, "");
  if (mobile.input.value !== digitsOnly) mobile.input.value = digitsOnly;

  const error = isMobileValid(digitsOnly);

  Object.values(mobile.errors).forEach(hide);
  markInvalid(mobile.input, !!error);

  if (error && mobile.touched) show(mobile.errors[error]);
  return !error;
}

function validateFormStep1() {
  const idOk = validateNationalId();
  const mobOk = validateMobile();
  sendButton.disabled = !(idOk && mobOk);
  return idOk && mobOk;
}

// Events step1
[nationalId, mobile].forEach((field) => {
  field.input.addEventListener("blur", () => {
    field.touched = true;
    validateFormStep1();
  });
  field.input.addEventListener("input", validateFormStep1);
});

formStep1.addEventListener("submit", (e) => {
  e.preventDefault();
  nationalId.touched = mobile.touched = true;
  if (validateFormStep1()) {
    step1.classList.add("d-none");
    step2.classList.remove("d-none");
    updateCounter(2);
    egyptianCount.classList.remove("d-none");
    foreignCount.classList.add("d-none");
  }
});

/*** ------- Step2 ------- ***/
const otpInput = document.getElementById("otpCode");
const otpError = document.querySelector(".text-error__otp");
otpInput.touched = false;

function isOtpValid(value) {
  if (!value) return "failed";
  if (!/^\d{4}$/.test(value)) return "failed";
  return null;
}

function validateOtp() {
  const digitsOnly = otpInput.value.replace(/\D/g, "");
  if (otpInput.value !== digitsOnly) otpInput.value = digitsOnly;

  const error = isOtpValid(digitsOnly);

  hide(otpError);
  markInvalid(otpInput, !!error);

  if (error && otpInput.touched) show(otpError);

  verifyButton.disabled = !!error;
  return !error;
}

otpInput.addEventListener("blur", () => {
  otpInput.touched = true;
  validateOtp();
});
otpInput.addEventListener("input", validateOtp);

formStep2.addEventListener("submit", (e) => {
  e.preventDefault();
  otpInput.touched = true;
  if (!validateOtp()) {
    otpInput.focus();
  } else {
    step2.classList.add("d-none");
    step3.classList.remove("d-none");
    updateCounter(3);
  }
});

verifyButton.disabled = true;

/*** ------- Step3 ------- ***/
const firstName = {
  input: document.getElementById("firstName"),
  error: document.getElementById("firstNameEgyptian-error"),
  touched: false
};

const middleName = {
  input: document.getElementById("middleName"),
  error: document.getElementById("middleNameEgyptian-error"),
  touched: false
};

const lastName = {
  input: document.getElementById("lastName"),
  error: document.getElementById("lastNameEgyptian-error"),
  touched: false
};

const idUpload = {
  input: document.getElementById("IDUpload"),
  error: document.getElementById("idEgyptian-error"),
  touched: false
};

const governorateResidence = {
  input: document.getElementById("governorateResidence"),
  error: document.getElementById("govResidence-error"),
  touched: false
};

function validateEgyptianField(field) {
  let valid = true;

  if (field.input.type === "file") {
    valid = field.input.files && field.input.files.length > 0;
  } else {
    valid = !!field.input.value.trim();
  }

  if (!valid && field.touched) {
    show(field.error);
    markInvalid(field.input, true);
  } else {
    hide(field.error);
    markInvalid(field.input, false);
  }
  return valid;
}

function validateStep3Egyptian() {
  let valid = true;
  valid &= validateEgyptianField(firstName);
  valid &= validateEgyptianField(middleName);
  valid &= validateEgyptianField(lastName);
  valid &= validateEgyptianField(idUpload);
  valid &= validateEgyptianField(governorateResidence);

  registerButton.disabled = !valid;
  return !!valid;
}

[firstName, middleName, lastName, governorateResidence, idUpload].forEach((field) => {
  field.input.addEventListener("blur", () => {
    field.touched = true;
    validateEgyptianField(field);
    validateStep3Egyptian();
  });
  field.input.addEventListener("input", () => {
    if (field.touched) {
      validateEgyptianField(field);
      validateStep3Egyptian();
    }
  });
});

idUpload.input.addEventListener("change", () => {
  idUpload.touched = true;
  validateStep3Egyptian();
});

formStep3.addEventListener("submit", (e) => {
  e.preventDefault();
  [firstName, middleName, lastName, governorateResidence, idUpload].forEach(f => f.touched = true);

  if (validateStep3Egyptian()) {
    step3.classList.add("d-none");
    document.getElementById("step4-egy").classList.remove("d-none");
    parentOptionCount.classList.add("d-none");
  } else {
    validateStep3Egyptian();
  }
});

registerButton.disabled = true;







const showError = (el) => el.classList.remove("d-none");
const hideError = (el) => el.classList.add("d-none");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fields = {
  email: {
    input: document.getElementById("Email"),
    errors: {
      required: document.getElementById("emailRequired"),
      format: document.getElementById("emailError")
    },
    touched: false,
    validate(value) {
      if (!value.trim()) return "required";
      if (!emailRegex.test(value)) return "format";
      return null;
    }
  },
  passport: {
    input: document.getElementById("Passport"),
    errors: {
      required: document.getElementById("passportRequired")
    },
    touched: false,
    validate(value) {
      if (!value.trim()) return "required";
      return null;
    }
  },
  nationality: {
    input: document.getElementById("nationality"),
    errors: {
      required: document.getElementById("nationalityRequired")
    },
    touched: false,
    validate(value) {
      if (!value || value === "Select Nationality") return "required";
      return null;
    }
  }
};

const formStep1_Foreign = document.getElementById("form-step1_Foreign");
const step1Btn = formStep1_Foreign.querySelector("button[type=submit]");

// Validate single field
function validateForeignField(field) {
  const value = field.input.value;
  const errorType = field.validate(value);

  // Hide all errors
  Object.values(field.errors).forEach(hideError);

  if (errorType && field.touched) {
    showError(field.errors[errorType]);
    return false;
  }
  return !errorType;
}

// Validate whole form
function validateForm() {
  let valid = true;
  for (const key in fields) {
    if (!validateForeignField(fields[key])) valid = false;
  }
  step1Btn.disabled = !valid;
}

for (const key in fields) {
  const field = fields[key];

  field.input.addEventListener("blur", () => {
    field.touched = true;
    validateForeignField(field);
    validateForm();
  });

  field.input.addEventListener("input", () => {
    validateForeignField(field);
    validateForm();
  });
}

// Prevent submit if invalid
formStep1_Foreign.addEventListener("submit", (e) => {
  e.preventDefault();
  validateForm();

  if (!step1Btn.disabled) {
    document.getElementById("step1-Foreign").classList.add("d-none");
    document.getElementById("step2-Foreign").classList.remove("d-none");
    stepCounter = 2;
    counterEl.textContent = stepCounter;
  }
});

// OTP Validation (Step 2)
const formStep2_Foreign = document.getElementById("form-step2_Foreign");
const otpInput_Foreign = document.getElementById("otpCode_Foreign");
const otpError_Foreign = document.getElementById("otpRequired");
const otpBtn_Foreign = formStep2_Foreign.querySelector("button[type=submit]");

otpInput_Foreign.touched = false;

function isOtpForeignValid(value) {
  if (!value) return "failed";
  if (!/^\d{4}$/.test(value)) return "failed"; // 4 Digits Only 
  return null;
}

function validateOtpForeign() {
  const digitsOnly = otpInput_Foreign.value.replace(/\D/g, "");
  if (otpInput_Foreign.value !== digitsOnly) {
    otpInput_Foreign.value = digitsOnly;
  }

  const error = isOtpForeignValid(digitsOnly);

  otpError_Foreign.classList.add("d-none");
  otpInput_Foreign.classList.toggle("is-invalid", !!error);

  if (error && otpInput_Foreign.touched) {
    otpError_Foreign.classList.remove("d-none");
  }

  otpBtn_Foreign.disabled = !!error;
  return !error;
}

// Events
otpInput_Foreign.addEventListener("blur", () => {
  otpInput_Foreign.touched = true;
  validateOtpForeign();
});

otpInput_Foreign.addEventListener("input", validateOtpForeign);

formStep2_Foreign.addEventListener("submit", (e) => {
  e.preventDefault();
  otpInput_Foreign.touched = true;
  if (!validateOtpForeign()) {
    otpInput_Foreign.focus();
  } else {
    otpError_Foreign.classList.add("d-none");

    document.getElementById("step2-Foreign").classList.add("d-none");
    document.getElementById("step3-Foreign").classList.remove("d-none");
    stepCounter = 3;
    counterEl.textContent = stepCounter;
  }
});

otpBtn_Foreign.disabled = true;

// Step 3 Validation
const formStep3_Foreign = document.getElementById("form-step3_Foreign");
const step3Btn = formStep3_Foreign.querySelector("button[type=submit]");

const step3Fields = {
  firstName: {
    input: document.getElementById("firstName_Foreign"),
    error: document.getElementById("firstNameForeign-error"),
    touched: false,
    validate(value) {
      return value.trim() ? null : "required";
    }
  },
  middleName: {
    input: document.getElementById("middleName_Foreign"),
    error: document.getElementById("middleNameForeign-error"),
    touched: false,
    validate(value) {
      return value.trim() ? null : "required";
    }
  },
  lastName: {
    input: document.getElementById("lastName_Foreign"),
    error: document.getElementById("lastNameForeign-error"),
    touched: false,
    validate(value) {
      return value.trim() ? null : "required";
    }
  },
  visaStatus: {
    inputs: document.querySelectorAll(".visaStatus input[name=flexRadioDefault]"),
    error: document.getElementById("visaStatus-error"),
    touched: false,
    validate() {
      return [...this.inputs].some(r => r.checked) ? null : "required";
    }
  }
};

function validateStep3Field(field) {
  const value = field.input ? field.input.value : null;
  const errorType = field.input ? field.validate(value) : field.validate();

  if (field.error) hideError(field.error);

  if (errorType && field.touched) {
    if (field.error) showError(field.error);
    return false;
  }
  return !errorType;
}

function validateStep3Form() {
  let valid = true;
  for (const key in step3Fields) {
    if (!validateStep3Field(step3Fields[key])) valid = false;
  }
  step3Btn.disabled = !valid;
}

for (const key in step3Fields) {
  const field = step3Fields[key];

  if (field.input) {
    field.input.addEventListener("blur", () => {
      field.touched = true;
      validateStep3Field(field);
      validateStep3Form();
    });

    field.input.addEventListener("input", () => {
      validateStep3Field(field);
      validateStep3Form();
    });
  } else if (field.inputs) {
    field.inputs.forEach(radio => {
      radio.addEventListener("change", () => {
        field.touched = true;
        validateStep3Field(field);
        validateStep3Form();
      });
    });
  }
}

formStep3_Foreign.addEventListener("submit", (e) => {
  e.preventDefault();
  for (const key in step3Fields) {
    step3Fields[key].touched = true;
  }
  validateStep3Form();

  if (!step3Btn.disabled) {
    document.getElementById("step3-Foreign").classList.add("d-none");
    document.getElementById("step4-Foreign").classList.remove("d-none");
    parentOptionCount.classList.add("d-none");
  }
});

step3Btn.disabled = true;