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


// winners
const tabs = document.querySelectorAll(".tabs-content_winners .tab");
const indicator = document.querySelector(".tab-indicator");
const contents = document.querySelectorAll(".tab-content");

function isRTL() {
  return document.documentElement.getAttribute("dir") === "rtl";
}

function moveIndicator(tab) {
  const tabRect = tab.getBoundingClientRect();
  const parentRect = tab.parentElement.getBoundingClientRect();

  indicator.style.width = `${tabRect.width}px`;

  if (isRTL()) {
    const rightOffset = parentRect.right - tabRect.right;
    indicator.style.right = `${rightOffset}px`;
    indicator.style.left = "auto";
  } else {
    indicator.style.left = `${tabRect.left - parentRect.left}px`;
    indicator.style.right = "auto";
  }
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    contents.forEach(c => c.classList.remove("active"));

    const target = tab.getAttribute("data-tab");
    document.getElementById(target).classList.add("active");

    moveIndicator(tab);
  });
});

if (tabs.length > 0) {
  tabs[0].classList.add("active");
  moveIndicator(tabs[0]);
}

const observer = new MutationObserver(() => {
  const activeTab = document.querySelector(".tab.active");
  if (activeTab) moveIndicator(activeTab);
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["dir"]
});






// Terms And Conditions
document.addEventListener('DOMContentLoaded', function () {
  const agree = document.getElementById('agree');
  const enrollBtn = document.getElementById('btn-enroll');

  enrollBtn.disabled = !agree?.checked;

  agree?.addEventListener('change', function () {
    enrollBtn.disabled = !agree.checked;
  });

  enrollBtn?.addEventListener('click', function (e) {
    if (!agree?.checked) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
});

// document.addEventListener('DOMContentLoaded', () => {
//   // ===== Helpers =====
//   const $ = (s, r = document) => r.querySelector(s);
//   const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
//   const isDigits = s => /^\d+$/.test(s ?? '');
//   const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s ?? '').trim());
//   const show = el => el && el.classList.remove('d-none');
//   const hide = el => el && el.classList.add('d-none');
//   const nonEmpty = el => !!el && (el.value ?? '').trim().length > 0;

//   // === visibility helpers ===
//   const isShown = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
//   const isActive = (el) => !!el && !el.disabled && isShown(el);
//   // check only if visible+enabled; otherwise treat as "OK"
//   const okIfHidden = (el, check) => !isActive(el) ? true : check(el);

//   // تتبع العناصر التي تفاعل معها المستخدم (blur/change)
//   const touched = new WeakSet();
//   const markTouched = el => el && touched.add(el);

//   // === OTP now 6 digits ===
//   const OTP_LEN = 6;

//   // (قديمة) دوال بتظهر/تخفي على طول – مستخدمة في بعض الخطوات الأخرى
//   function renderSelectTyping(sel, errEl) {
//     if (!sel) return true;
//     const ok = !!sel.value && sel.value !== '' && sel.value !== 'Select' && sel.value !== 'Select Nationality';
//     ok ? hide(errEl) : show(errEl);
//     return ok;
//   }
//   function renderFileTyping(inp, errEl) {
//     if (!inp) return true;
//     const ok = inp.files && inp.files.length > 0;
//     ok ? hide(errEl) : show(errEl);
//     return ok;
//   }

//   // نسخة صامتة + إظهار مشروط بالـ touched أو force
//   const isSelectChosen = (sel) =>
//     !!sel && !!sel.value && sel.value !== '' && sel.value !== 'Select' && sel.value !== 'Select Nationality';

//   const hasFile = (inp) =>
//     !!inp && !!inp.files && inp.files.length > 0;

//   function maybeShowSelectError(sel, errEl, force = false) {
//     if (!sel) return true;
//     if (!isShown(sel)) { if (errEl) hide(errEl); return true; } // ignore hidden
//     const ok = isSelectChosen(sel);
//     if (!errEl) return ok;
//     if (!force && !touched.has(sel)) { hide(errEl); return ok; }
//     ok ? hide(errEl) : show(errEl);
//     return ok;
//   }
//   function maybeShowFileError(inp, errEl, force = false) {
//     if (!inp) return true;
//     if (!isShown(inp)) { if (errEl) hide(errEl); return true; } // ignore hidden
//     const ok = hasFile(inp);
//     if (!errEl) return ok;
//     if (!force && !touched.has(inp)) { hide(errEl); return ok; }
//     ok ? hide(errEl) : show(errEl);
//     return ok;
//   }

//   function showRequiredOnBlur(input, errorEl) {
//     if (!input || !errorEl) return;
//     input.addEventListener('blur', () => {
//       markTouched(input);
//       const v = (input.value || '').trim();
//       v.length === 0 ? show(errorEl) : hide(errorEl);
//     });
//   }

//   function hideAllErrorsWithin(root) {
//     if (!root) return;
//     $$('.error-text, .text-error__otp', root).forEach(el => hide(el));
//   }
//   function clearInputsWithin(root) {
//     if (!root) return;
//     $$('input, select, textarea', root).forEach(el => {
//       if (el.type === 'file') el.value = '';
//       else if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
//       else el.value = '';
//       if (el.tagName === 'SELECT') el.value = '';
//     });
//   }
//   function disableButtonsWithin(root) {
//     if (!root) return;
//     $$('form button[type="submit"]', root).forEach(btn => btn.disabled = true);
//   }

//   // === force-show validation on all visible/enabled fields inside a root ===
//   function forceValidateAllWithin(root) {
//     if (!root) return;
//     $$('input, select, textarea', root).forEach(el => {
//       if (!isActive(el)) return;          // visible + enabled only
//       markTouched(el);
//       el.dispatchEvent(new Event('blur',   { bubbles: true }));
//       if (el.tagName === 'SELECT') {
//         el.dispatchEvent(new Event('change', { bubbles: true }));
//       }
//       if (el.type === 'file') {
//         el.dispatchEvent(new Event('change', { bubbles: true }));
//       }
//     });
//   }

//   // === aggregate validation for visible rules only ===
//   function allVisibleValid(rules /* Array<[el, checkFn]> */) {
//     const activeRules = rules.filter(([el]) => isActive(el));
//     const requiredCount = activeRules.length;
//     const allOk = activeRules.every(([el, check]) => check(el));
//     return { requiredCount, allOk };
//   }
//   const isAnyChecked = (...inputs) => inputs.some(i => isActive(i) && i?.checked);

//   // =========================================================
//   // ====== NEW USER: local vs foreign switcher + counter ====
//   // =========================================================
//   (function initNewUser() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;

//     const counterEl = wrap.querySelector('#counter');
//     const stepCountEl = wrap.querySelector('.registration-form__stepCount');
//     const typeGroupEl = wrap.querySelector('#type-group');

//     const setCounter = (n) => { if (counterEl) counterEl.textContent = String(n); };

//     const optLocal = wrap.querySelector('#option-local');
//     const optForeign = wrap.querySelector('#option-foreign');

//     const localContent = wrap.querySelector('#local-content');
//     const foreignContent = wrap.querySelector('#foreign-content');

//     const egyptianCount = wrap.querySelector('#egyptianCount');
//     const foreignCount = wrap.querySelector('#foreignCount');

//     const L1 = wrap.querySelector('#step1-egy');
//     const L2 = wrap.querySelector('#step2-egy');
//     const L3 = wrap.querySelector('#step3-egy');
//     const L4 = wrap.querySelector('#step4-egy');

//     const F1 = wrap.querySelector('#step1-Foreign');
//     const F2 = wrap.querySelector('#step2-Foreign');
//     const F3 = wrap.querySelector('#step3-Foreign');
//     const F4 = wrap.querySelector('#step4-Foreign');

//     function showLocalStep(n) {
//       if (L1 && L2 && L3) {
//         [L1, L2, L3].forEach(s => hide(s));
//         if (n === 1) show(L1);
//         if (n === 2) show(L2);
//         if (n === 3) show(L3);
//       }
//       if (L4) hide(L4);
//       setCounter(Math.min(Math.max(n, 1), 3));
//       show(stepCountEl);
//       show(typeGroupEl);
//     }

//     function showForeignStep(n) {
//       if (F1 && F2 && F3) {
//         [F1, F2, F3].forEach(s => hide(s));
//         if (n === 1) show(F1);
//         if (n === 2) show(F2);
//         if (n === 3) show(F3);
//       }
//       if (F4) hide(F4);
//       setCounter(Math.min(Math.max(n, 1), 3));
//       show(stepCountEl);
//       show(typeGroupEl);
//     }

//     function resetLocal() {
//       clearInputsWithin(localContent);
//       hideAllErrorsWithin(localContent);
//       disableButtonsWithin(localContent);
//       const disChk = wrap.querySelector('#checkDisability');
//       const disNum = wrap.querySelector('#disabilityNumber');
//       const disImg = wrap.querySelector('#disabilityImage');
//       if (disNum) disNum.disabled = true;
//       if (disImg) disImg.disabled = true;
//       if (disChk) disChk.checked = false;
//       showLocalStep(1);
//     }

//     function resetForeign() {
//       clearInputsWithin(foreignContent);
//       hideAllErrorsWithin(foreignContent);
//       disableButtonsWithin(foreignContent);
//       const disChk = wrap.querySelector('#checkDisability_Foreign');
//       const disNum = wrap.querySelector('#disabilityNumber_Foreign');
//       const disImg = wrap.querySelector('#disabilityImage_Foreign');
//       if (disNum) disNum.disabled = true;
//       if (disImg) disImg.disabled = true;
//       if (disChk) disChk.checked = false;
//       showForeignStep(1);
//     }

//     function hideProgressUI() {
//       hide(stepCountEl);
//       hide(typeGroupEl);
//     }

//     function activateLocal() {
//       show(localContent);
//       hide(foreignContent);
//       show(egyptianCount);
//       hide(foreignCount);
//       resetLocal();
//       resetForeign();
//     }
//     function activateForeign() {
//       hide(localContent);
//       show(foreignContent);
//       hide(egyptianCount);
//       show(foreignCount);
//       resetForeign();
//       resetLocal();
//     }

//     function resetAll(defaultType = 'local') {
//       if (optLocal) optLocal.checked = defaultType === 'local';
//       if (optForeign) optForeign.checked = defaultType === 'foreign';
//       defaultType === 'local' ? activateLocal() : activateForeign();
//       setCounter(1);
//     }

//     function refreshByRadio() {
//       if (optForeign && optForeign.checked) activateForeign();
//       else activateLocal();
//     }

//     $$('#type-group input[name="type"]', wrap).forEach(r => r.addEventListener('change', refreshByRadio));
//     refreshByRadio();

//     wrap.__nav = { showLocalStep, showForeignStep, setCounter, hideProgressUI, resetLocal, resetForeign, activateLocal, activateForeign, resetAll };

//     // ===== Reset Everything when close modal =====
//     const modalEl = wrap.closest('.modal');
//     if (modalEl) {
//       modalEl.addEventListener('hidden.bs.modal', () => resetAll('local'));
//       const obs = new MutationObserver(() => {
//         if (!modalEl.classList.contains('show')) resetAll('local');
//       });
//       obs.observe(modalEl, { attributes: true, attributeFilter: ['class'] });

//       document.addEventListener('click', (e) => {
//         const t = e.target && (e.target.closest('[data-bs-dismiss="modal"],[data-dismiss="modal"],.modal .btn-close'));
//         if (t && modalEl.contains(t)) resetAll('local');
//       }, true);
//     }
//   })();

//   // =========================================================
//   // ================== Egyptian =============================
//   // =========================================================

//   (function step1Local() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;
//     const form = $('#form-step1', wrap);
//     if (!form) return;

//     const nav = wrap.__nav;
//     const nationalId = $('#nationalId', wrap);
//     const mobile = $('#mobileNumber2', wrap);
//     const btn = form.querySelector('button[type="submit"]');
//     const idRequired = $('#id-required', wrap);
//     const idLength = $('#id-length', wrap);
//     const idExists = $('#id-exists', wrap);
//     const mobReq = $('#mobile-required', wrap);
//     const mobInc = $('#mobile-incomplete', wrap);

//     showRequiredOnBlur(nationalId, idRequired);
//     showRequiredOnBlur(mobile, mobReq);

//     nationalId?.addEventListener('blur', () => {
//       const v = (nationalId.value || '').trim();
//       markTouched(nationalId);
//       if (v.length === 0) { hide(idLength); hide(idExists); return; }
//       if (!(v.length === 14 && isDigits(v))) show(idLength); else hide(idLength);
//     });

//     function renderIdErrorsTyping() {
//       const v = (nationalId.value || '').trim();
//       if (v.length === 0) { hide(idLength); hide(idExists); return false; }
//       hide(idRequired);
//       if (!(v.length === 14 && isDigits(v))) { show(idLength); hide(idExists); return false; }
//       hide(idLength);
//       return true;
//     }

//     function renderMobileErrorsTyping() {
//       const v = (mobile.value || '').trim();
//       if (v.length === 0) { hide(mobInc); return false; }
//       hide(mobReq);
//       if (!(v.length === 10 && isDigits(v))) { show(mobInc); return false; }
//       hide(mobInc);
//       return true;
//     }

//     function recomputeButton() {
//       const idOK = (nationalId.value || '').trim().length === 14
//         && isDigits((nationalId.value || '').trim())
//         && (idExists?.classList.contains('d-none') ?? true);
//       const mobOK = (mobile.value || '').trim().length === 10 && isDigits((mobile.value || '').trim());
//       btn.disabled = !(idOK && mobOK);
//     }

//     nationalId?.addEventListener('input', () => { hide(idExists); renderIdErrorsTyping(); recomputeButton(); });
//     mobile?.addEventListener('input', () => { renderMobileErrorsTyping(); recomputeButton(); });

//     recomputeButton();

//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       if (btn.disabled) { forceValidateAllWithin(form); return; }
//       $('#step1-egy', wrap)?.classList.add('d-none');
//       $('#step2-egy', wrap)?.classList.remove('d-none');
//       nav?.setCounter(2);
//     });
//   })();

//   (function step2Local() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;
//     const form = $('#form-step2', wrap);
//     if (!form) return;

//     const nav = wrap.__nav;
//     const otp = $('#otpCode', wrap);
//     const btn = form.querySelector('button[type="submit"]');
//     const err = $('#step2-egy .text-error__otp', wrap);

//     if (otp) {
//       otp.setAttribute('maxlength', String(OTP_LEN));
//       otp.setAttribute('inputmode', 'numeric');
//       otp.addEventListener('input', () => {
//         otp.value = (otp.value || '').replace(/\D/g, '').slice(0, OTP_LEN);
//       });
//     }

//     function renderOtpErrorsTyping() {
//       const v = (otp.value || '').trim();
//       if (v.length === 0) { hide(err); return false; }
//       const ok = v.length === OTP_LEN && isDigits(v);
//       ok ? hide(err) : show(err);
//       return ok;
//     }
//     function recomputeButton() {
//       btn.disabled = !((otp.value || '').trim().length === OTP_LEN && isDigits((otp.value || '').trim()));
//     }

//     otp?.addEventListener('blur', () => { markTouched(otp); renderOtpErrorsTyping(); });
//     otp?.addEventListener('input', () => { renderOtpErrorsTyping(); recomputeButton(); });

//     recomputeButton();

//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       if (btn.disabled) { forceValidateAllWithin(form); return; }
//       $('#step2-egy', wrap)?.classList.add('d-none');
//       $('#step3-egy', wrap)?.classList.remove('d-none');
//       nav?.setCounter(3);
//     });
//   })();

//   (function step3Local() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;
//     const form = $('#form-step3', wrap);
//     if (!form) return;

//     const nav = wrap.__nav;
//     const btn = form.querySelector('button[type="submit"]');

//     const first  = $('#firstName', wrap);
//     const middle = $('#middleName', wrap);
//     const last   = $('#lastName', wrap);

//     const eFirst  = $('#firstNameEgyptian-error, #firstName-error', wrap);
//     const eMiddle = $('#middleNameEgyptian-error, #middleName-error', wrap);
//     const eLast   = $('#lastNameEgyptian-error, #lastName-error', wrap);

//     // Adult (قديمة)
//     const gov  = $('#governorateResidence', wrap);
//     const idUp = $('#IDUpload', wrap);
//     const eGov = $('#govResidence-error', wrap);
//     const eID  = $('#idEgyptian-error', wrap);

//     // Parent (جديدة)
//     const govParent  = $('#governorateResidence-parent', wrap);
//     const idUpParent = $('#IDUpload-egy', wrap);
//     const eGovParent = $('#govResidenceParent-error', wrap);
//     const eIDParent  = $('#idEgyptianParent-error', wrap);

//     // Kid
//     const kidId    = $('#KidNationalID', wrap);
//     const kidFirst = $('#firstNameKid', wrap);
//     const eKidId    = $('#kidNationalId-error, #KidNationalID-error', wrap);
//     const eKidFirst = $('#firstNameEgyptianKid-error', wrap);

//     // Disability
//     const disChk  = $('#checkDisability', wrap);
//     const disNum  = $('#disabilityNumber', wrap);
//     const disImg  = $('#disabilityImage', wrap);
//     const eDisNum = $('#disabilityNumber-error', wrap);
//     const eDisImg = $('#disabilityImage-error', wrap);

//     // Hide all errors initially
//     [eFirst,eMiddle,eLast,eGov,eID,eGovParent,eIDParent,eKidId,eKidFirst,eDisNum,eDisImg].forEach(hide);

//     function toggleDisabilityFields() {
//       const on = !!disChk?.checked;
//       if (disNum) disNum.disabled = !on;
//       if (disImg) disImg.disabled = !on;
//       if (!on) {
//         if (disNum) disNum.value = '';
//         if (disImg) disImg.value = '';
//         hide(eDisNum); hide(eDisImg);
//       }
//     }

//     function renderDisabilityTyping() {
//       if (!disChk?.checked) { hide(eDisNum); hide(eDisImg); return true; }
//       const okNum = nonEmpty(disNum);
//       const okImg = hasFile(disImg);
//       okNum ? hide(eDisNum) : show(eDisNum);
//       okImg ? hide(eDisImg) : show(eDisImg);
//       return okNum && okImg;
//     }

//     // يحسب الظاهر فقط + يمنع التفعيل لو مفيش Rules ظاهرة
//     function recomputeButton() {
//       // قواعد الأسماء
//       const nameRules = [
//         [first,  nonEmpty],
//         [middle, nonEmpty],
//         [last,   nonEmpty],
//       ];

//       // Adult
//       const adultRules = [
//         [gov,  isSelectChosen],
//         [idUp, hasFile],
//       ];

//       // Parent
//       const parentRules = [
//         [govParent,  isSelectChosen],
//         [idUpParent, hasFile],
//       ];

//       // Kid
//       const kidRules = [
//         [kidId,    nonEmpty],
//         [kidFirst, nonEmpty],
//       ];

//       // Disability (لو ظاهر ومُعلّم)
//       const disRules = (isActive(disChk) && disChk.checked)
//         ? [
//             [disNum, nonEmpty],
//             [disImg, hasFile],
//           ]
//         : [];

//       // اجمع كل القواعد
//       const rules = [
//         ...nameRules,
//         ...adultRules,
//         ...parentRules,
//         ...kidRules,
//         ...disRules,
//       ];

//       const { requiredCount, allOk } = allVisibleValid(rules);
//       btn.disabled = (requiredCount === 0) ? true : !allOk;
//     }

//     // required on blur + touch
//     showRequiredOnBlur(first,     eFirst);
//     showRequiredOnBlur(middle,    eMiddle);
//     showRequiredOnBlur(last,      eLast);
//     showRequiredOnBlur(kidId,     eKidId);
//     showRequiredOnBlur(kidFirst,  eKidFirst);

//     // Adult gov/file — إظهار فقط بعد التفاعل
//     gov?.addEventListener('blur',   () => { markTouched(gov); maybeShowSelectError(gov, eGov); recomputeButton(); });
//     gov?.addEventListener('change', () => { markTouched(gov); maybeShowSelectError(gov, eGov); recomputeButton(); });

//     idUp?.addEventListener('blur',   () => { markTouched(idUp); maybeShowFileError(idUp, eID); recomputeButton(); });
//     idUp?.addEventListener('change', () => { markTouched(idUp); maybeShowFileError(idUp, eID); recomputeButton(); });

//     // Parent gov/file — إظهار فقط بعد التفاعل
//     govParent?.addEventListener('blur',   () => { markTouched(govParent); maybeShowSelectError(govParent, eGovParent); recomputeButton(); });
//     govParent?.addEventListener('change', () => { markTouched(govParent); maybeShowSelectError(govParent, eGovParent); recomputeButton(); });

//     idUpParent?.addEventListener('blur',   () => { markTouched(idUpParent); maybeShowFileError(idUpParent, eIDParent); recomputeButton(); });
//     idUpParent?.addEventListener('change', () => { markTouched(idUpParent); maybeShowFileError(idUpParent, eIDParent); recomputeButton(); });

//     // typing inputs — أخفاء الأخطاء اللي ظهرت قبل كده
//     [first, middle, last, kidId, kidFirst].forEach(i => i?.addEventListener('input', () => {
//       if (i && touched.has(i)) {
//         const err = i===first?eFirst:i===middle?eMiddle:i===last?eLast:i===kidId?eKidId:eKidFirst;
//         if (nonEmpty(i)) hide(err);
//       }
//       recomputeButton();
//     }));

//     // Disability
//     disChk?.addEventListener('change', () => { toggleDisabilityFields(); recomputeButton(); });
//     disNum?.addEventListener('blur',   () => { markTouched(disNum); renderDisabilityTyping(); recomputeButton(); });
//     disNum?.addEventListener('input',  () => { renderDisabilityTyping(); recomputeButton(); });
//     disImg?.addEventListener('blur',   () => { markTouched(disImg); renderDisabilityTyping(); recomputeButton(); });
//     disImg?.addEventListener('change', () => { markTouched(disImg); renderDisabilityTyping(); recomputeButton(); });

//     // init
//     toggleDisabilityFields();
//     recomputeButton(); // صامت – مش بيظهر أخطاء

//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       if (btn.disabled) { forceValidateAllWithin(form); return; }
//       $('#step3-egy', wrap)?.classList.add('d-none');
//       $('#step4-egy', wrap)?.classList.remove('d-none');
//       nav?.hideProgressUI();
//     });
//   })();

//   // =========================================================
//   // =================== Foreigner ===========================
//   // =========================================================

//   (function step1Foreign() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;
//     const form = $('#form-step1_Foreign', wrap);
//     if (!form) return;

//     const nav = wrap.__nav;
//     const email = $('#Email', wrap);
//     const pass = $('#Passport', wrap);
//     const nat = $('#nationality', wrap);
//     const btn = form.querySelector('button[type="submit"]');

//     const eEmailReq = $('#emailRequired', wrap);
//     const eEmailFmt = $('#emailError', wrap);
//     const ePassReq  = $('#passportRequired', wrap);
//     const eNatReq   = $('#nationalityRequired', wrap);

//     email?.addEventListener('blur', () => {
//       markTouched(email);
//       const v = (email.value || '').trim();
//       if (v.length === 0) { show(eEmailReq); hide(eEmailFmt); return; }
//       hide(eEmailReq);
//       if (!isEmail(v)) show(eEmailFmt); else hide(eEmailFmt);
//     });

//     showRequiredOnBlur(pass, ePassReq);

//     nat?.addEventListener('blur', () => {
//       markTouched(nat);
//       const ok = nat.value && nat.value !== '' && nat.value !== 'Select Nationality';
//       ok ? hide(eNatReq) : show(eNatReq);
//     });

//     function recomputeButton() {
//       const ok = isEmail((email.value || '').trim())
//         && (pass.value || '').trim().length > 0
//         && (nat.value && nat.value !== '' && nat.value !== 'Select Nationality');
//       btn.disabled = !ok;
//     }

//     email?.addEventListener('input', recomputeButton);
//     pass?.addEventListener('input', recomputeButton);
//     nat?.addEventListener('change', recomputeButton);

//     recomputeButton();

//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       if (btn.disabled) { forceValidateAllWithin(form); return; }
//       $('#step1-Foreign', wrap)?.classList.add('d-none');
//       $('#step2-Foreign', wrap)?.classList.remove('d-none');
//       nav?.setCounter(2);
//     });
//   })();

//   (function step2Foreign() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;
//     const form = $('#form-step2_Foreign', wrap);
//     if (!form) return;

//     const nav = wrap.__nav;
//     const otp = $('#otpCode_Foreign', wrap);
//     const btn = form.querySelector('button[type="submit"]');
//     const err = $('#otpRequired', wrap);

//     if (otp) {
//       otp.setAttribute('maxlength', String(OTP_LEN));
//       otp.setAttribute('inputmode', 'numeric');
//       otp.addEventListener('input', () => {
//         otp.value = (otp.value || '').replace(/\D/g, '').slice(0, OTP_LEN);
//       });
//     }

//     function recomputeButton() {
//       const v = (otp.value || '').trim();
//       btn.disabled = !(v.length === OTP_LEN && isDigits(v));
//       if (v.length === 0) hide(err);
//       else (v.length === OTP_LEN && isDigits(v)) ? hide(err) : show(err);
//     }

//     otp?.addEventListener('blur', () => { markTouched(otp); recomputeButton(); });
//     otp?.addEventListener('input', recomputeButton);

//     recomputeButton();

//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       if (btn.disabled) { forceValidateAllWithin(form); return; }
//       $('#step2-Foreign', wrap)?.classList.add('d-none');
//       $('#step3-Foreign', wrap)?.classList.remove('d-none');
//       nav?.setCounter(3);
//     });
//   })();

//   (function step3Foreign() {
//     const wrap = $('#content-new__user');
//     if (!wrap) return;
//     const form = $('#form-step3_Foreign', wrap);
//     if (!form) return;

//     const nav = wrap.__nav;
//     const btn = form.querySelector('button[type="submit"]');

//     // Adult fields
//     const first = $('#firstName_Foreign', wrap);
//     const mid   = $('#middleName_Foreign', wrap);
//     const last  = $('#lastName_Foreign', wrap);
//     const eF = $('#firstNameForeign-error', wrap);
//     const eM = $('#middleNameForeign-error', wrap);
//     const eL = $('#lastNameForeign-error', wrap);

//     const visaYes = $('#option-yes', wrap);
//     const visaNo  = $('#option-no', wrap);
//     const eVisa   = $('#visaStatus-error', wrap);

//     const disChk = $('#checkDisability_Foreign', wrap);
//     const disNum = $('#disabilityNumber_Foreign', wrap);
//     const disImg = $('#disabilityImage_Foreign', wrap);

//     // Kid fields
//     const kidPassportId = $('#KidPassportlID-foreign', wrap);
//     const kidFirstName  = $('#firstNameKid-foreign', wrap);
//     const kidDOB        = $('#dateBirth_Foreign', wrap);
//     const kidGender     = $('#gender-foreignKid', wrap);
//     const kidGov        = $('#governorateResidence-foreignKid', wrap);
//     const kidPassImg    = $('#PassportImage_ForeignKid', wrap);
//     const kidConsent    = $('#guardianConsent_ForeignKid', wrap);

//     const eKidPassportId = $('#KidPassportID-error', wrap);
//     const eKidFirstName  = $('#firstNameForeignKid-error', wrap);
//     const eKidDOB        = $('#dateBirth_ForeignKid', wrap);
//     const eKidGender     = $('#gender-foreignKid-error', wrap);
//     const eKidGov        = $('#govResidenceForeignKid-error', wrap);
//     const eKidPassImg    = $('#passportImageForeignKid-error', wrap);
//     const eKidConsent    = $('#guardianConsentForeignKid-error', wrap);

//     // Hide all errors initially
//     [eF,eM,eL,eVisa,eKidPassportId,eKidFirstName,eKidDOB,eKidGender,eKidGov,eKidPassImg,eKidConsent].forEach(hide);

//     // blur required
//     showRequiredOnBlur(first, eF);
//     showRequiredOnBlur(mid,   eM);
//     showRequiredOnBlur(last,  eL);
//     showRequiredOnBlur(kidPassportId, eKidPassportId);
//     showRequiredOnBlur(kidFirstName,  eKidFirstName);

//     function toggleDisabilityFields() {
//       const on = disChk?.checked;
//       if (disNum) disNum.disabled = !on;
//       if (disImg) disImg.disabled = !on;
//       if (!on) { if (disNum) disNum.value = ''; if (disImg) disImg.value = ''; hide(eKidPassImg); }
//     }

//     function renderVisa() {
//       const okVisa = !!(visaYes?.checked || visaNo?.checked);
//       okVisa ? hide(eVisa) : show(eVisa);
//       return okVisa;
//     }
//     function renderDOB() {
//       const ok = (kidDOB?.value ?? '').trim().length > 0;
//       ok ? hide(eKidDOB) : show(eKidDOB);
//       return ok;
//     }
//     function renderGenderKid() {
//       const ok = ['male','female'].includes(kidGender?.value);
//       ok ? hide(eKidGender) : show(eKidGender);
//       return ok;
//     }
//     function renderGovKid() {
//       const ok = !!kidGov?.value && kidGov.value !== '';
//       ok ? hide(eKidGov) : show(eKidGov);
//       return ok;
//     }
//     function renderFile(el, err) {
//       const ok = !!(el?.files && el.files.length > 0);
//       ok ? hide(err) : show(err);
//       return ok;
//     }

//     // يحسب الظاهر فقط + يمنع التفعيل لو مفيش Rules ظاهرة
//     function recomputeButton() {
//       // Adult names
//       const nameRules = [
//         [first, nonEmpty],
//         [mid,   nonEmpty],
//         [last,  nonEmpty],
//       ];

//       // Visa: Rule واحد يتحقق لو الراديو ظاهر
//       const visaRule = [
//         [visaYes || visaNo, () => isAnyChecked(visaYes, visaNo)]
//       ];

//       // Disability (لو ظاهر ومُعلَّم)
//       const disRules = (isActive(disChk) && disChk.checked)
//         ? [
//             [disNum, nonEmpty],
//             [disImg, (el)=> !!(el?.files && el.files.length>0)],
//           ]
//         : [];

//       // Kid group
//       const kidRules = [
//         [kidPassportId, nonEmpty],
//         [kidFirstName,  nonEmpty],
//         [kidDOB,        (el)=> (el?.value ?? '').trim().length > 0],
//         [kidGender,     (el)=> ['male','female'].includes(el?.value)],
//         [kidGov,        (el)=> !!el?.value && el.value !== ''],
//         [kidPassImg,    (el)=> !!(el?.files && el.files.length>0)],
//         [kidConsent,    (el)=> !!(el?.files && el.files.length>0)],
//       ];

//       const rules = [
//         ...nameRules,
//         ...visaRule,
//         ...disRules,
//         ...kidRules,
//       ];

//       const { requiredCount, allOk } = allVisibleValid(rules);
//       btn.disabled = (requiredCount === 0) ? true : !allOk;
//     }

//     // listeners — adult
//     [first, mid, last].forEach(i => i?.addEventListener('input', () => {
//       if (nonEmpty(i)) hide(i===first?eF:i===mid?eM:eL);
//       recomputeButton();
//     }));
//     [visaYes, visaNo].forEach(r => r?.addEventListener('change', () => { renderVisa(); recomputeButton(); }));
//     disChk?.addEventListener('change', () => { toggleDisabilityFields(); recomputeButton(); });
//     disNum?.addEventListener('input',  recomputeButton);
//     disImg?.addEventListener('change', recomputeButton);

//     // listeners — kid
//     kidPassportId?.addEventListener('input', () => { if (nonEmpty(kidPassportId)) hide(eKidPassportId); recomputeButton(); });
//     kidFirstName?.addEventListener('input',  () => { if (nonEmpty(kidFirstName))  hide(eKidFirstName);  recomputeButton(); });
//     kidDOB?.addEventListener('change',   () => { renderDOB(); recomputeButton(); });
//     kidGender?.addEventListener('change',() => { renderGenderKid(); recomputeButton(); });
//     kidGov?.addEventListener('change',   () => { renderGovKid(); recomputeButton(); });
//     kidPassImg?.addEventListener('change',() => { renderFile(kidPassImg, eKidPassImg); recomputeButton(); });
//     kidConsent?.addEventListener('change',() => { renderFile(kidConsent, eKidConsent); recomputeButton(); });

//     toggleDisabilityFields();
//     recomputeButton();

//     form.addEventListener('submit', (e) => {
//       e.preventDefault();
//       if (btn.disabled) { forceValidateAllWithin(form); return; }
//       $('#step3-Foreign', wrap)?.classList.add('d-none');
//       $('#step4-Foreign', wrap)?.classList.remove('d-none');
//       nav?.hideProgressUI();
//     });
//   })();

// });



document.addEventListener('DOMContentLoaded', () => {
  // ===== Helpers =====
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const isDigits = s => /^\d+$/.test(s ?? '');
  const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s ?? '').trim());
  const show = el => el && el.classList.remove('d-none');
  const hide = el => el && el.classList.add('d-none');
  const nonEmpty = el => !!el && (el.value ?? '').trim().length > 0;

  // === visibility helpers ===
  const isShown = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
  const isActive = (el) => !!el && !el.disabled && isShown(el);

  const touched = new WeakSet();
  const markTouched = el => el && touched.add(el);

  // === OTP len ===
  const OTP_LEN = 6;

  const isSelectChosen = (sel) =>
    !!sel && !!sel.value && sel.value !== '' && sel.value !== 'Select' && sel.value !== 'Select Nationality';

  const hasFile = (inp) =>
    !!inp && !!inp.files && inp.files.length > 0;

  function maybeShowSelectError(sel, errEl, force = false) {
    if (!sel) return true;
    if (!isShown(sel)) { if (errEl) hide(errEl); return true; }
    const ok = isSelectChosen(sel);
    if (!errEl) return ok;
    if (!force && !touched.has(sel)) { hide(errEl); return ok; }
    ok ? hide(errEl) : show(errEl);
    return ok;
  }
  function maybeShowFileError(inp, errEl, force = false) {
    if (!inp) return true;
    if (!isShown(inp)) { if (errEl) hide(errEl); return true; }
    const ok = hasFile(inp);
    if (!errEl) return ok;
    if (!force && !touched.has(inp)) { hide(errEl); return ok; }
    ok ? hide(errEl) : show(errEl);
    return ok;
  }

  function showRequiredOnBlur(input, errorEl) {
    if (!input || !errorEl) return;
    input.addEventListener('blur', () => {
      markTouched(input);
      const v = (input.value || '').trim();
      v.length === 0 ? show(errorEl) : hide(errorEl);
    });
  }

  function hideAllErrorsWithin(root) {
    if (!root) return;
    $$('.error-text, .text-error__otp', root).forEach(el => hide(el));
  }
  function clearInputsWithin(root) {
    if (!root) return;
    $$('input, select, textarea', root).forEach(el => {
      if (el.type === 'file') el.value = '';
      else if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
      else el.value = '';
      if (el.tagName === 'SELECT') el.value = '';
    });
  }
  function disableButtonsWithin(root) {
    if (!root) return;
    $$('form button[type="submit"]', root).forEach(btn => btn.disabled = true);
  }

  // === force-show validation on all visible/enabled fields inside a root ===
  function forceValidateAllWithin(root) {
    if (!root) return;
    $$('input, select, textarea', root).forEach(el => {
      if (!isActive(el)) return;
      markTouched(el);
      el.dispatchEvent(new Event('blur', { bubbles: true }));
      if (el.tagName === 'SELECT') {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (el.type === 'file') {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  // === aggregate validation for visible rules only ===
  function allVisibleValid(rules) {
    const activeRules = rules.filter(([el]) => isActive(el));
    const requiredCount = activeRules.length;
    const allOk = activeRules.every(([, check], idx) => check(activeRules[idx][0]));
    return { requiredCount, allOk };
  }
  const isAnyChecked = (...inputs) => inputs.some(i => isActive(i) && i?.checked);

  // =========================================================
  // ====== NEW USER: local vs foreign switcher + counter ====
  // =========================================================
  (function initNewUser() {
    const wrap = $('#content-new__user');
    if (!wrap) return;

    const counterEl = wrap.querySelector('#counter');
    const stepCountEl = wrap.querySelector('.registration-form__stepCount');
    const typeGroupEl = wrap.querySelector('#type-group');

    const setCounter = (n) => { if (counterEl) counterEl.textContent = String(n); };

    const optLocal = wrap.querySelector('#option-local');
    const optForeign = wrap.querySelector('#option-foreign');

    const localContent = wrap.querySelector('#local-content');
    const foreignContent = wrap.querySelector('#foreign-content');

    const egyptianCount = wrap.querySelector('#egyptianCount');
    const foreignCount = wrap.querySelector('#foreignCount');

    const L1 = wrap.querySelector('#step1-egy');
    const L2 = wrap.querySelector('#step2-egy');
    const L3 = wrap.querySelector('#step3-egy');
    const L4 = wrap.querySelector('#step4-egy');

    const F1 = wrap.querySelector('#step1-Foreign');
    const F2 = wrap.querySelector('#step2-Foreign');
    const F3 = wrap.querySelector('#step3-Foreign');
    const F4 = wrap.querySelector('#step4-Foreign');

    function showLocalStep(n) {
      if (L1 && L2 && L3) {
        [L1, L2, L3].forEach(s => hide(s));
        if (n === 1) show(L1);
        if (n === 2) show(L2);
        if (n === 3) show(L3);
      }
      if (L4) hide(L4);
      setCounter(Math.min(Math.max(n, 1), 3));
      show(stepCountEl);
      show(typeGroupEl);
    }

    function showForeignStep(n) {
      if (F1 && F2 && F3) {
        [F1, F2, F3].forEach(s => hide(s));
        if (n === 1) show(F1);
        if (n === 2) show(F2);
        if (n === 3) show(F3);
      }
      if (F4) hide(F4);
      setCounter(Math.min(Math.max(n, 1), 3));
      show(stepCountEl);
      show(typeGroupEl);
    }

    function resetLocal() {
      clearInputsWithin(localContent);
      hideAllErrorsWithin(localContent);
      disableButtonsWithin(localContent);
      const disChk = wrap.querySelector('#checkDisability');
      const disNum = wrap.querySelector('#disabilityNumber');
      const disImg = wrap.querySelector('#disabilityImage');
      if (disNum) disNum.disabled = true;
      if (disImg) disImg.disabled = true;
      if (disChk) disChk.checked = false;
      showLocalStep(1);
    }

    function resetForeign() {
      clearInputsWithin(foreignContent);
      hideAllErrorsWithin(foreignContent);
      disableButtonsWithin(foreignContent);
      const disChk = wrap.querySelector('#checkDisability_Foreign');
      const disNum = wrap.querySelector('#disabilityNumber_Foreign');
      const disImg = wrap.querySelector('#disabilityImage_Foreign');
      if (disNum) disNum.disabled = true;
      if (disImg) disImg.disabled = true;
      if (disChk) disChk.checked = false;
      showForeignStep(1);
    }

    function hideProgressUI() {
      hide(stepCountEl);
      hide(typeGroupEl);
    }

    function activateLocal() {
      show(localContent);
      hide(foreignContent);
      show(egyptianCount);
      hide(foreignCount);
      resetLocal();
      resetForeign();
    }
    function activateForeign() {
      hide(localContent);
      show(foreignContent);
      hide(egyptianCount);
      show(foreignCount);
      resetForeign();
      resetLocal();
    }

    function resetAll(defaultType = 'local') {
      if (optLocal) optLocal.checked = defaultType === 'local';
      if (optForeign) optForeign.checked = defaultType === 'foreign';
      defaultType === 'local' ? activateLocal() : activateForeign();
      setCounter(1);
    }

    function refreshByRadio() {
      if (optForeign && optForeign.checked) activateForeign();
      else activateLocal();
    }

    $$('#type-group input[name="type"]', wrap).forEach(r => r.addEventListener('change', refreshByRadio));
    refreshByRadio();

    wrap.__nav = { showLocalStep, showForeignStep, setCounter, hideProgressUI, resetLocal, resetForeign, activateLocal, activateForeign, resetAll };

    // ===== Reset Everything when close modal =====
    const modalEl = wrap.closest('.modal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => resetAll('local'));
      const obs = new MutationObserver(() => {
        if (!modalEl.classList.contains('show')) resetAll('local');
      });
      obs.observe(modalEl, { attributes: true, attributeFilter: ['class'] });

      document.addEventListener('click', (e) => {
        const t = e.target && (e.target.closest('[data-bs-dismiss="modal"],[data-dismiss="modal"],.modal .btn-close'));
        if (t && modalEl.contains(t)) resetAll('local');
      }, true);
    }
  })();

  // =========================================================
  // ================== Egyptian =============================
  // =========================================================

  (function step1Local() {
    const wrap = $('#content-new__user');
    if (!wrap) return;
    const form = $('#form-step1', wrap);
    if (!form) return;

    const nav = wrap.__nav;
    const nationalId = $('#nationalId', wrap);
    const mobile = $('#mobileNumber2', wrap);
    const btn = form.querySelector('button[type="submit"]');
    const idRequired = $('#id-required', wrap);
    const idLength = $('#id-length', wrap);
    const idExists = $('#id-exists', wrap);
    const mobReq = $('#mobile-required', wrap);
    const mobInc = $('#mobile-incomplete', wrap);

    showRequiredOnBlur(nationalId, idRequired);
    showRequiredOnBlur(mobile, mobReq);

    nationalId?.addEventListener('blur', () => {
      const v = (nationalId.value || '').trim();
      markTouched(nationalId);
      if (v.length === 0) { hide(idLength); hide(idExists); return; }
      if (!(v.length === 14 && isDigits(v))) show(idLength); else hide(idLength);
    });

    function renderIdErrorsTyping() {
      const v = (nationalId.value || '').trim();
      if (v.length === 0) { hide(idLength); hide(idExists); return false; }
      hide(idRequired);
      if (!(v.length === 14 && isDigits(v))) { show(idLength); hide(idExists); return false; }
      hide(idLength);
      return true;
    }

    function renderMobileErrorsTyping() {
      const v = (mobile.value || '').trim();
      if (v.length === 0) { hide(mobInc); return false; }
      hide(mobReq);
      if (!(v.length === 10 && isDigits(v))) { show(mobInc); return false; }
      hide(mobInc);
      return true;
    }

    function recomputeButton() {
      const idOK = (nationalId.value || '').trim().length === 14
        && isDigits((nationalId.value || '').trim())
        && (idExists?.classList.contains('d-none') ?? true);
      const mobOK = (mobile.value || '').trim().length === 10 && isDigits((mobile.value || '').trim());
      btn.disabled = !(idOK && mobOK);
    }

    nationalId?.addEventListener('input', () => { hide(idExists); renderIdErrorsTyping(); recomputeButton(); });
    mobile?.addEventListener('input', () => { renderMobileErrorsTyping(); recomputeButton(); });

    recomputeButton();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) { forceValidateAllWithin(form); return; }
      $('#step1-egy', wrap)?.classList.add('d-none');
      $('#step2-egy', wrap)?.classList.remove('d-none');
      nav?.setCounter(2);
    });
  })();

  (function step2Local() {
    const wrap = $('#content-new__user');
    if (!wrap) return;
    const form = $('#form-step2', wrap);
    if (!form) return;

    const nav = wrap.__nav;
    const otp = $('#otpCode', wrap);
    const btn = form.querySelector('button[type="submit"]');
    const err = $('#step2-egy .text-error__otp', wrap);

    if (otp) {
      otp.setAttribute('maxlength', String(OTP_LEN));
      otp.setAttribute('inputmode', 'numeric');
      otp.addEventListener('input', () => {
        otp.value = (otp.value || '').replace(/\D/g, '').slice(0, OTP_LEN);
      });
    }

    function renderOtpErrorsTyping() {
      const v = (otp.value || '').trim();
      if (v.length === 0) { hide(err); return false; }
      const ok = v.length === OTP_LEN && isDigits(v);
      ok ? hide(err) : show(err);
      return ok;
    }
    function recomputeButton() {
      btn.disabled = !((otp.value || '').trim().length === OTP_LEN && isDigits((otp.value || '').trim()));
    }

    otp?.addEventListener('blur', () => { markTouched(otp); renderOtpErrorsTyping(); });
    otp?.addEventListener('input', () => { renderOtpErrorsTyping(); recomputeButton(); });

    recomputeButton();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) { forceValidateAllWithin(form); return; }
      $('#step2-egy', wrap)?.classList.add('d-none');
      $('#step3-egy', wrap)?.classList.remove('d-none');
      nav?.setCounter(3);
    });
  })();

  (function step3Local() {
    const wrap = $('#content-new__user');
    if (!wrap) return;
    const form = $('#form-step3', wrap);
    if (!form) return;

    const nav = wrap.__nav;
    const btn = form.querySelector('button[type="submit"]');

    const first = $('#firstName', wrap);
    const middle = $('#middleName', wrap);
    const last = $('#lastName', wrap);

    const eFirst = $('#firstNameEgyptian-error, #firstName-error', wrap);
    const eMiddle = $('#middleNameEgyptian-error, #middleName-error', wrap);
    const eLast = $('#lastNameEgyptian-error, #lastName-error', wrap);

    // Adult
    const gov = $('#governorateResidence', wrap);
    const idUp = $('#IDUpload', wrap);
    const eGov = $('#govResidence-error', wrap);
    const eID = $('#idEgyptian-error', wrap);

    // Parent
    const govParent = $('#governorateResidence-parent', wrap);
    const idUpParent = $('#IDUpload-egy', wrap);
    const eGovParent = $('#govResidenceParent-error', wrap);
    const eIDParent = $('#idEgyptianParent-error', wrap);

    // Kid
    const kidId = $('#KidNationalID', wrap);
    const kidFirst = $('#firstNameKid', wrap);
    const eKidId = $('#kidNationalId-error, #KidNationalID-error', wrap);
    const eKidFirst = $('#firstNameEgyptianKid-error', wrap);

    // Disability
    const disChk = $('#checkDisability', wrap);
    const disNum = $('#disabilityNumber', wrap);
    const disImg = $('#disabilityImage', wrap);
    const eDisNum = $('#disabilityNumber-error', wrap);
    const eDisImg = $('#disabilityImage-error', wrap);

    [eFirst, eMiddle, eLast, eGov, eID, eGovParent, eIDParent, eKidId, eKidFirst, eDisNum, eDisImg].forEach(hide);

    function toggleDisabilityFields() {
      const on = !!disChk?.checked;
      if (disNum) disNum.disabled = !on;
      if (disImg) disImg.disabled = !on;
      if (!on) {
        if (disNum) disNum.value = '';
        if (disImg) disImg.value = '';
        hide(eDisNum); hide(eDisImg);
      }
    }

    function renderDisabilityTyping() {
      if (!disChk?.checked) { hide(eDisNum); hide(eDisImg); return true; }
      const okNum = nonEmpty(disNum);
      const okImg = hasFile(disImg);
      okNum ? hide(eDisNum) : show(eDisNum);
      okImg ? hide(eDisImg) : show(eDisImg);
      return okNum && okImg;
    }

    function recomputeButton() {
      const nameRules = [
        [first, nonEmpty],
        [middle, nonEmpty],
        [last, nonEmpty],
      ];

      const adultRules = [
        [gov, isSelectChosen],
        [idUp, hasFile],
      ];

      const parentRules = [
        [govParent, isSelectChosen],
        [idUpParent, hasFile],
      ];

      const kidRules = [
        [kidId, nonEmpty],
        [kidFirst, nonEmpty],
      ];

      const disRules = (isActive(disChk) && disChk.checked)
        ? [
          [disNum, nonEmpty],
          [disImg, hasFile],
        ]
        : [];

      const rules = [
        ...nameRules,
        ...adultRules,
        ...parentRules,
        ...kidRules,
        ...disRules,
      ];

      const { requiredCount, allOk } = allVisibleValid(rules);
      btn.disabled = (requiredCount === 0) ? true : !allOk;
    }

    showRequiredOnBlur(first, eFirst);
    showRequiredOnBlur(middle, eMiddle);
    showRequiredOnBlur(last, eLast);
    showRequiredOnBlur(kidId, eKidId);
    showRequiredOnBlur(kidFirst, eKidFirst);

    gov?.addEventListener('blur', () => { markTouched(gov); maybeShowSelectError(gov, eGov); recomputeButton(); });
    gov?.addEventListener('change', () => { markTouched(gov); maybeShowSelectError(gov, eGov); recomputeButton(); });

    idUp?.addEventListener('blur', () => { markTouched(idUp); maybeShowFileError(idUp, eID); recomputeButton(); });
    idUp?.addEventListener('change', () => { markTouched(idUp); maybeShowFileError(idUp, eID); recomputeButton(); });

    govParent?.addEventListener('blur', () => { markTouched(govParent); maybeShowSelectError(govParent, eGovParent); recomputeButton(); });
    govParent?.addEventListener('change', () => { markTouched(govParent); maybeShowSelectError(govParent, eGovParent); recomputeButton(); });

    idUpParent?.addEventListener('blur', () => { markTouched(idUpParent); maybeShowFileError(idUpParent, eIDParent); recomputeButton(); });
    idUpParent?.addEventListener('change', () => { markTouched(idUpParent); maybeShowFileError(idUpParent, eIDParent); recomputeButton(); });

    [first, middle, last, kidId, kidFirst].forEach(i => i?.addEventListener('input', () => {
      if (i && touched.has(i)) {
        const err = i === first ? eFirst : i === middle ? eMiddle : i === last ? eLast : i === kidId ? eKidId : eKidFirst;
        if (nonEmpty(i)) hide(err);
      }
      recomputeButton();
    }));

    disChk?.addEventListener('change', () => { toggleDisabilityFields(); recomputeButton(); });
    disNum?.addEventListener('blur', () => { markTouched(disNum); renderDisabilityTyping(); recomputeButton(); });
    disNum?.addEventListener('input', () => { renderDisabilityTyping(); recomputeButton(); });
    disImg?.addEventListener('blur', () => { markTouched(disImg); renderDisabilityTyping(); recomputeButton(); });
    disImg?.addEventListener('change', () => { markTouched(disImg); renderDisabilityTyping(); recomputeButton(); });

    toggleDisabilityFields();
    recomputeButton();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) { forceValidateAllWithin(form); return; }
      $('#step3-egy', wrap)?.classList.add('d-none');
      $('#step4-egy', wrap)?.classList.remove('d-none');
      nav?.hideProgressUI();
    });
  })();

  // =========================================================
  // =================== Foreigner ===========================
  // =========================================================

  (function step1Foreign() {
    const wrap = $('#content-new__user');
    if (!wrap) return;
    const form = $('#form-step1_Foreign', wrap);
    if (!form) return;

    const nav = wrap.__nav;
    const email = $('#Email', wrap);
    const pass = $('#Passport', wrap);
    const nat = $('#nationality', wrap);
    const btn = form.querySelector('button[type="submit"]');

    const eEmailReq = $('#emailRequired', wrap);
    const eEmailFmt = $('#emailError', wrap);
    const ePassReq = $('#passportRequired', wrap);
    const eNatReq = $('#nationalityRequired', wrap);

    email?.addEventListener('blur', () => {
      markTouched(email);
      const v = (email.value || '').trim();
      if (v.length === 0) { show(eEmailReq); hide(eEmailFmt); return; }
      hide(eEmailReq);
      if (!isEmail(v)) show(eEmailFmt); else hide(eEmailFmt);
    });

    showRequiredOnBlur(pass, ePassReq);

    nat?.addEventListener('blur', () => {
      markTouched(nat);
      const ok = nat.value && nat.value !== '' && nat.value !== 'Select Nationality';
      ok ? hide(eNatReq) : show(eNatReq);
    });

    function recomputeButton() {
      const ok = isEmail((email.value || '').trim())
        && (pass.value || '').trim().length > 0
        && (nat.value && nat.value !== '' && nat.value !== 'Select Nationality');
      btn.disabled = !ok;
    }

    email?.addEventListener('input', recomputeButton);
    pass?.addEventListener('input', recomputeButton);
    nat?.addEventListener('change', recomputeButton);

    recomputeButton();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) { forceValidateAllWithin(form); return; }
      $('#step1-Foreign', wrap)?.classList.add('d-none');
      $('#step2-Foreign', wrap)?.classList.remove('d-none');
      nav?.setCounter(2);
    });
  })();

  (function step2Foreign() {
    const wrap = $('#content-new__user');
    if (!wrap) return;
    const form = $('#form-step2_Foreign', wrap);
    if (!form) return;

    const nav = wrap.__nav;
    const otp = $('#otpCode_Foreign', wrap);
    const btn = form.querySelector('button[type="submit"]');
    const err = $('#otpRequired', wrap);

    if (otp) {
      otp.setAttribute('maxlength', String(OTP_LEN));
      otp.setAttribute('inputmode', 'numeric');
      otp.addEventListener('input', () => {
        otp.value = (otp.value || '').replace(/\D/g, '').slice(0, OTP_LEN);
      });
    }

    function recomputeButton() {
      const v = (otp.value || '').trim();
      btn.disabled = !(v.length === OTP_LEN && isDigits(v));
      if (v.length === 0) hide(err);
      else (v.length === OTP_LEN && isDigits(v)) ? hide(err) : show(err);
    }

    otp?.addEventListener('blur', () => { markTouched(otp); recomputeButton(); });
    otp?.addEventListener('input', recomputeButton);

    recomputeButton();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) { forceValidateAllWithin(form); return; }
      $('#step2-Foreign', wrap)?.classList.add('d-none');
      $('#step3-Foreign', wrap)?.classList.remove('d-none');
      nav?.setCounter(3);
    });
  })();

  (function step3Foreign() {
    const wrap = $('#content-new__user');
    if (!wrap) return;
    const form = $('#form-step3_Foreign', wrap);
    if (!form) return;

    const nav = wrap.__nav;
    const btn = form.querySelector('button[type="submit"]');

    // Adult names
    const first = $('#firstName_Foreign', wrap);
    const mid = $('#middleName_Foreign', wrap);
    const last = $('#lastName_Foreign', wrap);
    const eF = $('#firstNameForeign-error', wrap);
    const eM = $('#middleNameForeign-error', wrap);
    const eL = $('#lastNameForeign-error', wrap);

    // Disability (Adult)
    const disChk = $('#checkDisability_Foreign', wrap);
    const disNum = $('#disabilityNumber_Foreign', wrap);
    const disImg = $('#disabilityImage_Foreign', wrap);

    // ===== Parent (NEW/UPDATED IDs) =====
    // Visa Status (Do you have a valid visa for Egypt?)
    const visaYesP = $('#parentOption-yes', wrap);
    const visaNoP = $('#parentOption-no', wrap);
    const eVisaP = $('#visaStatusParent-error', wrap);

    // Parent Date of Birth (UPDATED)
    const parentDOB = $('#dateBirth_Parent', wrap);
    const eParentDOB = $('#dateBirth_ForeignParent_error', wrap);

    // Parent Gender
    const parentGender = $('#gender-foreignParent', wrap);
    const eParentGender = $('#gender-foreignParent-error', wrap);

    // Parent Passport Image
    const parentPassImg = $('#PassportImage_Foreign', wrap);
    const eParentPassImg = $('#passportImageForeign-error', wrap);

    // ===== Kid =====
    const kidPassportId = $('#KidPassportlID-foreign', wrap);
    const kidFirstName = $('#firstNameKid-foreign', wrap);
    const kidDOB = $('#dateBirth_Foreign', wrap);
    const kidGender = $('#gender-foreignKid', wrap);
    const kidGov = $('#governorateResidence-foreignKid', wrap);
    const kidPassImg = $('#PassportImage_ForeignKid', wrap);
    const kidConsent = $('#guardianConsent_ForeignKid', wrap);

    const eKidPassportId = $('#KidPassportID-error', wrap);
    const eKidFirstName = $('#firstNameForeignKid-error', wrap);
    const eKidDOB = $('#dateBirth_ForeignKid', wrap);
    const eKidGender = $('#gender-foreignKid-error', wrap);
    const eKidGov = $('#govResidenceForeignKid-error', wrap);
    const eKidPassImg = $('#passportImageForeignKid-error', wrap);
    const eKidConsent = $('#guardianConsentForeignKid-error', wrap);

    [eF, eM, eL, eVisaP, eParentDOB, eParentGender, eParentPassImg, eKidPassportId, eKidFirstName, eKidDOB, eKidGender, eKidGov, eKidPassImg, eKidConsent].forEach(hide);

    // required (adult names)
    showRequiredOnBlur(first, eF);
    showRequiredOnBlur(mid, eM);
    showRequiredOnBlur(last, eL);

    // required (kid)
    showRequiredOnBlur(kidPassportId, eKidPassportId);
    showRequiredOnBlur(kidFirstName, eKidFirstName);

    function toggleDisabilityFields() {
      const on = disChk?.checked;
      if (disNum) disNum.disabled = !on;
      if (disImg) disImg.disabled = !on;
      if (!on) { if (disNum) disNum.value = ''; if (disImg) disImg.value = ''; }
    }

    // --- Renderers (Parent) ---
    function renderVisaParent() {
      const ok = !!(visaYesP?.checked || visaNoP?.checked);
      ok ? hide(eVisaP) : show(eVisaP);
      return ok;
    }
    function renderParentDOB() {
      const ok = (parentDOB?.value ?? '').trim().length > 0;
      ok ? hide(eParentDOB) : show(eParentDOB);
      return ok;
    }
    function renderParentGender() {
      const ok = ['male', 'female'].includes(parentGender?.value);
      ok ? hide(eParentGender) : show(eParentGender);
      return ok;
    }
    function renderFile(el, err) {
      const ok = !!(el?.files && el.files.length > 0);
      ok ? hide(err) : show(err);
      return ok;
    }

    function recomputeButton() {
      const nameRules = [
        [first, nonEmpty],
        [mid, nonEmpty],
        [last, nonEmpty],
      ];

      const parentRules = [
        [visaYesP || visaNoP, () => isAnyChecked(visaYesP, visaNoP)],
        [parentDOB, (el) => (el?.value ?? '').trim().length > 0],
        [parentGender, (el) => ['male', 'female'].includes(el?.value)],
        [parentPassImg, (el) => !!(el?.files && el.files.length > 0)],
      ];

      const disRules = (isActive(disChk) && disChk.checked)
        ? [
          [disNum, nonEmpty],
          [disImg, (el) => !!(el?.files && el.files.length > 0)],
        ]
        : [];

      const kidRules = [
        [kidPassportId, nonEmpty],
        [kidFirstName, nonEmpty],
        [kidDOB, (el) => (el?.value ?? '').trim().length > 0],
        [kidGender, (el) => ['male', 'female'].includes(el?.value)],
        [kidGov, (el) => !!el?.value && el.value !== ''],
        [kidPassImg, (el) => !!(el?.files && el.files.length > 0)],
        [kidConsent, (el) => !!(el?.files && el.files.length > 0)],
      ];

      const rules = [
        ...nameRules,
        ...parentRules,
        ...disRules,
        ...kidRules,
      ];

      const { requiredCount, allOk } = allVisibleValid(rules);
      btn.disabled = (requiredCount === 0) ? true : !allOk;
    }

    // listeners — adult names
    [first, mid, last].forEach(i => i?.addEventListener('input', () => {
      if (nonEmpty(i)) hide(i === first ? eF : i === mid ? eM : eL);
      recomputeButton();
    }));

    // listeners — parent
    [visaYesP, visaNoP].forEach(r => r?.addEventListener('change', () => { renderVisaParent(); recomputeButton(); }));
    parentDOB?.addEventListener('change', () => { renderParentDOB(); recomputeButton(); });
    parentGender?.addEventListener('change', () => { renderParentGender(); recomputeButton(); });
    parentPassImg?.addEventListener('change', () => { renderFile(parentPassImg, eParentPassImg); recomputeButton(); });

    // Disability
    disChk?.addEventListener('change', () => { toggleDisabilityFields(); recomputeButton(); });
    disNum?.addEventListener('input', recomputeButton);
    disImg?.addEventListener('change', recomputeButton);

    // listeners — kid
    kidPassportId?.addEventListener('input', () => { if (nonEmpty(kidPassportId)) hide(eKidPassportId); recomputeButton(); });
    kidFirstName?.addEventListener('input', () => { if (nonEmpty(kidFirstName)) hide(eKidFirstName); recomputeButton(); });
    kidDOB?.addEventListener('change', () => { const ok = (kidDOB?.value ?? '').trim().length > 0; ok ? hide(eKidDOB) : show(eKidDOB); recomputeButton(); });
    kidGender?.addEventListener('change', () => { const ok = ['male', 'female'].includes(kidGender?.value); ok ? hide(eKidGender) : show(eKidGender); recomputeButton(); });
    kidGov?.addEventListener('change', () => { const ok = !!kidGov?.value && kidGov.value !== ''; ok ? hide(eKidGov) : show(eKidGov); recomputeButton(); });
    kidPassImg?.addEventListener('change', () => { renderFile(kidPassImg, eKidPassImg); recomputeButton(); });
    kidConsent?.addEventListener('change', () => { renderFile(kidConsent, eKidConsent); recomputeButton(); });

    toggleDisabilityFields();
    recomputeButton();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btn.disabled) { forceValidateAllWithin(form); return; }
      $('#step3-Foreign', wrap)?.classList.add('d-none');
      $('#step4-Foreign', wrap)?.classList.remove('d-none');
      nav?.hideProgressUI();
    });
  })();
});
