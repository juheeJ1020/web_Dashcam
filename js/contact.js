const addressSelect = document.getElementById("contact-address");
const customAddressField = document.getElementById("custom-address-field");
const customAddressInput = document.getElementById("contact-custom-address");

if (addressSelect && customAddressField && customAddressInput) {
  const updateCustomAddress = () => {
    const showCustomAddress = addressSelect.value === "other";
    customAddressField.hidden = !showCustomAddress;
    customAddressInput.disabled = !showCustomAddress;
    customAddressInput.required = showCustomAddress;
  };

  addressSelect.addEventListener("change", updateCustomAddress);
  updateCustomAddress();
}

// Web3Forms 전송: 페이지 이동 없이 보내고 결과 메시지를 표시
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const buttonLabel = submitButton.textContent;

  const showStatus = (message, type) => {
    formStatus.textContent = message;
    formStatus.className = `form-status form-status-${type}`;
    formStatus.hidden = false;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "보내는 중...";
    formStatus.hidden = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showStatus("문의가 전송되었습니다. 빠르게 답변드리겠습니다.", "success");
        contactForm.reset();
        if (addressSelect) addressSelect.dispatchEvent(new Event("change"));
      } else {
        showStatus("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.", "error");
      }
    } catch (error) {
      showStatus("네트워크 오류로 전송하지 못했습니다. 인터넷 연결을 확인해 주세요.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = buttonLabel;
    }
  });
}
