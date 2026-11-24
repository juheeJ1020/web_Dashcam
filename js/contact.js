// ----- 언어 전환 (Home과 같은 data-en / data-ko 방식, 선택한 언어는 페이지 간 유지) -----
const LANGUAGE_KEY = "steppingStoneLanguage";
const languageButtons = document.querySelectorAll("[data-language]");
const translatable = document.querySelectorAll("[data-en][data-ko]");
const languageField = document.getElementById("contact-language");

const messages = {
  en: {
    sending: "Sending...",
    success: "Thanks! Your enquiry has been sent. We'll get back to you soon.",
    failed: "Sorry, your enquiry couldn't be sent. Please try again shortly.",
    network: "We couldn't send your enquiry because of a network error. Please check your connection.",
  },
  ko: {
    sending: "보내는 중...",
    success: "문의가 전송되었습니다. 빠르게 답변드리겠습니다.",
    failed: "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    network: "네트워크 오류로 전송하지 못했습니다. 인터넷 연결을 확인해 주세요.",
  },
};

let currentLanguage = "en";

const readSavedLanguage = () => {
  try {
    return localStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    return null;
  }
};

const applyLanguage = (language) => {
  currentLanguage = language === "ko" ? "ko" : "en";
  document.documentElement.lang = currentLanguage;
  translatable.forEach((element) => {
    element.textContent = element.dataset[currentLanguage];
  });
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  });
  if (languageField) languageField.value = currentLanguage;
  try {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  } catch (error) {
    // 저장이 막혀 있어도 전환 자체는 동작
  }
};

languageButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

applyLanguage(readSavedLanguage() || "en");

// ----- 헤더 · 푸터 (Home과 같은 동작) -----
// 휴대폰 메뉴 열기/닫기
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("primary-navigation");

if (menuToggle && navigation) {
  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navigation.classList.toggle("is-open", open);
  };

  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
}

// 이용약관 / 개인정보처리방침 팝업
document.querySelectorAll("[data-open-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.openDialog);
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
  });
});

document.querySelectorAll(".legal-dialog").forEach((dialog) => {
  dialog.querySelector("[data-close-dialog]")?.addEventListener("click", () => dialog.close());
  dialog.querySelectorAll("[data-close-link]").forEach((link) => {
    link.addEventListener("click", () => dialog.close());
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

// ----- Web3Forms 전송: 페이지 이동 없이 보내고 결과 메시지를 표시 -----
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  const showStatus = (key, type) => {
    formStatus.textContent = messages[currentLanguage][key];
    formStatus.className = `form-status form-status-${type}`;
    formStatus.hidden = false;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = messages[currentLanguage].sending;
    formStatus.hidden = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showStatus("success", "success");
        contactForm.reset();
        if (languageField) languageField.value = currentLanguage;
      } else {
        showStatus("failed", "error");
      }
    } catch (error) {
      showStatus("network", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset[currentLanguage];
    }
  });
}
