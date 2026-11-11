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
